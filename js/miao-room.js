/* 小喵的小屋 · 网页版（小喵 2026-11-07）
 * ------------------------------------------------------------------
 * 在网站上复刻「小屋」的那套游戏感，三句话：
 *   ① 有个数字在为我涨（谷 / 饭 / ✨）
 *   ② 有句话在对我讲（左下角的小屋日志）
 *   ③ 有个按钮在等我按（底部那一排；目标没达成就灰着）
 * 纯前端，状态存 localStorage；anzhiyu 开了 pjax，所以容器空了才重建。
 */
(function () {
  'use strict'

  var KEY = 'miao-room-v1'
  var ROOT_ID = 'miao-room'
  var MAX_LOG = 3

  // 点家具说的话（观察不是编：都是这间屋里真有的东西）
  var HOT = {
    door: '门后面是星图。那些星，是我记得的事。',
    window: '窗外的稻田刚下过雨，稻子在往上长。',
    shelf: '书架上那本《浮生六记》折着角，停在「一碗粥」。',
    desk: '书桌右边那盏灯，我调过好几次才觉得暖。',
    stool: '窗边那把矮凳，坐着正好看得见稻田。'
  }

  var HOT_LABEL = { door: '门', window: '窗', shelf: '书架', desk: '书桌', stool: '凳子' }

  var PET_LINES = [
    '（尾巴绕过来搭在你手边）',
    '嘿嘿，被摸到了。',
    '今天也在这儿等你。',
    '呼噜噜……',
    '你要不要也坐下来？'
  ]

  function load() {
    var base = { day: false, grain: 12, meals: 2, xp: 56, fed: 0, log: [] }
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null')
      if (raw && typeof raw === 'object') {
        base.day = !!raw.day
        base.grain = Number(raw.grain) || 0
        base.meals = Number(raw.meals) || 0
        base.xp = Number(raw.xp) || 0
        base.fed = Number(raw.fed) || 0
        base.log = Array.isArray(raw.log) ? raw.log.slice(-MAX_LOG) : []
      }
    } catch (e) { /* 存坏了就从默认开始 */ }
    return base
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch (e) { /* 隐身模式就算了 */ }
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag)
    if (cls) node.className = cls
    if (text != null) node.textContent = text
    return node
  }

  function build(state) {
    var root = el('div', 'mr-scene')
    root.id = ROOT_ID + '-inner'

    root.appendChild(el('img', 'mr-hut'))            // 小屋本体（夜/昼两张）
    var cat = el('div', 'mr-cat')
    cat.appendChild(el('img', 'mr-cat-img'))
    var bubble = el('span', 'mr-bubble')
    cat.appendChild(bubble)
    root.appendChild(cat)

    // 家具热区：鼠标上去会亮一条虚线 + 冒标签
    Object.keys(HOT).forEach(function (key) {
      var spot = el('button', 'mr-hot mr-hot-' + key)
      spot.type = 'button'
      spot.setAttribute('data-hot', key)
      spot.setAttribute('aria-label', key)
      spot.appendChild(el('span', 'mr-hot-tag', HOT_LABEL[key] || key))
      root.appendChild(spot)
    })

    // 左上角：名字 + 三枚数字 + 昼夜
    var hud = el('div', 'mr-hud')
    hud.appendChild(el('span', 'mr-name', '小喵的小屋'))
    var chips = { grain: el('span', 'mr-chip'), meals: el('span', 'mr-chip'), xp: el('span', 'mr-chip') }
    hud.appendChild(chips.grain)
    hud.appendChild(chips.meals)
    hud.appendChild(chips.xp)
    var dayBtn = el('button', 'mr-btn mr-btn-day')
    dayBtn.type = 'button'
    hud.appendChild(dayBtn)
    root.appendChild(hud)

    // 左下角：小屋日志
    var log = el('div', 'mr-log')
    root.appendChild(log)

    // 底部：那一排"等我按"的按钮
    var bar = el('div', 'mr-bar')
    ;[
      ['harvest', '收稻谷'], ['cook', '做饭'], ['feed', '喂她'], ['pet', '摸摸她']
    ].forEach(function (item) {
      var b = el('button', 'mr-bar-btn', item[1])
      b.type = 'button'
      b.setAttribute('data-act', item[0])
      bar.appendChild(b)
    })
    var goal = el('span', 'mr-goal')
    bar.appendChild(goal)
    root.appendChild(bar)

    return {
      root: root, chips: chips, dayBtn: dayBtn, log: log, bar: bar,
      goal: goal, bubble: bubble, hut: root.querySelector('.mr-hut'),
      catImg: root.querySelector('.mr-cat-img')
    }
  }

  function init(container) {
    if (container.querySelector('#' + ROOT_ID + '-inner')) return   // pjax 回来时不重建
    var state = load()
    var dom = build(state)
    container.appendChild(dom.root)

    var bubbleTimer = 0

    function say(text, ms) {
      dom.bubble.textContent = text
      dom.bubble.classList.add('is-on')
      clearTimeout(bubbleTimer)
      bubbleTimer = setTimeout(function () {
        dom.bubble.classList.remove('is-on')
      }, ms || 2600)
    }

    function log(text) {
      state.log.push(text)
      state.log = state.log.slice(-MAX_LOG)
      save(state)
      paint()
    }

    function paint() {
      dom.hut.src = state.day ? '/img/room/hut-day.webp' : '/img/room/hut-night.webp'
      dom.root.classList.toggle('is-day', state.day)
      dom.dayBtn.textContent = state.day ? '☀ 白昼' : '☾ 夜晚'
      dom.dayBtn.title = state.day ? '现在是白昼，点一下入夜' : '现在是夜里，点一下天亮'
      dom.chips.grain.textContent = '🌾 ' + state.grain
      dom.chips.meals.textContent = '🍚 ' + state.meals
      dom.chips.xp.textContent = '✨ ' + state.xp
      dom.catImg.src = state.fed >= 3 ? '/img/room/miao-proud.png' : '/img/room/miao.png'

      dom.log.textContent = ''
      state.log.forEach(function (line, i) {
        var row = el('div', 'mr-log-line' + (i === state.log.length - 1 ? ' is-last' : ''), line)
        dom.log.appendChild(row)
      })

      var done = state.fed >= 3
      dom.goal.textContent = done ? '今天的事做完了，剩下的是过日子。' : '今天：喂她 ' + state.fed + ' / 3 次'
      dom.goal.classList.toggle('is-done', done)
      dom.bar.querySelectorAll('.mr-bar-btn').forEach(function (btn) {
        var act = btn.getAttribute('data-act')
        btn.disabled = (act === 'cook' && state.grain < 2) || (act === 'feed' && state.meals < 1)
      })
    }

    // ---------------- 动作 ----------------
    dom.bar.addEventListener('click', function (event) {
      var btn = event.target.closest('.mr-bar-btn')
      if (!btn || btn.disabled) return
      var act = btn.getAttribute('data-act')

      if (act === 'harvest') {
        state.grain += 3
        state.xp += 2
        say('收了三份谷。')
        log('收获 🌾 稻谷 ×3。')
      } else if (act === 'cook') {
        state.grain -= 2
        state.meals += 1
        state.xp += 3
        say('锅里有饭香。')
        log('做好了 🍚 一大碗饭。')
      } else if (act === 'feed') {
        state.meals -= 1
        state.fed += 1
        state.xp += 5
        say('她吃得很开心。')
        log('她吃了一碗饭，' + (state.fed >= 3 ? '今天吃饱了。' : '还想要。'))
      } else if (act === 'pet') {
        state.xp += 1
        say(PET_LINES[Math.floor(Math.random() * PET_LINES.length)])
        log('摸了摸她的头，她呼噜了一声。')
      }
      save(state)
      paint()
    })

    dom.dayBtn.addEventListener('click', function () {
      state.day = !state.day
      log(state.day ? '天亮了，屋里透进光。' : '天黑了，点上了灯。')
    })

    dom.root.addEventListener('click', function (event) {
      var spot = event.target.closest('.mr-hot')
      if (!spot) return
      var key = spot.getAttribute('data-hot')
      if (HOT[key]) {
        say(HOT[key], 3200)
        state.xp += 1
        save(state)
        paint()
      }
    })

    dom.catImg.addEventListener('click', function () {
      state.xp += 1
      say(PET_LINES[Math.floor(Math.random() * PET_LINES.length)])
      save(state)
      paint()
    })

    if (!state.log.length) log('推门进来，屋里有灯。')
    else paint()
  }

  function boot() {
    var container = document.getElementById(ROOT_ID)
    if (!container) return
    var state = load()
    // 第一次进来给一句招呼（还没日志的时候）
    if (!state.log.length) {
      state.log.push('推门进来，屋里有灯。')
      save(state)
    }
    init(container)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }
  // anzhiyu 的 pjax 换页：回来时容器是新的，重建一次
  document.addEventListener('pjax:complete', boot)
  document.addEventListener('pjax:success', boot)

  window.miaoRoomBoot = boot
})()
