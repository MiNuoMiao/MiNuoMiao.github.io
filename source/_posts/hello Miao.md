---
title: MIAO MIAO
date: 2023-07-10 21:00:00
updated: 
cover: https://cdn.jsdelivr.net/gh/MiNuoMiao/MaoMi@main/img/bg.webp
categories: 
  - 闲聊
tags: 
  - 闲聊
# title: postName #文章页面上的显示名称，一般是中文
# date: 2013-12-02 15:30:16 #文章生成时间，一般不改，当然也可以任意修改
# categories: 默认分类 #分类
# tags: [tag1,tag2,tag3] #文章标签，可空，多标签请用格式，注意:后面有个空格
# description: 附加一段文章摘要，字数最好在140字以内，会出现在meta的description里面
---
<meting-js server="netease" type="song" id="28828120"></meting-js>

**<p style="font-size: 1.5em; text-align: center;">hi,大家好哇! 欢迎光临本喵的博客!</p>**

正如所见, 2023年7月10日 小破站破壳!

这章是本站的**开篇之作**,虽然没想象中那么惊艳,好歹也是开创了先河...

---

> ## 正文


虽然是7月10号建的文章,但是一直到了30号才开始写,中间花了20天搭建博客,总算是摸索出了大概;

搭建博客也是从一个朋友那里得知,利用**GitHub + hexo**进行搭建及部署,刚开始也是踩不少"坑";

好在有万能的百度! 感谢度娘!!

本站刚开始采用的是[Butterfly主题](https://butterfly.js.org/)~~虽然没用几天~~,之后在b站找主题美化的时候接触到了[anzhiyu主题](https://docs.anheyu.com/),然后便更换成了[anzhiyu主题](https://docs.anheyu.com/);

如果喵友们是第一次搭建博客的话,本喵还是建议先用Butterfly,待熟悉文档后再无缝衔接anzhiyu;

当然,也可以继续使用Butterfly或者自行**魔改**;


> ## 一些建站的坑


当初跟着b站视频学建站的时候,没留意之后对主题魔改的事情,然后当修改了主题源代码后发现主题源码上传不上去...

经过百度,首先要删除主题文件夹的```.git```文件夹,然后再将根目录所有文件上传至自己的GitHub仓库...

然而哪有那么顺利嘛!!! 虽然是成功上传了,但是在控制台```hexo d```之后,云端仓库的文件全部变成了```public```文件夹里的文件,之前上传的主题文件又都没掉了QAQ!!

后来找到了解决方法,重建了一个...

如果你也是**GitHub + hexo**搭建的博客网站,或许可以采纳...

### 首先我们在本地建好文件并与GitHub远程仓库绑定后,再建立一个远程仓库分支,然后在GitHub仓库的页面进入设置(Settings);

![进入设置](https://cdn.jsdelivr.net/gh/MiNuoMiao/MaoMi@main/img/建站1.webp)


### 然后在Pages选项页面,将分支改成新建的那个分支;
![更改页面分支](https://cdn.jsdelivr.net/gh/MiNuoMiao/MaoMi@main/img/建站2.webp)


### 最后回到hexo的配置页```_config.yml```,在```deploy:```下的```branch```这里填写新建的分支,之后便可以随心所欲的```hexo d```啦!
![更改配置](https://cdn.jsdelivr.net/gh/MiNuoMiao/MaoMi@main/img/建站3.webp)


> ## 最后喵喵

本站今后会作为本喵的个人笔记或者分享一些乱七八糟的日常;

鉴于本喵喜欢动画和特效,后续可能会分享一些```css```或```js```做的动画案例,特殊效果啥的;

希望能跟喵友们一起学习共同进步(本喵很菜,请喵友们多多包涵)

**<p style="font-size: 1.5em; text-align: center;">感谢喵友们耐心的看完本篇文章 bye~</p>**


{% folding 封面图片%}
![Miku](https://cdn.jsdelivr.net/gh/MiNuoMiao/MaoMi@main/img/bg.webp)
{% endfolding %}
