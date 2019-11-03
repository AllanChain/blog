---
Title: "Commands"
Date: 2019-10-27T21:26:57+08:00
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
