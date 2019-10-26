---
Title: 总结一下权限问题
Date: 2019-10-25
author: Allan Chain
Categories: 
    - Linux
    - Server
---
### Nginx
`Nginx` 必须使用 root 权限才能开启，因为它铁定需要 root 权限来绑定 80 端口，另外还要使用一些系统目录下的文件。

但是可以通过一波操作使只有 master 进程以 root 运行，其他操作则使用低级用户。

### uWSGI
本质上是低权限用户使用 Python 操作、访问本目录的问题。

- 首先，目录必须对其他用户有 x 权限，比如 `drwxrwxr-x`
- 还要保证日志输出文件夹要有权限

### sudo -u www-data
可以以 www-data 的身份运行命令，不必知道其密码
