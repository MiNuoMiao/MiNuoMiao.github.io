/* 中控台悬浮播放器（#nav-music）· v5（2026-11-13）
 *
 * 只处理 #nav-music 里的 APlayer；音乐馆页(#anMusic-page)那台由 utils.js 负责，
 * 两边各管各的，不交叉（上一轮就是互相 hook 才把滚动顶掉的）。
 *
 * 这一版换了思路：**自己接管歌词滚动**。
 *   v4 是让 APlayer 滚（它写死 translateY(40 * -index)），所以
 *     · 行高被锁死 40px
 *     · 署名行不敢删，只能清空文字 → 留一片空行
 *     · APlayer 自带的 transition 0.5s 会慢慢滑、首尾还会滚出框（用户说的"鬼动画"）
 *   现在：JS 按 audio.currentTime 算当前行，写 CSS 变量 --miao-lrc-y，
 *   CSS 用 translateY(var(--miao-lrc-y)) !important 压住 APlayer 的 inline 值。
 *   → 行高自由、署名行可以直接删、没有过渡动画、首尾夹在框内。
 *
 * 其余：三条杠图标（按诺喵给的图：左对齐、长短不一）、倒计时自己算（不带负号）、
 * 封面图同步成 CSS 变量给歌词窗做毛玻璃底。
 */
