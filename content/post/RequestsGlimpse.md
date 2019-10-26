---
Title: Requests初探
Date: 2019-02-13
Author: Allan Chain
Categories: 
    - Python
---

`requests` 模块获取http回复十分方便，一句`requests.get(url)`即可搞定。
下面贴上从`mliucixin.zuopinj.com/`抓取刘慈欣小说全集的代码：

Download [lcx_spider.py](lcx_spider.py)

几点说明：

- 该网站url十分简单，只需一个for循环改改变最后.html前的数字即可抓取全集。
```python
end, start = 202227+1, 201980
num = end-start
for i in range(num):
    r = requests.get('http://mliucixin.zuopinj.com/5561/%d.html' % (start+i))
```
抓到的网页大概是这样的：
```html
<!doctype html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>全频段阻塞干扰 第2章 “万年炎帝”号_手机小说在线阅读_刘慈欣作品集</title>
<meta name="keywords" content="全频段阻塞干扰,第2章 “万年炎帝”号" />
<meta name="description" content="刘慈欣作品集整理全频段阻塞干扰全集无弹窗手机小说在线阅读,当前章节：第2章 “万年炎帝”号" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="translucent">
<link rel="apple-touch-icon" href="http://zuopinj.com/images/logo_64.png">
<link rel="apple-touch-icon-precomposed" href="http://zuopinj.com/images/logo_64.png">
<meta name="apple-mobile-web-app-title" content="作品集">
<meta name="msapplication-tap-highlight" content="no">
<meta name="format-detection" content="telphone=no, email=no">
<meta http-equiv="Cache-Control" content="no-transform" />
<link rel="stylesheet" type="text/css" href="http://zuopinj.com/css/ydread.css"/>
<script src="http://zuopinj.com/js/wap.js"></script>
</head>
<body>
<div id="readerWarp">
<h1 id="title">第2章 “万年炎帝”号</h1>
<div class="ad-mb01"><script>ad_zpjhf_wap();</script></div>
<div id="conWp">
<p>　　1月5日，近日轨道，&ldquo;万年炎帝&rdquo;号<br />
<br />
庄宇感到了一个人独居一座城市的孤独。<br />
<br />
&ldquo;万年炎帝&rdquo;号太空
......
&tp://mliucixin.zuopinj.com/5558/202095.html"  class="section section-next">下一章</span>
<script>ad_zpjhf2_wap();</script>
<div class="chapter" id="chapter">
<span id="chapterPre" data-url="http://mliucixin.zuopinj.com/5558/202093.html" class="chapter-pre">上一章</span>
<a class="chapter-bt" href="http://mliucixin.zuopinj.com/5558/">目录</a>
<span id="chapterNext" data-url="http://mliucixin.zuopinj.com/5558/202095.html"  class="chapter-next">下一章</span>
</div>
<div style="margin-top:1px;"><script>ad_zpjhf3_wap();</script></div>
<div id="tipBg" class="tip-bg"></div>
<script type="text/javascript">
var CONFIG = {catalog: 1,tj: "",pos: '["","load"]',basehis : '{}',error : ""};CONFIG.pos = JSON.parse(CONFIG.pos);
</script>
<script>ad_zpjxf_wap();</script>
<script type="text/javascript" src="http://zuopinj.com/js/zepto.js"></script>
<script type="text/javascript" src="http://zuopinj.com/js/read.js"></script>
<div style="display: none;"><script>waptj();</script></div>
</body>
</html>
```
- 在re.findall时，如果html中含有换行符，将导致匹配不成功。
```python
text = r.text.replace('\r\n', '')
```
- 当然re是必须的
```python
novel, chapter = findall(pattern='<meta name="keywords" content="(.*?)" />', string=text)[0].split(',')
p = findall(pattern='<p>(.*?)</p>', string=text)[0]
```
- 生成html后，使用Calibre转换为AZW3直接用USB发至Kindle中，二级目录才有效。
