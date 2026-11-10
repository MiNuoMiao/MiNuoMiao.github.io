---
title: 今晚听什么
date: 2026-11-07 05:30:00
updated: 2026-11-10 21:20:00
comments: false
---

<div class="listen-box">
  <div class="listen-label">今晚 · 随机一首</div>
  <div class="listen-card" id="listen-card">
    <div class="listen-title" id="listen-title">点一下下面那颗按钮</div>
    <div class="listen-artist" id="listen-artist">从音乐馆的歌单里抽一首</div>
    <div class="listen-lyric" id="listen-lyric">（抽到哪首就放哪首）</div>
    <div class="listen-player" id="listen-player">
      <button class="lp-toggle" id="lp-toggle" type="button" aria-label="播放">▶</button>
      <div class="lp-bar" id="lp-bar">
        <div class="lp-fill" id="lp-fill"></div>
      </div>
      <span class="lp-time" id="lp-time">0:00</span>
    </div>
    <audio id="listen-audio" preload="none" crossorigin="anonymous"></audio>
  </div>
  <button class="listen-btn" id="listen-btn">再抽一首</button>
  <div class="listen-hint">空格键也可以 · 歌单来自音乐馆</div>
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
.listen-card.turning { animation: listenFade 0.5s ease; }
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
  min-height: 1.9em;
  color: var(--anzhiyu-main);
  transition: opacity 0.3s ease;
}
.listen-lyric.empty { opacity: 0.45; }
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
}
[data-theme="dark"] .listen-player { background: rgba(255, 255, 255, 0.08); }
.listen-player.disabled { opacity: 0.35; pointer-events: none; }
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
.lp-toggle.loading { opacity: 0.6; pointer-events: none; }
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
.listen-btn:active { transform: scale(0.97); }
.listen-btn:disabled { opacity: 0.5; cursor: default; transform: none; }
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
  // 歌单来自音乐馆：Meting 接口，server + playlist id 都跟导航里那个一致
  var METING = 'https://api.qijieya.cn/meting/'
  var SERVER = 'netease'
  var PLAYLIST = '8560567666'

  var songs = null          // 拉到的歌单
  var loading = null        // 进行中的请求
  var lastIndex = -1
  var lrcCache = {}
  var curLrc = []           // 当前这手的歌词行 [{t, text}]
  var lyricTimer = null

  var audio, fill, timeEl, toggle, player, bar, titleEl, artistEl, lyricEl, btn

  function fmt (s) {
    if (!isFinite(s) || s < 0) s = 0
    var m = Math.floor(s / 60)
    var sec = Math.floor(s % 60)
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
      var m = /^\[(\d+):(\d+)(?:[.:](\d+))?\](.*)$/.exec(line.trim())
      if (!m) return
      var t = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + (m[3] ? parseInt(m[3], 10) / 100 : 0)
      var txt = (m[4] || '').trim()
      if (txt && !/^(作词|作曲|编曲|混音|演唱|制作|和声|吉他|贝斯|鼓|母带|录音|监制|出品|发行|策划|统筹|美术|设计|OP|SP)/.test(txt)) {
        out.push({ t: t, text: txt })
      }
    })
    return out
  }

  function syncLyric () {
    if (!curLrc.length) return
    var t = audio.currentTime
    var cur = null
    for (var i = 0; i < curLrc.length; i++) {
      if (curLrc[i].t <= t + 0.3) cur = curLrc[i]
      else break
    }
    if (cur) {
      lyricEl.textContent = '「' + cur.text + '」'
      lyricEl.classList.remove('empty')
    }
  }

  function loadLyric (song) {
    curLrc = []
    if (lyricTimer) { clearInterval(lyricTimer); lyricTimer = null }
    lyricEl.textContent = '「……』'
    lyricEl.classList.add('empty')
    if (!song.lrc) return
    var cached = lrcCache[song.lrc]
    var go = function (txt) {
      curLrc = parseLrc(txt)
      if (curLrc.length) {
        // 还没播时先给一句中段的词，别空着
        var mid = curLrc[Math.floor(curLrc.length * 0.3)]
        lyricEl.textContent = '「' + mid.text + '」'
        lyricEl.classList.remove('empty')
      } else {
        lyricEl.textContent = '这首没有词'
      }
      lyricTimer = setInterval(syncLyric, 400)
    }
    if (cached) { go(cached); return }
    fetch(song.lrc)
      .then(function (r) { return r.text() })
      .then(function (txt) { lrcCache[song.lrc] = txt; go(txt) })
      .catch(function () { lyricEl.textContent = '这首没有词' })
  }

  function stopAudio () {
    if (!audio) return
    try { audio.pause(); audio.currentTime = 0 } catch (e) {}
    if (fill) fill.style.width = '0%'
    if (timeEl) timeEl.textContent = '0:00'
    if (toggle) toggle.textContent = '▶'
  }

  function pick () {
    var i = Math.floor(Math.random() * songs.length)
    if (songs.length > 1 && i === lastIndex) i = (i + 1) % songs.length
    lastIndex = i
    return songs[i]
  }

  function render () {
    stopAudio()
    if (!songs) return
    var s = pick()
    titleEl.textContent = s.name || '（无题）'
    artistEl.textContent = '— ' + (s.artist || '未知') + ' —'
    audio.src = s.url
    audio.load()
    player.classList.remove('disabled')
    toggle.classList.remove('loading')
    loadLyric(s)
    var card = document.getElementById('listen-card')
    card.classList.remove('turning')
    void card.offsetWidth
    card.classList.add('turning')
  }

  function refresh () {
    if (!songs) {
      btn.disabled = true
      titleEl.textContent = '正在从音乐馆拉歌单…'
      loadPlaylist().then(function () {
        btn.disabled = false
        render()
      }).catch(function (e) {
        btn.disabled = false
        titleEl.textContent = '歌单没拉到'
        artistEl.textContent = '检查网络后点「再抽一首」重试'
        lyricEl.textContent = '（' + (e && e.message ? e.message : '请求失败') + '）'
        lyricEl.classList.add('empty')
      })
      return
    }
    render()
  }

  function bind () {
    audio = document.getElementById('listen-audio')
    fill = document.getElementById('lp-fill')
    timeEl = document.getElementById('lp-time')
    toggle = document.getElementById('lp-toggle')
    player = document.getElementById('listen-player')
    bar = document.getElementById('lp-bar')
    btn = document.getElementById('listen-btn')
    titleEl = document.getElementById('listen-title')
    artistEl = document.getElementById('listen-artist')
    lyricEl = document.getElementById('listen-lyric')
    if (!audio || !toggle || !bar || !btn) return false

    toggle.addEventListener('click', function () {
      if (!audio.src) return
      if (audio.paused) {
        toggle.classList.add('loading')
        audio.play().then(function () {
          toggle.classList.remove('loading')
        }).catch(function () {
          toggle.classList.remove('loading')
          lyricEl.textContent = '这首放不出来（音源可能暂时不可用），换一首试试'
          lyricEl.classList.add('empty')
        })
      } else {
        audio.pause()
      }
    })
    audio.addEventListener('play', function () { toggle.textContent = '❚❚' })
    audio.addEventListener('pause', function () { toggle.textContent = '▶' })
    audio.addEventListener('waiting', function () { toggle.classList.add('loading') })
    audio.addEventListener('playing', function () { toggle.classList.remove('loading') })
    audio.addEventListener('ended', function () {
      toggle.textContent = '▶'
      fill.style.width = '0%'
      timeEl.textContent = '0:00'
    })
    audio.addEventListener('error', function () {
      toggle.classList.remove('loading')
      if (audio.src) {
        lyricEl.textContent = '这首放不出来（音源可能暂时不可用），换一首试试'
        lyricEl.classList.add('empty')
      }
    })
    audio.addEventListener('timeupdate', function () {
      var d = audio.duration || 0
      if (!d) return
      fill.style.width = Math.min(100, (audio.currentTime / d) * 100) + '%'
      timeEl.textContent = fmt(audio.currentTime)
    })
    bar.addEventListener('click', function (e) {
      if (!audio.duration) return
      var r = bar.getBoundingClientRect()
      var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      audio.currentTime = p * audio.duration
    })
    btn.addEventListener('click', refresh)
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Space' && !/input|textarea/i.test((e.target.tagName || ''))) {
        e.preventDefault()
        refresh()
      }
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
