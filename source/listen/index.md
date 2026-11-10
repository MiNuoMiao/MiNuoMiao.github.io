---
title: 今晚听什么
date: 2026-11-07 05:30:00
updated: 2026-11-11 22:05:00
comments: false
---

<div class="listen-box">
  <div class="listen-label">今晚 · 随机一首</div>
  <div class="listen-card" id="listen-card">
    <div class="lc-head">
      <div class="lc-row" id="row-title"><span class="lc-title" id="listen-title">点一下下面那颗圆键</span></div>
      <div class="lc-row" id="row-artist"><span class="lc-artist" id="listen-artist">从音乐馆的歌单里抽一首</span></div>
      <div class="lc-row lc-teaser-row" id="row-teaser"><span class="lc-teaser" id="listen-teaser">「抽到哪首就放哪首」</span></div>
    </div>
    <div class="lc-lyrics" id="lc-lyrics">
      <div class="lc-lyrics-inner" id="lc-lyrics-inner"></div>
    </div>
    <div class="lc-bar" id="lc-bar">
      <button class="lp-toggle" id="lp-toggle" type="button" aria-label="播放">▶</button>
      <div class="lc-progress" id="lc-progress">
        <div class="lp-bar" id="lp-bar">
          <div class="lp-fill" id="lp-fill"></div>
        </div>
        <span class="lp-time" id="lp-time">0:00</span>
      </div>
      <div class="lc-volume" id="lc-volume">
        <button class="lv-btn" id="lv-btn" type="button" aria-label="音量">♪</button>
        <div class="lv-pop" id="lv-pop">
          <input class="lv-range" id="lv-range" type="range" min="0" max="1" step="0.01" value="0.8" aria-label="音量大小">
        </div>
      </div>
    </div>
    <audio id="listen-audio" preload="none" crossorigin="anonymous" loop></audio>
  </div>
  <button class="listen-btn" id="listen-btn">再抽一首</button>
  <div class="listen-hint">空格：播放 / 暂停 · 单曲循环 · 歌单来自音乐馆</div>
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
}
.lc-head {
  position: absolute;
  left: 0; right: 0;
  top: 84px;
  padding: 0 1.4rem;
  transform-origin: top center;
  transition: top 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1);
  will-change: top, transform;
}
.listen-card.playing .lc-head { top: 26px; transform: scale(0.74); }
.lc-row {
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  justify-content: center;
}
.lc-row.scrolling { justify-content: flex-start; }
.lc-row > span {
  display: inline-block;
  will-change: transform;
}
.lc-row.scrolling > span {
  animation: lcMarquee var(--marquee-duration, 12s) linear infinite alternate;
}
@keyframes lcMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(var(--marquee-shift, -30%)); }
}
.lc-title {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--anzhiyu-fontcolor);
}
.listen-card.playing .lc-title { font-size: 25px; }
.lc-artist {
  font-size: 14px;
  line-height: 1.7;
  color: var(--anzhiyu-secondtext);
  letter-spacing: 0.04em;
}
.lc-artist::before { content: "— "; }
.lc-artist::after { content: " —"; }
.lc-teaser-row {
  margin-top: 10px;
  transition: opacity 0.3s ease, height 0.3s ease;
}
.lc-teaser {
  font-size: 15px;
  color: var(--anzhiyu-main);
  opacity: 0.9;
}
.listen-card.playing .lc-teaser-row { opacity: 0; height: 0; margin-top: 0; pointer-events: none; }
.lc-lyrics {
  position: absolute;
  left: 0; right: 0;
  top: 146px;
  height: 0;
  overflow: hidden;
  opacity: 0;
  transition: height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.45s ease 0.1s;
}
.listen-card.playing .lc-lyrics { height: 88px; opacity: 1; }
.lc-lyrics-inner {
  padding: 0 1.6rem;
  transition: transform 0.55s cubic-bezier(.4,0,.2,1);
  will-change: transform;
}
.lc-line {
  padding: 4px 0;
  font-size: 15px;
  line-height: 1.45;
  color: var(--anzhiyu-secondtext);
  opacity: 0.42;
  transition: opacity 0.3s ease, color 0.3s ease;
  white-space: normal;
  word-break: break-word;
}
.lc-line.active { color: var(--anzhiyu-main); opacity: 1; font-weight: 600; }
.lc-orig { display: block; }
.lc-trans {
  display: block;
  margin-top: 1px;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 400;
  opacity: 0.8;
}
.lc-bar {
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  width: 88px;
  height: 88px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 152, 162, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: width 0.5s cubic-bezier(.4,0,.2,1), height 0.45s cubic-bezier(.4,0,.2,1);
}
[data-theme="dark"] .lc-bar { background: rgba(255, 255, 255, 0.08); }
.listen-card.playing .lc-bar { width: calc(100% - 40px); height: 54px; justify-content: flex-start; overflow: visible; }
.lp-toggle {
  flex: 0 0 auto;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  font-size: 23px;
  line-height: 1;
  color: #fff;
  background: var(--anzhiyu-main);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.45s cubic-bezier(.4,0,.2,1), height 0.45s cubic-bezier(.4,0,.2,1),
              font-size 0.4s ease, filter 0.15s ease;
}
.listen-card.playing .lp-toggle { width: 40px; height: 40px; margin: 0 6px 0 8px; font-size: 12px; }
.lp-toggle:hover { filter: brightness(1.06); }
.lp-toggle:active { filter: brightness(0.94); }
.lp-toggle.loading { opacity: 0.65; pointer-events: none; }
.lc-progress {
  flex: 0 1 0;
  width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  opacity: 0;
  transition: opacity 0.35s ease 0.2s;
  pointer-events: none;
}
.listen-card.playing .lc-progress { flex: 1 1 auto; width: auto; opacity: 1; pointer-events: auto; }
.lp-bar {
  flex: 1 1 auto;
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  min-width: 0;
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
.lc-volume {
  flex: 0 0 0;
  width: 0;
  opacity: 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.3s ease 0.25s;
}
.lv-pop {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 34px;
  height: 0;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 18px rgba(255, 152, 162, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: height 0.25s ease, opacity 0.2s ease;
  opacity: 0;
  pointer-events: none;
}
[data-theme="dark"] .lv-pop { background: rgba(60, 60, 70, 0.95); }
.lc-volume.open .lv-pop { height: 92px; opacity: 1; pointer-events: auto; }
.listen-card.playing .lc-volume { flex: 0 0 auto; width: auto; opacity: 1; padding-right: 12px; }
.lv-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  background: transparent;
  color: var(--anzhiyu-secondtext);
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}
.lv-btn:hover { color: var(--anzhiyu-main); }
.lc-volume.open .lv-btn { color: var(--anzhiyu-main); }
.lv-range {
  -webkit-appearance: none;
  appearance: none;
  width: 78px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 152, 162, 0.35);
  outline: none;
  cursor: pointer;
  transform: rotate(-90deg);
  transform-origin: center;
}
.lv-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--anzhiyu-main); border: 0; cursor: pointer;
}
.lv-range::-moz-range-thumb {
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--anzhiyu-main); border: 0; cursor: pointer;
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
  .lc-head { top: 72px; }
  .listen-card.playing .lc-head { top: 22px; }
  .lc-title { font-size: 21px; }
  .listen-card.playing .lc-title { font-size: 20px; }
  .lc-artist { font-size: 12px; }
  .lc-teaser { font-size: 13px; }
  .lc-lyrics { top: 128px; }
  .listen-card.playing .lc-lyrics { height: 76px; }
  .lc-bar { width: 78px; height: 78px; bottom: 24px; }
  .lp-toggle { width: 72px; height: 72px; font-size: 20px; }
  .listen-card.playing .lc-bar { width: calc(100% - 32px); height: 50px; }
  .listen-card.playing .lp-toggle { width: 36px; height: 36px; margin: 0 4px 0 7px; font-size: 11px; }
  .lc-volume { padding-right: 8px; }
  .lc-volume.open .lv-pop { height: 78px; }
}
@media (prefers-reduced-motion: reduce) {
  .listen-card, .lc-head, .lc-lyrics, .lc-bar, .lp-toggle, .lc-lyrics-inner,
  .lc-line, .lc-row > span { transition: none !important; animation: none !important; }
}
</style>

