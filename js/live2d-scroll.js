/* 首屏 / 页脚的浮层显隐：live2d 小猫 + 左下角音乐球
 * 改成给 body 挂一个 class，这样元素什么时候被插件创建出来都能立刻生效，
 * 不用等 #live2d-widget / #nav-music 出现（它们在线上出得很晚）。
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
