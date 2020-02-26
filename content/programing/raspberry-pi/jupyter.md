---
Title: "Jupyter on Raspberry Pi"
Date: 2020-02-26T20:20:29+08:00
Author: Allan Chain
Categories:
    - Raspberry Pi
Tags: 
    - Jupyter
---

## Start Jupyter as service

*From <https://gist.github.com/whophil/5a2eab328d2f8c16bb31c9ceaf23164f>*

` /etc/systemd/system/jupyter.service`:

```ini
# After Ubuntu 16.04, Systemd becomes the default.
# It is simpler than https://gist.github.com/Doowon/38910829898a6624ce4ed554f082c4dd

[Unit]
Description=Jupyter Notebook

[Service]
Type=simple
PIDFile=/run/jupyter.pid
ExecStart=jupyter-notebook --config=/home/pi/.jupyter/jupyter_notebook_config.py
User=pi
Group=pi
WorkingDirectory=/home/pi/Notebooks/
Restart=always
RestartSec=10
#KillMode=mixed

[Install]
WantedBy=multi-user.target
```

To use, just do it in `systemctl` way:

```bash
sudo systemctl start jupyter
sudo systemctl stop jupyter
# To launch while start up
sudo systemctl enable jupyter
```

> :grey_exclamation: **NOTICE**
>
> run `systemctl daemon-reload` often when changing unit file. Or it will silently use the old bad file.
>
> *不要问我是怎么知道的*

## libf77blas.so.3: cannot open shared object file

```bash
sudo apt install libatlas-base-dev
```

## Config Jupyter

*Follow <https://jupyter-notebook.readthedocs.io/en/stable/public_server.html>*

### Typical Way

```bash
jupyter notebook --generate-config
# Get passwd hash
python3 -c 'from notebook.auth import passwd;print(passwd())'
# cd to a nice directory
# where `nodes` means `no-des`, no passwd for private key
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -sha256 -nodes
```

And here is the official example for the configuration file:

```python
# Set options for certfile, ip, password, and toggle off
# browser auto-opening
c.NotebookApp.certfile = '/absolute/path/to/your/certificate/fullchain.pem'
c.NotebookApp.keyfile = '/absolute/path/to/your/certificate/privkey.pem'
# Set ip to '*' to bind on all interfaces (ips) for the public server
c.NotebookApp.ip = '*'
c.NotebookApp.password = 'sha1:bcd259ccf...<your hashed password here>'
c.NotebookApp.open_browser = False
# It is a good idea to set a known, fixed port for server access
c.NotebookApp.port = 9999
```

> :warning: **​IMPORTANT**
>
> There are so many keys in the file, be sure to modify the correct key.

### Listen to ipv6 Only

```python
c.NotebookApp.ip = '::'
```

## Jupyter Themes

### Installation

```bash
pip3 install jupyterthemes
```

### Configuration

```bash
jt -t oceans16 -T -N -fs 16 -nfs 16 -cellw 90%
```

Explanation:

    -T, --toolbar         make toolbar visible
    -N, --nbname          nb name/logo visible
    -t THEME              theme name to install
    -fs MONOSIZE          code font-size
    -nfs NBFONTSIZE       notebook fontsize
    -tfs TCFONTSIZE       txtcell fontsize
    -dfs DFFONTSIZE       pandas dataframe fontsize
    -ofs OUTFONTSIZE      output area fontsize
    -mathfs MATHFONTSIZE  mathjax fontsize (in %)
    -cellw CELLWIDTH      set cell width (px or %)
> Font sizes are in `pt`

## Behind Nginx

*Reference: <https://gist.github.com/christopherbaek/39e6c432e212ca7a67ffe015fe869664>*

- Disable SSL and bind IP back to localhost, add `base_url`

```python
c.NotebookApp.base_url = 'jupyter'
c.NotebookApp.ip = '127.0.0.1'
c.NotebookApp.open_browser = False
c.NotebookApp.password = 'sha1:84cb...36f7e6'
c.NotebookApp.port = 9999
```

- Config Nginx, **headers are important**, **slash is also important**

```nginx
location /jupyter/ {
    proxy_pass http://127.0.0.1:9999/jupyter/;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;

    # WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Origin "";
}
```

