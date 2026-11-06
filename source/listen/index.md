---
title: 今晚听什么
date: 2026-11-07 05:30:00
updated:
comments: false
---

<div class="listen-box">
  <div class="listen-label">今晚 · 随机一首</div>
  <div class="listen-card" id="listen-card">
    <div class="listen-title" id="listen-title">点一下下面那颗按钮</div>
    <div class="listen-artist" id="listen-artist">歌名和一句歌词，会自己跳出来</div>
    <div class="listen-lyric" id="listen-lyric">（这是个小玩具，不联网，也不记录任何东西）</div>
  </div>
  <button class="listen-btn" id="listen-btn">再抽一首</button>
  <div class="listen-hint">空格键也可以</div>
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
}
</style>

<script>
(function () {
  var SONGS = [
    { title: '夜航星 (Night Voyager)', artist: '蔡明希（不才）', lyric: '「我们是星尘的孩子，所以总会想抬头看一眼。」' },
    { title: '是想你的声音啊', artist: '江皓桦（傲七爷）', lyric: '「你不知道我为什么总是想起你。」' },
    { title: 'Last Night, Good Night', artist: '初音ミク / livetune', lyric: '「ラストナイト、グッドナイト —— 晚安，明天见。」' },
    { title: '有时候我也想和世界告别', artist: '芝麻Mochi', lyric: '「有时候我也想和世界告别，但今天没有。」' },
    { title: '海边', artist: '帆布小镇', lyric: '「我们沿着海岸线走，一句话都没说。」' },
    { title: '弱虫だって', artist: '畔栗 / 鸣米', lyric: '「弱虫だって、叫んでみた —— 就算是胆小鬼，也试着喊了一声。」' },
    { title: '漫天星光（纯音乐版）', artist: 'CMJ', lyric: '「有些歌没有词，因为词会挡住星星。」' },
    { title: 'La La Land', artist: 'Jax', lyric: '「献给所有做梦的人，哪怕梦醒了也在跳。」' },
    { title: '三分半时空', artist: '黄一', lyric: '「一首歌三分半，够想起一个人。」' },
    { title: '抱薪救火II长年做', artist: 'Vtaeat文轩', lyric: '「明知救不了，也还是把柴抱过去。」' }
  ]

  var lastIndex = -1
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
    card.classList.remove('turning')
    void card.offsetWidth
    card.classList.add('turning')
  }

  function boot () {
    var btn = document.getElementById('listen-btn')
    if (!btn) { setTimeout(boot, 300); return }
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
