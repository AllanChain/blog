---
Title: 让Termux对浏览器更友好
Date: 2019-07-03
Author: Allan Chain
Categories: 
    - Termux
    - Python
---

Download [xb.py](/file/xb.py)

难点：

- 获取jupyter等应用的实时输出

```python
import subprocess
backup = subprocess.Popen(
	cmd.split(), shell=False, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
for line in iter(backup.stdout.readline, b''):
	line = line.rstrip().decode('utf8')
```

- 使Ctrl+C能使让应用结束
    - 只有以`shell=False`启动的`Popen`才能收到中止信号，不要问我为什么。

```python
try:
    do_something()
except KeyboardInterrupt:
    from os import _exit
    
    print('Quiting')
    backup.kill()
    _exit(0)
```

- 能自动识别使用什么应用

```python
# 基于文件数量多少的分类

def guess_app():
    from os import listdir, getcwd, chdir
    from os.path import splitext

    app_trait = {'.ipynb': 'j',
                 '.md': 'd'}
    # Support launch mkdocs even deep inside the directory
    chdir(getcwd().split('docs')[0])
    if 'mkdocs.yml' in listdir():
        return 'k'
    exts = {}
	# Convert to only extentions
    all_file = list(map(lambda x: splitext(x)[1], listdir()))
    for k in app_trait:
        exts[k] = all_file.count(k)
    # Get the most frequent one
    most = sorted([(k, v)for k, v in exts.items()],
                  key=lambda x: x[1], reverse=True)[0][0]
    return app_trait[most]
```

```python
# 参考了grip语法后，也许更合适的分类

def guess_app():
    from os import listdir, getcwd, chdir
    from os.path import splitext

    app_trait = {'.ipynb': 'j',
                 '.md': 'd'}
    # Support launch mkdocs even deep inside the directory
    if 'mkdocs.yml' in listdir():
        return 'k'
    pwd = getcwd()
    if 'docs' in pwd:
        chdir(pwd.split('docs')[0])
        if 'mkdocs.yml' in listdir():
            return 'k'
        chdir(pwd)
    if len(argv) > 1 and argv[1].endswith('.md') or 'README.md' in listdir():
        return 'd'
    exts = {}
    # Convert to only extentions
    all_file = set(map(lambda x: splitext(x)[1], listdir()))
    if '.ipynb' in all_file:
        return 'j'
    raise NotImplementedError('No application found to implement this.')
```

- 有时候应用不止一次地输出应打开的地址，这时要立一个flag

```python
def start_app(cmd):
    XB_STATUS = False
	......
	r = findall('http://.*/', line) or findall('http://.*$', line)
	if len(r) > 0 and not XB_STATUS:
		print(r[0])
		popen('termux-open-url "%s"' % r[0])
		XB_STATUS = True
```
