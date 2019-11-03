---
Title: 在ftp文件夹视图下实现双击打开文件
Date: 2019-04-08
Author: Allan Chain
Categories: 
    - Python
---

## 背景

在日常学习生活中，ftp文件的操作需要拖放来实现，于是产生以下问题：

- 拖曳操作对触摸屏并不友好，常需要通过长按后达到右键的效果再拖放。
- 几天以后，会出现满桌面的文件，整理工作量大。

## 解决方案探索

### 评析浏览器下载插件的可行性

缺点：

1. 难以自定义下载位置，也是一股脑放在一个地方
2. 肯定会弹出浏览器窗口，就算不管弹出窗口的美观性，如果浏览器打开了什么。。。

> 结论：放弃此方案

### 评析将自定义程序注册为ftp打开方式的可行性

优点：

1. 有专门负责ftp双击打开后打开程序的注册表项，此处原来注册的是Chrome
2. 的确可以注册，调用python无窗口程序顺利

不足：

1. 传给程序的是临时文件地址，不知道ftp用户
2. 必须系统下载好临时文件才会调用注册的程序
3. 系统已经下载过的文件再次双击又会下载一遍，费时费力
4. 临时文件目录不会自动清空

补充：

- 存在两个地方注册ftp浏览器：
    1. `HKEY_CURRENT_USER\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\ftp\UserChoice`
    2. `HKEY_CLASS_ROOT\ftp`
    > 在某些电脑上（如Win7 64bit）使用方法一注册时，会下载临时文件；使用方法二时，只会创建临时文件
    > 
    > 但在另一些电脑（如Win7 32bit），不论使用那种方法，均会下载

解救方案：

- 使用windows api获取最上层文件浏览器的地址栏
> 注：有的（Win7 Professional）地址栏中包含用户名和密码，有的（Win7 Ultimate）只有用户名
- 再启用python ftplib实现文件对比和下载

### 思考Shell Extension

Shell Extension有属性栏、悬停等，但不适合

### 其他应用，放弃Explorer

暂时找不到

### SMB, Not FTP

你去协商呀！
