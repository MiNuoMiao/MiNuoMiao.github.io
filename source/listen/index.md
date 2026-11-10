---
title: 今晚听什么
date: 2026-11-07 05:30:00
updated: 2026-11-10 21:40:00
comments: false
---

<div class="listen-box">
  <div class="listen-label">今晚 · 随机一首</div>
  <div class="listen-card" id="listen-card">
    <div class="lc-head">
      <div class="listen-title" id="listen-title">点一下下面那颗圆键</div>
      <div class="listen-artist" id="listen-artist">从音乐馆的歌单里抽一首</div>
    </div>
    <div class="lc-lyrics" id="lc-lyrics">
      <div class="lc-lyrics-inner" id="lc-lyrics-inner"></div>
    </div>
    <div class="lc-track" id="lc-track">
      <div class="lp-bar" id="lp-bar"><div class="lp-fill" id="lp-fill"></div></div>
      <span class="lp-time" id="lp-time">0:00</span>
    </div>
    <button class="lp-toggle" id="lp-toggle" type="button" aria-label="播放">▶</button>
    <audio id="listen-audio" preload="none" crossorigin="anonymous"></audio>
  </div>
  <button class="listen-btn" id="listen-btn">再抽一首</button>
  <div class="listen-hint">空格键：播放 / 暂停 · 歌单来自音乐馆</div>
</div>

<style>
.listen-box { text-align: center; padding: 2.2rem 1rem 2.6rem; }
.listen-label {
  display: inline-block;
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--anzhiyu-secondtext);
  margin-bottom: 1.4rem;
}
.listen-card {
  position: relative;
  max-width: 620px;
  height: 330px;
  margin: 0 auto 1.6rem;
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(255, 152, 162, 0.16), rgba(255, 152, 162, 0.04));
  border: 1px solid rgba(255, 152, 162, 0.28);
  overflow: hidden;
  transition: background 0.4s ease;
}
.lc-head {
  position: absolute;
  left: 0; right: 0;
  top: 88px;
  transform: scale(1);
  transform-origin: top center;
  padding: 0 1.6rem;
  transition: top 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1);
  will-change: top, transform;
}
.listen-card.playing .lc-head {
  top: 36px;
  transform: scale(0.72);
}
.listen-title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--anzhiyu-fontcolor);
  transition: font-size 0.4s ease;
}
.listen-artist {
  margin-top: 4px;
  font-size: 14px;
  color: var(--anzhiyu-secondtext);
  letter-spacing: 0.04em;
}
.listen-card.playing .listen-title { font-size: 24px; }
.lc-lyrics {
  position: absolute;
  left: 0; right: 0;
  top: 120px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  transition: height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.45s ease 0.1s;
}
.listen-card.playing .lc-lyrics { height: 116px; opacity: 1; }
.lc-lyrics-inner {
  padding: 0 1.6rem;
  transition: transform 0.55s cubic-bezier(.4,0,.2,1);
  will-change: transform;
}
.lc-line {
  height: 29px;
  line-height: 29px;
  font-size: 15px;
  color: var(--anzhiyu-secondtext);
  opacity: 0.45;
  transition: opacity 0.3s ease, color 0.3s ease, transform 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lc-line.active {
  color: var(--anzhiyu-main);
  opacity: 1;
  font-weight: 600;
  transform: scale(1.03);
}
.lc-track {
  position: absolute;
  left: 74px;
  right: 20px;
  bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transform: scaleX(0.15);
  transform-origin: left center;
  transition: opacity 0.4s ease 0.15s, transform 0.5s cubic-bezier(.4,0,.2,1) 0.1s;
  pointer-events: none;
}
.listen-card.playing .lc-track { opacity: 1; transform: scaleX(1); pointer-events: auto; }
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
.lp-toggle {
  position: absolute;
  left: 50%;
  bottom: 62px;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  font-size: 26px;
  line-height: 1;
  color: #fff;
  background: var(--anzhiyu-main);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%) scale(1);
  box-shadow: 0 10px 26px rgba(255, 152, 162, 0.4);
  transition: left 0.5s cubic-bezier(.4,0,.2,1), bottom 0.5s cubic-bezier(.4,0,.2,1),
              width 0.4s cubic-bezier(.4,0,.2,1), height 0.4s cubic-bezier(.4,0,.2,1),
              font-size 0.4s ease, transform 0.5s cubic-bezier(.4,0,.2,1),
              box-shadow 0.4s ease;
  z-index: 3;
}
.lp-toggle:hover { filter: brightness(1.05); }
.lp-toggle:active { transform: translateX(-50%) scale(0.96); }
.listen-card.playing .lp-toggle {
  left: 20px;
  bottom: 16px;
  width: 40px;
  height: 40px;
  font-size: 13px;
  transform: translateX(0) scale(1);
  box-shadow: 0 6px 16px rgba(255, 152, 162, 0.3);
}
.listen-card.playing .lp-toggle:active { transform: scale(0.94); }
.lp-toggle.loading { opacity: 0.65; pointer-events: none; }
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
.listen-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(255, 152, 162, 0.45); filter: brightness(1.04); }
.listen-btn:active { transform: scale(0.97); }
.listen-btn:disabled { opacity: 0.5; cursor: default; transform: none; }
.listen-hint {
  margin-top: 0.9rem;
  font-size: 12px;
  color: var(--anzhiyu-secondtext);
  opacity: 0.75;
}
@media (max-width: 768px) {
  .listen-card { height: 300px; }
  .listen-title { font-size: 22px; }
  .listen-card.playing .listen-title { font-size: 20px; }
  .listen-card.playing .lc-head { top: 40px; }
  .lc-lyrics { top: 108px; }
  .listen-card.playing .lc-lyrics { height: 100px; }
  .lp-toggle { width: 74px; height: 74px; bottom: 58px; }
  .listen-card.playing .lp-toggle { width: 38px; height: 38px; bottom: 14px; left: 16px; }
  .lc-track { left: 66px; right: 16px; bottom: 26px; }
}
@media (prefers-reduced-motion: reduce) {
  .listen-card, .lc-head, .lc-lyrics, .lc-track, .lp-toggle, .lc-lyrics-inner, .lc-line { transition: none !important; }
}
</style>

