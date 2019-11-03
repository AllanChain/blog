---
Title: Split a Repo
Date: 2019-06-10
Author: Allan Chain
Categories: 
    - Git
---
## Single File
From <https://stackoverflow.com/questions/39479154/how-can-i-split-a-single-file-from-a-git-repo-into-a-new-repo>
Use git fast-export.

First you export the history of the file to a fast-import stream. Make sure you do this on the master branch.

```shell
cd oldrepo
git fast-export HEAD -- MyFile.ext >../myfile.fi
```
Then you create a new repo and import.
```shell
cd ..
mkdir newrepo
cd newrepo
git init
git fast-import <../myfile.fi
git checkout
```
## Sub Directory
```shell
git filter-branch -f --prune-empty --subdirectory-filter  path/to/module
```
