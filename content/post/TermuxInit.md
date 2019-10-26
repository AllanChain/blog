---
Title: Termux Initialize
Date: 2018-11-04
Author: Allan Chain
Categories:
    - Termux
---
### Initial Setup
- First,run:
```shell
termux-setup-storage
ln -s ~/storage/shared/123/pythonPro
```
- Then, in directory `pythonPro`,run `sh setup.sh`. 
- And the content of `setup.sh` is as followed:
```shell
apt install clang python python-dev fftw libzmq libzmq-dev freetype freetype-dev libpng libpng-dev pkg-config curl vim-python zsh
curl -L https://its-pointless.github.io/setup-pointless-repo.sh | sh
pkg install numpy
pip install matplotlib
pip install jupyter
sh -c "$(curl -fsSL https://github.com/Cabbagec/termux-ohmyzsh/raw/master/install.sh)"
ln -s /data/data/com.termux/files/usr/lib/python3.6/site-packages
ln -s ~/storage/shared/qpython
ln -s ~/storage/shared/123/cppPro
cp ~/pythonPro/jupyter_notebook_config.py ~/.jupyter/
```

