---
Title: Using Kivy and Buildozer to Build Android APK
Date: 2019-07-14
Author: Allan Chain
Categories:
    - Kivy
    - Python
    - Android
---

- Environment: 
    - Ubuntu 19.04 Disco Dingo
    - Python 3.7.3
    - kivy 1.10.1
    - buildozer 0.39

## My First Android Application Ever Built

### Buildozer Install

```shell
pip3 install buildozer
```

### Get Kivy program

Using <https://github.com/kivy/kivy/tree/master/examples/demo/pictures>

### Configure Buildozer

```shell
buildozer init
vim buildozer.spec
```

### Prepare to build

As advised on [Buildozer Doc](https://buildozer.readthedocs.io/en/latest/installation.html), Android on Ubuntu 18.04 (64bit) should install:

```
sudo pip install --upgrade cython==0.28.6
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install build-essential ccache git libncurses5:i386 libstdc++6:i386 libgtk2.0-0:i386 libpangox-1.0-0:i386 libpangoxft-1.0-0:i386
```

```shell
buildozer -v android debug
```

This will download Android SDK, NDK, and others tools, taking your ~/.buildozer about 3.9GB space and ./.buildozer about 1.3 GB, if you have only python3 and pip3 installed.

It may crash though, please **make sure there is no [WARNING] telling you to install packages**, and Google often.

If it says that there is no file called xyz.so, you can try:

```shell
locate xyz.so
ln -s path/to/exist/so /usr/lib/xyz.so
```

If you are inside some kind of great firewall, try in morning will speed the downloading process up.

### Install and Test

Finally, you will find a apk file inside ./bin directory.

You sure can upload it to a cloud and download it to your android device as I previously did, but I strongly recommend you to enable USB debug mode on your android phone and connect to your PC / laptop. And run:

```shell
buildozer android deploy
```

Then the android apk will be transmitted to your android device and install. Then run:

```shell
buildozer android run logcat 2>&1 >/dev/null | grep 'python' > filter.out
```

> Note:
>
> - an android device can only connect to a virtual machine or the PC at one time, configure it carefully
>
> - buildozer writes adb logcat info to STDERR, so use `2>&1` to redirect it to STDOUT
> - use grep to get all info related to python, since logcat has too much info to read
> - logcat won't stop automatically, so kill it when your app fiinishes
> - finally, write all to a file to be easily read.

### About Kivy Version

I ran buildozer to build an example apk before installing kivy via pip, so my next app crashed because of requirement error. So I have to install the specific version of kivy.
