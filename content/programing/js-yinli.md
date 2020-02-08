---
Title: "JS 获取阴历（无需安装依赖）"
Date: 2020-02-08T13:46:36+08:00
Author: Allan Chain
Categories:
    - JavaScript
Tags: 
    - YinLi
---

*Based on <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl>*

Intl 是个好东西，但是还不是很强大，而且浏览器支持上有 Node 和 Android 的小缺憾。

```JavaScript
const dtf = new Intl.DateTimeFormat('zh-hans-u-ca-chinese')
const gan = '甲乙丙丁戊己庚辛壬癸'
const zhi = '子丑寅卯辰巳午未申酉戌亥';
const yue = '正二三四五六七八九十冬腊';
const ri = ['初', '十', '廿', '三十'];
[year, month, date] = dtf.format(new Date()).split('/');
year--;
year = gan.charAt(year % 10) + zhi.charAt(year % 12);
let dates = '';
if (date % 10)
  dates = new Intl.NumberFormat('zh-hans-u-nu-hanidec').format(date % 10);
dates = ri[Math.floor(date / 10)] + dates;
console.log(`${year}年${yue.charAt(month-1)}月${dates}`);
```

日的表述还不够标准，就先这样了。