---
Title: Read the Character Straight
Date: 2019-02-08
Author: Allan Chain
Categories: 
    - Python
---

#### On Linux
```python
import  os
import  sys
import  tty, termios
fd = sys.stdin.fileno()
old_settings = termios.tcgetattr(fd)
try :
   tty.setraw( fd )
   ch = sys.stdin.read( 1 )
finally :

   termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
```
#### On Windows
```python
import  msvcrt
ch = msvcrt.getch()
```
