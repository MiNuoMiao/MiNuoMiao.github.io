/* 音乐球边缘遮挡层（全部由脚本注入，不改主题 CSS、不改 pug 结构）
 *
 * 触发判定：
 *   1. 只在桌面宽屏生效（主题在 <=1200px 会隐藏音乐球）
 *   2. 球必须是「最大化」状态：aplayer-bar-wrap 宽度 > 300 才允许唤出；
 *      <=300（球是收起来的窄条）时完全无反应，贴边也不触发
 *   3. 在上面两条都满足的前提下，鼠标贴到球「右边缘往里 2px」的那条窄带 → 遮挡层浮出
 *   4. 浮出后只要指针还在球上、遮挡层上、歌单或音量弹层上就保持
 *      （离开这几个区域 220ms 后才收起，避免边界抖动）
 *   5. 歌单 / 音量是「点了才开、开了不走」的粘性面板：
 *      - 鼠标移开不会自己消失，只有点别处 / Esc / 再点一次按钮才收
 *      - 音量拖动时锁住面板（pointerdown → pointerup），拖出面板也不会断
 *
 * 位置：遮挡层是 body 下的 fixed 元素，右边缘永远对齐球的右边缘、高度跟随球，
 *       所以不会被球的 overflow:hidden 裁掉（上一版就栽在这儿）。
 */
