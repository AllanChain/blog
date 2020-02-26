---
Title: "Install Wolfram With Jupyter"
Date: 2020-02-26T17:50:09+08:00
Author: Allan Chain
Categories:
    - Jupyter
    - Wolfram
---

From <https://github.com/wjxway/PKU-shuakeji>, I find that I can install free Wolfram Mathematica on Raspberry Pi.

Go ahead and `apt install wolfram-engine wolframscript`

Get Wolfram Language For Jupyter Guide here: <https://github.com/WolframResearch/WolframLanguageForJupyter/>

## WTF PATH

If try the first approach:

```bash
./configure-jupyter.wls add
```

Error occurred:

    configure-jupyter.wls: Jupyter installation on Environment["PATH"] not found.

But `jupyter` is in `PATH` indeed:

```bash
$ which jupyter
/usr/local/bin/jupyter
$ echo $PATH
/home/pi/.local/bin:/home/pi/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
```

However in `wolframscript`
```bash
$ echo 'Print[Environment["PATH"]]' | wolframscript
Wolfram Language 12.0.1 Engine for Linux ARM (32-bit)
Copyright 1988-2019 Wolfram Research, Inc.

In[1]:= /opt/Wolfram/WolframEngine/12.0/Executables:/opt/Wolfram/WolframEngine/12.0/S\

>   ystemFiles/Graphics/Binaries/Linux-ARM:/home/pi/.local/bin:/usr/bin:/bin
```

Well, `PATH` is different...

As said in `./configure-jupyter.wls help`, you can specify jupyter path by

    configure-jupyter.wls add "/absolute/path/to/Wolfram-Engine-binary--not-wolframscript" "path/to/Jupyter-binary"
            adds the provided absolute Wolfram Engine binary path to the provided Jupyter binary path

If you try the second, you can avoid providing path to Wolfram Engine binary:

```mathematica
ConfigureJupyter["Add", "JupyterInstallation" -> "..."]
```

## WTF GFW

However, it seems to update the `paclet` from server, which is very slow here...

Luckily, success.