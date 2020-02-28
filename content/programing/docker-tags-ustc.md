---
Title: "List Docker Tags USTC"
Date: 2020-02-28T21:38:39+08:00
Author: Allan Chain
Categories:
    - Docker
---

众所周知，如果网络条件好的话，可以使用官方的 API 获取镜像标签列表。

如 v2 接口：

```bash
#!/bin/bash
i=0

while [ $? == 0 ]
do
   i=$((i+1))
   curl https://registry.hub.docker.com/v2/repositories/library/nginx/tags/?page=$i | jq '."results"[]["name"]'

done
```

但是天朝。。

网易和阿里的 API 都要求有 API Key 签名认证之类，比较繁琐，故使用 USTC 的镜像，缺点是标签不全。。

废话不说，根据一波猜测，得到了 USTC 标签的 API：

    https://docker.mirrors.ustc.edu.cn/v2/library/nginx/tags/list

于是根据<https://stackoverflow.com/a/39454426/8810271>代码改编：

```bash
#!/bin/bash

if [ $# -lt 1 ]
then
cat << HELP

dockertags  --  list all tags for a Docker image on a remote registry.

EXAMPLE:
    - list all tags for ubuntu:
       dockertags ubuntu

    - list all php tags containing apache:
       dockertags php apache

HELP
exit
fi

image="$1"
tags=`curl https://docker.mirrors.ustc.edu.cn/v2/library/${image}/tags/list | sed -e 's/.*\[//g' -e 's/"//g' -e 's/\]\}$//g' -e 's/,/\n/g'`

if [ -n "$2" ]
then
    tags=` echo "${tags}" | grep "$2" `
fi

echo "${tags}"
```

