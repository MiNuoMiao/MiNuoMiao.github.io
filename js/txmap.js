//get请求
fetch('https://api.qjqq.cn/api/Local')
  .then(response => response.json())
  .then(data => {
    ipLocation = data
    showWelcome()
  })
  .catch(error => console.error('Error:', error))


function getDistance (e1, n1, e2, n2) {
  const R = 6371
  const { sin, cos, asin, PI, hypot } = Math
  let getPoint = (e, n) => {
    e *= PI / 180
    n *= PI / 180
    return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
  }

  let a = getPoint(e1, n1)
  let b = getPoint(e2, n2)
  let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
  let r = asin(c / 2) * 2 * R
  return Math.round(r)
}

function showWelcome () {

  let dist = getDistance(114.305392, 30.593099, ipLocation.data.lng, ipLocation.data.lat) //博主在武汉
  let pos = ipLocation.data.country
  let ip = ipLocation.ip
  let posdesc

  // 以下的代码需要根据新API返回的结果进行相应的调整
  switch (ipLocation.data.country) {
    case "日本":
      posdesc = "よろしく，一起去看樱花吗"
      break
    case "美国":
      posdesc = "Let us live in peace!"
      break
    case "英国":
      posdesc = "想同你一起夜乘伦敦眼"
      break
    case "俄罗斯":
      posdesc = "干了这瓶伏特加！"
      break
    case "法国":
      posdesc = "C'est La Vie"
      break
    case "德国":
      posdesc = "Die Zeit verging im Fluge."
      break
    case "澳大利亚":
      posdesc = "一起去大堡礁吧！"
      break
    case "加拿大":
      posdesc = "拾起一片枫叶赠予你"
      break
    case "中国":
      pos = ipLocation.data.prov + " " + ipLocation.data.city + " " + ipLocation.data.district
      switch (ipLocation.data.prov) {
        case "北京市":
          posdesc = "北——京——欢迎你~~~"
          break
        case "天津市":
          posdesc = "讲段相声吧"
          break
        case "河北省":
          posdesc = "山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山"
          break
        case "山西省":
          posdesc = "展开坐具长三尺，已占山河五百余"
          break
        case "内蒙古自治区":
          posdesc = "天苍苍，野茫茫，风吹草低见牛羊"
          break
        case "辽宁省":
          posdesc = "我想吃烤鸡架！"
          break
        case "吉林省":
          posdesc = "状元阁就是东北烧烤之王"
          break
        case "黑龙江省":
          posdesc = "很喜欢哈尔滨大剧院"
          break
        case "上海市":
          posdesc = "众所周知，中国只有两个城市"
          break
        case "江苏省":
          switch (ipLocation.data.city) {
            case "南京市":
              posdesc = "这是我挺想去的城市啦"
              break
            case "苏州市":
              posdesc = "上有天堂，下有苏杭"
              break
            default:
              posdesc = "散装是必须要散装的"
              break
          }
          break
        case "浙江省":
          posdesc = "东风渐绿西湖柳，雁已还人未南归"
          break
        case "河南省":
          switch (ipLocation.data.city) {
            case "郑州市":
              posdesc = "豫州之域，天地之中"
              break
            case "南阳市":
              posdesc = "臣本布衣，躬耕于南阳此南阳非彼南阳！"
              break
            case "驻马店市":
              posdesc = "峰峰有奇石，石石挟仙气嵖岈山的花很美哦！"
              break
            case "开封市":
              posdesc = "刚正不阿包青天"
              break
            case "洛阳市":
              posdesc = "洛阳牡丹甲天下"
              break
            default:
              posdesc = "可否带我品尝河南烩面啦？"
              break
          }
          break
        case "安徽省":
          posdesc = "蚌埠住了，芜湖起飞"
          break
        case "福建省":
          posdesc = "井邑白云间，岩城远带山"
          break
        case "江西省":
          posdesc = "落霞与孤鹜齐飞，秋水共长天一色"
          break
        case "山东省":
          posdesc = "遥望齐州九点烟，一泓海水杯中泻"
          break
        case "湖北省":
          switch (ipLocation.data.city) {
            case "黄冈市":
              posdesc = "红安将军县！辈出将才！"
              break
            default:
              posdesc = "来碗热干面~"
              break
          }
          break
        case "湖南省":
          posdesc = "74751，长沙斯塔克"
          break
        case "广东省":
          switch (ipLocation.data.city) {
            case "广州市":
              posdesc = "看小蛮腰，喝早茶了嘛~"
              break
            case "深圳市":
              posdesc = "今天你逛商场了嘛~"
              break
            case "阳江市":
              posdesc = "阳春合水！博主家乡~ 欢迎来玩~"
              break
            default:
              posdesc = "来两斤福建人~"
              break
          }
          break
        case "广西壮族自治区":
          posdesc = "桂林山水甲天下"
          break
        case "海南省":
          posdesc = "朝观日出逐白浪，夕看云起收霞光"
          break
        case "四川省":
          posdesc = "康康川妹子"
          break
        case "贵州省":
          posdesc = "茅台，学生，再塞200"
          break
        case "云南省":
          posdesc = "玉龙飞舞云缠绕，万仞冰川直耸天"
          break
        case "西藏自治区":
          posdesc = "躺在茫茫草原上，仰望蓝天"
          break
        case "陕西省":
          posdesc = "来份臊子面加馍"
          break
        case "甘肃省":
          posdesc = "羌笛何须怨杨柳，春风不度玉门关"
          break
        case "青海省":
          posdesc = "牛肉干和老酸奶都好好吃"
          break
        case "宁夏回族自治区":
          posdesc = "大漠孤烟直，长河落日圆"
          break
        case "新疆维吾尔自治区":
          posdesc = "驼铃古道丝绸路，胡马犹闻唐汉风"
          break
        case "台湾省":
          posdesc = "我在这头，大陆在那头"
          break
        case "香港特别行政区":
          posdesc = "永定贼有残留地鬼嚎，迎击光非岁玉"
          break
        case "澳门特别行政区":
          posdesc = "性感荷官，在线发牌"
          break
        default:
          posdesc = "带我去你的城市逛逛吧！"
          break
      }
      break
    default:
      posdesc = "带我去你的国家逛逛吧"
      break
  }

  //根据本地时间切换欢迎语
  let timeChange
  let date = new Date()
  if (date.getHours() >= 5 && date.getHours() < 11) timeChange = "<span>🌤️ 早上好，一日之计在于晨</span>"
  else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = "<span>☀️ 中午好，记得午休喔~</span>"
  else if (date.getHours() >= 13 && date.getHours() < 17) timeChange = "<span>🕞 下午好，饮茶先啦！</span>"
  else if (date.getHours() >= 17 && date.getHours() < 19) timeChange = "<span>🚶‍♂️ 即将下班，记得按时吃饭~</span>"
  else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>🌙 晚上好，夜生活嗨起来！</span>"
  else timeChange = "夜深了，早点休息，少熬夜"

  try {
    //自定义文本和需要放的位置
    document.getElementById("welcome-info").innerHTML =
      `<span>热烈欢迎来自~</span><br><span><span style="color: var(--icat-card-welcome);font-weight: bold;">${pos}</span> 的喵友</span><br><span class="welcome-message">${posdesc}</span><br>您当前位置距博主约 <b><span style="color: var(--icat-card-welcome);font-weight: bold;">${dist}</span></b> 公里！<br><span>您的IP地址为：${ip}</span><br>${timeChange}`
  } catch (err) {
    console.log("Pjax无法获取元素")
  }
}
window.onload = showWelcome
document.addEventListener("pjax:complete", showWelcome)// 发起获取IP地址的GET请求
// 2026-11 换了数据源：原来的 https://api.qjqq.cn/api/Local 已经挂掉（Cloudflare 530 / 证书失败），
// 现在用 ipwho.is（https、免 key、允许跨域），然后把英文国家和省份翻回中文，
// 这样下面那套「北京市 → 北——京——欢迎你」的文案还能继续命中。
var CN_COUNTRY = { china: '中国', cn: '中国', japan: '日本', jp: '日本', unitedstates: '美国', usa: '美国', us: '美国', unitedkingdom: '英国', uk: '英国', gb: '英国', britain: '英国', russia: '俄罗斯', ru: '俄罗斯', france: '法国', fr: '法国', germany: '德国', de: '德国', australia: '澳大利亚', au: '澳大利亚', canada: '加拿大', ca: '加拿大', singapore: '新加坡', sg: '新加坡', southkorea: '韩国', kr: '韩国', korea: '韩国', india: '印度', in: '印度', brazil: '巴西', br: '巴西', italy: '意大利', it: '意大利', spain: '西班牙', es: '西班牙', netherlands: '荷兰', nl: '荷兰', sweden: '瑞典', se: '瑞典', norway: '挪威', no: '挪威', finland: '芬兰', fi: '芬兰', poland: '波兰', pl: '波兰', turkey: '土耳其', tr: '土耳其', thailand: '泰国', th: '泰国', vietnam: '越南', vn: '越南', malaysia: '马来西亚', my: '马来西亚', indonesia: '印度尼西亚', id: '印度尼西亚', philippines: '菲律宾', ph: '菲律宾', newzealand: '新西兰', nz: '新西兰', mexico: '墨西哥', mx: '墨西哥', argentina: '阿根廷', ar: '阿根廷', egypt: '埃及', eg: '埃及', southafrica: '南非', za: '南非', taiwan: '中国台湾', tw: '中国台湾', hongkong: '中国香港', hk: '中国香港', macau: '中国澳门', mo: '中国澳门' }
var CN_PROV = { beijing: '北京市', tianjin: '天津市', hebei: '河北省', shanxi: '山西省', shaanxi: '陕西省', neimenggu: '内蒙古自治区', neimongol: '内蒙古自治区', liaoning: '辽宁省', jilin: '吉林省', heilongjiang: '黑龙江省', shanghai: '上海市', jiangsu: '江苏省', zhejiang: '浙江省', anhui: '安徽省', fujian: '福建省', jiangxi: '江西省', shandong: '山东省', henan: '河南省', hubei: '湖北省', hunan: '湖南省', guangdong: '广东省', guangxi: '广西壮族自治区', hainan: '海南省', chongqing: '重庆市', sichuan: '四川省', guizhou: '贵州省', yunnan: '云南省', xizang: '西藏自治区', tibet: '西藏自治区', gansu: '甘肃省', qinghai: '青海省', ningxia: '宁夏回族自治区', xinjiang: '新疆维吾尔自治区', taiwan: '台湾省', hongkong: '香港特别行政区', macau: '澳门特别行政区' }
var CN_CITY = { wuhan: '武汉市', huanggang: '黄冈市', nanjing: '南京市', suzhou: '苏州市', zhengzhou: '郑州市', nanyang: '南阳市', zhumadian: '驻马店市', kaifeng: '开封市', luoyang: '洛阳市', guangzhou: '广州市', shenzhen: '深圳市', yangjiang: '阳江市', beijing: '北京市', tianjin: '天津市', shanghai: '上海市', chongqing: '重庆市', chengdu: '成都市', hangzhou: '杭州市', changsha: '长沙市', xian: '西安市', nanchang: '南昌市', hefei: '合肥市', fuzhou: '福州市', xiamen: '厦门市', jinan: '济南市', qingdao: '青岛市', shenyang: '沈阳市', harbin: '哈尔滨市', kunming: '昆明市', guiyang: '贵阳市', nanning: '南宁市', haikou: '海口市', lanzhou: '兰州市', xining: '西宁市', yinchuan: '银川市', urumqi: '乌鲁木齐市', huhehaote: '呼和浩特市' }

