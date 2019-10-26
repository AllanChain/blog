---
Title: Module readline
Date: 2019-02-08
Author: Allan Chain
Categories: 
    - Python
---

Here is my simple script on readline.

```python
import readline
import os

def completer(text,state):
    ds=os.listdir()
    rs=list(filter(lambda s:s.startswith(text),ds))
    if state<len(rs):
        return rs[state]
    return None
readline.parse_and_bind("tab: complete")
readline.set_completer(completer)
input()
```

- 必须注意如果在函数中有错误的话，在你按下tab键后什么都不会发生（新手会在这里卡壳）。要知道，`readline`非常高级地封装了你的函数，这样才能在`input`中补全。但这对debug来说不见得是一件好事。较好的方法是先调用一下你的函数`completer('c',0)`并检查输出，这样函数中的Exception会正常raise。
- 形象理解的话，`state`其实就是第几选项的序号。

- Expecially notice that if there's any exception raised in your script, nothing would happen when you pressed <tab>.The best way I thought of is to call `completer('c',0)` first and check the return value when debugging.
- As for the parameter `state` , it's just a index of the options.
