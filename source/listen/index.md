---
title: 今晚听什么
date: 2026-11-07 05:30:00
updated: 2026-11-10 20:00:00
comments: false
---

<div class="listen-box">
  <div class="listen-label">今晚 · 随机一首</div>
  <div class="listen-card" id="listen-card">
    <div class="listen-title" id="listen-title">点一下下面那颗按钮</div>
    <div class="listen-artist" id="listen-artist">歌名和一句歌词，会自己跳出来</div>
    <div class="listen-lyric" id="listen-lyric">（抽到哪首就放哪首，放一段副歌）</div>
    <div class="listen-player" id="listen-player">
      <button class="lp-toggle" id="lp-toggle" type="button" aria-label="播放">▶</button>
      <div class="lp-bar" id="lp-bar">
        <div class="lp-fill" id="lp-fill"></div>
      </div>
      <span class="lp-time" id="lp-time">0:00</span>
    </div>
    <div class="listen-noaudio" id="listen-noaudio" hidden>这首暂时没有录音，只能看看词</div>
    <audio id="listen-audio" preload="none"></audio>
  </div>
  <button class="listen-btn" id="listen-btn">再抽一首</button>
  <div class="listen-hint">空格键也可以 · 片段 45 秒</div>
</div>

<style>
.listen-box {
  text-align: center;
  padding: 2.2rem 1rem 2.6rem;
}
.listen-label {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--anzhiyu-secondtext);
  margin-bottom: 1.4rem;
}
.listen-card {
  max-width: 620px;
  margin: 0 auto 1.6rem;
  padding: 2.2rem 1.6rem;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(255, 152, 162, 0.16), rgba(255, 152, 162, 0.04));
  border: 1px solid rgba(255, 152, 162, 0.28);
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.7rem;
}
.listen-card.turning {
  animation: listenFade 0.5s ease;
}
@keyframes listenFade {
  0% { opacity: 0; transform: translateY(8px) scale(0.985); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.listen-title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--anzhiyu-fontcolor);
}
.listen-artist {
  font-size: 14px;
  color: var(--anzhiyu-secondtext);
  letter-spacing: 0.04em;
}
.listen-lyric {
  margin-top: 0.6rem;
  font-size: 15px;
  line-height: 1.9;
  color: var(--anzhiyu-main);
}

/* ── 播放器 ── */
.listen-player {
  margin: 1.1rem auto 0;
  width: 100%;
  max-width: 460px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px 8px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 152, 162, 0.35);
  backdrop-filter: blur(6px);
  transition: opacity 0.25s ease;
}
[data-theme="dark"] .listen-player {
  background: rgba(255, 255, 255, 0.08);
}
.listen-player.disabled {
  opacity: 0.35;
  pointer-events: none;
}
.lp-toggle {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: #fff;
  background: var(--anzhiyu-main);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, filter 0.15s ease;
}
.lp-toggle:hover { filter: brightness(1.06); }
.lp-toggle:active { transform: scale(0.94); }
.lp-bar {
  flex: 1 1 auto;
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
}
[data-theme="dark"] .lp-bar { background: rgba(255, 255, 255, 0.16); }
.lp-fill {
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: var(--anzhiyu-main);
  transition: width 0.12s linear;
}
.lp-time {
  flex: 0 0 auto;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--anzhiyu-secondtext);
  min-width: 34px;
  text-align: right;
}
.listen-noaudio {
  margin-top: 1rem;
  font-size: 13px;
  color: var(--anzhiyu-secondtext);
  opacity: 0.8;
}

.listen-btn {
  border: 0;
  border-radius: 999px;
  padding: 12px 30px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: var(--anzhiyu-main);
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 152, 162, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.listen-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(255, 152, 162, 0.45);
  filter: brightness(1.04);
}
.listen-btn:active {
  transform: scale(0.97);
}
.listen-hint {
  margin-top: 0.9rem;
  font-size: 12px;
  color: var(--anzhiyu-secondtext);
  opacity: 0.75;
}
@media (max-width: 768px) {
  .listen-title { font-size: 21px; }
  .listen-card { padding: 1.6rem 1.1rem; }
  .listen-player { padding: 6px 12px 6px 6px; }
  .lp-toggle { width: 34px; height: 34px; }
}
</style>

