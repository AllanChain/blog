---
Title: 我踏马为什么要选 Flask？
Date: 2020-01-03T21:00:00+08:00
Author: Allan Chain
TOC: false
Categories:
    - Flask
    - Python
Tags: 
    - Server
toc: false
---

注意，这里不是说 Flask 有多好，而是。。用 Flask 用到怀疑人生！

不错，我又开始后悔了 :flushed: ：

- `Jinja2`, inspired by `django`
- `WTForm`, looks like `django`
- `Flask-SQLAlchemy`, even more like `django`
- Tons of extensions but many are not in active development.
- Lack of documentations, and existing documentation is not friendly towards newcomers. 
    - Because of the confusing namespace and they don't show the import  statement.

但是`django`怎么样呢？（以前用过的感受）

- 比较死板的项目目录
- 迷惑的`views.py`
- 庞大的体积
- 以及 redirect 后一直没弄懂的数目不定的斜杠
- 据说还有一堆`super().__init__(self)`？

既然选择了 Flask，那就要一直做下去。于是，被逼之下，解锁新技能——**面向 GitHub 编程**！

- GitHub 搜索代码片段
- 转到 Code 搜索结果
- 选择 Python 语言
- 虽然搜索结果并不很准，但第一页总有较好结果的，而且这些代码应该都能跑起来的

### UPDATE
用了一段时间后的感受又不一样了。

正如西方文化选读的老师讲的，基督教认为，上帝给了你自由意志，让你用自由意志去服从上帝。

Flask 和 Django 关系大抵类似。Flask 给了你很自由的编程方式，允许你任意组织项目结构、决定使用什么库。但是呢，Django 的模式还是一样的香，ORM 就是好用，没有像样的 template 引擎就是不行，表单验证就是需要简化，一个功能分一个模块，模块下 route 和 database 分开也很舒服。总之，Django 选择这样的模式还是很有道理的（不然也不会有那么多星对吧）

但是呢？你还是不会选择完全模仿 Django。Flask 有自己的装饰器实现的 route，因为业务需求，也会把所有涉及数据库的函数全部封装放到一个类里。而且 Django 使用的类的黑魔法也有些反人类。使用 Flask 还是有着更多的掌控感。

也许所谓上帝自由意志也是如此，虽然给了你自由意志，但是也像 Flask 一样，总归有新教徒，面向同一件事，各自有着自己的实现方式。

所以，Flask or Django 的实质还是那句话，你是想要一把榔头，从五金市场拿到所需的材料，构建合适的项目，就像自己理解圣经并不断探zhe索teng呢，还是要一个开箱即用的工具箱，拥有 drop-in experience，就像直接接受流行教派的思想搭上救赎的快车呢？

> Maybe, solutions for problems in Flask are open to the whole world, but solutions for problems Django are confined in the Cathollic church world.
>
> However, Django's documentation and community are mature enough.
>
> All in all, Flask or Django is your own choice.

*声明：本文扯上基督教只是因为课上讲到并有感而发，并非黑，而且对基督教思想还停留在比较浅薄的地步，如有错误轻喷*
