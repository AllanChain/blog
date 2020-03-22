---
Title: "FFmpeg"
Date: 2020-03-22T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
Tags: 
    - ffmpeg
    - Commands
---

# Basic

## Get help from command line
```bash
ffmpeg -h
```
<details>
<summary>Some useful help here</summary>

```
Global options (affect whole program instead of just one file:
-loglevel loglevel  set logging level
-v loglevel         set logging level
-y                  overwrite output files
-n                  never overwrite output files
Video options:
-r rate             set frame rate (Hz value, fraction or abbreviation)
-s size             set frame size (WxH or abbreviation)
-aspect aspect      set aspect ratio (4:3, 16:9 or 1.3333, 1.7777)
-vn                 disable video
-vcodec codec       force video codec ('copy' to copy stream)
-vf filter_graph    set video filters
-ab bitrate         audio bitrate (please use -b:a)
-b bitrate          video bitrate (please use -b:v)

Audio options:
-aq quality         set audio quality (codec-specific)
-ar rate            set audio sampling rate (in Hz)
-ac channels        set number of audio channels
-an                 disable audio
-acodec codec       force audio codec ('copy' to copy stream)
-vol volume         change audio volume (256=normal)
-af filter_graph    set audio filters
```
</details>

# Examples

## 去除和取出声音
```shell
ffmpeg -i example.mkv -c copy -an nosound.mkv
ffmpeg -i input.avi -vn -acodec copy output.aac
```
## 裁剪
```shell
ffmpeg -i input.m4a -ss 0 -t 18 cut.m4a
```

- -ss 表开始，`HH:MM:SS.xxx`
- -t 表时长
- -to 表结束

## 拼接
```shell
ffmpeg -safe 0 -f concat -i list.txt -c copy output.mp4
```
list.txt 内容为：
```
file 1.mp4
file 2.mp4
```

## 生成静音的音频
```shell
ffmpeg -f lavfi -i anullsrc -t 5 -c:a libvorbis output.ogg
```
## 把视频和音频合起来
```shell
ffmpeg -i all.mp4 -i all.m4a -c:v copy -c:a aac -strict experimental output.mp4
```

## 合理转成 GIF

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

## 直接倍速

```bash
ffmpeg -i input.mkv -filter:v "setpts=PTS/60" output.mkv
```
或者更快的，但是会有音频问题，而且转出来帧率吓死人，并没有多少压缩作用，请慎用：
```bash
ffmpeg -itsscale 0.01666 -i input.mkv -c copy output.mkv
```

## 调节帧率

```bash
ffmpeg -i input.mp4 -r 24 output.mp4
```