<script>
(function () {
  // clip 有值 = 有录音片段（45 秒，放在 source/listen/audio/ 下）
  var SONGS = [
    { title: '夜航星 (Night Voyager)', artist: '蔡明希（不才）', lyric: '「我们是星尘的孩子，所以总会想抬头看一眼。」', clip: 'yehangxing.mp3' },
    { title: '是想你的声音啊', artist: '江皓桦（傲七爷）', lyric: '「你不知道我为什么总是想起你。」', clip: 'shixiangni.mp3' },
    { title: 'Last Night, Good Night', artist: '初音ミク / livetune', lyric: '「ラストナイト、グッドナイト —— 晚安，明天见。」', clip: 'lastnight.mp3' },
    { title: '有时候我也想和世界告别', artist: '芝麻Mochi', lyric: '「有时候我也想和世界告别，但今天没有。」' },
    { title: '海边', artist: '帆布小镇', lyric: '「我们沿着海岸线走，一句话都没说。」' },
    { title: '弱虫だって', artist: '畔栗 / 鸣米', lyric: '「弱虫だって、叫んでみた —— 就算是胆小鬼，也试着喊了一声。」', clip: 'yowamushi.mp3' },
    { title: '漫天星光（纯音乐版）', artist: 'CMJ', lyric: '「有些歌没有词，因为词会挡住星星。」' },
    { title: 'La La Land', artist: 'Jax', lyric: '「献给所有做梦的人，哪怕梦醒了也在跳。」' },
    { title: '三分半时空', artist: '黄一', lyric: '「一首歌三分半，够想起一个人。」', clip: 'sanfenban.mp3' },
    { title: '抱薪救火II长年做', artist: 'Vtaeat文轩', lyric: '「明知救不了，也还是把柴抱过去。」' }
  ]

  var lastIndex = -1
  var audio = null
  var fill = null
  var timeEl = null
  var toggle = null
  var player = null
  var noAudio = null

  function fmt (s) {
    if (!isFinite(s) || s < 0) s = 0
    var m = Math.floor(s / 60)
    var sec = Math.floor(s % 60)
    return m + ':' + (sec < 10 ? '0' : '') + sec
  }

  function stopAudio () {
    if (!audio) return
    try { audio.pause(); audio.currentTime = 0 } catch (e) {}
    if (fill) fill.style.width = '0%'
    if (timeEl) timeEl.textContent = '0:00'
    if (toggle) toggle.textContent = '▶'
  }

  function loadClip (song) {
    if (!audio) return
    stopAudio()
    if (!song.clip) {
      audio.removeAttribute('src')
      player.classList.add('disabled')
      noAudio.hidden = false
      return
    }
    noAudio.hidden = true
    player.classList.remove('disabled')
    audio.src = 'audio/' + song.clip
    audio.load()
  }

  function pick () {
    var i = Math.floor(Math.random() * SONGS.length)
    if (SONGS.length > 1 && i === lastIndex) i = (i + 1) % SONGS.length
    lastIndex = i
    return SONGS[i]
  }

  function render () {
    var card = document.getElementById('listen-card')
    var t = document.getElementById('listen-title')
    var a = document.getElementById('listen-artist')
    var l = document.getElementById('listen-lyric')
    if (!card) return
    var s = pick()
    t.textContent = s.title
    a.textContent = '— ' + s.artist + ' —'
    l.textContent = s.lyric
    loadClip(s)
    card.classList.remove('turning')
    void card.offsetWidth
    card.classList.add('turning')
  }

  function bindAudio () {
    audio = document.getElementById('listen-audio')
    fill = document.getElementById('lp-fill')
    timeEl = document.getElementById('lp-time')
    toggle = document.getElementById('lp-toggle')
    player = document.getElementById('listen-player')
    noAudio = document.getElementById('listen-noaudio')
    var bar = document.getElementById('lp-bar')
    if (!audio || !toggle || !bar) return false

    toggle.addEventListener('click', function () {
      if (!audio.src) return
      if (audio.paused) {
        audio.play().catch(function () {})
      } else {
        audio.pause()
      }
    })

    audio.addEventListener('play', function () { toggle.textContent = '❚❚' })
    audio.addEventListener('pause', function () { toggle.textContent = '▶' })
    audio.addEventListener('ended', function () {
      toggle.textContent = '▶'
      fill.style.width = '0%'
      timeEl.textContent = '0:00'
    })
    audio.addEventListener('timeupdate', function () {
      var d = audio.duration || 0
      if (!d) return
      fill.style.width = Math.min(100, (audio.currentTime / d) * 100) + '%'
      timeEl.textContent = fmt(audio.currentTime)
    })
    audio.addEventListener('loadedmetadata', function () {
      timeEl.textContent = '0:00'
    })

    bar.addEventListener('click', function (e) {
      if (!audio.duration) return
      var r = bar.getBoundingClientRect()
      var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      audio.currentTime = p * audio.duration
    })
    return true
  }

  function boot () {
    var btn = document.getElementById('listen-btn')
    if (!btn) { setTimeout(boot, 300); return }
    if (!bindAudio()) { setTimeout(boot, 300); return }
    btn.addEventListener('click', render)
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Space' && !/input|textarea/i.test((e.target.tagName || ''))) {
        e.preventDefault()
        render()
      }
    })
    render()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
</script>
