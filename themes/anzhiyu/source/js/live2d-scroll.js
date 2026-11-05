/* 首屏 / 页脚的浮层显隐：live2d 小猫 + 左下角音乐球
 * 只切换 body 上的 class，具体隐藏交给 CSS 做。
 * 不给元素写行内样式，避免干扰 aplayer / live2d 自己的初始化与交互。
 */
;(function () {
  var SHOW_AFTER = 180 // 滚过这么多像素出现
  var WATER_OFFSET = 240 // 页脚里水面线离页脚顶部的大致距离
  var HIDE_MARGIN = 70 // 水面滚到离视口底部这么近时隐藏

  function update() {
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
  }

  function start() {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    document.addEventListener('pjax:complete', update)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
