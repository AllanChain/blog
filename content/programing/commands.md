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

## FFMpeg
#### 去除和取出声音
```shell
ffmpeg -i example.mkv -c copy -an nosound.mkv
ffmpeg -i input.avi -vn -acodec copy output.aac
```
#### 裁剪
```shell
ffmpeg -i input.m4a -ss 0 -t 18 cut.m4a
```

- -ss 表开始，`HH:MM:SS.xxx`
- -t 表时长

#### 拼接
```shell
ffmpeg -safe 0 -f concat -i list.txt -c copy output.mp4
```
list.txt 内容为：
```
file 1.mp4
file 2.mp4
```

#### 生成静音的音频
```shell
ffmpeg -f lavfi -i anullsrc -t 5 -c:a libvorbis output.ogg
```
#### 把视频和音频合起来
```shell
ffmpeg -i all.mp4 -i all.m4a -c:v copy -c:a aac -strict experimental output.mp4
```

#### 合理转成 GIF

The standard way to use ffmpeg for GIFs is

Generate a palette from the video

```bash
ffmpeg -y -i file.mp4 -vf palettegen palette.png
```
Then,
```bash
ffmpeg -y -i file.mp4 -i palette.png -filter_complex paletteuse -r 10 -s 320x480 file.gif
```
More options documented here.

所以使用我的 `ffmpegroup`脚本，第二步就是

```bash
ffmpegroup mp4/gif -z"-i palette.png -filter_complex paletteuse -r 10 -s 200x200 -y"
```

#### 直接倍速

```bash
ffmpeg -i input.mkv -filter:v "setpts=PTS/60" output.mkv
```
或者更快的，但是会有音频问题，而且转出来帧率吓死人，并没有多少压缩作用，请慎用：
```bash
ffmpeg -itsscale 0.01666 -i input.mkv -c copy output.mkv
```

#### 调节帧率

```bash
ffmpeg -i input.mp4 -r 24 output.mp4
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
