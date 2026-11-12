var posts=["2026/11/11/listen-page-story/","2026/11/07/shorter-sentences/","2026/11/07/music-ball-versions/","2023/07/10/hello Miao/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };