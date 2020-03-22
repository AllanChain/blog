---
Title: "Windows CMD"
Date: 2020-03-22T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
---

## Create Soft / Hard link

Using `ln` in WSL does not create Windows capable symlinks. To do so, open CMD with administartor priviledge, and use `mklink` command. Notice that `mklink` has an odd argument order.

To make soft link for directory:
```batch
mklink /D Link Target
```
`Target` is the directory which already exist.

Type `mklink` for more information.
