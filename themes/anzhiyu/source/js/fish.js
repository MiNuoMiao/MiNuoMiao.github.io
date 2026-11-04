/* 页底养鱼（重写版 v4）
 * footer 就是一片水：水面在底栏顶边往下留一段空域，鱼在水里巡游，跃出水面画一道弧线再落回。
 * - 物理统一按 dt 缩放，60Hz / 120Hz 屏速度一致
 * - 出水、入水都会在水面激起一圈涟漪
 */
;(function () {
  var CONFIG = {
    waterTop: 240, // 水面距 footer 顶部的像素（上面这段空域留给鱼跃出）
    fishCount: 6,
    waveHeight: 5,
    waveLen1: 0.006,
    waveLen2: 0.019,
    gravity: 0.1 // 跃水重力（像素/帧²）—— 越小越飘
  }

  var container = document.getElementById('jsi-flying-fish-container')
  if (!container) return

  var canvas = document.createElement('canvas')
  canvas.id = 'fish'
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  container.appendChild(canvas)

  var ctx = canvas.getContext('2d')
  var W = 1
  var H = 1
  var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
  var fishes = []
  var ripples = []
  var t = 0
  var rafId = 0
  var lastTs = 0
  var booted = false

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  }

  function resize() {
    var rect = container.getBoundingClientRect()
    var w = Math.round(rect.width) || window.innerWidth
    var h = Math.round(rect.height)
    if (h <= 0) h = 260
    if (w === W && h === H && booted) return
    W = w
    H = h
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ripples = []
    createFishes()
    booted = true
  }

  function addRipple(x, amp, wide) {
    ripples.push({ x: x, age: 0, amp: amp, spread: wide || 90, life: 110 })
    if (ripples.length > 20) ripples.shift()
  }

  function waterY(x) {
    var y =
      CONFIG.waterTop +
      Math.sin(x * CONFIG.waveLen1 + t) * CONFIG.waveHeight +
      Math.sin(x * CONFIG.waveLen2 - t * 1.6) * CONFIG.waveHeight * 0.45

    for (var i = 0; i < ripples.length; i++) {
      var r = ripples[i]
      var d = Math.abs(x - r.x)
      if (d > r.spread * 3) continue
      var falloff = Math.exp(-d / r.spread) * Math.exp(-r.age / 45)
      y += Math.sin(d * 0.075 - r.age * 0.32) * r.amp * falloff
    }
    return y
  }

  function createFishes() {
    fishes = []
    for (var i = 0; i < CONFIG.fishCount; i++) {
      fishes.push(newFish(true))
    }
  }

  function newFish(initial) {
    var minY = CONFIG.waterTop + 40
    var maxY = Math.max(minY + 20, H - 26)
    var cruise = minY + Math.random() * (maxY - minY)
    return {
      dir: Math.random() < 0.5 ? 1 : -1,
      len: 7 + Math.random() * 8,
      speed: 0.35 + Math.random() * 0.8,
      x: initial ? Math.random() * W : -60,
      cruiseY: cruise,
      maxY: maxY,
      minY: minY,
      y: cruise,
      phase: Math.random() * Math.PI * 2,
      tilt: 0,
      state: 'cruise',
      t0: 0,
      vy0: 0,
      y0: 0,
      wasOut: false,
      cooldown: Math.random() * 240,
      splash: 0,
      alpha: isDark() ? 0.92 : 0.88
    }
  }

  function startJump(f) {
    // 目标最高点：水面之上 40~75px（用掉 waterTop 这一段空域）
    var peak = CONFIG.waterTop - (40 + Math.random() * 35)
    var h = Math.max(36, f.y - peak)
    f.state = 'jump'
    f.t0 = 0
    f.vy0 = -Math.sqrt(2 * CONFIG.gravity * h)
    f.y0 = f.y
    f.wasOut = false
  }

  function updateFish(f, dt) {
    f.alpha = isDark() ? 0.92 : 0.88
    if (f.splash > 0) f.splash -= dt

    if (f.state === 'jump') {
      f.t0 += dt
      var g = CONFIG.gravity
      f.y = f.y0 + f.vy0 * f.t0 + 0.5 * g * f.t0 * f.t0
      var vyNow = f.vy0 + g * f.t0
      f.x += f.dir * f.speed * 1.1 * dt
      f.tilt = Math.atan2(vyNow, f.speed * 1.1) * 0.9

      // 刚冲出水面：起一圈涟漪
      if (!f.wasOut && f.y < CONFIG.waterTop) {
        f.wasOut = true
        addRipple(f.x, 5.5, 80)
      }

      // 落回水里
      if (f.y > CONFIG.waterTop + 4 && vyNow > 0) {
        f.state = 'cruise'
        f.splash = 18
        addRipple(f.x, 7, 110)
        f.cruiseY = Math.min(f.maxY, CONFIG.waterTop + 30 + Math.random() * 80)
        f.cooldown = 170 + Math.random() * 320
      }
    } else {
      f.x += f.dir * f.speed * dt
      f.phase += 0.04 * dt
      f.y += (f.cruiseY + Math.sin(f.phase) * 7 - f.y) * 0.08 * dt
      f.tilt = Math.sin(f.phase) * 0.12

      if (f.cooldown > 0) {
        f.cooldown -= dt
      } else if (Math.random() < 0.005 * dt) {
        startJump(f)
      }
    }

    if (f.x < -80 || f.x > W + 80) {
      var n = newFish(false)
      f.dir = f.dir === 1 ? -1 : 1
      f.x = f.dir > 0 ? -40 : W + 40
      f.cruiseY = n.cruiseY
      f.maxY = n.maxY
      f.y = n.cruiseY
      f.state = 'cruise'
      f.splash = 0
      f.wasOut = false
    }
  }

  function drawFish(f, color) {
    var L = f.len
    ctx.save()
    ctx.globalAlpha = f.alpha
    ctx.translate(f.x, f.y)
    ctx.scale(f.dir, 1)
    ctx.rotate(f.tilt)
    ctx.fillStyle = color

    ctx.beginPath()
    ctx.ellipse(0, 0, L, L * 0.42, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(-L * 0.86, 0)
    ctx.quadraticCurveTo(-L * 1.35, -L * 0.15, -L * 1.62, -L * 0.62)
    ctx.quadraticCurveTo(-L * 1.2, 0, -L * 1.62, L * 0.62)
    ctx.quadraticCurveTo(-L * 1.35, L * 0.15, -L * 0.86, 0)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(-L * 0.1, -L * 0.38)
    ctx.quadraticCurveTo(L * 0.1, -L * 0.85, L * 0.45, -L * 0.34)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  function drawSplash(f, color) {
    if (f.splash <= 0) return
    var p = f.splash / 18
    var grow = 1 - p
    ctx.save()
    ctx.globalAlpha = 0.36 * p
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(f.x, waterY(f.x), 7 + grow * 20, 2 + grow * 5, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  function render() {
    ctx.clearRect(0, 0, W, H)

    var dark = isDark()
    var waterColor = dark ? '#30343f' : '#f1f3f8'
    var fishColor = dark ? '#f1f3f8' : '#30343f'

    // 水面
    ctx.beginPath()
    ctx.moveTo(0, H)
    ctx.lineTo(0, waterY(0))
    for (var x = 0; x <= W; x += 5) {
      ctx.lineTo(x, waterY(x))
    }
    ctx.lineTo(W, H)
    ctx.closePath()
    ctx.fillStyle = waterColor
    ctx.fill()

    // 水面高光
    ctx.beginPath()
    for (var gx = 0; gx <= W; gx += 5) {
      var gy = waterY(gx)
      if (gx === 0) ctx.moveTo(gx, gy)
      else ctx.lineTo(gx, gy)
    }
    ctx.strokeStyle = dark ? 'rgba(241,243,248,0.18)' : 'rgba(48,52,63,0.16)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    for (var i = 0; i < fishes.length; i++) {
      updateFish(fishes[i], render.dt || 1)
      drawFish(fishes[i], fishColor)
      drawSplash(fishes[i], fishColor)
    }
  }

  function loop(ts) {
    rafId = requestAnimationFrame(loop)
    if (!lastTs) lastTs = ts
    var dt = Math.min(50, ts - lastTs) / 16.67
    lastTs = ts
    t += 0.016 * dt
    render.dt = dt

    // 涟漪老化
    for (var i = ripples.length - 1; i >= 0; i--) {
      ripples[i].age += dt
      if (ripples[i].age > ripples[i].life) ripples.splice(i, 1)
    }

    render()
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId)
    lastTs = 0
    rafId = requestAnimationFrame(loop)
  }

  function boot() {
    var el = document.getElementById('jsi-flying-fish-container')
    if (!el) return
    if (el !== container || !document.body.contains(canvas)) {
      container = el
      if (!document.body.contains(canvas)) container.appendChild(canvas)
    }
    resize()
    start()
  }

  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      resize()
    }).observe(container)
  }
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('pjax:complete', boot)

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
})()
