var posts=["2023/07/10/hello Miao/","2026/11/07/shorter-sentences/","2026/11/07/music-ball-versions/","2026/11/11/listen-page-story/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };