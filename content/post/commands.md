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

```shell
ffmpeg -i example.mkv -c copy -an example-nosound.mkv
ffmpeg -i input-video.avi -vn -acodec copy output-audio.aac
ffmpeg -i 20191019_160158.m4a -ss 0 -t 18 a1.m4a
ffmpeg -safe 0 -f concat -i list.txt -c copy output.mp4
ffmpeg -f lavfi -i anullsrc -t 5 -c:a libvorbis output.ogg
ffmpeg -i all.mp4 -i all.m4a -c:v copy -c:a aac -strict experimental output.mp4
```