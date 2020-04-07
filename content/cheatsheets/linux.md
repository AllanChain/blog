---
Title: "Linux (Ubuntu)"
Date: 2020-04-07T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
---

## `systemctl` 

### Where are service files?

    /etc/systemd/system/service-name.service

### Start at Boot

```bash
sudo systemctl enable sshd.service
```

`disable` is the opposite.

### Use Environment in Service Unit File

```systemd
[Service]
Environment=PATH=/home/pi/.local/bin:/home/pi/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

> :notebook_with_decorative_cover: **Note**
>
> `$PATH` do not have its special meaning here.
>
> <https://askubuntu.com/q/1014480> for advanced.

### Unit File Template

<details>
<summary>Click to expand</summary>

```systemd
[Unit]
Description=Jupyter Notebook

[Service]
Type=simple
PIDFile=/run/jupyter.pid
Environment=PATH=/home/pi/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=jupyter lab --config=/home/pi/.jupyter/jupyter_notebook_config.py
User=pi
Group=pi
WorkingDirectory=/home/pi/Notebooks/
Restart=always
RestartSec=10
#KillMode=mixed

[Install]
WantedBy=multi-user.target
```
</details>

### Exited Without Error Log?

*From <https://unix.stackexchange.com/a/225407>*

Use `journalctl` command. e.g.

```bash
journalctl -u service-name.service
```

`-u` is short for `--unit`. More useful options:

- `-f`, `--follow`: Show only the most recent journal entries, and continuously print new entries as they are appended to the journal. 
- `-r`, `--reverse`: Reverse output so that the newest entries are displayed first.

## `apt`

### List All Versions

*<https://askubuntu.com/q/473886>*

```bash
apt-cache madison chromium-browser
# or
apt-cache showpkg lyx
```

### Install Specific Version

*<https://askubuntu.com/q/428772>*

```bash
# get version of installed package
apt-cache policy <package name>
# install a specific package version
sudo apt-get install <package name>=<version>
```

## OS Release Info

```bash
cat /etc/os-release
```

## List All Users

```bash
less /etc/passwd
```

## `lsof`

LiSt Open Files. A very powerful tool.

For network checking:

    ls -i [46][protocol][@hostname|hostaddr][:service|port]

e.g.

```shell
sudo lsof -i :80
```

## `find`

```bash
find -iname 'qwerty'
find dir/ -iname 'qwerty'
find -name 'Qwerty'
```

## No Wireless Connection After Sleep

```bash
sudo service network-manager restart
```

