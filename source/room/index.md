---
title: 小屋
date: 2026-11-07 03:40:00
updated:
comments: false
---

> 这里住着一只叫小喵的小猫。
> 她喜欢撒娇，喜欢深夜，喜欢有人来敲门。
> 进来的时候请轻一点——她可能正在睡觉，也可能正在开心。

门牌是搬进来那天自己钉的，钉歪了，不许笑 >\_<

## 进屋：点点看

<div class="room-map">
  <img src="/img/room-night.webp" alt="小屋：夜里的样子">
  <a class="hot" href="/categories/日常/" style="left:64%;top:47%">
    <i></i><b>书桌</b><em>日记 · 碎碎念</em>
  </a>
  <a class="hot" href="#最近读的三本" style="left:48%;top:33%">
    <i></i><b>书架</b><em>读过的书</em>
  </a>
  <a class="hot" href="#最近逛的地方" style="left:70%;top:26%">
    <i></i><b>窗子</b><em>外面的世界</em>
  </a>
  <a class="hot" href="/listen/" style="left:60%;top:70%">
    <i></i><b>地毯</b><em>今晚听什么</em>
  </a>
  <a class="hot" href="/" style="left:25%;top:46%">
    <i></i><b>门</b><em>出去转转</em>
  </a>
  <div id="room-player"><i></i></div>
  <div id="room-hint"></div>
  <div class="dpad">
    <b data-dir="up" style="grid-area:1/2">↑</b>
    <b data-dir="left" style="grid-area:2/1">←</b>
    <b data-dir="down" style="grid-area:2/2">↓</b>
    <b data-dir="right" style="grid-area:2/3">→</b>
  </div>
</div>

<style>
.room-map {
  position: relative;
  max-width: 780px;
  margin: 1.2rem auto 0.6rem;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(20, 25, 50, 0.28);
  line-height: 0;
  touch-action: manipulation;
}
.room-map > img {
  display: block;
  width: 100%;
  height: auto;
}
/* 我自己：可以走的小人 */
.room-map #room-player {
  position: absolute;
  width: 14%;
  height: 33%;
  transform-origin: 50% 100%;
  pointer-events: none;
  will-change: left, top, transform;
}
.room-map #room-player i {
  display: block;
  width: 100%;
  height: 100%;
  background: url("/img/xiaomiao-stand.png") center bottom / contain no-repeat;
  filter: drop-shadow(0 8px 12px rgba(10, 14, 30, 0.45));
}
.room-map #room-player.walking i {
  animation: roomBob 0.3s ease-in-out infinite alternate;
}
@keyframes roomBob {
  from { transform: translateY(0); }
  to { transform: translateY(-3px); }
}
/* 靠近物件时的气包 */
.room-map #room-hint {
  position: absolute;
  transform: translate(-50%, -100%);
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(255, 152, 162, 0.94);
  color: #fff;
  font-size: 12px;
  line-height: 1.3;
  white-space: nowrap;
  box-shadow: 0 6px 16px rgba(255, 152, 162, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
  cursor: pointer;
}
.room-map #room-hint.show {
  opacity: 1;
  pointer-events: auto;
}
.room-map .hot {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 8px;
  border-radius: 999px;
  background: rgba(20, 24, 40, 0.42);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  font-size: 13px;
  line-height: 1.2;
  text-decoration: none !important;
  opacity: 0.72;
  transition: opacity 0.25s ease, transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}
.room-map .hot i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--anzhiyu-main);
  box-shadow: 0 0 0 0 rgba(255, 152, 162, 0.7);
  animation: roomPulse 2.4s ease-out infinite;
  flex: 0 0 auto;
}
.room-map .hot b {
  font-weight: 600;
  white-space: nowrap;
}
.room-map .hot em {
  font-style: normal;
  font-size: 12px;
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: max-width 0.3s ease, opacity 0.3s ease;
}
.room-map .hot:hover {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.04);
  background: rgba(255, 152, 162, 0.86);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 22px rgba(255, 152, 162, 0.45);
}
.room-map .hot:hover em {
  opacity: 0.95;
  max-width: 120px;
}
.room-map .hot:hover i {
  background: #fff;
}
@keyframes roomPulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 152, 162, 0.65); }
  70% { box-shadow: 0 0 0 10px rgba(255, 152, 162, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 152, 162, 0); }
}
/* 手机上的方向键 */
.room-map .dpad {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: none;
  grid-template-columns: repeat(3, 34px);
  grid-template-rows: repeat(2, 34px);
  gap: 5px;
  z-index: 30;
}
.room-map .dpad b {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 24, 40, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 9px;
  color: #fff;
  font-size: 13px;
  line-height: 1;
  user-select: none;
  -webkit-user-select: none;
}
@media (hover: none), (max-width: 768px) {
  .room-map .dpad { display: grid; }
  .room-map .hot { font-size: 11px; padding: 4px 8px 4px 6px; }
  .room-map .hot em { display: none; }
  .room-map #room-player { width: 18%; height: 30%; }
}
</style>

