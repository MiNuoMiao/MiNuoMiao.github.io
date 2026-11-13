/* 中控台悬浮播放器（#nav-music）结构适配 · Mac 小组件版
 * 2026-11-13 重写（上一版把歌词塞进封面、控制行塌成 0 高、进度条位置乱）
 * 参考：[HTML+CSS+JS] MAC歌词滚动音乐播放器（B站 BV1xN411D7Vg）
 *
 * 只做三件事，其余交给 CSS：
 *  1. 把 .aplayer-lrc 从 .aplayer-info 里搬到 .aplayer-body（封面之后），
 *     让歌词独占一块，而不是压在封面上；
 *  2. 在 .aplayer 顶部插一行 .miao-topbar（音量 + 「词」按钮）；
 *  3. 「词」按钮切换 .miao-lyric-on —— 收起封面，歌词区放大。
 * 进度条 / 时间 / 控制钮都保持 APlayer 原始 DOM，只由 CSS 排位置。
 * 深色模式、折叠小球、音乐馆页内播放器一律不碰。 */
(function () {
  'use strict';

  function setup(ap) {
    if (!ap || ap.dataset.miaoPlayer === '1') return;
    if (document.documentElement.getAttribute('data-theme') === 'dark') return;

    var body = ap.querySelector('.aplayer-body');
    var pic = ap.querySelector('.aplayer-pic');
    var info = ap.querySelector('.aplayer-info');
    var lrc = ap.querySelector('.aplayer-lrc');
    if (!body || !pic || !info) return;

    ap.dataset.miaoPlayer = '1';

    /* 1. 歌词搬出 info，放到封面之后 */
    if (lrc && lrc.parentElement !== body) {
      body.insertBefore(lrc, info);
    }

    /* 2. 顶部行：音量 + 词按钮 */
    var topbar = document.createElement('div');
    topbar.className = 'miao-topbar';

    var vol = ap.querySelector('.aplayer-volume-wrap');
    if (vol) topbar.appendChild(vol);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'miao-lyric-toggle';
    btn.title = '只看歌词';
    btn.setAttribute('aria-label', '切换歌词模式');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 7h10M4 12h16M4 17h7"/></svg>';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var on = ap.classList.toggle('miao-lyric-on');
      btn.classList.toggle('on', on);
      btn.title = on ? '显示封面' : '只看歌词';
    });
    topbar.appendChild(btn);

    ap.insertBefore(topbar, body);

    /* 3. 封面没有歌词时也能点播放 */
    if (pic && !pic.dataset.miaoBound) {
      pic.dataset.miaoBound = '1';
      pic.addEventListener('click', function () {
        var playBtn = ap.querySelector('.aplayer-icon-play');
        if (playBtn) playBtn.click();
      });
    }
  }

  // 返回 true 表示「找到了 aplayer 并且处理过」
  function scan() {
    var root = document.getElementById('nav-music');
    if (!root) return false;
    var aps = root.querySelectorAll('.aplayer');
    for (var i = 0; i < aps.length; i++) setup(aps[i]);
    return aps.length > 0;
  }

  // ⚠️ 线上实测：底部注入的脚本执行时，meting-js 还没把 .aplayer 造出来，
  // 只扫一次会永远错过（本地因为时序不同看着是好的）。
  // 所以这里持续轮询 —— 每次只是两次 querySelectorAll，成本可以忽略）。
  function start() {
    if (scan()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (scan() || tries > 200) clearInterval(timer);   // 200 × 300ms = 60 秒，够了
    }, 300);
    // pjax 换页后再兜一次
    document.addEventListener('pjax:complete', function () { setTimeout(scan, 200); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
