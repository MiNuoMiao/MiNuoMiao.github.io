/* 首屏 / 页脚的浮层显隐：live2d 小猫 + 左下角音乐球
 * 直接给元素写 inline style（带 important），因为主题也会给它们写行内样式，
 * 光靠 CSS 规则压不住。同时挂 body class 作兜底。
 */
;(function () {
  var SHOW_AFTER = 180 // 滚过这么多像素出现
  var WATER_OFFSET = 240 // 页脚里水面线离页脚顶部的大致距离
  var HIDE_MARGIN = 70 // 水面滚到离视口底部这么近时隐藏

  var live2dEl = null
  var musicEl = null

  function apply() {
    var st = window.scrollY || document.documentElement.scrollTop || 0
    var winH = window.innerHeight
    var footer = document.getElementById('footer')
    var atFooter = false

    if (footer) {
      var waterY = footer.getBoundingClientRect().top + WATER_OFFSET
      atFooter = waterY < winH - HIDE_MARGIN
    }

    var visible = st > SHOW_AFTER && !atFooter
    document.body.classList.toggle('float-hidden', !visible)

    ;[live2dEl, musicEl].forEach(function (el) {
      if (!el) return
      try {
        el.style.setProperty('opacity', visible ? '1' : '0', 'important')
        el.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important')
        el.style.setProperty('pointer-events', visible ? 'auto' : 'none', 'important')
      } catch (e) {}
    })
  }

  function find() {
    live2dEl = document.getElementById('live2d-widget')
    musicEl = document.getElementById('nav-music')
    if (!live2dEl || !musicEl) setTimeout(find, 300) // 这两个是动态创建的
    apply()
  }

  function start() {
    apply()
    find()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply, { passive: true })
    document.addEventListener('pjax:complete', function () {
      apply()
      find()
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
