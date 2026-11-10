/* 小屋：能走的小游戏（WASD / 方向键走动，靠近物件按 E 进去）
 * 纯前端，不改动任何其它页面
 */
;(function () {
  'use strict'
  function boot () {
    var box = document.querySelector('.room-map')
    var player = document.getElementById('room-player')
    var hint = document.getElementById('room-hint')
    if (!box || !player || !hint) { setTimeout(boot, 300); return }
    if (box.dataset.ready === '1') return
    box.dataset.ready = '1'

    // 地板范围（百分比坐标，等距菱形，稍微内缩一点，免得走出屋子）
    var FLOOR = [[47, 46], [78, 62], [61, 87], [29, 64]]

    var zones = []
    Array.prototype.forEach.call(box.querySelectorAll('.hot'), function (a) {
      zones.push({
        el: a,
        x: parseFloat(a.style.left),
        y: parseFloat(a.style.top),
        name: (a.querySelector('b') || {}).textContent || '',
        desc: (a.querySelector('em') || {}).textContent || '',
        href: a.getAttribute('href')
      })
      a.dataset.href = a.getAttribute('href')
    })

    var W = 0, H = 0, pos = { x: 0, y: 0 }, scale = { min: 0.62, max: 1.05 }
    var keys = {}, active = null, raf = 0, last = 0
    var SPEED = 0.34 // 每秒移动：容器宽度的 34%（x 方向）

    function measure () {
      W = box.clientWidth
      H = box.clientHeight
    }

    function pctToPx (p, base) { return p / 100 * base }

    function floorPx () {
      return FLOOR.map(function (pt) { return { x: pctToPx(pt[0], W), y: pctToPx(pt[1], H) } })
    }

    function inside (poly, pt) {
      var c = false
      for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y
        if (((yi > pt.y) !== (yj > pt.y)) && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi)) c = !c
      }
      return c
    }

    function depthScale () {
      var poly = floorPx()
      var ys = poly.map(function (p) { return p.y })
      var top = Math.min.apply(null, ys), bottom = Math.max.apply(null, ys)
      var t = (pos.y - top) / (bottom - top || 1)
      t = Math.max(0, Math.min(1, t))
      return scale.min + (scale.max - scale.min) * t
    }

    var DBG = location.search.indexOf('roomdebug') > -1
    var lastLog = 0

    function render () {
      var s = depthScale()
      var w = player.offsetWidth || W * 0.14
      var h = player.offsetHeight || H * 0.33
      // 用负 margin 把「脚底」对到 (pos.x, pos.y)，不依赖 % translate
      player.style.left = pos.x + 'px'
      player.style.top = pos.y + 'px'
      player.style.marginLeft = (-w / 2) + 'px'
      player.style.marginTop = (-h) + 'px'
      player.style.transform = 'scale(' + s.toFixed(3) + ')'
      player.style.zIndex = 10 + Math.round(pos.y / 10)
      if (DBG && Date.now() - lastLog > 600) {
        lastLog = Date.now()
        console.info('[room] pos=' + Math.round(pos.x) + ',' + Math.round(pos.y) +
          ' box=' + Math.round(W) + 'x' + Math.round(H) +
          ' sprite=' + w + 'x' + h + ' scale=' + s.toFixed(2))
      }
    }

    function nearest () {
      var best = null, bestD = 1e9
      var R = Math.max(W, H) * 0.11
      zones.forEach(function (z) {
        var zx = pctToPx(z.x, W), zy = pctToPx(z.y, H)
        var d = Math.hypot(zx - pos.x, zy - pos.y)
        if (d < bestD) { bestD = d; best = z }
      })
      return bestD <= R ? best : null
    }

    function updateHint () {
      active = nearest()
      if (!active) {
        hint.classList.remove('show')
        return
      }
      hint.textContent = '按 E · ' + active.name + (active.desc ? '（' + active.desc + '）' : '')
      hint.style.left = Math.min(W - 10, Math.max(10, pos.x)) + 'px'
      hint.style.top = Math.max(28, pos.y - player.offsetHeight * depthScale() * 0.9) + 'px'
      hint.dataset.href = active.href
      hint.classList.add('show')
    }

    function step (ts) {
      if (!last) last = ts
      var dt = Math.min(0.05, (ts - last) / 1000)
      last = ts
      var dx = 0, dy = 0
      if (keys.up) dy -= 1
      if (keys.down) dy += 1
      if (keys.left) dx -= 1
      if (keys.right) dx += 1
      if (dx || dy) {
        var poly = floorPx()
        var nx = pos.x + dx * SPEED * W * dt
        var ny = pos.y + dy * SPEED * W * dt * 0.62 // 等距视角：上下走得慢一些
        if (inside(poly, { x: nx, y: pos.y })) pos.x = nx
        if (inside(poly, { x: pos.x, y: ny })) pos.y = ny
        player.classList.add('walking')
        render()
        updateHint()
      } else {
        player.classList.remove('walking')
      }
      raf = requestAnimationFrame(step)
    }

    function go (href) {
      if (!href) return
      if (href.charAt(0) === '#') {
        var el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      location.href = href
    }

    var MAP = {
      'KeyW': 'up', 'ArrowUp': 'up',
      'KeyS': 'down', 'ArrowDown': 'down',
      'KeyA': 'left', 'ArrowLeft': 'left',
      'KeyD': 'right', 'ArrowRight': 'right'
    }

    document.addEventListener('keydown', function (e) {
      if (/input|textarea/i.test((e.target.tagName || ''))) return
      if (MAP[e.code]) {
        if (!isInView()) return
        keys[MAP[e.code]] = true
        e.preventDefault()
      } else if (e.code === 'KeyE' || e.code === 'Enter') {
        if (active && isInView()) { e.preventDefault(); go(active.href) }
      }
    })
    document.addEventListener('keyup', function (e) {
      if (MAP[e.code]) keys[MAP[e.code]] = false
    })

    hint.addEventListener('click', function () { go(hint.dataset.href) })

    // 手机上给一个方向键
    Array.prototype.forEach.call(box.querySelectorAll('.dpad b'), function (b) {
      var dir = b.dataset.dir
      var on = function (e) { e.preventDefault(); keys[dir] = true }
      var off = function (e) { e.preventDefault(); keys[dir] = false }
      b.addEventListener('pointerdown', on)
      b.addEventListener('pointerup', off)
      b.addEventListener('pointerleave', off)
      b.addEventListener('pointercancel', off)
    })

    function isInView () {
      var r = box.getBoundingClientRect()
      return r.bottom > 80 && r.top < window.innerHeight - 40
    }

    function init () {
      measure()
      pos.x = pctToPx(56, W)
      pos.y = pctToPx(66, H)
      render()
      updateHint()
      last = 0
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(step)
    }

    window.addEventListener('resize', function () {
      var rx = pos.x / (W || 1), ry = pos.y / (H || 1)
      measure()
      pos.x = rx * W
      pos.y = ry * H
      render()
    })

    init()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
