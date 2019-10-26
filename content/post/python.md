---
Title: Python the Language
Date: 2018-11-04
Author: Allan Chain
Categories: 
    - Python
---

Notes for python language itself.

## Interesting Things About Class
Let's have a look at the following code first:

```python
class A:
    def printf(*args):
        print(args)
def printff(*args):
    print(args)

a=A()
a.printf()
print ('-'*5,a.printf)

A.printf=printff
a.printf()
print ('-'*5,a.printf)

A.printf=print
a.printf()
print ('-'*5,a.printf)

a.printf=printff
a.printf()
print ('-'*5,a.printf)

A.printf=printff
a.printf()
print ('-'*5,a.printf)
print ('-'*5,A.printf)

##Output
##(<__main__.A object at 0x01371070>,)
##----- <bound method A.printf of <__main__.A object at 0x01371070>>
##(<__main__.A object at 0x01371070>,)
##----- <bound method A.printff of <__main__.A object at 0x01371070>>
##
##----- <built-in function print>
##()
##----- <function printff at 0x01795858>
##()
##----- <function printff at 0x01795858>
##----- <function printff at 0x01795858>
```

And from this kind of behavior, I think I leart :

- The method defined in the class is called `bound method`.
- The function specificly assigned to the class later will become its `bound method` too. And **magically**, the name will change to the function's name. What's more, when I call `a.printff` ,it throw an error.
- The python interpreter treated built-in functions diffrently. Thus function `print` wound not become a `bound method`.
- After the function is assign to the instance, it would not become a `bound method`, but rather simply a function.
- ~~After a function is assign to the instance, the corresponding `bound method` in the class would magically change.~~
- After a function is assign to the instance, the **behavoir** when assigning functions again to an class would **magically** change.
- (Though I **really don't** know some of them ,I think I'd better put them down)

## Python Exceptions
I encountered this problem when writing `nb.py`. I wrote`except Exception:` instead of `except KeyboardInterrupt:` ,and it did not catch the KeyboardInterrupt as I expected. But now I figured out that KeyboardInterrupt is not included in Exception:
```shell
BaseException
+-- SystemExit
+-- KeyboardInterrupt
+-- GeneratorExit
+-- Exception
    +-- ...
	+-- ...
```

## Slicing
#### Here is a valid slice

```python
s='jksahgijsdhgedhjgkh'
print(s[5:999])

##Output
##gijsdhgedhjgkh
```

#### a valid way to create a slice
```python
a=slice(1,5,2)
print(a.start)
print(a.stop,a.step)

##Output
##1
##5 2
```
#### the invalid way
```python
a=[1:3:4]

##Output
##SyntaxError
```
#### cooperate with class
```python
class A:
    def __getitem__(self,arg):
	    print(arg)
		return 
a=A()
b=a[123,...,1:3:5,[1,2,3]]

##Output
##(123, Ellipsis, slice(1, 3, 5), [1, 2, 3])
```

## iter take callable argument

```
def seek_next_line(f):
    for c in iter(lambda: f.read(1),'\n'):
	        pass
```

The `iter(callable, until_value)` function repeatedly calls callable and yields its result until `until_value` is returned.


## method `__missing__`
From 2.5 onwards dicts have a special method `__missing__` that is invoked for missing items:
```python
>>> class MyDict(dict):
...  def __missing__(self, key):
...   self[key] = rv = []
...   return rv
...
>>> m = MyDict()
>>> m["foo"].append(1)
>>> m["foo"].append(2)
>>> dict(m)
{'foo': [1, 2]}
```
There is also a dict subclass in collections called defaultdict that does pretty much the same but calls a function without arguments for not existing items:
```python
>>> from collections import defaultdict
>>> m = defaultdict(list)
>>> m["foo"].append(1)
>>> m["foo"].append(2)
>>> dict(m)
{'foo': [1, 2]}
```
I recommend converting such dicts to regular dicts before passing them to functions that don't expect such subclasses. A lot of code uses `d[a_key]` and catches KeyErrors to check if an item exists which would add a new item to the dict.

## The `.pth` file
To add more python modules (espcially 3rd party ones), most people seem to use `PYTHONPATH` environment variables or they add symlinks or directories in their site-packages directories. Another way, is to use `*.pth` files. Here's the official python doc's explanation:

> The most convenient way [to modify python's search path] is to add a path configuration file to a directory that's already on Python's path, usually to the .../site-packages/ directory. Path configuration files have an extension of .pth, and each line must contain a single path that will be appended to sys.path. (Because the new paths are appended to sys.path, modules in the added directories will not override standard modules. This means you can't use this mechanism for installing fixed versions of standard modules.)

## Hidden features of Python
What are the lesser-known but useful features of the Python programming language?

Discussion at <https://stackoverflow.com/questions/101268/hidden-features-of-python>
