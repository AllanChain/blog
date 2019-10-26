---
Title: Pip&Pypi
Date: 2019-04-30
Author: Allan Chain
Categories: 
    - Python
---


## Downloading Binary Package on Windows
> *From StackOverflow*
> 
> As the other responses pointed out, one solution is to install Visual Studio 2015. However, it takes a few GBs of disk space. One way around is to install precompiled binaries. 
> 
> The webpage <http://www.lfd.uci.edu/~gohlke/pythonlibs> contains precompiled binaries for many Python packages.

## The pip command I actually want
```shell
alias pup="pip install --upgrade --no-cache -i https://pypi.tuna.tsinghua.edu.cn/simple/"
```

## To install locally
```shell
pip install --no-index --find-links=dest/ -r requirements.txt
```

## To download using `download` command
```shell
pip download --dest "Pypis" -r requirements.txt
```

## Downloading specific python version and platform (Windows batch version)
```shell
pip download ^
	--only-binary=:all:^
	--platform win32^
	--python-version 36^
	--implementation cp^
	--dest "Pypis"^
	-i https://pypi.tuna.tsinghua.edu.cn/simple/^
	-r requirements.txt
```

## Using TUNA Mirror by Default

#### On Linux
Write below in `~/.pip/pip.conf`
```
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host=mirrors.aliyun.com
```
#### On Windows
Write above in `~/pip/pip.ini`
