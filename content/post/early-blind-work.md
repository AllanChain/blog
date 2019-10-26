---
Title: 服务器早期的盲目工作
Date: 2019-09-23
Author: Allan Chain
TOC: false
Categories:
    - Python
Tags: 
    - Server
Description: >
    Talking about
    Early Blind Work
---

### 打日志、测试与持续集成

我在接了写操作`MySQL`的四个函数的任务后，发现有错误需要记录，就设计了日志部分，也就是初始化`logging`。

在写完数据库部分后，把用作测试的代码放在了`test.py`。我甚至在一波操作获得发起Git仓库的主动权后：

> 要不试一下 GitHub 的 CI/CD 吧！
>
> 发现服务器很多功能都无法在 GitHub 的 CI/CD 上完成 test...就先这样，其实本来用 GitHub 的 CI/CD 就是玩玩的:joy:
>
> WTH? 才发现 GitHub Actions 到 2019.11.13 就要收费了？福利到头。。算了，那就去掉吧
>
> 经过坚苦卓绝的探索，终于搞定了`CircleCI`的集成，完成了数据库自动化测试和代码风格检查。Yeah\~ :grin:

千万不要学我！！你会看到我在另一波操作获得定下`flask`框架的主动权后，发现这一切在`flask`正确打开方式不是这样的:sob:

### 历史的必然

我们真的不知道往哪个方向走，搭建服务器应该都是第一次。不知道用什么框架就开始搞，显然会陷入左倾盲动主义泥潭，必将导致代码实现不够优雅。也只有摸爬滚打过来才知道这番风景。