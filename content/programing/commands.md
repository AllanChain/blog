---
Title: "Commands"
Date: 2020-02-29T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
Tags: 
    - Commands
---

## 网络

```shell
# [Quick Fix] No Wireless Connection After Sleep
sudo service network-manager restart
```
## 各种查看
### 端口占用
```shell
sudo lsof -i:80
```
### 单个文件权限
```bash
ls -l file
```
### 全部任务
```bash
ps -e
```
### 所有用户
```bash
less /etc/passwd
```
### 系统发行版

```bash
cat /etc/os-release
```

## Nginx

```shell
# 重新加载配置文件
sudo nginx -s reload
# stop
sudo nginx -s stop
```

## 递归chmod

一个文件夹里既有子文件夹又有文件，但是由于之前操作不当，想要重新设置权限，但一个`-R`会把文件夹和文件同等对待。

<https://stackoverflow.com/a/11512211/8810271>

```shell
find /opt/lampp/htdocs -type d -exec chmod 755 {} \;
find /opt/lampp/htdocs -type f -exec chmod 644 {} \;
```

> `chmod 644 {} \;` specifies the command that will be executed by `find` for each file. `{}` is replaced by the file path, and the semicolon denotes the end of the command (escaped, otherwise it would be interpreted by the shell instead of `find`). 

## apt

### 列出所有版本

*<https://askubuntu.com/q/473886>*

```bash
apt-cache madison chromium-browser
# or
apt-cache showpkg lyx
```

### 安装特定版本

*<https://askubuntu.com/q/428772>*

```bash
# get version of installed package
apt-cache policy <package name>
# install a specific package version
sudo apt-get install <package name>=<version>
```

## 关于 submodule

#### 删除

```shell
git submodule deinit path/to/submodule
git rm path/to/submodule
rm -rf .git/path/to/submodule
```

#### 添加已有

```shell
git submodule add https://github/....
```

即可

#### 忽略修改

```.gitmodules
[submodule "bundle/fugitive"]
	path = bundle/fugitive
	url = git://github.com/tpope/vim-fugitive.git
    ignore = dirty
```

## Bash `**/*` 不是递归？
```shell
shopt -s globstar
```
即可

## 查找文件

```bash
find -iname 'qwerty'
find dir/ -iname 'qwerty'
find -name 'Qwerty'
```

## systemctl

### 开机启动
```bash
sudo systemctl enable sshd.service
```
