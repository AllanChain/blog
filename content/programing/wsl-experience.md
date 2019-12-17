---
Title: "体验 WSL"
Date: 2019-12-17T10:43:22+08:00
Author: Allan Chain
Categories:
    - Linux
    - WSL
Tags: 
    - Environment
---

近日突发奇想，打算试一试 Windows Subsystem for Linux。（可能因为虚拟机还是有点带不动，Chrome + VM (running VSCode) =~ Crash）总体感觉比较流畅，在此稍作总结。

### SSH 的插曲

> :warning:本来天真的以为什么 SSH 连接就自带 root 权限（不要问我为什么这样想），看来的确是想多了。尝试着折腾了一下 SSH，好不容易弄好了配置文件之后，发现并非如此，依然要敲 sudo。

### 暴力 root

所以呢，想要 root 权限不如直接`su root`，当然要先给 root 用户设置密码：

```bash
sudo passwd -u root
```

Root的（唯一:smirk:）好处是敲需要 sudo 的 venv 命令的时候不需要带全路径，如：

```bash
sudo venv/bin/uwsgi blah blah
# vs
uwsgi blah blah
```

而且这样上翻查历史命令也方便。

（真香警告）

### 去你的 CMD 和 PowerShell

由于 Windows 自带的终端兼容性不好，本来使用了 powerline 字体，进了 Vim 就会自动消失？

还有平时使用 CMD 时，还是默认使用宋体，只有连接 SSH 之类的时候才会使用 powerline 字体，我也颇是绝望。。

所以还是使用 mintty 吧！

mintty 官方也有对 WSL 的支持，见 <https://github.com/mintty/wsltty>

再导入之前就有的配置（可以直接复制到`%APPDATA%\wsltty\config`，这样可以不修改自动生成的快捷方式），就大功告成了！

配置见下（备忘），注意修改了部分 Solarized 颜色：

```ini
# To use common configuration in %APPDATA%\mintty, simply remove this file
BoldAsFont=no
Term=xterm-256color
Transparency=high
CursorType=block
Font=Powerline Consolas
FontHeight=18
BackgroundColour=0,43,54
ForegroundColour=131,148,150
CursorColour=220,50,47
Black=7,54,66
BoldBlack=0,43,54
Red=220,50,47
BoldRed=203,75,22
Green=133,153,0
BoldGreen=133,153,0
Yellow=181,137,0
BoldYellow=101,123,131
Blue=38,139,210
BoldBlue=131,148,150
Magenta=211,54,130
BoldMagenta=108,113,196
Cyan=42,161,152
BoldCyan=147,161,161
White=238,232,213
BoldWhite=253,246,227
Locale=zh_CN
Charset=UTF-8

Rows=20
OpaqueWhenFocused=yes
FontSmoothing=default
```

### WSL 的文件在哪？

当然了，既然直接运行在 Windows 上，文件互通是必须的。虽然的确可以在本机上找到存放位置，但是可以使用网络的办法访问，简洁快速：

直接在`explorer`导航栏输入`\\wsl$`即可，愿意的话还可以创建快捷方式。

或者在 WSL 里输入`explorer.exe .`

### 继续接近 MSYS2 的使用

修改注册表添加右键菜单:

> `command`一栏直接使用`LOCALAPPDATA`的环境变量貌似会找不到文件

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\wsl_shell]
@="WSL Here"
"Icon"="%ProgramFiles%/WindowsApps/CanonicalGroupLimited.Ubuntu18.04onWindows_1804.2019.522.0_x64__79rhkp1fndgsc/ubuntu1804.exe"

[HKEY_CLASSES_ROOT\Directory\Background\shell\wsl_shell\command]
@="C:\\Users\\AC\\AppData\\Local\\wsltty\\bin\\mintty.exe --WSL=\"Ubuntu-18.04\" --configdir=\"C:\\Users\\AC\\AppData\\Roaming\\wsltty\"  -"
```

### To Be Continued

WSL 到底会不会代替 MSYS2 呢？这是个问题，毕竟现在的 GVim 也是依赖了 MSYS2 的环境的。