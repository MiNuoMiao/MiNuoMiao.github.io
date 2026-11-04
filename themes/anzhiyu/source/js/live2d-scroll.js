/* 首屏 / 底部的浮层显隐：live2d 小猫 + 左下角音乐球
 * - 往下滚一点点（约两格滚轮）就出现
 * - 滚到页脚、快到水面线时才消失
 * - 主题自己也给音乐球写过 opacity / bottom 的行内样式，所以显示时用 shown-float 覆盖
 */
;(function () {
  var SHOW_AFTER = 180 // 滚过这么多像素出现
  var WATER_OFFSET = 240 // 页脚里水面线离页脚顶部的大致距离
  var HIDE_MARGIN = 70 // 水面滚到离视口底部这么近时隐藏
  var tries = 0

  function boot() {
    var live2d = document.getElementById('live2d-widget')
    var music = document.getElementById('nav-music')

    if (!live2d || !music) {
      ;[live2d, music].forEach(function (el) {
        if (el) el.classList.add('hidden-float')
      })
      if (++tries < 40) setTimeout(boot, 250)
      return
    }

    var footer = document.getElementById('footer')

    function update() {
      var st = window.scrollY || document.documentElement.scrollTop || 0
      var winH = window.innerHeight
      var atFooter = false

      if (footer) {
        // 按「水面线」判断，而不是页脚顶边
        var waterY = footer.getBoundingClientRect().top + WATER_OFFSET
        atFooter = waterY < winH - HIDE_MARGIN
      }

      var visible = st > SHOW_AFTER && !atFooter
      ;[live2d, music].forEach(function (el) {
        el.classList.toggle('hidden-float', !visible)
        el.classList.toggle('shown-float', visible)
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
  document.addEventListener('pjax:complete', function () {
    tries = 0
    boot()
  })
})()
