---
Title: "在 Win10 上装 Docker"
Date: 2020-02-21T09:27:09+08:00
Author: Allan Chain
Categories:
    - Docker
    - WSL
---

## WSL: 失败的尝试

按照[官方说明](https://docs.docker.com/install/linux/docker-ce/ubuntu/)，使用第一种推荐方法，在 WSL Ubuntu 中安装 docker。但是发现没有`containerd.io`！

顺着第二种方法找过去，stable 里也没有它，却在 nightly 里。于是下了 `deb`包装上，又`apt install docker-ce docker-ce-cli`. 安装成功！

启动又出了问题，虽然表面上`sudo service docker start`给了一个 OK，但是想`docker run`的时候总说

    Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?.

查看`/var/log/docker.log`

    time="2020-02-19T19:00:28.735462500+08:00" level=info msg="stopping healthcheck following graceful
    shutdown" module=libcontainerd
    time="2020-02-19T19:00:28.735478500+08:00" level=info msg="stopping event stream following graceful
     shutdown" error="context canceled" module=libcontainerd namespace=plugins.moby
    panic: invalid page type: 0: 4
    
    goroutine 1 [running]:
    github.com/docker/docker/vendor/go.etcd.io/bbolt.(*Cursor).search(0xc000934dd8, 0x7ff3996e43f0, 0x7
    , 0x7, 0x4)
            /go/src/github.com/docker/docker/vendor/go.etcd.io/bbolt/cursor.go:250 +0x356
    github.com/docker/docker/vendor/go.etcd.io/bbolt.(*Cursor).seek(0xc000934dd8, 0x7ff3996e43f0, 0x7,
    0x7, 0x7ff398042420, 0x7ff390230001, 0xc000964500, 0xc000934df0, 0x7ff395b0d7c4, 0xc00096a088, ...)
            /go/src/github.com/docker/docker/vendor/go.etcd.io/bbolt/cursor.go:159 +0x80
    github.com/docker/docker/vendor/go.etcd.io/bbolt.(*Bucket).Bucket(0xc0003ba398, 0x7ff3996e43f0, 0x7
    , 0x7, 0xc00096a088)
            /go/src/github.com/docker/docker/vendor/go.etcd.io/bbolt/bucket.go:105 +0xd7
    github.com/docker/docker/vendor/go.etcd.io/bbolt.(*Tx).Bucket(...)
            /go/src/github.com/docker/docker/vendor/go.etcd.io/bbolt/tx.go:101
    github.com/docker/docker/volume/service.listMeta(0xc0003ba380, 0xc000000008, 0xc0001d69c0, 0x0)
            /go/src/github.com/docker/docker/volume/service/db.go:78 +0x6d
    github.com/docker/docker/volume/service.(*VolumeStore).restore.func1(0xc0003ba380, 0x7ff3982b02c8,
    0xc0003ba380)
            /go/src/github.com/docker/docker/volume/service/restore.go:21 +0x36
    github.com/docker/docker/vendor/go.etcd.io/bbolt.(*DB).View(0xc000132200, 0xc000934f98, 0x0, 0x0)
            /go/src/github.com/docker/docker/vendor/go.etcd.io/bbolt/db.go:725 +0x92
    github.com/docker/docker/volume/service.(*VolumeStore).restore(0xc000968320)
            /go/src/github.com/docker/docker/volume/service/restore.go:20 +0x94
    github.com/docker/docker/volume/service.NewStore(0xc0005e8890, 0xf, 0xc000755140, 0x0, 0x0, 0x0)
            /go/src/github.com/docker/docker/volume/service/store.go:107 +0xf6
    github.com/docker/docker/volume/service.NewVolumeService(0xc0005e8890, 0xf, 0x7ff39834c4a0, 0xc0004d1200, 0x0, 0x0, 0x0, 0x0, 0x7ff3982f0c40, 0xc00087a1e0, ...)
            /go/src/github.com/docker/docker/volume/service/service.go:45 +0x160
    github.com/docker/docker/daemon.NewDaemon(0x7ff39834bfa0, 0xc0007b8c80, 0xc0006f8a00, 0xc0004d1200, 0x0, 0x0, 0x0)
            /go/src/github.com/docker/docker/daemon/daemon.go:958 +0x1ed9
    main.(*DaemonCli).start(0xc0006fc720, 0xc00029a2a0, 0x0, 0x0)
            /go/src/github.com/docker/docker/cmd/dockerd/daemon.go:199 +0x7d3
    main.runDaemon(...)
            /go/src/github.com/docker/docker/cmd/dockerd/docker_unix.go:13
    main.newDaemonCommand.func1(0xc0001dd680, 0xc0001bb420, 0x0, 0x2, 0x0, 0x0)
            /go/src/github.com/docker/docker/cmd/dockerd/docker.go:34 +0x7d
    github.com/docker/docker/vendor/github.com/spf13/cobra.(*Command).execute(0xc0001dd680, 0xc00004e190, 0x2, 0x2, 0xc0001dd680, 0xc00004e190)
            /go/src/github.com/docker/docker/vendor/github.com/spf13/cobra/command.go:762 +0x467
    github.com/docker/docker/vendor/github.com/spf13/cobra.(*Command).ExecuteC(0xc0001dd680, 0x0, 0x0, 0x10)
            /go/src/github.com/docker/docker/vendor/github.com/spf13/cobra/command.go:852 +0x2ee
    github.com/docker/docker/vendor/github.com/spf13/cobra.(*Command).Execute(...)
            /go/src/github.com/docker/docker/vendor/github.com/spf13/cobra/command.go:800
    main.main()
            /go/src/github.com/docker/docker/cmd/dockerd/docker.go:97 +0x191

问题是出在`bbolt`上，一个叫`panic: invalid page type: 0: 4`的奇怪问题，搜索后看到<https://github.com/etcd-io/bbolt/issues/144>，又指向了<https://github.com/microsoft/WSL/issues/3162>，其中[这个评论](https://github.com/microsoft/WSL/issues/3162#issuecomment-435109168)提到了 docker 的问题。

然后又指向了<https://github.com/microsoft/WSL/issues/3939>，说，Fixed in Windows Insider Build [18890](https://github.com/MicrosoftDocs/WSL/blob/live/WSL/release-notes.md#build-18890)。。版本不够，去你的！

> :notebook_with_decorative_cover: **Note**
>
> 其实 WSL2 也可以，但是。。版本不够。。
>
> 其实也可以选择 Windows Insider 计划，但是升级有风险。。

## 尝试 Win10 家庭版安装

*若是专业版、教育版、企业版，请走正规军：<https://docs.docker.com/docker-for-windows/install/>*

系统要求摘录如下：

> - Windows 10 64-bit: Pro, Enterprise, or Education (Build 15063 or later).
> - Hyper-V and Containers Windows features must be enabled.
> - The following hardware prerequisites are required to successfully run Client Hyper-V on Windows 10:
>     - 64 bit processor with [Second Level Address Translation (SLAT)](http://en.wikipedia.org/wiki/Second_Level_Address_Translation)
>     - 4GB system RAM
>     - BIOS-level hardware virtualization support must be enabled in the BIOS settings. For more information, see [Virtualization](https://docs.docker.com/docker-for-windows/troubleshoot/#virtualization-must-be-enabled).

这个的方法已经烂大街了，在此简要记录一下方法：

以下两个 Windows 脚本保存成 cmd，管理员运行，需要装的包有点多，耐心等待。结束后会提示重启，看情况：

- 添加`Hyper-V`功能：

```Batch
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
for /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
del hyper-v.txt
Dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL
```

- 添加`Containers`功能（看起来不是所有人都需要，但我的电脑需要）：

```Batch
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*containers*.mum >containers.txt
for /f %%i in ('findstr /i . containers.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
del containers.txt
Dism /online /enable-feature /featurename:Containers -All /LimitAccess /ALL
```

---

从[官方](https://download.docker.com/win/stable/Docker%20Desktop%20Installer.exe)或[我的分享](https://disk.pku.edu.cn:443/link/0F0B4E4D080C429E2FCDA25ACE9DB0E6)下载`Docker Desktop Installer.exe`，版本 2.2.0.3(42716)，docker engine 19.03.5。（当然可以合理安排时间，与添加功能同步进行）

---

修改注册表骗过安装检查：

`\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion`，右侧的`EditionID`，改为`Professional`。注意重启后会复原。

---

双击安装，默认即可。可能要注意的是确认`Windows Container`不勾选。

## 换源

GUI 直接 settings 完事，Docker Engine 栏：

```JSON
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com",
    "https://registry.aliyuncs.com",
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "insecure-registries": [],
  "debug": true,
  "experimental": false
}
```

注意的是，直接使用中科大的没有效果（挠头），可能是已经崩了？算了还是留着吧。