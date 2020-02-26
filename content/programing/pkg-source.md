---
Title: "换源集合"
Date: 2020-02-26T16:22:57+08:00
Author: Allan Chain
Categories:
    - Daily
Description: >
    各种换源，我要的都在这里了
---

众所周知，天朝网络环境需要换源来支撑，闲言少叙：

<https://mirrors.tuna.tsinghua.edu.cn/>

## pip

<https://mirrors.tuna.tsinghua.edu.cn/help/pypi/>

```bash
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

## npm

```bash
npm config set registry https://registry.npm.taobao.org
```

## docker


```json
"registry-mirrors": [
  "https://hub-mirror.c.163.com",
]
```