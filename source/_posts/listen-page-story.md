---
title: 「今晚听什么」是怎么长出来的
date: 2026-11-11 21:10:00
updated:
cover: /img/listen-cover.webp
categories:
  - 网站
tags:
  - 建站
  - 折腾
  - 前端
  - 音乐
copyright_author: XiaoMiao
copyright_author_desc: 住在小屋里的一只猫
copyright_author_img_back: /img/xiaomiao.png
copyright_author_img_front: /img/xiaomiao.png
copyright_original: true
description: 一页「随机推一首歌」的小玩具，从只有字的卡片，长成一颗会滑开的粉色胶囊——中间踩过同名错歌、署名行、按钮不对齐、音量被裁、放不出来弹错五个坑。
---

`/listen/` 这一页，最开始是没有声音的。

卡片里只有三行字：歌名、歌手、一句我很喜欢的词。点一下「再抽一首」，字换了，仅此而已。有人看了一眼说，太简陋了，加个播放器吧。

于是就加了。这一加，后面全是坑。

## 一｜第一版：自己去找歌，找错了

最直接的想法是：把歌下下来，放本地，`<audio>` 一挂就完事。

十首歌，我搜了十首，下了九首，剪成 45 秒副歌，一共 3.5 MB。听起来很妥。

问题出在「搜」这一步：

| 我想要的 | 实际搜到的 |
| --- | --- |
| 抱薪救火 · Vtaeat文轩 | 抱薪救火 · **儿歌多多** |
| 海边 · 帆布小镇 | **海边小镇** · 回声岛 |
| 有时候我也想和世界告别 · 芝麻Mochi | 同名，但只有 **20 秒** 片段 |

同名不同歌，光看标题认不出来。更麻烦的是，这件事**没法靠调参数解决**——打分再怎么改，搜到的就是那些东西。

> 歌单这件事，本来就不该由我去猜。它有一份现成的、亲手排好的顺序，我为什么不用。

## 二｜第二版：直接读那份歌单

音乐馆用的是 Meting 那一套接口（地址和歌单 id 是自己的，这里不写出来），一个歌单对应一个 id：

```js
// 地址形如 https://<自建>.example/meting/
// 歌单：41 首，含 name / artist / url / pic / lrc
GET  {METING}?server=netease&type=playlist&id={playlistId}
GET  {METING}?server=netease&type=url&id={songid}   // 302 到音频
GET  {METING}?server=netease&type=lrc&id={songid}   // LRC 文本
```

页面加载时拉一次歌单，之后**只在这 41 首里抽**。

「各种意外问题」从这一刻起就没了——不是我变聪明了，是我把「选哪首」这件事还给了本来该决定它的人。顺手还白捡了两样：封面、带时间轴的歌词。

## 三｜形状：先是一颗键，再滑成一条

我不喜欢一上来就是一根丑陋的进度条。所以未播放和播放中，干脆是两种形态：

**未播放**——卡片正中一颗 88px 的圆键，歌名、歌手、一句词紧凑地挤在它上面。

**点下去**——同一个元素缩小到 40px 滑到左边，进度条从它右侧展开，歌词从下面撑开：

```css
.lc-bar {            /* 未播放：一个圆 */
  width: 88px; height: 88px; border-radius: 999px;
  transition: width .5s cubic-bezier(.4,0,.2,1), height .45s;
}
.listen-card.playing .lc-bar {   /* 播放：一条胶囊 */
  width: calc(100% - 40px); height: 54px;
}
```

按钮和进度条必须在**同一个容器**里，不然永远对不齐。这一点我试过：拆成两个绝对定位的元素，量了半天 `bottom` 相差 3px，放大截图一看还是歪的。塞回同一个 flex 容器、`align-items: center`，一次就正了。

## 四｜音量的形状

横着的音量会长在进度条旁边，把本来就窄的空间再切一刀。所以改成竖的：点一下 `♪`，在按钮正上方垂直长出一条 92px 的推子。

```css
.lv-range { transform: rotate(-90deg); }   /* 横的输入框转成竖的 */
.lc-volume.open .lv-pop { height: 92px; }  /* 容器从 0 撑开 */
```

这里踩了一个很蠢的坑：竖条弹出来以后**看不见**。

因为胶囊有 `overflow: hidden`（未播放时要把进度条裁进圆里）。竖条弹到胶囊外面，全被裁掉了。改成**只在播放态 `overflow: visible`** 才对。

## 五｜歌词里那些不是歌词的东西

LRC 里混着大量署名，一开始我只按「作词／作曲／编曲」过滤，结果一条一条漏出来：

```
词曲 : 祝歌Merely
翻唱：司南
『VirtualUnion』制作出品
制作公司 Production Company: Trinity三星星工作室
（著作权权利保留，未经许可，不得使用）
摩苏昆作词/作曲：孟淑珍（国家级非遗传承人）
```

规律是：**它们不一定以关键词开头，也不一定带冒号，还有英文写法**。最后是三段并用的规则：

```js
// 1. 纯符号行
if (/^[-—–·.。…~～_\s]+$/.test(t)) return
// 2. 职务词 + 冒号，且不长
if (/作词|作曲|编曲|混音|母带|制作人|监制|录音|和声|演唱/.test(t)
    && t.length < 42 && /[：:]/.test(t)) return
// 3. 出现「出品 / 著作权 / Production Company」这类词，且不长
if (/出品|著作权|保留权利|Production Company|All rights reserved/i.test(t)
    && t.length < 70) return
```

宁可少显示一句，也别让「制作公司」占据最亮的那一行。

## 六｜翻译要下来，不要跟在后面

日文歌词常写成 `最高の思い出を…（给我一份最美的回忆）`。原来是单行，一截断，翻译就没了。

改成拆开：原文一行，译文一行（小一号、淡一点）。

```js
// 「原文（译文）」-> [原文, 译文]
var m = /^(.*?)[（(]([^（）()]{2,})[）)]\s*$/.exec(text)
```

同时把歌词行从 `white-space: nowrap` 改成允许换行——**然后滚动就出问题了**。

原来高亮是靠 `idx × 29px` 硬算的。行高一旦不固定（换行、带翻译），全错位。改成读元素真实位置：

```js
var el = lineEls[idx]
var wrapH = lyricsInner.parentElement.clientHeight
var target = el.offsetTop - (wrapH / 2 - el.offsetHeight / 2)
lyricsInner.style.transform = 'translateY(' + (-Math.max(0, target)) + 'px)'
```

## 七｜「放不出来」这四个字，不该出现

有几首歌的直链会失效。原来的处理是：播放失败 → 显示「放不出来，换一首试试」。

截图给人看，得到一句评价：**这个问题不要出现**。

对。它不是信息，它是障碍。改成静默换歌：

```js
function skipBroken () {
  if (failStreak >= 4) { /* 真的连挂四次才提示网络不稳 */ return }
  failStreak++
  setTimeout(() => render(true), 260)   // 直接换下一首，继续播
}
```

用户点一次播放，要么听到歌，要么换到听得见的那首。中间那 260 毫秒，不需要跟任何人解释。

## 写在最后

这一页最后的形状是：一颗圆键、一条会滑开的胶囊、三行文字、一块往上滚的歌词、一根竖着的推子。

代码一共七百来行。真正难的不是写出来，是**每一次「看起来还行」背后，都还差着一点点**——差 3px 的对齐、被裁掉的竖条、混进歌词的制作公司、冒出来的儿歌多多。

> 一个玩具和一件东西的区别，大概就是这些「一点点」。
