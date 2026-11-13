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

  var CREDIT = /(作词|作曲|词曲|编曲|混音|母带|制作人|监制|录音|和声|演唱|出品|发行|统筹|企划|吉他|贝斯|鼓|键盘|弦乐|钢琴|打击|人声编辑|录音棚|主唱|MMD|视频绘图|曲绘|封面|插画|字幕|翻译|PV|动画|特效|调色|剪辑|导演|摄影|混剪|原曲|翻调|调教|本家|原唱|翻唱|策划|作编曲|中文词|中文曲|原文词|英文词|译词|填词|词作|曲作|后期|混缩|混音师|配唱|伴唱|合声|总监|宣发|推广|艺人|鸣谢|特别感谢|谱务|母带师|贝斯手|吉他手|鼓手|键盘手|和音|O\.P\.|S\.P\.|小提琴|大提琴|中提琴|低音提琴|二胡|古筝|琵琶|竹笛|长笛|口琴|萨克斯|小号|长号|圆号|合成器|Program|配器|弦乐编写|视频|人声设计|录音师|混音助理|配唱制作|和声编写|曲名|歌名|专辑|专辑名|歌姬|歌基|海报|封面设计|视觉|绘图|插画师|制片|出品人|制作方|出品方|发行方|演唱者|念白|独白)[^：:]{0,14}[：:]/;
  var OTHER = /^(出品方|授权|版权|未经著作权人|本作品|OP|SP)\s*[：:]|All rights reserved|Production Company/i;
  var SYMBOL = /^[-—–·.。…~～_\s]+$/;

  /* 开头的「标签：值」形式（曲名：X / 歌姬：Y / 海报：Z …）——
     光靠关键词表永远补不全（每首歌的写法都不一样）。这类行的共同点是
     **出现在最前面、冒号前不超过 8 个字、整行不超过 24 字**，而正常歌词
     极少以「短标签：」开头，所以按位置兜一层。 */
  /* 开头排除括号：【（( 【[ —— 否则「（旁白：…）」这种歌词会被当成署名行删掉 */
  var LABEL_LINE = /^[^\s，。！？,.!?：:（(【\[]{1,8}[：:][^\n]{0,20}$/;

  function isCredit(text, idx) {
    var t = String(text == null ? '' : text).trim();
    if (!t) return true;
    if (SYMBOL.test(t)) return true;
    if (CREDIT.test(t) && t.length < 48) return true;
    if (OTHER.test(t)) return true;
    if (/(授权|OST|同人文|版权方|独家|首发|翻自)/.test(t) && t.length < 40) return true;
    if (typeof idx === 'number' && idx < 10 && t.length <= 24 && LABEL_LINE.test(t)) return true;
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

  /* 二分：返回最后一个 time<=t 的下标（没有就 -1）。rows 按时间升序。 */
  function bisect(rows, t, cap) {
    var n = Math.min(rows.length, cap || rows.length);
    var lo = 0, hi = n - 1, ans = -1;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (Number(rows[mid][0]) <= t) { ans = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    return ans;
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
      if (!isCredit(full[i] && full[i][1], i)) kept.push(full[i]);
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

  /* APlayer 的音量条原生是竖的：它把音量写在 .aplayer-volume 的 inline
     `height: NN%` 上，宽度固定 20px。我们把它改成横条之后，那个百分比必须
     映射成 width 才看得见 —— 之前漏了这一步，所以音量条一直是空的。 */
  function syncVolume(ap) {
    var el = ap.container.querySelector('.aplayer-volume');
    if (!el) return;
    var v = (ap.audio && typeof ap.audio.volume === 'number') ? ap.audio.volume : 1;
    if (!isFinite(v)) v = 1;
    var pct = Math.round(v * 1000) / 10;
    var want = pct + '%';
    if (el.style.width !== want) el.style.width = want;
    // APlayer 每次改音量会重写 height 百分比，这里压回 2px
    if (el.style.height !== '2px') el.style.height = '2px';
  }

  function tick(ap) {
    if (!ap || !ap.audio) return;

    updateCountdown(ap);   // 先做：不依赖歌词
    syncVolume(ap);        // 音量填充：高度百分比 → 宽度（竖条逻辑改成横条）

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

    /* 当前行：二分查找（抄 lyrics-scrolling 的做法，行长几百行也只是 log n） */
    var idx = bisect(rows, t + 0.2, ps.length);
    if (idx !== ap.__miaoIdx) {
      for (var j = 0; j < ps.length; j++) ps[j].classList.remove('aplayer-lrc-current');
      if (idx >= 0 && ps[idx]) ps[idx].classList.add('aplayer-lrc-current');
      ap.__miaoIdx = idx;
    }

    /* 居中 + 首尾夹取（不外溢、不加动画） */
    if (lrcBox) {
      var winH = lrcBox.clientHeight;
      if (winH > 0) {
        /* 参照 lyrics-scrolling：把当前行钉死在窗口的一个锚点上（他们写的是
           index * -30 + 150，150 就是容器半高）。这里不夹取首尾 —— 超出窗口的
           部分交给 overflow: hidden 裁掉，所以第一句和最后一句也照样停在中间。 */
        var cur = (idx >= 0 && ps[idx]) ? idx : 0;
        var rowTop = ps[cur].offsetTop;
        var rowH = ps[cur].offsetHeight || 34;
        var anchor = winH * 0.5;
        var y = anchor - (rowTop + rowH / 2);
        var want = Math.round(y) + 'px';
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

  /* ── 自己接管拖动（进度条 / 音量条）──
     为什么不能用 APlayer 自带的：
       · 音量条：它的公式是竖向的（(底边 - clientY) / 高度），
         我们把它改成了横条，沿着横线拖时 clientY 几乎不变 → 永远算出 100%；
       · 进度条：实测点 80% 位置跳到 26%，它的取值基准和我们的布局对不上。
     capture 阶段拦截 + stopPropagation，APlayer 自己的处理不再跑。 */
  function bindDrag(ap) {
    var fire = function (el, type, x, y) {
      try {
        el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y }));
      } catch (e) {}
    };
    var attach = function (el, onStart) {
      if (!el || el.dataset.miaoDrag === "1") return;
      el.dataset.miaoDrag = "1";
      var start = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var x0 = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        onStart(x0);
        var move = function (ev) {
          var x = ev.clientX != null ? ev.clientX : (ev.touches && ev.touches[0] ? ev.touches[0].clientX : 0);
          onStart(x);
        };
        var up = function () {
          document.removeEventListener("mousemove", move, true);
          document.removeEventListener("mouseup", up, true);
          document.removeEventListener("touchmove", move, true);
          document.removeEventListener("touchend", up, true);
        };
        document.addEventListener("mousemove", move, true);
        document.addEventListener("mouseup", up, true);
        document.addEventListener("touchmove", move, { capture: true, passive: false });
        document.addEventListener("touchend", up, true);
      };
      el.addEventListener("mousedown", start, true);
      el.addEventListener("touchstart", start, { capture: true, passive: false });
    };
    var ratio = function (el, clientX) {
      var r = el.getBoundingClientRect();
      if (!r.width) return 0;
      var p = (clientX - r.left) / r.width;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    };

    /* 进度条 */
    var bar = ap.container.querySelector(".aplayer-bar-wrap");
    attach(bar, function (x) {
      var dur = ap.audio && ap.audio.duration;
      if (!dur || !isFinite(dur)) return;
      var t = dur * ratio(bar, x);
      try { if (typeof ap.seek === "function") ap.seek(t); else ap.audio.currentTime = t; } catch (e) {}
    });

    /* 音量条（横排）*/
    var vol = ap.container.querySelector(".aplayer-volume-bar-wrap");
    attach(vol, function (x) {
      var p = ratio(vol, x);
      try { if (typeof ap.volume === "function") ap.volume(p); else ap.audio.volume = p; } catch (e) {}
    });
  }

  /* 「♪」#consoleMusic 的激活态，必须跟着**真实播放状态**走。两个坑叠在一起：
     1) 主题的 listenNavMusicPause 找到第一个 APlayer 就 clearInterval 了，
        Pjax 换页后新实例没人监听 play/pause；
     2) Pjax 会把整个 #console 换成新节点（实测 consoleSameNode === false），
        .on 类跟着旧 DOM 一起丢掉，而 initConsoleState 只恢复「⇄」那颗
        （按 html.hide-aside）—— ♪ 就一直白着，明明音乐在播。
     所以这里按实例绑事件，并且让 tick 顺手校正（值没变就不碰 DOM，不会引抖动）。 */
  function syncMusicUI(ap) {
    var playing = !!(ap && ap.audio && !ap.audio.paused);
    try { window.anzhiyu_musicPlaying = playing; } catch (e) {}
    var item = document.getElementById("consoleMusic");
    if (item && item.classList.contains("on") !== playing) item.classList.toggle("on", playing);
    var nav = document.getElementById("nav-music");
    if (nav && nav.classList.contains("playing") !== playing) nav.classList.toggle("playing", playing);
  }

  /* ── 音源瞬时失败：先重试，别急着跳下一首 ──────────────────────
     APlayer 自己的处理是「一 error 就弹一条白框，2 秒后 skipForward」。
     但 meting 直链偶发会被服务端 RST 断开（实测同一首隔几秒重试就 200），
     一 error 就跳会白白跳过好歌。
     做法：capture 阶段掐断它那条 DOM 监听（stopImmediatePropagation 有效，
     实测 APlayer 的 notice 不再出现、也没有跳歌），然后自己按退避重试；
     同一首连续失败 MAX 次才真的跳。 */
  var ERR_MAX_TRIES = 2;       /* 同一首最多重试 2 次（共 3 次机会） */
  function guardError(ap) {
    if (!ap || !ap.audio || ap.__miaoErrGuard) return;
    ap.__miaoErrGuard = true;
    var tries = 0;
    var timer = null;

    function reset() {
      tries = 0;
      if (timer) { clearTimeout(timer); timer = null; }
    }

    ap.audio.addEventListener("error", function (e) {
      /* 掐断 APlayer 那条（否则它弹提示 + 2 秒后跳歌，我们就没得选了） */
      try { e.stopImmediatePropagation(); } catch (err) {}

      var list = ap.list;
      var cur = list && list.audios && list.audios[list.index];
      if (!cur) return;

      if (tries < ERR_MAX_TRIES) {
        tries++;
        var wait = 350 + tries * 450;      /* 350 / 800ms 退避 */
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          timer = null;
          try {
            /* 断点：CDN 是在播到一半时断的，那时 audio.currentTime 还是有效值。
               不记这一下，重试成功后歌会从 0 重新来一遍。 */
            var seek = 0;
            try { seek = ap.audio.currentTime || 0; } catch (e2) { seek = 0; }

            /* 关键：重走 meting 接口拿新鲜直链。
               直接复用旧 src 往往还是同一个过期地址，重试等于白试。 */
            ap.audio.src = cur.url;
            ap.audio.load();
            if (seek > 1) {
              var onMeta = function () {
                ap.audio.removeEventListener("loadedmetadata", onMeta);
                try { ap.audio.currentTime = seek; } catch (e3) {}
              };
              ap.audio.addEventListener("loadedmetadata", onMeta);
            }
            var pr = ap.audio.play();
            if (pr && pr.catch) pr.catch(function () {});
          } catch (err) {}
        }, wait);
      } else {
        /* 真的放不出来：交回 APlayer 原本的行为（跳下一首） */
        reset();
        try { ap.skipForward(); if (ap.paused) ap.play(); } catch (err) {}
      }
    }, true);

    /* 播起来了 / 换歌了 → 计数清零，避免「第一首失败过就把后面全跳掉」 */
    ["playing", "canplay"].forEach(function (ev) {
      ap.audio.addEventListener(ev, reset, true);
    });
    if (ap.on) ap.on("listswitch", reset);
  }

  function bindOne(ap) {
    if (!ap || ap.__miaoBound) return;
    ap.__miaoBound = true;
    try { bindDrag(ap); } catch (e) {}
    try { guardError(ap); } catch (e) {}
    /* ⚠️ 完全接管 APlayer 的歌词更新。
       它按「原始行数」算 index 并自己加 .aplayer-lrc-current、自己写 inline
       translateY(40 * -index)；我们把署名行删掉了（47 → 39），它就会整体错位，
       而且它每次 timeupdate 都和我们抢 class —— 这就是「高亮和滚动对不上」的来源。
       这里直接换成空函数，高亮 / 滚动 / 倒计时全由下面的 tick() 负责。 */
    if (ap.lrc && !ap.lrc.__miaoOverridden) {
      ap.lrc.__miaoOverridden = true;
      ap.lrc.update = function () {};
    }

    /* ♪ 跟随真实播放状态（换页后新实例也要有人管） */
    if (ap.on && !ap.__miaoMusicBound) {
      ap.__miaoMusicBound = true;
      ap.on("play", function () { syncMusicUI(ap); });
      ap.on("pause", function () { syncMusicUI(ap); });
    }
    syncMusicUI(ap);

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
    var ok = false;
    var root = document.getElementById('nav-music');
    if (root) {
      var mjs = root.querySelectorAll('meting-js');
      for (var i = 0; i < mjs.length; i++) {
        if (mjs[i].aplayer) { bindOne(mjs[i].aplayer); syncMusicUI(mjs[i].aplayer); ok = true; }
      }
    }
    /* 音乐馆页那个实例只挂「音源重试」，绝不 bindOne ——
       歌词归 utils.js 管，两边都接管会互相打架。 */
    var page = document.getElementById('anMusic-page');
    var holder = document.getElementById('anMusic-page-meting');
    if (page || holder) {
      var pmjs = page ? page.querySelectorAll('meting-js') : [];
      if (!pmjs.length) return false;        /* 还没建出来，继续轮询 */
      var pending = false;
      for (var j = 0; j < pmjs.length; j++) {
        if (pmjs[j].aplayer) { try { guardError(pmjs[j].aplayer); } catch (e) {} }
        else pending = true;
      }
      /* aplayer 还没初始化好就别让轮询收工 ——
         否则这个实例永远挂不上保护（实测就是栽在这里） */
      if (pending) return false;
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
          if (ap && ap.__miaoBound) { try { tick(ap); } catch (e) {} try { syncMusicUI(ap); } catch (e) {} }
        }
      }, 200);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  document.addEventListener('pjax:complete', function () { setTimeout(scan, 200); });
})();
