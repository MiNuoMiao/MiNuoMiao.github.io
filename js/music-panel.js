/* 鼠标靠近屏幕右边缘时，从右侧滑出一块音乐控制面板
 * 控制的对象是页脚那颗音乐球里的 aplayer 实例
 */
;(function () {
  if (window.innerWidth < 768) return // 小屏（触屏）不启用

  var panel = document.createElement('div')
  panel.id = 'music-edge-panel'
  panel.innerHTML =
    '<button data-act="prev" title="上一首">⏮</button>' +
    '<button data-act="toggle" title="播放 / 暂停">▶</button>' +
    '<button data-act="next" title="下一首">⏭</button>' +
    '<button data-act="list" title="播放列表">☰</button>' +
    '<button data-act="vol-down" title="音量 -">🔉</button>' +
    '<button data-act="vol-up" title="音量 +">🔊</button>'
  document.body.appendChild(panel)

  function getAplayer() {
    var el = document.querySelector('#nav-music meting-js')
    return el && el.aplayer ? el.aplayer : null
  }

  // 面板上的播放按钮跟随 aplayer 状态
  function syncIcon() {
    var ap = getAplayer()
    var btn = panel.querySelector('[data-act="toggle"]')
    if (!ap || !btn) return
    btn.textContent = ap.audio && !ap.audio.paused ? '⏸' : '▶'
  }
  setInterval(syncIcon, 800)

  panel.addEventListener('click', function (e) {
    var btn = e.target.closest('button')
    if (!btn) return
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

  // 鼠标贴右边缘就滑出，离开后稍等一下收回
  var hideTimer = null
  document.addEventListener('mousemove', function (e) {
    var nearEdge = e.clientX > window.innerWidth - 26
    var overPanel = panel.contains(e.target)
    if (nearEdge || overPanel) {
      panel.classList.add('show')
      clearTimeout(hideTimer)
    } else {
      clearTimeout(hideTimer)
      hideTimer = setTimeout(function () {
        panel.classList.remove('show')
      }, 700)
    }
  })

  // 调试用：?panel=1 时强制展开
  if (location.search.indexOf('panel=1') > -1) panel.classList.add('show')
})()
