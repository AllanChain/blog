---
Title: "服务器上的 Logging"
Date: 2019-10-27T19:10:02+08:00
Author: Allan Chain
Categories:
    - Python
    - Flask
Tags: 
    - Server
Description: |
    Flask, uWSGI, Nginx 日志的分分合合
    如何设置一个优雅的日志？
    折腾日志记录的部分辛酸历程
---

## Logging 模块也没有传说的那么烂

Flask 也是默认 Logging 模块的，因为一开始使用 Flask 的自带的测试服务器时，其 access log 也服从 Logging 模块的配置方案，就没有换其他的模块。而且你看，支持`StreamHandler`, `SMTPHandler`, `TimedRotatingFileHandler`。还可以`dictConfig`，意味着不需要冗长代码，一个配置文件即可搞定，还可以和其他配置共用一个文件，使凌乱的配置整洁。

## 进入生产环境之后

这样就多出来了`uWSGI`和`Nginx`两个新面孔。然而他们就不听 Python 的 Logging 使唤了。。三个方向，三种日志如何操作？经过考察，发现可以通过自定义 Formmatter 来使 Flask 的日志里包含IP、URL、以及用户信息。但是……

## 如何在配置文件里设置自定义 Formatter？

[Flask 官方](https://flask.palletsprojects.com/en/1.1.x/logging/#injecting-request-information)和其他的一些博客很多都是用 Python 配置的，自定义的函数也必定要用到 Python 实现。怎么办，难道就要用一大段 Python 来代替如此整洁的配置文件？No！

作为成熟的 Logging 库，必定有 Pythonic Ways To Acheive That. 于是我就开始如下配置：

```yaml
formatters:
    default:
        '()': pkuphy.settings.RequestFormatter
        format: |-
          [%(asctime)s] %(request)s
              %(levelname)s in %(module)s: (%(student)s) %(message)s
```

顺便一提，YAML 中用`|-`表示原样保留，并且不在结尾添加换行符。

看起来很顺利，但是为什么……

## 找不到RequestFormatter！

没毛病啊！没有打错啊！怎么可能？

看一下项目结构：

```
pkuphy/
  +- __init__.py
      from . import settings
  +- settings.py
      dictConfig(yaml)
  +- settings.yaml
      formatters: pkuphy.settings.RequestFormatter
```

也就是说，在模块`__init__`过程中导入`settings.py`尚未结束的时候，`Logging`打算从模块里拿到`settings.RequestFormatter`这就显然不可能做到了

**SOLVE:** 把 RequestFormatter 写进另外一个里面呗，就叫`utils.py`好了。

## 优雅的日志格式

这个可能需要一点审美挑战。还要考虑有点时候日志里并没有用户、URL 数据，就返回 None？那就会变成`(None by None) (Student None with id None)`，毫无美感可言。那就不要用`%(remote)s at %(url)s`了嘛，反正是自定义的格式，直接用`%(request)s`，没有的时候一整串就是空好了。

## 又是踩坑时

众所周知，使用 Logging 的方法为：

```python
from logging import getLogger

logger = getLogger(__name__)
logger.info('hello')
```

当我把`SMTPHandler`以及 YAML 的配置文件折腾好时，突然发现有的日志不会输出？是我哪里配置少抄了？没有啊？观察发现，只有`_internal`和未捕捉的错误的输出，而且格式没有问题。是 `StreamHandelr`砸了？不对`SMTPHandler`也只有未捕捉的错误而没有 Error 级别的日志。。

好的，是写了`getLogger()`。奇怪了，为什么之前没有问题？`git log`了一下确实一开始就打错了，而且我确认搭好 uWSGI 的时候也是没有问题的。世界未解之谜。。期待有人能解答。。