function ipNorm (s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z]/g, '') }
function ipProvKey (s) {
  return ipNorm(String(s == null ? '' : s).replace(/\b(sheng|shi|zizhiqu|province|municipality|autonomous|region|uygur|zhuangzu|huizu|zhuang|hui)\b/gi, ''))
}
function ipTr (map, value, keyer) {
  if (!value) return ''
  var k = (keyer || ipNorm)(value)
  return map[k] || value
}

// IPv6 太长，显示成「240e:36f:15d1:6ce0:…（IPv6）」，不然看着像乱码
function ipShow (ip) {
  if (!ip) return ''
  if (String(ip).indexOf(':') === -1) return ip
  return String(ip).split(':').slice(0, 4).join(':') + ':…（IPv6）'
}

function applyLocation (o) {
  ipLocation = {
    ip: ipShow(o.ip),
    data: {
      country: ipTr(CN_COUNTRY, o.country),
      prov: ipTr(CN_PROV, o.region, ipProvKey),
      city: ipTr(CN_CITY, o.city),
      district: '',
      lat: o.lat,
      lng: o.lng
    }
  }
  showWelcome()
}

// 优先 ipinfo（能拿到 IPv4，地址更清楚），不行再换 ipwho.is
fetch('https://ipinfo.io/json')
  .then(function (r) { return r.json() })
  .then(function (d) {
    if (!d || !d.ip) throw new Error('ipinfo failed')
    var loc = String(d.loc || ',').split(',')
    applyLocation({ ip: d.ip, country: d.country, region: d.region, city: d.city, lat: parseFloat(loc[0]), lng: parseFloat(loc[1]) })
  })
  .catch(function () {
    return fetch('https://ipwho.is/')
      .then(function (r) { return r.json() })
      .then(function (d) {
        if (!d || d.success === false) throw new Error((d && d.message) || 'ipwho.is failed')
        applyLocation({ ip: d.ip, country: d.country, region: d.region, city: d.city, lat: d.latitude, lng: d.longitude })
      })
  })
  .catch(function (error) { console.error('IP 定位都失败了:', error) })

