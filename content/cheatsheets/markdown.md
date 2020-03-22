---
Title: "Markdown"
Date: 2020-03-22T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
---

## Escaping `` ` ``

The general principle is, escape `` ` `` with more `` ` ``s.

For example, if you want to escape a single `` ` ``, just wrap it with two on each side, and add spaces, that is, ``` `` ` `` ```.

If you want to escape three back quotes in a code block, use 4 for the code fence:
`````
````
```python
print('hello')
```
````
`````
Produces:
````
```python
print('hello')
```
````
