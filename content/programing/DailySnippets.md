---
Title: 无法运行一些老旧程序
Date: 2019-07-15
Author: Allan Chain
Categories: 
    - Python
---

方案：右键>属性>以兼容模式运行
## 优酷.kux转.mp4
优酷安装文件夹内有ffmpeg.exe，按照ffmpeg用法重新封装成mp4即可。

附：优酷不给力的探索过程

- 杀掉Youku Desktop重新启动优酷
- 注销后重新启动优酷
- 在火绒中恢复优酷自启动
- 打开安装包，并没有修复功能
- 重装优酷
- 在优酷安装文件夹中漫步，找到NPlayer.exe，双击打不开，将.kux视频拖在其上，打开成功

## 为.kux文件注册打开方式

- 写`KuxConverter.py`，接收命令行参数，调用`ffmpeg`转成mp4，然后用默认应用（`PotPlayer`）打开。
- 在注册表`HKEY_CLASSES_ROOT`中
    - PyKux
		- DefaultIcon
		- shell
		    - open
				- command
    - .kux
- 其中`PyKux`项仿照`Python.File`填写，`.kux`项仿照`.mp4`填写

## FFMpeg 下载 m3u8

方便快捷，一行到位！

```shell
ffmpeg -i "https://zuikzy.603ee.com/2019/05/01/irlmX9Oasv3yhzR4/playlist.m3u8" example.mp4
```

## 华为手机助手给手机做全盘备份慢解决
1. 华为手机助手官网下载地址为：<https://consumer.huawei.com/cn/support/hisuite/>
以这个为准。安装完后可能会提示更新，如遇到可不理。我使用9.0.3.300测试成功。
2. 备份过程中如遇到98%卡死的情况，可考虑取消备份。然后将手机上的“备份”程序卸载掉，然后重新连接电脑端手机助手，由电脑端手机助手自动安装。如按前述操作，则可解决备份缓慢或者是卡住现象。
3. 在重装手机助手后，建议把手机连接电脑的相关记录取消，并且重新打开相关开关。
