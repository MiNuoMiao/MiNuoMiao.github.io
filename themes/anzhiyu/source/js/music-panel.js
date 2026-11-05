/* 鼠标移到音乐球上时展开控制条；音量悬停弹出竖向滑块 */
;(function () {
  if (window.innerWidth < 768) return

  var I = function (d, filled) {
    return '<svg viewBox="0 0 24 24" width="15" height="15" fill="' + (filled ? 'currentColor' : 'none') +
      '" stroke="' + (filled ? 'none' : 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'
  }

  var panel = document.createElement('div')
  panel.id = 'music-edge-panel'
  panel.innerHTML =
    '<button data-act="prev" title="上一首">' + I('M19 20L9 12l10-8z', true) + '<span class="mp-bar"></span></button>' +
    '<button data-act="toggle" title="播放 / 暂停">' + I('M7 4l13 8-13 8z', true) + '</button>' +
    '<button data-act="next" title="下一首">' + I('M5 4l10 8-10 8z', true) + '<span class="mp-bar"></span></button>' +
    '<button data-act="list" title="播放列表">' + I('M4 6h16M4 12h16M4 18h16') + '</button>' +
    '<span class="mp-vol">' +
    '<button data-act="vol" class="mp-vol-btn" title="音量">' + I('M4 9v6h4l5 4V5L8 9H4zM16 8a5 5 0 0 1 0 8') + '</button>' +
    '<span class="mp-vol-pop"><input type="range" min="0" max="100" step="1" value="70" id="music-vol"></span>' +
    '</span>'

  function getAplayer() {
    var el = document.querySelector('#nav-music meting-js')
    return el && el.aplayer ? el.aplayer : null
  }

  var PLAY = 'M7 4l13 8-13 8z', PAUSE = 'M8 4v16M16 4v16'
  function syncIcon() {
    var ap = getAplayer()
    var btn = panel.querySelector('[data-act="toggle"]')
    if (!ap || !btn || !ap.audio) return
    btn.innerHTML = I(ap.audio.paused ? PLAY : PAUSE, ap.audio.paused)
  }
  function syncVolume() {
    var ap = getAplayer()
    var vol = panel.querySelector('#music-vol')
    if (!ap || !vol || typeof ap.volume !== 'function') return
    var v = ap.volume()
    if (typeof v === 'number' && Math.abs(v * 100 - Number(vol.value)) > 2) {
      vol.value = Math.round(v * 100)
    }
  }
  setInterval(function () { syncIcon(); syncVolume() }, 800)

  panel.addEventListener('click', function (e) { e.stopPropagation() })
  panel.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'music-vol') {
      var ap = getAplayer()
      if (ap) ap.volume(Number(e.target.value) / 100)
    }
  })
  panel.addEventListener('click', function (e) {
    var btn = e.target.closest('button')
    if (!btn) return
    var act = btn.getAttribute('data-act')
    if (act === 'vol') { panel.classList.toggle('show-vol'); return }
    var ap = getAplayer()
    if (!ap || !ap.list) return
    try {
      if (act === 'prev') ap.list.switch(ap.list.index - 1)
      else if (act === 'next') ap.list.switch(ap.list.index + 1)
      else if (act === 'toggle') ap.toggle()
      else if (act === 'list') {
        var ballEl = document.getElementById('nav-music')
        if (ballEl) ballEl.classList.toggle('show-list')
      }
    } catch (err) {}
    setTimeout(syncIcon, 200)
  })



  // 点别处收起列表和音量条
  document.addEventListener('click', function (e) {
    if (panel.contains(e.target)) return
    panel.classList.remove('show-vol')
    var ballNow = document.getElementById('nav-music')
    if (ballNow && !ballNow.contains(e.target)) ballNow.classList.remove('show-list')
  })

  // 只有鼠标进到球的最右端才浮出遮罩；在球内移动保持，离开球就收回
  var panelShown = false
  document.addEventListener('mousemove', function (e) {
    var ball = document.getElementById('nav-music')
    if (!ball) return
    var r = ball.getBoundingClientRect()
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    var nearRight = inside && e.clientX > r.right - 34
    if (nearRight) panelShown = true
    else if (!inside) panelShown = false
    panel.classList.toggle('show', panelShown)
  })


  // 主题球 hover 展开后是 aplayer 原生控制条，它的☰和音量键也接上我们的逻辑
  function bindNative() {
    var ball = document.getElementById('nav-music')
    if (!ball) return
    var listBtn = ball.querySelector('.aplayer-list-toggle')
    if (listBtn && !listBtn.dataset.bound) {
      listBtn.dataset.bound = '1'
      listBtn.addEventListener('click', function (e) {
        e.stopPropagation()
        ball.classList.toggle('show-list')
      })
    }
    var volBtn = ball.querySelector('.aplayer-volume')
    if (volBtn && !volBtn.dataset.bound) {
      volBtn.dataset.bound = '1'
      volBtn.addEventListener('click', function (e) {
        e.stopPropagation()
        panel.classList.toggle('show-vol')
      })
    }
  }
  setInterval(bindNative, 1200)

  function mount() {
    var ball = document.getElementById('nav-music')
    if (!ball) { setTimeout(mount, 400); return }
    if (!ball.contains(panel)) ball.appendChild(panel)
  }
  mount()
  setInterval(mount, 2000)

  if (location.search.indexOf('panel=1') > -1) {
    var forced = setInterval(function () {
      var ball = document.getElementById('nav-music')
      if (ball) { ball.classList.add('force-panel'); clearInterval(forced) }
    }, 300)
  }
})()