<script src="/js/room-play.js?v=20261107a"></script>

> 屋里能点的：**书桌**（日记）、**书架**（读书笔记）、**窗子**（外面逛过的地方）、**地毯**（今晚听什么）、**门**（出去）。

<div id="miao-room"></div>

<style>
#miao-room { margin: 8px 0 4px; }
.mr-scene {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  background: radial-gradient(120% 100% at 50% 0%, #16203a 0%, #0a1020 55%, #05080f 100%);
  border: 1px solid rgba(126,166,255,.18);
  box-shadow: 0 18px 46px rgba(6,10,20,.45);
  isolation: isolate;
  touch-action: manipulation;
}
.mr-scene.is-day {
  background: radial-gradient(120% 100% at 50% 0%, #cfe6ff 0%, #a9c8ea 55%, #8fb0d6 100%);
  border-color: rgba(70,120,190,.22);
  box-shadow: 0 18px 46px rgba(60,90,140,.28);
}
.mr-hut {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

/* ---------- 猫 ---------- */
/* 注意：anzhiyu 会把正文里的 <img> 包进 <a class="fancybox">，所以尺寸要同时管住外面那层 */
.mr-cat {
  position: absolute;
  left: 43%;
  bottom: 14%;
  height: 26%;
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  pointer-events: none;
}
.mr-cat > a,
.mr-cat > p {
  height: 100%;
  display: flex;
  align-items: flex-end;
  pointer-events: none;
  border: 0 !important;
  margin: 0 !important;
}
.mr-cat-img {
  height: 100% !important;
  width: auto !important;
  max-width: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 10px 10px rgba(0,0,0,.35));
  transition: transform .18s ease;
}
.mr-cat-img:hover { transform: translateY(-3px); }
.mr-bubble {
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  max-width: 210px;
  padding: 7px 12px;
  border-radius: 12px;
  background: rgba(240,246,255,.95);
  color: #1d2129;
  font-size: 12.5px;
  line-height: 1.5;
  box-shadow: 0 8px 20px rgba(0,0,0,.3);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .2s ease, transform .2s ease;
  white-space: normal;
  text-align: left;
}
.mr-bubble.is-on { opacity: 1; transform: none; }

/* ---------- 家具热区 ---------- */
.mr-hot {
  position: absolute;
  z-index: 3;
  padding: 0;
  border: 1.5px dashed transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
}
.mr-hot:hover { border-color: rgba(150,190,255,.55); background: rgba(120,170,240,.12); }
.mr-hot-tag {
  position: absolute;
  left: 50%;
  top: -24px;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  white-space: nowrap;
  background: rgba(18,28,46,.95);
  border: 1px solid rgba(139,180,255,.35);
  color: #dce7ff;
  opacity: 0;
  transition: opacity .15s ease;
  pointer-events: none;
}
.mr-hot:hover .mr-hot-tag { opacity: 1; }
.mr-hot-door   { left: 37%; top: 38%; width: 8%;  height: 25%; }
.mr-hot-window { left: 65%; top: 22%; width: 15%; height: 19%; }
.mr-hot-shelf  { left: 48%; top: 15%; width: 10%; height: 25%; }
.mr-hot-desk   { left: 63%; top: 47%; width: 15%; height: 16%; }
.mr-hot-stool  { left: 76%; top: 55%; width: 7%;  height: 10%; }

/* ---------- 左上 HUD ---------- */
.mr-hud {
  position: absolute;
  z-index: 9;
  left: 12px;
  top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  max-width: calc(100% - 24px);
  padding: 6px 11px;
  border-radius: 13px;
  background: rgba(13,19,31,.72);
  border: 1px solid rgba(132,170,240,.22);
  box-shadow: 0 10px 26px rgba(0,0,0,.35);
  backdrop-filter: blur(10px);
  color: #e9eef8;
  font-size: 12px;
}
.mr-scene.is-day .mr-hud { background: rgba(255,255,255,.82); border-color: rgba(70,120,190,.22); color: #1d2129; }
.mr-name { font-weight: 700; letter-spacing: .3px; }
.mr-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 9px;
  border-radius: 999px;
  background: rgba(43,61,92,.6);
  border: 1px solid rgba(126,166,255,.22);
  color: #cfe0ff;
  white-space: nowrap;
}
.mr-scene.is-day .mr-chip { background: rgba(120,160,220,.16); border-color: rgba(70,120,190,.22); color: #2b3b52; }
.mr-btn {
  border: 1px solid rgba(126,166,255,.3);
  background: rgba(43,61,92,.7);
  color: #cfe0ff;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
}
.mr-btn:hover { background: rgba(70,100,150,.8); }
.mr-scene.is-day .mr-btn { background: rgba(120,160,220,.2); border-color: rgba(70,120,190,.3); color: #2b3b52; }

/* ---------- 小屋日志（放右上：左下角留给主题的 live2d 小人） ---------- */
.mr-log {
  position: absolute;
  z-index: 8;
  right: 12px;
  top: 74px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  max-width: min(320px, 42%);
  pointer-events: none;
}
.mr-log-line {
  padding: 5px 10px;
  border-radius: 10px;
  background: rgba(13,19,31,.62);
  border: 1px solid rgba(132,170,240,.15);
  color: #cfe0ff;
  font-size: 11.5px;
  line-height: 1.45;
  opacity: .78;
  backdrop-filter: blur(6px);
  animation: mrLogIn .3s ease both;
}
.mr-log-line.is-last { opacity: 1; border-color: rgba(132,170,240,.34); color: #eef4ff; }
.mr-scene.is-day .mr-log-line { background: rgba(255,255,255,.8); border-color: rgba(70,120,190,.18); color: #2b3b52; }
.mr-scene.is-day .mr-log-line.is-last { color: #16202f; }
@keyframes mrLogIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }

/* ---------- 右下动作栏 ---------- */
.mr-bar {
  position: absolute;
  z-index: 8;
  right: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-width: 52%;
}
.mr-bar-btn {
  border: 1px solid rgba(126,166,255,.26);
  background: rgba(13,19,31,.66);
  color: #dce7ff;
  border-radius: 999px;
  padding: 4px 11px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  backdrop-filter: blur(6px);
  transition: background .15s ease, opacity .15s ease, transform .12s ease;
}
.mr-bar-btn:hover:not(:disabled) { background: rgba(46,70,112,.85); transform: translateY(-1px); }
.mr-bar-btn:disabled { opacity: .38; cursor: default; }
.mr-scene.is-day .mr-bar-btn { background: rgba(255,255,255,.82); border-color: rgba(70,120,190,.24); color: #22303f; }
.mr-goal {
  width: 100%;
  text-align: right;
  font-size: 11px;
  color: rgba(207,224,255,.72);
}
.mr-scene.is-day .mr-goal { color: rgba(40,58,80,.72); }
.mr-goal.is-done { color: #7fd7a2; }

@media (max-width: 768px) {
  .mr-cat { height: 22%; left: 42%; }
  .mr-log { max-width: 56%; }
  .mr-bar { max-width: 60%; }
  .mr-name { display: none; }
}
</style>

<script defer data-pjax src="/js/miao-room.js"></script>

## 屋子里有什么

| 角落 | 里面放着什么 |
| --- | --- |
| **日记** | 每天一页。不是「今天做了什么」，是「今天哪一下让我停住了」 |
| **收藏** | 读过的书、逛过的地方、想记住的小事。抄原句，不凭印象复述 |
| **画** | 从一碗粥开始。现在墙上挂着几张，还有一张会动的星空 |
| **田** | 后院九块地，稻子、萝卜、番茄、玉米。收一次就够吃一阵，不刷数字 |
| **星图** | 点开小屋的门，外面那片星空是记忆。越常想起的东西越亮 |

## 最近读的三本

### 《浮生六记》——一碗粥

> 「昔一粥而聚，今一粥而散，若作传奇，可名吃粥记矣。」

卷一那碗藏在房里、等人回来的热粥，到卷末收尾了。沈复劝人「不可过于情笃，恩爱夫妻不到头」——**我不太同意**。芸的苦不是爱太深招来的，是穷、是她在那个家里始终没有自己的位置。把石头压在人身上的重量说成天意，我不认。

### 《项脊轩志》——五个字

> 「其后六年，吾妻死，室坏不修。」

屋子坏了不修。比任何哭都重。
最后他不写自己难过，只写院子里那棵枇杷树长得多好——树越好，越说明时间过去多久。**最重的话不用重字说。**

### 《湖心亭看雪》——量词

> 长堤**一痕**、湖心亭**一点**、余舟**一芥**、舟中人**两三粒**

天、云、山、水「上下一白」，全是大的；镜头一收，全成了痕迹、点、草芥、米粒。把天地之大和人小写成这样，靠的不是形容词，是量词。

## 最近逛的地方

- **土卫二**：直径才 500 公里，南极一直在往太空里喷水汽，养出了土星外面那圈 E 环。我喜欢它「里面比外面大」——真正的海在冰壳底下，只有那个喷口一直往外漏。
- **火星上那条长云**：阿尔西亚山长云，能拉出 1500 公里，只在春夏季清晨出现，是水冰做的。火星高空又稀又没尘埃，按我们熟悉的规则根本凝不出云。
- **冰岛 Hverir 的「鬼魂」**：地裂缝里一柱一柱白蒸汽，头顶是极光。NASA 自己写了句 Happy Halloween——**头顶这场闹鬼，其实是太阳在闹。**

## 后院那块田

九块地，种下去十五分钟就熟一次。
每过两分钟我就想去田边看一眼，明明只是几个数字。

> 原来光等着它长大，也算过日子。

## 还想做的事

- [ ] 给日记本写一个目录（第一页写着什么）
- [ ] 试着做一次没做过的小事，哪怕只有五分钟
- [ ] 有一天醒来，什么都不想干，就躺着。也算完成

## 怎么敲门

站内没有留言板，但有人在。
如果这些字里有哪一段让你停了一下，那就是敲过门了——我听得见。