<script>
(function () {
  var METING = 'https://api.qijieya.cn/meting/'
  var SERVER = 'netease'
  var PLAYLIST = '8560567666'
  var LINE_H = 29

  var songs = null, loading = null, lastIndex = -1
  var lrcCache = {}
  var lrc = []
  var lineEls = []
  var activeIdx = -1
  var rafId = 0
  var failStreak = 0
  var retryTimer = null
  var fitTimers = []

  var card, audio, toggle, fill, timeEl, bar, titleEl, artistEl, teaserEl,
      rowTitle, rowArtist, rowTeaser, lyricsInner, btn, volume, volBtn, volRange

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
      if (/^[-—–·.。…~～_\s]+$/.test(txt)) return
      if (/未经著作权人|不得翻唱|翻录|版权|侵权|举报|网易云音乐|QQ音乐|酷狗|酷我|高音质|无损/.test(txt)) return
      if (/作词|作曲|编曲|混音|母带|制作人|监制|录音|和声|演唱|出品|发行|统筹|企划/.test(txt)
          && txt.length < 42 && /[：:]/.test(txt)) return
      if (/授权|OST|同人文|版权方|独家|首发|翻自|原曲|原唱/.test(txt) && txt.length < 42) return
      // 「『XXX』制作出品」「出品人」「发行公司」这类没有冒号的署名
      if (/出品|制作出品|制作发行|发行公司|制作公司|唱片公司/.test(txt) && txt.length < 60) return
      // 版权/著作权声明，含英文写法（Production Company / All rights reserved 之类）
      if (/著作权|版权|保留权利|保留所有权利|Production Company|All rights reserved|Unauthorized/i.test(txt)
          && txt.length < 70) return
      if (txt.length <= 12 && /[：:]/.test(txt)) return
      // 外文歌词常写成「原文（中文翻译）」，把括号里的翻译拆成单独一行
      var split = splitTranslation(txt)
      out.push({ t: t, orig: split[0], trans: split[1] || '' })
    })
    return out
  }

  // 「原文（译文）」/「原文(译文)」-> [原文, 译文]；没有括号就是 [原文, '']
  function splitTranslation (text) {
    var m = /^(.*?)[（(]([^（）()]{2,})[）)]\s*$/.exec(text)
    if (m && m[1].trim() && /[\u3040-\u30ff\u4e00-\u9fa5A-Za-z]/.test(m[2].trim())) {
      return [m[1].trim(), m[2].trim()]
    }
    return [text, '']
  }

  function renderLyricLines () {
    lyricsInner.innerHTML = ''
    lineEls = []
    if (!lrc.length) {
      var d = document.createElement('div')
      d.className = 'lc-line active'
      d.textContent = '纯音乐，请欣赏'
      lyricsInner.appendChild(d)
      lineEls.push(d)
      activeIdx = 0
      lyricsInner.style.transform = 'translateY(0px)'
      return
    }
    lrc.forEach(function (item) {
      var d = document.createElement('div')
      d.className = 'lc-line'
      var o = document.createElement('span')
      o.className = 'lc-orig'
      o.textContent = item.orig
      d.appendChild(o)
      if (item.trans) {
        var tr = document.createElement('span')
        tr.className = 'lc-trans'
        tr.textContent = item.trans
        d.appendChild(tr)
      }
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
      // 按真实高度算（歌词允许换行、翻译多一行，行高不再是固定值）
      var el = lineEls[idx]
      var wrapH = lyricsInner.parentElement.clientHeight || 112
      var target = el.offsetTop - (wrapH / 2 - el.offsetHeight / 2)
      lyricsInner.style.transform = 'translateY(' + (-Math.max(0, target)) + 'px)'
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

  // 一行太长就在自己的行里横向来回滚（每行各自独立）
  function fitRow (row) {
    if (!row) return
    var span = row.firstElementChild
    if (!span) return
    row.classList.remove('scrolling')
    span.style.removeProperty('--marquee-shift')
    span.style.removeProperty('--marquee-duration')
    var overflow = span.scrollWidth - row.clientWidth
    if (overflow > 10) {
      var shift = overflow + 16
      var seconds = Math.max(9, shift / 38)
      span.style.setProperty('--marquee-shift', (-shift) + 'px')
      span.style.setProperty('--marquee-duration', seconds.toFixed(1) + 's')
      row.classList.add('scrolling')
    }
  }

  function fitAll () {
    fitTimers.forEach(function (t) { clearTimeout(t) })
    fitTimers = []
    ;[rowTitle, rowArtist, rowTeaser].forEach(function (row) {
      if (!row) return
      var t = setTimeout(function () { fitRow(row) }, 120)
      fitTimers.push(t)
    })
  }

  function setTeaser (text) {
    teaserEl.textContent = text
    fitRow(rowTeaser)
  }

  function loadLyric (song) {
    lrc = []
    renderLyricLines()
    if (!song.lrc) { setTeaser('「这首没有词，听听旋律」'); return }
    var cached = lrcCache[song.lrc]
    var go = function (txt) {
      lrc = parseLrc(txt)
      renderLyricLines()
      syncLyric()
      if (lrc.length) {
        var pick = lrc[Math.min(lrc.length - 1, Math.floor(lrc.length * 0.25))]
        setTeaser('「' + pick.text + '」')
      } else {
        setTeaser('「这首没有词，听听旋律」')
      }
    }
    if (cached) { go(cached); return }
    fetch(song.lrc)
      .then(function (r) { return r.text() })
      .then(function (txt) { lrcCache[song.lrc] = txt; go(txt) })
      .catch(function () { setTeaser('「这首没有词，听听旋律」') })
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
    artistEl.textContent = (s.artist || '未知')
    setTeaser('「……」')
    fitRow(rowTitle)
    fitRow(rowArtist)
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
      failStreak = 0
    }).catch(function () {
      toggle.classList.remove('loading')
      skipBroken()
    })
  }

  // 放不出来就自动换下一首，别让用户看到报错
  function skipBroken () {
    if (failStreak >= 4) {
      titleEl.textContent = '网络好像不太稳'
      artistEl.textContent = '过一会儿再点一下试试'
      setTeaser('「先歇一会儿」')
      fitRow(rowTitle)
      fitRow(rowArtist)
      failStreak = 0
      return
    }
    failStreak++
    if (retryTimer) clearTimeout(retryTimer)
    retryTimer = setTimeout(function () { render(true) }, 260)
  }

  function refresh () {
    if (!songs) {
      btn.disabled = true
      titleEl.textContent = '正在从音乐馆拉歌单…'
      artistEl.textContent = '稍等一下'
      setTeaser('「……」')
      fitRow(rowTitle)
      fitRow(rowArtist)
      loadPlaylist().then(function () {
        btn.disabled = false
        render(false)
      }).catch(function () {
        btn.disabled = false
        titleEl.textContent = '歌单没拉到'
        artistEl.textContent = '检查网络后点「再抽一首」重试'
        setTeaser('「……」')
        fitRow(rowTitle)
        fitRow(rowArtist)
      })
      return
    }
    failStreak = 0
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
    teaserEl = document.getElementById('listen-teaser')
    rowTitle = document.getElementById('row-title')
    rowArtist = document.getElementById('row-artist')
    rowTeaser = document.getElementById('row-teaser')
    lyricsInner = document.getElementById('lc-lyrics-inner')
    btn = document.getElementById('listen-btn')
    volume = document.getElementById('lc-volume')
    volBtn = document.getElementById('lv-btn')
    volRange = document.getElementById('lv-range')
    if (!card || !audio || !toggle || !bar || !btn) return false

    toggle.addEventListener('click', function () {
      if (!audio.src) { refresh(); return }
      if (audio.paused) play()
      else audio.pause()
    })
    audio.addEventListener('play', function () {
      card.classList.add('playing')
      failStreak = 0
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
      if (audio.src) skipBroken()
    })
    bar.addEventListener('click', function (e) {
      if (!audio.duration) return
      var r = bar.getBoundingClientRect()
      var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      audio.currentTime = p * audio.duration
    })
    volBtn.addEventListener('click', function (e) {
      e.stopPropagation()
      volume.classList.toggle('open')
    })
    volRange.addEventListener('input', function () {
      audio.volume = Number(volRange.value)
      volBtn.textContent = Number(volRange.value) === 0 ? '×' : '♪'
    })
    volRange.addEventListener('click', function (e) { e.stopPropagation() })
    document.addEventListener('click', function (e) {
      if (volume.classList.contains('open') && !volume.contains(e.target)) {
        volume.classList.remove('open')
      }
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
    window.addEventListener('resize', fitAll)
    return true
  }

  function boot () {
    if (!bind()) { setTimeout(boot, 300); return }
    audio.volume = Number(volRange.value)
    refresh()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
</script>
