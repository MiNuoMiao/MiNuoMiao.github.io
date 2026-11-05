/* 鼠标移到音乐球上时展开控制条；音量是竖向滑块，悬停音量键时从球里向上弹出 */
;(function () {
  if (window.innerWidth < 768) return

  var panel = document.createElement('div')
  panel.id = 'music-edge-panel'
  panel.innerHTML =
    '<button data-act="prev" title="上一首">⏮</button>' +
    '<button data-act="toggle" title="播放 / 暂停">▶</button>' +
    '<button data-act="next" title="下一首">⏭</button>' +
    '<button data-act="list" title="播放列表">☰</button>' +
    '<span class="mp-vol">' +
    '<button data-act="vol" class="mp-vol-btn" title="音量">🔊</button>' +
    '<span class="mp-vol-pop"><input type="range" min="0" max="100" step="1" value="70" id="music-vol"></span>' +
    '</span>'

  function getAplayer() {
    var el = document.querySelector('#nav-music meting-js')
    return el && el.aplayer ? el.aplayer : null
  }

  function syncIcon() {
    var ap = getAplayer()
    var btn = panel.querySelector('[data-act="toggle"]')
    if (!ap || !btn || !ap.audio) return
    btn.textContent = ap.audio.paused ? '▶' : '⏸'
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
    if (act === 'vol') return // 音量按钮只用来显示滑块
    var ap = getAplayer()
    if (!ap || !ap.list) return
    try {
      if (act === 'prev') ap.list.switch(ap.list.index - 1)
      else if (act === 'next') ap.list.switch(ap.list.index + 1)
      else if (act === 'toggle') ap.toggle()
      else if (act === 'list') ap.list.toggle()
    } catch (err) {}
    setTimeout(syncIcon, 200)
  })

  // 让面板底色跟球一致
  function syncBg() {
    var ap = document.querySelector('#nav-music .aplayer')
    if (!ap) return
    var bg = getComputedStyle(ap).backgroundColor
    if (bg && bg !== 'rgba(0, 0, 0, 0)') panel.style.background = bg
  }

  function mount() {
    var ball = document.getElementById('nav-music')
    if (!ball) { setTimeout(mount, 400); return }
    if (!ball.contains(panel)) ball.appendChild(panel)
    syncBg()
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
