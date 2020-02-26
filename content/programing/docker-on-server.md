---
Title: "为什么说普通服务器部署 Docker 鸡肋"
Date: 2020-02-21T15:13:19+08:00
Author: Allan Chain
Categories:
    - Docker
---

*背景：一台阿里云的低配服务器，多人协作开发*

## 一次部署，到处运行

这个可谓是最大亮点，可以保证开发环境和生产环境的一致性，免去了在不同个人电脑上配置环境的麻烦。但是正如[前面一篇博文](windows-docker.md)所说，Windows 10 上设置安装 docker 比较麻烦，使这一便利打了折扣。

## 阿里羊毛，免费镜像

阿里居然提供了免费的私有 docker 仓库存储服务（ACR），适用于保存后台代码。

## 进程隔离，略有安全

但是容器内的 root 还是会作用到宿主机的。

## 刀客发耀，真的很爽

*`Dockerfile`， 凑四个字的无奈*:cry:

规整有序的环境搭建，每次出来都是干净的！还可以随便更新系统，不用担心 SSH 崩坏！

## 容器重启，并不优雅

如果不用容器，`uwsgi`和`nginx`提供的优雅重启用起来很爽，解决了重启这段时间的问题。但是若要直接重启容器，docker 是不可能管得到`uwsgi`和`nginx`的事情的。

虽然优雅重启不可行，但是优雅关闭还是可行的。但这里有一个坑，特此摘录：

> *From <https://stackoverflow.com/questions/43584760>*
>
> TL;DR
>
> Add `exec` after CMD in your `dockerfile`: `CMD exec gunicorn -b :8000 test:app`

不能，岂不白白浪费了本来提供的优雅功能？

## 搞个集群？还是算了

小小服务器怎么可能还用的 docker 在单机折腾一个“集群”呢？Docker Compose + Nginx + MySQL + Flask？

听说多搞几个实例，再加装一个负载均衡，就可以搞定优雅的问题。但是一台机器上搞两个实例也太愚蠢了吧。。

## 部署周期，就有点长

因为建议的方法都是直接拷贝文件进去而不是在容器里`git pull`那么简单，所以要 build，要传，要装，工序比较繁杂。虽然有 CI 可用，但看起来并不适合，而且传输到阿里云肯定费时。

## 退求其次，有点怪怪

通过挂载数据卷的形式挂上代码，只留一些环境配置之类交给 docker？再加上暴露 80、443，挂上数据库？