;(function () {
  'use strict'
  if (window.__mbBarLoaded) return
  window.__mbBarLoaded = true

  var EDGE = 2 // 触发带宽：球右边缘往里 2px
  var GRACE = 220 // 离开后收起延迟(ms)
  var POLL = 120 // 打开时对齐位置 / 同步图标的心跳(ms)
  var MIN_W = 1201 // 主题在 <=1200px 隐藏音乐球
  var TRIGGER_MIN = 250 // .aplayer-bar-wrap 宽度要大于它（即球已经在展开态）才允许唤出遮挡层
  // 说明：展开态的 wrap 实测在 291~470 之间浮动（跟歌名长短有关），收起态 83~197；
  // 所以阈值取 250 能把两种状态干净分开。要改就改这一个数。

  var doc = document
  var bar, listEl, volEl, volInput, listBody
  var st = { open: false, list: false, vol: false, drag: false, grace: 0, poll: 0, seek: false, seekCool: 0 }
  var cache = { r: null, key: '', t: 0 }

  /* ---------------- 基础 ---------------- */
  function ball() {
    return doc.getElementById('nav-music')
  }
  function getAp() {
    var m = doc.querySelector('#nav-music meting-js')
    return m && m.aplayer ? m.aplayer : null
  }
  function ballRect(fresh) {
    var b = ball()
    if (!b) return null
    var tag = '1'
    var now = Date.now()
    if (!fresh && cache.key === tag && now - cache.t < 80) return cache.r
    cache.r = b.getBoundingClientRect()
    cache.t = now
    return cache.r
  }
  function inRect(r, x, y) {
    return !!r && r.width > 0 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  }
  function svg(d, filled) {
    return (
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="' + (filled ? 'currentColor' : 'none') +
      '" stroke="' + (filled ? 'none' : 'currentColor') +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'
    )
  }
  function isWide() {
    return window.innerWidth >= MIN_W
  }
  // 球有没有「最大化」：看 aplayer 那条进度层有多宽（它跟着球一起伸缩）
  function wrapWidth() {
    var el = doc.querySelector('#nav-music .aplayer-bar-wrap')
    if (el) return el.getBoundingClientRect().width
    var r = ballRect()
    return r ? r.width : 0 // 兜底：aplayer 还没起来时按球的宽度算
  }
  function bigEnough() {
    return wrapWidth() > TRIGGER_MIN
  }
  function ballUsable() {
    var b = ball()
    if (!b) return false
    var r = b.getBoundingClientRect()
    if (r.width < 24 || r.height < 14) return false
    var cs = getComputedStyle(b)
    if (cs.display === 'none' || cs.visibility === 'hidden') return false
    if (Number(cs.opacity) < 0.5) return false // 首屏 / 页脚时主题会把它淡出
    return true
  }

  /* ---------------- 样式 ---------------- */
  var CSS = [
    /* 遮挡层本身是透明的（只当感应面，四边精确贴合球），玻璃那条是里面的 .mb-chrome */
    '#mb-bar{position:fixed;z-index:99999;display:flex;align-items:center;justify-content:flex-end;',
    'box-sizing:border-box;border-radius:40px;overflow:hidden;',
    'opacity:0;pointer-events:none;transition:opacity .1s ease;}',
    '#mb-bar.mb-open{opacity:1;}',
    /* 极淡粉玻璃：主色 #ff98a2 只留 5% 不透明度，基本只剩磨砂 + 一圈白边；
       图标用白色，跟球上原本的白字一致。出现时从右往左传进（被球右边缘裁切） */
    '#mb-bar .mb-chrome{display:flex;align-items:center;justify-content:center;gap:1px;padding:0 4px;',
    'height:100%;margin-left:auto;border-radius:40px;',
    'background:rgba(255,152,162,.05);',
    '-webkit-backdrop-filter:blur(12px) saturate(180%);backdrop-filter:blur(12px) saturate(180%);',
    'box-shadow:0 2px 10px rgba(255,114,128,.12),0 0 0 1px rgba(255,255,255,.5) inset;',
    'transform:translateX(100%);opacity:0;pointer-events:none;',
    'transition:transform .28s cubic-bezier(.22,.61,.36,1),opacity .2s ease;}',
    '#mb-bar.mb-open .mb-chrome{transform:translateX(0);opacity:1;pointer-events:auto;}',
    '#mb-bar .mb-btn{width:var(--mb-btn,28px);height:var(--mb-btn,28px);flex:0 0 auto;',
    'display:inline-flex;align-items:center;',
    'justify-content:center;padding:0;border:0;border-radius:50%;background:transparent;color:#fff;',
    'cursor:pointer;opacity:.95;transition:background .15s ease,opacity .15s ease,transform .1s ease;}',
    '#mb-bar .mb-btn:hover{background:rgba(255,255,255,.24);opacity:1;}',
    '#mb-bar .mb-btn:active{transform:scale(.88);}',
    '#mb-bar .mb-btn.mb-on{background:rgba(255,255,255,.34);opacity:1;}',
    '#mb-bar .mb-btn[hidden]{display:none;}',

    /* 歌单：深色字 + 正在播放那一行粉色加粗 */
    '#mb-list{position:fixed;z-index:100000;width:284px;max-height:52vh;overflow-y:auto;padding:6px;',
    'box-sizing:border-box;border-radius:16px;background:rgba(255,152,162,.46);color:#3a3a44;',
    '-webkit-backdrop-filter:blur(14px) saturate(180%);backdrop-filter:blur(14px) saturate(180%);',
    'box-shadow:0 10px 30px rgba(255,114,128,.28),0 0 0 1px rgba(255,255,255,.45) inset;',
    'font-size:13px;line-height:1.35;',
    'opacity:0;pointer-events:none;transform:translateY(6px);',
    'transition:opacity .16s ease,transform .16s ease;}',
    '#mb-list.mb-open{opacity:1;pointer-events:auto;transform:translateY(0);}',
    '#mb-list .mb-row{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:10px;cursor:pointer;}',
    '#mb-list .mb-row:hover{background:rgba(255,255,255,.32);}',
    '#mb-list .mb-row.mb-cur{color:#ff7280;font-weight:600;}',
    '#mb-list .mb-no{flex:0 0 18px;text-align:right;font-size:12px;opacity:.5;}',
    '#mb-list .mb-name{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '#mb-list .mb-singer{flex:0 0 auto;max-width:96px;font-size:12px;opacity:.55;overflow:hidden;',
    'text-overflow:ellipsis;white-space:nowrap;}',
    '#mb-list .mb-empty{padding:14px 10px;text-align:center;opacity:.7;}',

    /* 音量弹层：竖着的推子（保持原来那套主色粉玻璃，不动） */
    '#mb-volpop{position:fixed;z-index:100000;width:46px;padding:12px 8px 8px;box-sizing:border-box;',
    'border-radius:16px;background:rgba(255,152,162,.46);color:#fff;',
    '-webkit-backdrop-filter:blur(14px) saturate(180%);backdrop-filter:blur(14px) saturate(180%);',
    'box-shadow:0 8px 26px rgba(255,114,128,.3),0 0 0 1px rgba(255,255,255,.42) inset;',
    'display:flex;flex-direction:column;align-items:center;gap:6px;',
    'opacity:0;pointer-events:none;transform:translateY(6px);',
    'transition:opacity .16s ease,transform .16s ease;}',
    '#mb-volpop.mb-open{opacity:1;pointer-events:auto;transform:translateY(0);}',
    /* 上下各留一段透明桥：指针从按钮走到滑块、或滑出面板再回来，都不会断 */
    '#mb-volpop::before,#mb-volpop::after{content:"";position:absolute;left:0;right:0;height:16px;}',
    '#mb-volpop::before{top:-16px;}#mb-volpop::after{bottom:-16px;}',
    '#mb-volpop .mb-vol-wrap{position:relative;width:22px;height:108px;flex:0 0 auto;}',
    /* 轨道和填充自己画，不依赖旋转后渐变的方向，看得清也拖得准 */
    '#mb-volpop .mb-vol-wrap::before{content:"";position:absolute;left:50%;top:0;height:100%;width:6px;',
    'transform:translateX(-50%);border-radius:3px;background:rgba(255,255,255,.4);z-index:0;}',
    '#mb-volpop .mb-vol-wrap::after{content:"";position:absolute;left:50%;bottom:0;width:6px;',
    'height:calc(var(--mb-vol,70) * 1%);transform:translateX(-50%);border-radius:3px;',
    'background:#fff;z-index:0;}',
    '#mb-volpop .mb-vol-num{font-size:12px;color:#fff;opacity:.95;font-variant-numeric:tabular-nums;',
    'text-shadow:0 1px 2px rgba(214,86,105,.45);}',
    /* 横着写的 input 转 -90° 变成竖向推子：value 0 在下、100 在上 */
    '#mb-volpop input[type=range]{position:absolute;top:50%;left:50%;width:108px;height:22px;',
    'margin:0;padding:0;background:transparent;outline:none;cursor:pointer;z-index:1;',
    'transform:translate(-50%,-50%) rotate(-90deg);-webkit-appearance:none;appearance:none;}',
    '#mb-volpop input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:transparent;}',
    '#mb-volpop input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;',
    'margin-top:-4.5px;border-radius:50%;background:#fff;border:1px solid rgba(255,255,255,.95);',
    'box-shadow:0 1px 5px rgba(214,86,105,.5);}',
    '#mb-volpop input[type=range]::-moz-range-track{height:6px;border-radius:3px;background:transparent;}',
    '#mb-volpop input[type=range]::-moz-range-thumb{width:15px;height:15px;border:1px solid rgba(255,255,255,.95);',
    'border-radius:50%;background:#fff;box-shadow:0 1px 5px rgba(214,86,105,.5);}'
  ].join('')

  function injectCSS() {
    if (doc.getElementById('mb-style')) return
    var s = doc.createElement('style')
    s.id = 'mb-style'
    s.textContent = CSS
    ;(doc.head || doc.documentElement).appendChild(s)
  }

  /* ---------------- DOM ---------------- */
  var PLAY = 'M8 5v14l11-7z'
  var PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z'
  var PREV = 'M19 20L9 12l10-8v16zM6 5v14'
  var NEXT = 'M5 4l10 8-10 8V4zM18 5v14'
  var LIST = 'M4 6h16M4 12h16M4 18h16'
  var VOL = 'M4 9v6h4l5 4V5L8 9H4zM16 8a5 5 0 0 1 0 8'

  function build() {
    if (bar) return
    bar = doc.createElement('div')
    bar.id = 'mb-bar'
    bar.innerHTML =
      '<span class="mb-chrome">' +
      '<button type="button" class="mb-btn" data-act="prev" title="上一首" aria-label="上一首">' + svg(PREV, true) + '</button>' +
      '<button type="button" class="mb-btn" data-act="toggle" title="播放 / 暂停" aria-label="播放或暂停">' + svg(PLAY, true) + '</button>' +
      '<button type="button" class="mb-btn" data-act="next" title="下一首" aria-label="下一首">' + svg(NEXT, true) + '</button>' +
      '<button type="button" class="mb-btn" data-act="list" title="歌单" aria-label="歌单">' + svg(LIST, false) + '</button>' +
      '<button type="button" class="mb-btn" data-act="vol" title="音量" aria-label="音量">' + svg(VOL, false) + '</button>' +
      '</span>'

    listEl = doc.createElement('div')
    listEl.id = 'mb-list'
    listBody = doc.createElement('div')

    volEl = doc.createElement('div')
    volEl.id = 'mb-volpop'
    volEl.innerHTML =
      '<span class="mb-vol-wrap"><input type="range" min="0" max="100" step="1" value="70" aria-label="音量"></span>' +
      '<span class="mb-vol-num">70</span>'
    volInput = volEl.querySelector('input')

    doc.body.appendChild(bar)
    listEl.appendChild(listBody)
    doc.body.appendChild(listEl)
    doc.body.appendChild(volEl)
    bind()
  }

  /* ---------------- 定位 ---------------- */
  // 球有多宽就放几个按钮：5 个塞不下就藏掉「上一首」，再塞不下就只剩 播放/歌单/音量
  function fitButtons(w, pad, gap) {
    var order = [5, 4, 3]
    for (var i = 0; i < order.length; i++) {
      var c = order[i]
      var span = w - pad * 2 - (c - 1) * gap
      var bw = Math.floor(span / c)
      if (bw >= 20) return { n: c, bw: Math.min(30, bw) }
    }
    return { n: 3, bw: 20 }
  }

  function place() {
    var r = ballRect(true)
    if (!r) return
    var vw = window.innerWidth
    var vh = window.innerHeight

    // 遮挡层：四边都跟球一模一样（取 ceil/floor 防止亚像素留缝），整颗球盖住
    var pad = 4, gap = 1
    var fit = fitButtons(r.width, pad, gap)
    bar.style.setProperty('--mb-btn', fit.bw + 'px')
    bar.querySelector('[data-act="prev"]').hidden = fit.n < 5
    bar.querySelector('[data-act="next"]').hidden = fit.n < 4
    var L = Math.floor(r.left), T = Math.floor(r.top)
    bar.style.left = L + 'px'
    bar.style.top = T + 'px'
    bar.style.width = Math.ceil(r.right) - L + 'px'
    bar.style.height = Math.ceil(r.bottom) - T + 'px'
    bar.style.right = 'auto'
    bar.style.bottom = 'auto'

    if (st.list) {
      var lw = listEl.offsetWidth || 284
      listEl.style.left = Math.round(Math.max(10, Math.min(r.left, vw - lw - 12))) + 'px'
      listEl.style.top = 'auto'
      // 底部压住球 2px，中间不留缝，指针从球走到面板不会掉出去
      listEl.style.bottom = Math.round(vh - r.top - 2) + 'px'
    }
    if (st.vol) {
      var pw = volEl.offsetWidth || 46
      var volBtn = bar.querySelector('[data-act="vol"]')
      var br = volBtn ? volBtn.getBoundingClientRect() : r
      var cx = br.left + br.width / 2
      var left = Math.max(10, Math.min(cx - pw / 2, vw - pw - 12))
      volEl.style.left = Math.round(left) + 'px'
      volEl.style.top = 'auto'
      volEl.style.bottom = Math.round(vh - r.top - 2) + 'px'
    }
  }

  /* ---------------- 状态同步 ---------------- */
  function paintVol(pc) {
    volEl.style.setProperty('--mb-vol', pc)
    var n = volEl.querySelector('.mb-vol-num')
    if (n) n.textContent = pc
  }

  function sync() {
    if (!bar) return
    var a = getAp()
    if (!a) return
    var tBtn = bar.querySelector('[data-act="toggle"]')
    if (tBtn && a.audio) tBtn.innerHTML = svg(a.audio.paused ? PLAY : PAUSE, true)

    var vBtn = bar.querySelector('[data-act="vol"]')
    if (vBtn) vBtn.classList.toggle('mb-on', st.vol)

    var lBtn = bar.querySelector('[data-act="list"]')
    if (lBtn) lBtn.classList.toggle('mb-on', st.list)

    if (typeof a.volume === 'function' && !st.drag) {
      var v = a.volume()
      if (typeof v === 'number') {
        var pc = Math.round(v * 100)
        if (Math.abs(pc - Number(volInput.value)) > 1) volInput.value = pc
        paintVol(pc)
      }
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
    })
  }

  function renderList() {
    var a = getAp()
    var audios = a && a.list && a.list.audios ? a.list.audios : null
    if (!audios || !audios.length) {
      listBody.innerHTML = '<div class="mb-empty">歌单还没加载出来</div>'
      return
    }
    var cur = a.list.index
    var html = ''
    for (var i = 0; i < audios.length; i++) {
      var s = audios[i] || {}
      html +=
        '<div class="mb-row' + (i === cur ? ' mb-cur' : '') + '" data-i="' + i + '">' +
        '<span class="mb-no">' + (i + 1) + '</span>' +
        '<span class="mb-name">' + esc(s.name || '未知曲目') + '</span>' +
        '<span class="mb-singer">' + esc(s.artist || '') + '</span>' +
        '</div>'
    }
    listBody.innerHTML = html
  }

  /* ---------------- 开 / 关 ---------------- */
  function openBar() {
    if (st.open) { st.bail = 'already-open'; return }
    if (!isWide()) { st.bail = 'narrow-screen'; return }
    if (!ballUsable()) { st.bail = 'ball-hidden'; return }
    if (!bigEnough()) { st.bail = 'wrap<=' + TRIGGER_MIN; return }
    build()
    clearTimeout(st.grace)
    st.open = true
    place()
    bar.classList.add('mb-open')
    sync()
    if (!st.poll) st.poll = setInterval(function () { place(); sync() }, POLL)
  }
  function closeList() {
    st.list = false
    if (listEl) listEl.classList.remove('mb-open')
  }
  function closeVol() {
    st.vol = false
    if (volEl) volEl.classList.remove('mb-open')
  }
  function closeBar() {
    if (!st.open) return
    st.open = false
    clearTimeout(st.grace)
    if (st.poll) { clearInterval(st.poll); st.poll = 0 }
    closeList()
    closeVol()
    if (bar) bar.classList.remove('mb-open')
  }
  function keepAlive() {
    clearTimeout(st.grace)
    if (!st.open) openBar()
    else if (!st.poll) st.poll = setInterval(function () { place(); sync() }, POLL)
  }
  function scheduleClose() {
    // 歌单或音量开着的时候就钉住，不因为鼠标移开而消失（这正是上一版最坑的地方）
    if (!st.open || st.drag || st.list || st.vol) return
    clearTimeout(st.grace)
    st.grace = setTimeout(function () {
      if (!st.drag) closeBar()
    }, GRACE)
  }

  /* ---------------- 交互 ---------------- */
  function onMove(e) {
    if (!isWide()) return
    if (!ball()) { if (st.open) closeBar(); return }
    var r = ballRect()
    if (!r || r.width < 24) { if (st.open) scheduleClose(); return }
    // 正在拖球的进度条（按住不放）→ 一律不弹，也别把已经开着的面板关掉
    if (st.seek || e.buttons || Date.now() < st.seekCool) {
      if (st.open) keepAlive()
      return
    }
    // 球没展开（进度层 <= 300）时完全不响应：贴边也不唤出
    if (!bigEnough()) {
      if (st.open) closeBar()
      return
    }

    var overBall = inRect(r, e.clientX, e.clientY)
    var overBar = st.open && inRect(bar.getBoundingClientRect(), e.clientX, e.clientY)
    var overList = st.list && inRect(listEl.getBoundingClientRect(), e.clientX, e.clientY)
    var overVol = st.vol && inRect(volEl.getBoundingClientRect(), e.clientX, e.clientY)

    // ① 触发：贴到球的右边缘（往里 2px 之内）
    if (overBall && e.clientX >= r.right - EDGE) {
      openBar()
      keepAlive()
      return
    }
    // ② 保持：还在球上 / 遮挡层上 / 歌单上 / 音量弹层上
    if (overBar || overList || overVol || (st.open && overBall)) {
      keepAlive()
      return
    }
    // ③ 都离开了 → 延迟收起
    scheduleClose()
  }

  function bind() {
    bar.addEventListener('pointerdown', function (e) { e.stopPropagation() })
    bar.addEventListener('click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      var btn = e.target.closest ? e.target.closest('.mb-btn') : null
      if (!btn) return // 点遮挡层空白处不当成收起，避免贴边时误触
      var act = btn.getAttribute('data-act')
      var a = getAp()
      if (!a) return

      if (act === 'prev') { try { a.skipBack() } catch (err) {} }
      else if (act === 'next') { try { a.skipForward() } catch (err) {} }
      else if (act === 'toggle') { try { a.toggle() } catch (err) {} }
      else if (act === 'list') {
        st.list = !st.list
        if (st.list) { closeVol(); renderList(); place(); listEl.classList.add('mb-open') }
        else closeList()
      } else if (act === 'vol') {
        st.vol = !st.vol
        if (st.vol) {
          closeList()
          var pc = 70
          if (typeof a.volume === 'function') {
            var v = a.volume()
            if (typeof v === 'number') pc = Math.round(v * 100)
          }
          volInput.value = pc
          paintVol(pc)
          place()
          volEl.classList.add('mb-open')
        } else closeVol()
      }
      place()
      sync()
    })

    // 歌单：点了就切歌，面板不关（想连点几首也方便）
    listEl.addEventListener('pointerdown', function (e) { e.stopPropagation() })
    listEl.addEventListener('click', function (e) {
      e.stopPropagation()
      var row = e.target.closest ? e.target.closest('.mb-row') : null
      if (!row) return
      var i = Number(row.getAttribute('data-i'))
      var a = getAp()
      if (!a || !a.list) return
      try { a.list.switch(i) } catch (err) {}
      setTimeout(function () { renderList(); sync() }, 120)
    })

    // 音量：拖动期间锁住面板，绝不因为指针离开而消失
    volEl.addEventListener('pointerdown', function (e) {
      e.stopPropagation()
      st.drag = true
      clearTimeout(st.grace)
      try { volInput.setPointerCapture(e.pointerId) } catch (err) {}
    })
    volEl.addEventListener('pointermove', function (e) { e.stopPropagation() })
    doc.addEventListener('pointerup', function () {
      if (!st.drag) return
      st.drag = false
      sync()
    })
    volInput.addEventListener('input', function () {
      var pc = Number(volInput.value)
      paintVol(pc)
      var a = getAp()
      if (a && typeof a.volume === 'function') a.volume(pc / 100)
    })

    // 在球上按下 = 要拖进度条（aplayer 的进度条铺满整颗球）：这期间遮挡层不许弹出
    doc.addEventListener('pointerdown', function (e) {
      var b = ball()
      if (b && b.contains(e.target)) { st.seek = true; clearTimeout(st.grace) }
    }, true)
    doc.addEventListener('pointerup', function () {
      if (!st.seek) return
      st.seek = false
      st.seekCool = Date.now() + 280 // 松手那一刻鼠标还在右边缘，别立刻弹出来
    }, true)
    doc.addEventListener('pointercancel', function () { st.seek = false }, true)

    // 触发判定：鼠标贴到球右边缘 2px
    // 同时挂 pointermove / pointerover / pointerdown：有的环境（含自动化点击）只会派发后两种，
    // 只监听 move 的话贴边会漏掉触发
    doc.addEventListener('pointermove', onMove, { passive: true })
    doc.addEventListener('pointerover', onMove, { passive: true })
    doc.addEventListener('pointerdown', onMove, { passive: true })

    // 点别处 / Esc 收起
    doc.addEventListener('pointerdown', function (e) {
      if (!st.open) return
      if (bar.contains(e.target) || listEl.contains(e.target) || volEl.contains(e.target)) return
      closeBar()
    }, true)
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeBar()
    })
    window.addEventListener('resize', function () { if (st.open) place() })
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    injectCSS()
    build()
    // 主题 / pjax 可能重排音乐球：打开时校对位置，球被淡出就收起
    setInterval(function () {
      if (st.open && !ballUsable()) closeBar()
    }, 500)
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot)
  else boot()

  if (location.search.indexOf('mbdebug') > -1) {
    console.info('[mb-bar] loaded, edge=' + EDGE + 'px, minWidth=' + MIN_W)
    // 调试用：带上 ?mbdebug=1 才会打，平时一行日志都不留
    // 调试用：带上 ?mbdebug=1 才会打，平时一行日志都不留
    ;['pointerdown', 'click'].forEach(function (t) {
      doc.addEventListener(t, function (e) {
        var r = ballRect(true)
        if (!r) return
        console.info('[mb-bar] ' + t + ' ' + e.clientX + ',' + e.clientY +
          ' band[' + (r.right - EDGE) + ',' + r.right + '] open=' + st.open +
          ' tgt=' + ((e.target && (e.target.id || e.target.className)) || '?'))
      }, true)
    })
    setInterval(function () {
      var r = ballRect(true)
      if (!r) return
      var br2 = bar ? bar.getBoundingClientRect() : null
      console.info('[mb-bar] ball ' + JSON.stringify({
        left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right),
        bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height),
        vw: window.innerWidth, vh: window.innerHeight, open: st.open, list: st.list, vol: st.vol,
        op: (function () { var b = ball(); return b ? Number(getComputedStyle(b).opacity) : -1 })(),
        bail: st.bail || '-',
        wrap: Math.round(wrapWidth()),
        barBox: br2 ? [Math.round(br2.left), Math.round(br2.top), Math.round(br2.right), Math.round(br2.bottom)] : null
      }))
    }, 2500)
  }
})()
