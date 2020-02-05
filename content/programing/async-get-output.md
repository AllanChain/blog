---
Title: "异步获取命令输出"
Date: 2020-02-05T18:53:16+08:00
Author: Allan Chain
Categories:
    - Python
Tags: 
    - Async
---

*Tested with Python 3.7*

> :stuck_out_tongue_winking_eye: **TL;DR**
>
> 直达：[异步获取命令输出](#异步获取命令输出)

## 异步

异步和多线程比较而言，就是在应该停的地方停下，让给另一个任务。这样就使任务之间的交替变得更可控，不像多线程一样会动不动出现资源竞争的操作。

### 简单例子

*From <https://www.tornadoweb.org/en/stable/guide/async.html>*

synchronous:

```Python
from tornado.httpclient import HTTPClient

def synchronous_fetch(url):
    http_client = HTTPClient()
    response = http_client.fetch(url)
    return response.body
```

asynchronous:

```Python
from tornado.httpclient import AsyncHTTPClient

async def asynchronous_fetch(url):
    http_client = AsyncHTTPClient()
    response = await http_client.fetch(url)
    return response.body
```
虽然看起来除了`async await`之外和同步的没有什么区别，但是阻塞的函数并不能直接改成异步的函数，因为异步函数会立即返回，而且写程序的时候要明确告知什么时候停下。接下来详细讨论一下。

### Get Your Hands Dirty!

*Based on <https://realpython.com/async-io-python/>*

```Python
import asyncio
import time


async def count():
    print("One", end=" ")
    await asyncio.sleep(1)
    # time.sleep(1)
    print("Two", end=" ")


async def main():
    await asyncio.gather(count(), count(), count())

if __name__ == "__main__":
    s = time.perf_counter()
    asyncio.run(main())
    elapsed = time.perf_counter() - s
    print(f"{__file__} executed in {elapsed:0.2f} seconds.")
```

    One One One Two Two Two aioplay.py executed in 1.00 seconds.

只是直接调用`count()`，会返回`<coroutine object count at ...>`，而并不会立即执行，这和 JS 不一样。插播 JS：

```JavaScript
const a = async () => console.log(1)
a()
```
    1
    Promise {
      undefined,
      domain:
       ... }
但是在一个异步函数里调用而不用`await`变现，会直接报错：

```Python
In [5]: async def count():
   ...:     print("One")
   ...:     await asyncio.sleep(1)
   ...:     print("Two")
   ...:

In [6]: async def run():
   ...:     count()
   ...:

In [7]: asyncio.run(run())
ipython:2: RuntimeWarning: coroutine 'count' was never awaited
RuntimeWarning: Enable tracemalloc to get the object allocation traceback
```
这又和 JS 不一样。

---

如果不使用`await asyncio.sleep`，而是使用`time.sleep`来模拟一个阻塞的操作：

    One Two One Two One Two aioplay.py executed in 3.00 seconds.

没有切入点，只好顺序执行

---

如果修改`main`，成为一个循环：

```Python
async def main():
    for _ in range(3):
        await count()
```
    One Two One Two One Two aioplay.py executed in 3.00 seconds.

因为`await`会等到函数结束后才进行下一步操作。`asyncio.gather(count(), count(), count())`正是为了让它们一起运行。

## 获取命令输出

注意 Windows 下要指定路径

```Python
import subprocess

p = subprocess.Popen(['/bin/ping', '-c', '4', 'www.baidu.com'],
                     shell=False, stdout=subprocess.PIPE)
for line in iter(p.stdout.readline, b''):
    print(line.rstrip().decode())
```

这里的 `iter` 为不常见用法，指一直调用此函数，直至返回`b''`

或者使用`with`：

```Python
with subprocess.Popen(['/bin/ping', '-c', '4', 'www.baidu.com'],
                      shell=False, stdout=subprocess.PIPE) as p:
    for line in iter(p.stdout.readline, b''):
        print(line.rstrip().decode())
```

或者

```Python
with subprocess.Popen(['/bin/ping', '-c', '4', 'www.baidu.com'],
                      shell=False, stdout=subprocess.PIPE) as p:
    for line in p.stdout:
        print(line.rstrip().decode())
```

## 异步获取命令输出

可惜上述是阻塞的，不能用于异步。这就需要`asyncio.subprocess`出场了。

```Python
import asyncio


async def ping(prefix):
    # Create the subprocess; redirect the standard output
    # into a pipe.
    proc = await asyncio.create_subprocess_exec(
        'ping', '-c', '4', 'www.baidu.com',
        stdout=asyncio.subprocess.PIPE)

    async for data in proc.stdout:
        line = data.decode('ascii').rstrip()
        print(prefix + line)

    # Wait for the subprocess exit.
    await proc.wait()


async def main():
    await asyncio.gather(ping('1> '), ping('2> '))

# For Windows
# https://stackoverflow.com/a/53146484/8810271
# loop = asyncio.ProactorEventLoop()
# asyncio.set_event_loop(loop)
# loop.run_until_complete(get_date())
asyncio.run(main())
```

    1> PING www.a.shifen.com (183.232.231.174) 56(84) bytes of data.
    1> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=1 ttl=55 time=34.2 ms
    2> PING www.a.shifen.com (183.232.231.174) 56(84) bytes of data.
    2> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=1 ttl=55 time=46.6 ms
    1> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=2 ttl=55 time=38.6 ms
    2> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=2 ttl=55 time=32.5 ms
    1> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=3 ttl=55 time=34.2 ms
    2> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=3 ttl=55 time=31.7 ms
    1> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=4 ttl=55 time=35.9 ms
    1>
    1> --- www.a.shifen.com ping statistics ---
    1> 4 packets transmitted, 4 received, 0% packet loss, time 3003ms
    1> rtt min/avg/max/mdev = 34.212/35.731/38.574/1.781 ms
    2> 64 bytes from 183.232.231.174 (183.232.231.174): icmp_seq=4 ttl=55 time=32.7 ms
    2>
    2> --- www.a.shifen.com ping statistics ---
    2> 4 packets transmitted, 4 received, 0% packet loss, time 3004ms
    2> rtt min/avg/max/mdev = 31.721/35.892/46.580/6.182 ms

### `async for`?

```Python
async for TARGET in ITER:
    BLOCK
else:
    BLOCK2
```

is equivalent to

```Python
iter = (ITER)
iter = type(iter).__aiter__(iter)
running = True
while running:
    try:
        TARGET = await type(iter).__anext__(iter)
    except StopAsyncIteration:
        running = False
    else:
        BLOCK
else:
    BLOCK2
```

如果不用类呢，就会是这个样子：

```Python
import asyncio
import time


async def count():
    print("One", end=" ")
    await asyncio.sleep(1)
    print("Two", end=" ")
    return 'Yeah!'


async def generate_workers():
    for _ in range(3):
        yield await count()


async def main():
    async for line in generate_workers():
        print(line)

if __name__ == "__main__":
    s = time.perf_counter()
    asyncio.run(main())
    elapsed = time.perf_counter() - s
    print(f"{__file__} executed in {elapsed:0.2f} seconds.")
```

    One Two Yeah!
    One Two Yeah!
    One Two Yeah!
    aioplay.py executed in 3.00 seconds.