<script>
(function () {
  var METING = 'https://api.qijieya.cn/meting/'
  var SERVER = 'netease'
  var PLAYLIST = '8560567666'
  var LINE_H = 29
  var LYRIC_LINES = 9      // 一次渲染多少行（前后各留几行）

  var songs = null, loading = null, lastIndex = -1
  var lrcCache = {}
  var lrc = []             // [{t, text}]
  var lineEls = []
  var activeIdx = -1
  var rafId = 0

  var card, audio, toggle, fill, timeEl, bar, titleEl, artistEl, lyricsEl, lyricsInner, btn

  function fmt (s) {
    if (!isFinite(s) || s < 0) s = 0
    var m = Math.floor(s / 60), sec = Math.floor(s % 60)
    return m + ':' + (sec < 10 ? '0' : '') + sec
  }

  function loadPlaylist () {
    if (songs) return Promise.resolve(songs)
    if (loading) return loading
    loading = fetch(METING + '?server=' + SERVER + '&type=playlist&id=' + PLAYLIST)
      .then(function (r) { return r.json() })
      .then(function (list) {
        if (!Array.isArray(list) || !list.length) throw new Error('歌单是空的')
        songs = list
        return songs
      })
      .catch(function (e) { loading = null; throw e })
    return loading
  }

  function parseLrc (text) {
    var out = []
    ;(text || '').split('\n').forEach(function (line) {
      var m = /^\[(\d+):(\d+)(?:[.:](\d+))?\]\s*(.*)$/.exec(line.trim())
      if (!m) return
      var t = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) / 100 : 0)
      var txt = (m[4] || '').trim()
      if (!txt) return
      // 纯符号行（"-"、"—"、"..." 之类）直接丢掉
      if (/^[-—–·.。…~～_\s]+$/.test(txt)) return
      // 过滤制作名单：歌名后面常跟一大段署名，歌词区不需要
      var CREDIT = /^(作词|作曲|词曲|原作词|原作曲|编曲|改编|混音|母带|演唱|原唱|翻唱|制作|制作人|监制|出品|发行|策划|统筹|企划|宣发|视觉|封面|插画|字幕|翻译|和声|伴唱|伴舞|吉他|贝斯|鼓|键盘|弦乐|录音|录音师|后期|混音师|母带师|OP|SP|词|曲|编|混|唱|奏|弹|合声|原曲|原词|原曲作者|词作者|曲作者)[^：:]{0,12}[：:]/
      if (CREDIT.test(txt)) return
      // 署名行一般很短又带冒号；纯歌词很少这么短
      if (txt.length <= 12 && /[：:]/.test(txt)) return
      out.push({ t: t, text: txt })
    })
    return out
  }

  function renderLyricLines () {
    lyricsInner.innerHTML = ''
    lineEls = []
    if (!lrc.length) {
      var d = document.createElement('div')
      d.className = 'lc-line'
      d.textContent = '纯音乐，请欣赏'
      lyricsInner.appendChild(d)
      lineEls.push(d)
      activeIdx = 0
      lyricsInner.style.transform = 'translateY(0px)'
      d.classList.add('active')
      return
    }
    lrc.forEach(function (item) {
      var d = document.createElement('div')
      d.className = 'lc-line'
      d.textContent = item.text
      lyricsInner.appendChild(d)
      lineEls.push(d)
    })
    activeIdx = -1
    lyricsInner.style.transform = 'translateY(0px)'
  }

  function syncLyric () {
    if (!lrc.length) return
    var t = audio.currentTime
    var idx = -1
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i].t <= t + 0.25) idx = i
      else break
    }
    if (idx === activeIdx) return
    if (activeIdx >= 0 && lineEls[activeIdx]) lineEls[activeIdx].classList.remove('active')
    activeIdx = idx
    if (idx >= 0 && lineEls[idx]) {
      lineEls[idx].classList.add('active')
      // 让当前行停在歌词窗的第二行位置，下面的往上滚
      var offset = idx * LINE_H - LINE_H * 1
      lyricsInner.style.transform = 'translateY(' + (-Math.max(0, offset)) + 'px)'
    }
  }

  function tick () {
    if (!audio.paused) {
      var d = audio.duration || 0
      if (d) {
        fill.style.width = Math.min(100, (audio.currentTime / d) * 100) + '%'
        timeEl.textContent = fmt(audio.currentTime)
      }
      syncLyric()
    }
    rafId = requestAnimationFrame(tick)
  }

  function loadLyric (song) {
    lrc = []
    renderLyricLines()
    if (!song.lrc) return
    var cached = lrcCache[song.lrc]
    var go = function (txt) {
      lrc = parseLrc(txt)
      renderLyricLines()
      syncLyric()
    }
    if (cached) { go(cached); return }
    fetch(song.lrc)
      .then(function (r) { return r.text() })
      .then(function (txt) { lrcCache[song.lrc] = txt; go(txt) })
      .catch(function () {})
  }

  function stopAudio () {
    try { audio.pause(); audio.currentTime = 0 } catch (e) {}
    fill.style.width = '0%'
    timeEl.textContent = '0:00'
    toggle.textContent = '▶'
    card.classList.remove('playing')
    toggle.classList.remove('loading')
  }

  function pick () {
    var i = Math.floor(Math.random() * songs.length)
    if (songs.length > 1 && i === lastIndex) i = (i + 1) % songs.length
    lastIndex = i
    return songs[i]
  }

  function render (autoplay) {
    if (!songs) return
    stopAudio()
    var s = pick()
    titleEl.textContent = s.name || '（无题）'
    artistEl.textContent = '— ' + (s.artist || '未知') + ' —'
    audio.src = s.url
    audio.load()
    loadLyric(s)
    if (autoplay) play()
  }

  function play () {
    if (!audio.src) return
    toggle.classList.add('loading')
    audio.play().then(function () {
      toggle.classList.remove('loading')
    }).catch(function () {
      toggle.classList.remove('loading')
      titleEl.textContent = '放不出来，换一首试试'
      artistEl.textContent = '音源可能暂时不可用'
    })
  }

  function refresh () {
    if (!songs) {
      btn.disabled = true
      titleEl.textContent = '正在从音乐馆拉歌单…'
      artistEl.textContent = '稍等一下'
      loadPlaylist().then(function () {
        btn.disabled = false
        render(false)
      }).catch(function (e) {
        btn.disabled = false
        titleEl.textContent = '歌单没拉到'
        artistEl.textContent = '检查网络后点「再抽一首」重试'
      })
      return
    }
    render(false)
  }

  function bind () {
    card = document.getElementById('listen-card')
    audio = document.getElementById('listen-audio')
    toggle = document.getElementById('lp-toggle')
    fill = document.getElementById('lp-fill')
    timeEl = document.getElementById('lp-time')
    bar = document.getElementById('lp-bar')
    titleEl = document.getElementById('listen-title')
    artistEl = document.getElementById('listen-artist')
    lyricsInner = document.getElementById('lc-lyrics-inner')
    btn = document.getElementById('listen-btn')
    if (!card || !audio || !toggle || !bar || !btn) return false

    toggle.addEventListener('click', function () {
      if (!audio.src) { refresh(); return }
      if (audio.paused) play()
      else audio.pause()
    })
    audio.addEventListener('play', function () {
      card.classList.add('playing')
      toggle.textContent = '❚❚'
      if (!rafId) rafId = requestAnimationFrame(tick)
    })
    audio.addEventListener('pause', function () { toggle.textContent = '▶' })
    audio.addEventListener('playing', function () { toggle.classList.remove('loading') })
    audio.addEventListener('waiting', function () { toggle.classList.add('loading') })
    audio.addEventListener('ended', function () {
      toggle.textContent = '▶'
      fill.style.width = '0%'
      timeEl.textContent = '0:00'
    })
    audio.addEventListener('error', function () {
      toggle.classList.remove('loading')
      if (audio.src) {
        titleEl.textContent = '这首放不出来'
        artistEl.textContent = '音源可能暂时不可用，换一首试试'
      }
    })
    bar.addEventListener('click', function (e) {
      if (!audio.duration) return
      var r = bar.getBoundingClientRect()
      var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      audio.currentTime = p * audio.duration
    })
    btn.addEventListener('click', refresh)
    document.addEventListener('keydown', function (e) {
      if (e.code !== 'Space') return
      if (/input|textarea/i.test((e.target.tagName || ''))) return
      e.preventDefault()
      if (!audio.src) { refresh(); return }
      if (audio.paused) play()
      else audio.pause()
    })
    return true
  }

  function boot () {
    if (!bind()) { setTimeout(boot, 300); return }
    refresh()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
</script>
