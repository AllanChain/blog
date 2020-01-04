---
Title: "Commands"
Date: 2019-12-18T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
Tags: 
    - Commands
Description: >
    各种命令
---

### 网络

```shell
# [Quick Fix] No Wireless Connection After Sleep
sudo service network-manager restart
```
### 各种查看

```shell
# 端口占用
sudo lsof -i:80
# 单个文件权限
ls -l file
# 全部任务
ps -e
# 所有用户
less /etc/passwd
```
### Nginx

```shell
# 重新加载配置文件
sudo nginx -s reload
# stop
sudo nginx -s stop
```

### FFMpeg
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

### 递归chmod

一个文件夹里既有子文件夹又有文件，但是由于之前操作不当，想要重新设置权限，但一个`-R`会把文件夹和文件同等对待。

<https://stackoverflow.com/a/11512211/8810271>

```shell
find /opt/lampp/htdocs -type d -exec chmod 755 {} \;
find /opt/lampp/htdocs -type f -exec chmod 644 {} \;
```

> `chmod 644 {} \;` specifies the command that will be executed by `find` for each file. `{}` is replaced by the file path, and the semicolon denotes the end of the command (escaped, otherwise it would be interpreted by the shell instead of `find`). 

### 关于 submodule

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

### Bash `**/*` 不是递归？
```shell
shopt -s globstar
```
即可
