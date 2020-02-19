---
Title: "g++ & VS Code 党对《数据结构与算法》的环境准备"
Date: 2020-02-19T16:50:19+08:00
Author: Allan Chain
Categories:
    - DSA
    - CPP
---

作为`DSA`类的首篇，有必要解释一下名称的由来：*Data Structure and Algorithm*

## 万恶`exe`

删掉删掉，养虎遗患:dog2: 

## 文件编码

作为可以追溯到 2008 年的程序们，使用 GBK 之类的编码和 CRLF 的确是正常的，但是看着觉得别扭。

所以使用`iconv`转换编码，`dos2unix`转换换行符：

```Bash
for file in **/*.cpp; do iconv -f GBK -t utf-8 $file -o $file; dos2unix $file; done
```

转完之后才发现，还有头文件。。改成`.h`再来一次完事。

## WSL + VS Code

使用微软“黑科技”，VS Code 使用 WSL 的环境，就不用担心 MSVC 这玩意了。

安装不多说，参考<https://code.visualstudio.com/docs/cpp/config-wsl>

配置编译启动的时候有需要注意的地方。VS Code 编译调试 c++ 的时候分两步，配置信息放在两个配置文件中，分别为`.vscode/tasks.json`, `.vscode/launch.json`。

- 点击调试，按照提示新建一个`launch.json`
- 我选择了`g++ build and debug active file`
- `launch.json`无需改动
- 再次调试，按照提示新建一个`tasks.json`
- 选择`g++ build active file`
- `tasks.json`修改稍等叙述

但是新建`tasks.json`好像并不可靠，有时并没有对应选项。。

由于多为多文件项目，直接默认的编译只会编译当前文件，故对`tasks.json`改动如下，编译文件所在目录下所有 `cpp` 文件：

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558 
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "type": "shell",
            "label": "g++ build active file",
            "command": "/usr/bin/g++",
            "args": [
                "-g",
                "${fileDirname}/**.cpp", // 原为 ${file}
                "-o",
                "${fileDirname}/${fileBasenameNoExtension}"
            ],
            "options": {
                "cwd": "/usr/bin"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": "build"
        }
    ]
}
```

## 万恶的`gets`

虽然该函数已经（2011？）正式退出，但是作为之前的代码，还是有它的身影。

*参考 <https://stackoverflow.com/q/1694036/8810271>*

只需将

```cpp
char str[32];
printf("生成多少随机数:\n");
gets(str);
```

改为

```cpp
char str[32];
printf("生成多少随机数:\n");
fgets(str, 32, stdin);
```

就没什么大问题了。

## `StdAfx`?

*<https://stackoverflow.com/questions/4726155>*

用于预编译一些头文件以达到加速效果。但是对于这种小项目，预编译加速效果有限，于是我并没有进行相关配置。