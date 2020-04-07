---
Title: "Git"
Date: 2020-04-07T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
---

## submodule

### Delete

```shell
git submodule deinit path/to/submodule
git rm path/to/submodule
rm -rf .git/path/to/submodule
```

### Add a cloned repo

Just

```shell
git submodule add https://github/....
```

### Ignore Change

```ini
[submodule "bundle/fugitive"]
	path = bundle/fugitive
	url = git://github.com/tpope/vim-fugitive.git
    ignore = dirty
```