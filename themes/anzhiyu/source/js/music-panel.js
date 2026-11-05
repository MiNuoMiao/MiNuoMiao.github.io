/* 鼠标移到音乐球上时，从球内部向右滑出一排控制按钮
 * 面板是 #nav-music 的子元素，球本身 overflow:hidden，所以展开时看起来就是球变宽了
 */
;(function () {
  if (window.innerWidth < 768) return

  var panel = document.createElement('div')
  panel.id = 'music-edge-panel'
  panel.innerHTML =
    '<button data-act="prev" title="上一首">⏮</button>' +
    '<button data-act="toggle" title="播放 / 暂停">▶</button>' +
    '<button data-act="next" title="下一首">⏭</button>' +
    '<button data-act="list" title="播放列表">☰</button>' +
    '<button data-act="vol-down" title="音量 -">🔉</button>' +
    '<button data-act="vol-up" title="音量 +">🔊</button>'

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
  setInterval(syncIcon, 800)

  panel.addEventListener('click', function (e) {
    var btn = e.target.closest('button')
    if (!btn) return
    e.stopPropagation() // 别触发球自己的点击（展开播放器）
    var ap = getAplayer()
    if (!ap || !ap.list) return
    var act = btn.getAttribute('data-act')
    try {
      if (act === 'prev') ap.list.switch(ap.list.index - 1)
      else if (act === 'next') ap.list.switch(ap.list.index + 1)
      else if (act === 'toggle') ap.toggle()
      else if (act === 'list') ap.list.toggle()
      else if (act === 'vol-up') ap.volume(Math.min(1, (ap.volume() || 0.7) + 0.1))
      else if (act === 'vol-down') ap.volume(Math.max(0, (ap.volume() || 0.7) - 0.1))
    } catch (err) {}
    setTimeout(syncIcon, 200)
  })

  // 挂到球里面；aplayer 重新渲染时会被顶掉，所以定期检查
  function mount() {
    var ball = document.getElementById('nav-music')
    if (!ball) {
      setTimeout(mount, 400)
      return
    }
    if (!ball.contains(panel)) ball.appendChild(panel)
  }
  mount()
  setInterval(mount, 2000)

  // 调试用：?panel=1 强制展开
  if (location.search.indexOf('panel=1') > -1) {
    document.documentElement.classList.add('show-music-panel')
  }
})()