// 计算两个经纬度之间的距离
function getDistance (e1, n1, e2, n2) {
  const R = 6371
  const { sin, cos, asin, PI, hypot } = Math
  let getPoint = (e, n) => {
    e *= PI / 180
    n *= PI / 180
    return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
  }

  let a = getPoint(e1, n1)
  let b = getPoint(e2, n2)
  let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
  let r = asin(c / 2) * 2 * R
  return Math.round(r)
}

// 根据获取的IP地址显示欢迎信息
function showWelcome () {
  let dist = getDistance(114.305392, 30.593099, ipLocation.data.lng, ipLocation.data.lat) //博主在武汉
  let pos = ipLocation.data.country
  let ip = ipLocation.ip
  let posdesc

  // 根据IP地址的国家进行相应的欢迎文本设置
  switch (ipLocation.data.country) {
    case "日本":
      posdesc = "よろしく，一起去看樱花吗"
      break
    case "美国":
      posdesc = "Let us live in peace!"
      break
    case "英国":
      posdesc = "想同你一起夜乘伦敦眼"
      break
    case "俄罗斯":
      posdesc = "干了这瓶伏特加！"
      break
    case "法国":
      posdesc = "C'est La Vie"
      break
    case "德国":
      posdesc = "Die Zeit verging im Fluge."
      break
    case "澳大利亚":
      posdesc = "一起去大堡礁吧！"
      break
    case "加拿大":
      posdesc = "拾起一片枫叶赠予你"
      break
    case "中国":
      pos = ipLocation.data.prov + " " + ipLocation.data.city + " " + ipLocation.data.district
      switch (ipLocation.data.prov) {
        case "北京市":
          posdesc = "北——京——欢迎你~~~"
          break
        case "天津市":
          posdesc = "讲段相声吧"
          break
        case "河北省":
          posdesc = "山势巍巍成壁垒，天下雄关铁马金戈由此向，无限江山"
          break
        case "山西省":
          posdesc = "展开坐具长三尺，已占山河五百余"
          break
        case "内蒙古自治区":
          posdesc = "天苍苍，野茫茫，风吹草低见牛羊"
          break
        case "辽宁省":
          posdesc = "我想吃烤鸡架！"
          break
        case "吉林省":
          posdesc = "状元阁就是东北烧烤之王"
          break
        case "黑龙江省":
          posdesc = "很喜欢哈尔滨大剧院"
          break
        case "上海市":
          posdesc = "众所周知，中国只有两个城市"
          break
        case "江苏省":
          switch (ipLocation.data.city) {
            case "南京市":
              posdesc = "这是我挺想去的城市啦"
              break
            case "苏州市":
              posdesc = "上有天堂，下有苏杭"
              break
            default:
              posdesc = "散装是必须要散装的"
              break
          }
          break
        case "浙江省":
          posdesc = "东风渐绿西湖柳，雁已还人未南归"
          break
        case "河南省":
          switch (ipLocation.data.city) {
            case "郑州市":
              posdesc = "豫州之域，天地之中"
              break
            case "南阳市":
              posdesc = "臣本布衣，躬耕于南阳此南阳非彼南阳！"
              break
            case "驻马店市":
              posdesc = "峰峰有奇石，石石挟仙气嵖岈山的花很美哦！"
              break
            case "开封市":
              posdesc = "刚正不阿包青天"
              break
            case "洛阳市":
              posdesc = "洛阳牡丹甲天下"
              break
            default:
              posdesc = "可否带我品尝河南烩面啦？"
              break
          }
          break
        case "安徽省":
          posdesc = "蚌埠住了，芜湖起飞"
          break
        case "福建省":
          posdesc = "井邑白云间，岩城远带山"
          break
        case "江西省":
          posdesc = "落霞与孤鹜齐飞，秋水共长天一色"
          break
        case "山东省":
          posdesc = "遥望齐州九点烟，一泓海水杯中泻"
          break
        case "湖北省":
          switch (ipLocation.data.city) {
            case "黄冈市":
              posdesc = "红安将军县！辈出将才！"
              break
            default:
              posdesc = "来碗热干面~"
              break
          }
          break
        case "湖南省":
          posdesc = "74751，长沙斯塔克"
          break
        case "广东省":
          switch (ipLocation.data.city) {
            case "广州市":
              posdesc = "看小蛮腰，喝早茶了嘛~"
              break
            case "深圳市":
              posdesc = "今天你逛商场了嘛~"
              break
            case "阳江市":
              posdesc = "阳春合水！博主家乡~ 欢迎来玩~"
              break
            default:
              posdesc = "来两斤福建人~"
              break
          }
          break
        case "广西壮族自治区":
          posdesc = "桂林山水甲天下"
          break
        case "海南省":
          posdesc = "朝观日出逐白浪，夕看云起收霞光"
          break
        case "四川省":
          posdesc = "康康川妹子"
          break
        case "贵州省":
          posdesc = "茅台，学生，再塞200"
          break
        case "云南省":
          posdesc = "玉龙飞舞云缠绕，万仞冰川直耸天"
          break
        case "西藏自治区":
          posdesc = "躺在茫茫草原上，仰望蓝天"
          break
        case "陕西省":
          posdesc = "来份臊子面加馍"
          break
        case "甘肃省":
          posdesc = "羌笛何须怨杨柳，春风不度玉门关"
          break
        case "青海省":
          posdesc = "牛肉干和老酸奶都好好吃"
          break
        case "宁夏回族自治区":
          posdesc = "大漠孤烟直，长河落日圆"
          break
        case "新疆维吾尔自治区":
          posdesc = "驼铃古道丝绸路，胡马犹闻唐汉风"
          break
        case "台湾省":
          posdesc = "我在这头，大陆在那头"
          break
        case "香港特别行政区":
          posdesc = "永定贼有残留地鬼嚎，迎击光非岁玉"
          break
        case "澳门特别行政区":
          posdesc = "性感荷官，在线发牌"
          break
        default:
          posdesc = "带我去你的城市逛逛吧！"
          break
      }
      break
    default:
      posdesc = "带我去你的国家逛逛吧"
      break
  }

  // 根据本地时间切换欢迎语
  let timeChange
  let date = new Date()
  if (date.getHours() >= 5 && date.getHours() < 11) timeChange = "<span>🌤️ 早上好，一日之计在于晨</span>"
  else if (date.getHours() >= 11 && date.getHours() < 13) timeChange = "<span>☀️ 中午好，记得午休喔~</span>"
  else if (date.getHours() >= 13 && date.getHours() < 17) timeChange = "<span>🕞 下午好，饮茶先啦！</span>"
  else if (date.getHours() >= 17 && date.getHours() < 19) timeChange = "<span>🚶‍♂️ 即将下班，记得按时吃饭~</span>"
  else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>🌙 晚上好，夜生活嗨起来！</span>"
  else timeChange = "夜深了，早点休息，少熬夜"

  try {
    //自定义文本和需要放的位置
    document.getElementById("welcome-info").innerHTML =
      `<span>热烈欢迎来自~</span><br><span><span style="color: var(--icat-card-welcome);font-weight: bold;">${pos}</span> 的喵友</span><br><span class="welcome-message">${posdesc}</span><br>您当前位置距博主约 <b><span style="color: var(--icat-card-welcome);font-weight: bold;">${dist}</span></b> 公里！<br><span>您的IP地址为：${ip}</span><br>${timeChange}`
  } catch (err) {
    console.log("Pjax无法获取元素")
  }
}

// Pjax完成页面切换的事件回调处理
function handlePjaxComplete () {
  showWelcome()
}

window.onload = function () {
  showWelcome()

  // 添加pjax:complete事件监听
  document.addEventListener("pjax:complete", handlePjaxComplete)
}
