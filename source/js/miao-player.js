/* 中控台悬浮播放器（#nav-music）· 只动最小的两处
 * 2026-11-13 v3
 *
 * 走过的弯路（都记着，别再犯）：
 *   ① 把 .aplayer-lrc 从 .aplayer-info 搬出去 → 跟主题的绝对定位打架，整张卡崩掉
 *   ② 底部注入的脚本执行时 meting-js 还没把 .aplayer 造出来，只扫一次永远错过
 *
 * 所以这一版：DOM 父子关系一个都不动，只做两件事 ——
 *   1. 把「词」按钮（APlayer 原生三条杠）克隆一份换掉监听，点它切 #nav-music 的
 *      .miao-lyric-on，布局两态全由 CSS 负责；
 *   2. 音量条的填充块原生是「竖条 + inline height」，横排后要变 width，
 *      用一个 MutationObserver 跟着 inline 值同步。
 */
(function () {
  'use strict';

  /* 「词」按钮的图形：APlayer 原生 .aplayer-icon-lrc 里那颗其实是唱片
     （path 是 M26.667 5.333h-21.333... 一个圆角方框），放在 16px 里像个音箱。
     这里直接换成三条杠；CSS 按 stroke 上色。 */
  var LRC_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M4 6.5h16M4 12h16M4 17.5h16"/></svg>';

  /* 时间改成倒计时：APlayer 写的是「00:08 / 04:14」，这里只留「-04:06」。
     它每次 timeupdate 都会重写，所以用 MutationObserver 反向修正
     （跟音量那条同一个套路）。 */
  function bindCountdown(ap) {
    var box = ap.querySelector('.aplayer-time-inner');
    if (!box || box.dataset.miaoCd === '1') return;
    box.dataset.miaoCd = '1';

    var fix = function () {
      var t = (box.textContent || '').replace(/\s+/g, ' ').trim();
      var m = t.match(/(\d{1,3}):(\d{2})\s*\/\s*(\d{1,3}):(\d{2})/);
      if (!m) return;
      var cur = (+m[1]) * 60 + (+m[2]);
      var dur = (+m[3]) * 60 + (+m[4]);
      if (!dur) return;
      var left = Math.max(0, dur - cur);
      var mm = Math.floor(left / 60), ss = left % 60;
      var txt = '-' + (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss);
      if (box.textContent !== txt) box.textContent = txt;
    };
    fix();
    try {
      new MutationObserver(function () { setTimeout(fix, 0); })
        .observe(box, { childList: true, characterData: true, subtree: true });
    } catch (e) {}
  }

  /* 音量填充：inline height 是百分比（音量），横排要的是 width */
  function bindVolume(ap) {
    var fill = ap.querySelector('.aplayer-volume');
    if (!fill || fill.dataset.miaoVol === '1') return;
    fill.dataset.miaoVol = '1';

    var sync = function () {
      var h = parseFloat(fill.style.height);
      if (isNaN(h)) return;
      var w = h + '%';
      if (fill.style.width !== w) fill.style.width = w;
    };
    sync();
    try {
      new MutationObserver(sync).observe(fill, { attributes: true, attributeFilter: ['style'] });
    } catch (e) {}
  }

  /* 歌手行开头那个「- 」是 APlayer 模板自带的前缀，去掉（切歌会重设，所以跟着监听） */
  function bindAuthor(ap) {
    var a = ap.querySelector('.aplayer-author');
    if (!a || a.dataset.miaoAuthor === '1') return;
    a.dataset.miaoAuthor = '1';
    var clean = function () {
      var t = a.textContent || '';
      var f = t.replace(/^\s*[-\u2013\u2014]\s*/, '');
      if (f !== t) a.textContent = f;
    };
    clean();
    try { new MutationObserver(clean).observe(a, { childList: true, characterData: true, subtree: true }); } catch (e) {}
  }

  /* 歌名放不下就缩字号（16 → 12），别硬截断 —— 音乐馆页那套同样做法。
     缩到 12px 还放不下才交给 CSS 的省略号兜底。 */
  function fitTitle(ap) {
    var t = ap.querySelector('.aplayer-title');
    if (!t || t.dataset.miaoFit === '1') return;
    t.dataset.miaoFit = '1';
    var apply = function () {
      var box = t.parentElement;
      if (!box) return;
      var avail = box.clientWidth;
      if (!avail) return;
      t.style.setProperty('--miao-tt', '18px');
      var size = 18;
      while (size > 12 && t.scrollWidth > avail) {
        size -= 1;
        t.style.setProperty('--miao-tt', size + 'px');
      }
    };
    apply();
    try { new MutationObserver(apply).observe(t, { childList: true, characterData: true, subtree: true }); } catch (e) {}
    window.addEventListener('resize', apply);
  }

  /* 歌词开头那几行「作词 / 作曲 / 编曲 / 出品方」不是歌词，看着很脏。
     音乐馆页那边是从数据层删掉的，但那边自己接管了滚动；这里不能删行 ——
     APlayer 的滚动是写死的 translateY(40 * -index)，行数一变就整体错位。
     所以只把文字清空、行高留着：行数不变、斜率不变、index 不变，只是那几行变空白。 */
  var CREDIT_RE = /(作词|作曲|词曲|编曲|混音|母带|制作人|监制|录音|和声|演唱|出品|发行|统筹|企划|原曲|翻唱|策划|作编曲|中文词|中文曲|原文词|英文词|翻译|译词|填词|词作|曲作|后期|混缩|混音师|配唱|伴唱|合声|总监|宣发|推广|艺人|鸣谢|特别感谢)[^：:]{0,12}[：:]/;
  var OTHER_RE = /^(出品方|授权|版权|未经著作权人|本作品|OP|SP)\s*[：:]/;

  function isCreditLine(t) {
    t = (t || '').trim();
    if (!t) return false;              // 空行是已经清过的，别再动
    return (CREDIT_RE.test(t) && t.length < 48) || OTHER_RE.test(t);
  }

  function blankCredits(ap) {
    var box = ap.querySelector('.aplayer-lrc-contents');
    if (!box) return;
    var ps = box.querySelectorAll('p');
    var n = Math.min(ps.length, 16);   // 只处理开头十六行（署名段很少超过这个长度）
    for (var i = 0; i < n; i++) {
      if (isCreditLine(ps[i].textContent)) ps[i].textContent = '';
    }
  }

  function bind(ap) {
    var btn = ap.querySelector('.aplayer-icon-lrc');
    if (!btn || btn.dataset.miaoToggle === '1') return true;

    // 克隆一份：彻底断开 APlayer 绑在它身上的「隐藏歌词」行为
    var clone = btn.cloneNode(true);
    clone.innerHTML = LRC_SVG;   /* 原生那颗是唱片，换成三条杠 */
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
    });
    btn.parentNode.replaceChild(clone, btn);

    bindVolume(ap);
    bindAuthor(ap);
    fitTitle(ap);
    bindCountdown(ap);
    // 切歌会重建歌词 DOM，所以低频轮询着清（幂等：已清过的是空串，直接跳过）
    if (!window.__miaoLrcTimer) {
      window.__miaoLrcTimer = setInterval(function () {
        try { blankCredits(ap); } catch (e) {}
      }, 800);
    }
    try { blankCredits(ap); } catch (e) {}
    return true;
  }

  function scan() {
    var root = document.getElementById('nav-music');
    if (!root) return false;
    var aps = root.querySelectorAll('.aplayer');
    if (!aps.length) return false;
    for (var i = 0; i < aps.length; i++) bind(aps[i]);
    return true;
  }

  function start() {
    if (scan()) return;
    var tries = 0;
    var timer = setInterval(function () {
      if (scan() || ++tries > 200) clearInterval(timer);   // 200 × 300ms = 60 秒
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  document.addEventListener('pjax:complete', function () { setTimeout(scan, 200); });
})();
