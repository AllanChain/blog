---
Title: "Mysql in Wsl"
Date: 2020-02-07T16:59:02+08:00
Author: Allan Chain
Categories:
    - MySQL
    - WSL
---

> :stuck_out_tongue_winking_eye: **TL;DR**
>
> 查看日志`/var/log/mysql/error.log`，上互联网搜

在使用 Windows Subsystem for Linux 时，可能因为缺少对 MySQL 是预置安装，会遇到一些问题

如果说


    ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)


可以试试建立 `/var/run/mysqld` 目录，并给 `mysql` 权限

如果说


    No directory, logging in with HOME=/


可以试试 `sudo usermod -d /var/lib/mysql/ mysql`

---

更新了一次系统后，MySQL 又无法启动了。刚开始还以为是更新的时候之前的配置被抹掉了，可并不是。。

**UPDATE: 不要听下面这个部分**

根据<https://github.com/Microsoft/WSL/issues/3631#issuecomment-465966498>，是 MySQL 版本太高了。。自动升到了 8.x。还要按照步骤回退。。:rage:

但是但是，由于我作死升到了 eoan，那个仓库并不支持。所以去 <https://dev.mysql.com/downloads/repo/apt/> 下载了最新的。然而，并没有 5.7 的选项:sob:

所以只能强行安装 Ubuntu 19.04 的包了，下载对应的 deb 文件：

```bash
wget https://dev.mysql.com/get/mysql-apt-config_0.8.13-1_all.deb
```

---

或者。。直接装 Windows 上，说不定也可。

---

**UPDATE:** 事实证明，是 MySQL 未正确升级所致，只需要完全删除 MySQL，再重新安装，就可以了（只要备份了重要文件）

```bash
sudo apt remove --purge *mysql*
sudo apt remove --purge *mariadb*
sudo rm -rf /etc/mysql /var/lib/mysql
sudo apt autoremove
sudo apt autoclean
```