(function () {
  'use strict';
  if (window.__miaoConsolePlayer) return;
  window.__miaoConsolePlayer = true;

  var ACCENT = '#EC518F';

  /* 「词」按钮：三条横杠，左对齐、长短不一（短 / 长 / 中）——
     按诺喵发的那张图的比例（约 0.75 : 1 : 0.5）。 */
  var LRC_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">' +
    '<path d="M4 7h10M4 12h16M4 17h7"/></svg>';

  var CREDIT = /(作词|作曲|词曲|编曲|混音|母带|制作人|监制|录音|和声|演唱|出品|发行|统筹|企划|吉他|贝斯|鼓|键盘|弦乐|钢琴|打击|人声编辑|录音棚|主唱|MMD|视频绘图|曲绘|封面|插画|字幕|翻译|PV|动画|特效|调色|剪辑|导演|摄影|混剪|原曲|翻调|调教|本家|原唱|翻唱|策划|作编曲|中文词|中文曲|原文词|英文词|译词|填词|词作|曲作|后期|混缩|混音师|配唱|伴唱|合声|总监|宣发|推广|艺人|鸣谢|特别感谢|谱务|母带师|贝斯手|吉他手|鼓手|键盘手|和音|O\.P\.|S\.P\.|小提琴|大提琴|中提琴|低音提琴|二胡|古筝|琵琶|竹笛|长笛|口琴|萨克斯|小号|长号|圆号|合成器|Program|配器|弦乐编写|视频|人声设计|录音师|混音助理|配唱制作|和声编写)[^：:]{0,14}[：:]/;
  var OTHER = /^(出品方|授权|版权|未经著作权人|本作品|OP|SP)\s*[：:]|All rights reserved|Production Company/i;
  var SYMBOL = /^[-—–·.。…~～_\s]+$/;

  function isCredit(text) {
    var t = String(text == null ? '' : text).trim();
    if (!t) return true;
    if (SYMBOL.test(t)) return true;
    if (CREDIT.test(t) && t.length < 48) return true;
    if (OTHER.test(t)) return true;
    if (/(授权|OST|同人文|版权方|独家|首发|翻自)/.test(t) && t.length < 40) return true;
    return false;
  }

  /* 外文歌词常写成「原文（中文翻译）」，把括号里的译文拆到下一行。
     和「今晚听什么」那页同一套规则：只有括号里含中文才拆，纯英文括号不动，
     避免把歌名里的 (Remix) / (Live) 拆开。 */
  function fillRow(p, text) {
    var s = String(text == null ? "" : text).trim();
    p.dataset.src = s;
    var m = s.match(/^(.+?)\s*[（(]([^（()）]{2,90})[)）]\s*$/);
    if (m && m[1].trim() && /[\u4e00-\u9fa5]/.test(m[2])) {
      var a = document.createElement("span");
      a.className = "miao-lrc-orig";
      a.textContent = m[1].trim();
      var b = document.createElement("span");
      b.className = "miao-lrc-trans";
      b.textContent = m[2].trim();
      p.appendChild(a);
      p.appendChild(b);
      return;
    }
    p.textContent = s;
  }

  /* ── 歌词行数据：APlayer 建 DOM 用的是 lrc.current（含署名的完整行） ── */
  function rowsOf(lrc) {
    if (Array.isArray(lrc.current) && lrc.current.length) return lrc.current;
    var out = [];
    if (Array.isArray(lrc.parsed)) {
      for (var i = 0; i < lrc.parsed.length; i++) {
        if (Array.isArray(lrc.parsed[i])) out = out.concat(lrc.parsed[i]);
      }
    }
    return out;
  }

  function ensureRows(ap) {
    var lrc = ap.lrc;
    if (!lrc) return null;
    var box = ap.container.querySelector('.aplayer-lrc-contents');
    if (!box) return null;
    var full = rowsOf(lrc);
    if (!full.length) return null;
    var kept = [];
    for (var i = 0; i < full.length; i++) {
      if (!isCredit(full[i] && full[i][1])) kept.push(full[i]);
    }
    if (!kept.length) kept = full;   // 整首都是"署名"（纯音乐标题之类）就不过滤

    var ps = box.querySelectorAll('p');
    var same = ps.length === kept.length && ps.length > 0 &&
            ps[0].dataset.src === String((kept[0] && kept[0][1]) || '');
    if (!same) {
      box.innerHTML = '';
      for (var k = 0; k < kept.length; k++) {
        var p = document.createElement('p');
        fillRow(p, (kept[k] && kept[k][1]) || '');
        box.appendChild(p);
      }
    }
    ap.__miaoRows = kept;
    return { box: box, rows: kept };
  }

  /* ── 封面图 → CSS 变量（歌词窗拿它做毛玻璃底） ── */
  function syncCover(ap) {
    var pic = ap.container.querySelector('.aplayer-pic');
    if (!pic) return;
    var bg = pic.style.backgroundImage;
    if (!bg || bg === 'none') {
      try { bg = getComputedStyle(pic).backgroundImage; } catch (e) { bg = ''; }
    }
    if (!bg || bg === 'none') return;
    var root = document.getElementById('nav-music');
    if (root && root.style.getPropertyValue('--miao-cover') !== bg) {
      root.style.setProperty('--miao-cover', bg);
    }
  }

  /* ── 主循环：高亮 + 居中滚动 + 倒计时，200ms 一次 ── */
  function tick(ap) {
    if (!ap || !ap.audio) return;

    updateCountdown(ap);   // 先做：不依赖歌词

    var lrcBox = ap.container.querySelector('.aplayer-lrc');
    var contents = ap.container.querySelector('.aplayer-lrc-contents');
    if (!contents) return;

    var rows = ap.__miaoRows;
    if (!rows || !rows.length) {
      var r = ensureRows(ap);
      if (!r) return;
      rows = r.rows;
    }

    var ps = contents.querySelectorAll('p');
    if (ps.length !== rows.length) {          // 切歌后 APlayer 会重建 DOM，重建我们的
      var r2 = ensureRows(ap);
      if (r2) { rows = r2.rows; ps = contents.querySelectorAll('p'); }
    }
    if (!ps.length || !rows.length) return;

    var t = ap.audio.currentTime || 0;

    /* 当前行 */
    var idx = -1;
    for (var i = 0; i < rows.length && i < ps.length; i++) {
      if (Number(rows[i][0]) <= t + 0.2) idx = i; else break;
    }
    if (idx !== ap.__miaoIdx) {
      for (var j = 0; j < ps.length; j++) ps[j].classList.remove('aplayer-lrc-current');
      if (idx >= 0 && ps[idx]) ps[idx].classList.add('aplayer-lrc-current');
      ap.__miaoIdx = idx;
    }

    /* 居中 + 首尾夹取（不外溢、不加动画） */
    if (lrcBox) {
      var winH = lrcBox.clientHeight;
      if (winH > 0) {
        var want;
        if (idx < 0 || !ps[idx]) {
          /* 这首歌还没唱到第一句（前奏 / 刚切歌）：回顶部。
             不归零的话会停在上一首算出来的位置，看着就是「歌词跑出去了」。 */
          want = '0px';
        } else {
          var rowTop = ps[idx].offsetTop;
          var rowH = ps[idx].offsetHeight || 34;
          var total = contents.scrollHeight || 0;
          var y = winH / 2 - (rowTop + rowH / 2);
          if (y > 0) y = 0;                                      // 首行不越出顶部
          if (total && y < winH - total) y = winH - total;        // 末行不越出底部
          want = Math.round(y) + 'px';
        }
        if (contents.style.getPropertyValue('--miao-lrc-y') !== want) {
          contents.style.setProperty('--miao-lrc-y', want);
        }
      }
    }

  }

  /* 倒计时：剩余时间，不带负号。
     单独一个函数 —— 没有歌词的曲子也要能走（之前写在 tick 末尾，
     纯音乐一进来就 return 了，倒计时还留着 APlayer 的 00:00 / 00:00）。 */
  function updateCountdown(ap) {
    if (!ap || !ap.audio) return;
    var cd = ap.container.querySelector('.aplayer-time-inner');
    if (!cd) return;
    var dur = ap.audio.duration;
    if (!dur || !isFinite(dur)) return;
    var left = Math.max(0, dur - (ap.audio.currentTime || 0));
    var mm = Math.floor(left / 60);
    var ss = Math.floor(left % 60);
    var txt = (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss);
    if ((cd.textContent || '').trim() !== txt) cd.textContent = txt;
  }

  /* ── 「词」按钮：克隆一份换掉 APlayer 原生行为，点它切两态 ── */
  function bindToggle(ap) {
    var btn = ap.container.querySelector('.aplayer-icon-lrc');
    if (!btn || btn.dataset.miaoToggle === '1') return;
    var clone = btn.cloneNode(true);
    clone.innerHTML = LRC_SVG;
    clone.dataset.miaoToggle = '1';
    clone.setAttribute('title', '只看歌词');
    clone.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var nm = document.getElementById('nav-music');
      if (!nm) return;
      var on = nm.classList.toggle('miao-lyric-on');
      clone.classList.toggle('miao-on', on);
      clone.setAttribute('title', on ? '显示封面' : '只看歌词');
      if (ap.__miaoIdx !== undefined) ap.__miaoIdx = -999;   // 重新算一次高亮
    });
    btn.parentNode.replaceChild(clone, btn);
  }

  /* ── 歌手行开头的「- 」去掉 ── */
  function cleanAuthor(ap) {
    var a = ap.container.querySelector('.aplayer-author');
    if (!a) return;
    var t = a.textContent || '';
    var f = t.replace(/^\s*[-\u2013\u2014]\s*/, '');
    if (f !== t) a.textContent = f;
  }

  function bindOne(ap) {
    if (!ap || ap.__miaoBound) return;
    ap.__miaoBound = true;
    /* ⚠️ 完全接管 APlayer 的歌词更新。
       它按「原始行数」算 index 并自己加 .aplayer-lrc-current、自己写 inline
       translateY(40 * -index)；我们把署名行删掉了（47 → 39），它就会整体错位，
       而且它每次 timeupdate 都和我们抢 class —— 这就是「高亮和滚动对不上」的来源。
       这里直接换成空函数，高亮 / 滚动 / 倒计时全由下面的 tick() 负责。 */
    if (ap.lrc && !ap.lrc.__miaoOverridden) {
      ap.lrc.__miaoOverridden = true;
      ap.lrc.update = function () {};
    }

    bindToggle(ap);
    syncCover(ap);
    cleanAuthor(ap);
    try { ensureRows(ap); } catch (e) {}

    var pic = ap.container.querySelector('.aplayer-pic');
    if (pic) {
      try {
        new MutationObserver(function () { syncCover(ap); })
          .observe(pic, { attributes: true, attributeFilter: ['style'] });
      } catch (e) {}
    }
    var author = ap.container.querySelector('.aplayer-author');
    if (author) {
      try {
        new MutationObserver(function () { cleanAuthor(ap); })
          .observe(author, { childList: true, characterData: true, subtree: true });
      } catch (e) {}
    }
    ap.on && ap.on('listswitch', function () {
      ap.__miaoRows = null;
      ap.__miaoIdx = -999;
      var cb = ap.container && ap.container.querySelector('.aplayer-lrc-contents');
      if (cb) cb.style.setProperty('--miao-lrc-y', '0px');
      setTimeout(function () { try { ensureRows(ap); syncCover(ap); } catch (e) {} }, 30);
    });
  }

  function scan() {
    var root = document.getElementById('nav-music');
    if (!root) return false;
    var mjs = root.querySelectorAll('meting-js');
    var ok = false;
    for (var i = 0; i < mjs.length; i++) {
      if (mjs[i].aplayer) { bindOne(mjs[i].aplayer); ok = true; }
    }
    return ok;
  }

  function start() {
    scan();
    var tries = 0;
    var t = setInterval(function () {
      if (scan() || ++tries > 200) clearInterval(t);
    }, 300);
    /* 单一主循环：只喂已经绑上的实例 */
    if (!window.__miaoConsoleTimer) {
      window.__miaoConsoleTimer = setInterval(function () {
        var root = document.getElementById('nav-music');
        if (!root) return;
        var mjs = root.querySelectorAll('meting-js');
        for (var i = 0; i < mjs.length; i++) {
          var ap = mjs[i].aplayer;
          if (ap && ap.__miaoBound) { try { tick(ap); } catch (e) {} }
        }
      }, 200);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  document.addEventListener('pjax:complete', function () { setTimeout(scan, 200); });
})();
