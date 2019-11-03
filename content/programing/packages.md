---
Title: Package Notes
Date: 2019-02-10
Author: Allan Chain
Categories: 
    - Python
---


## QtDisigner Install
QtDisigner is convenient, but it doesn't come along with the none GPL version. Then it is for you.
```shell
pip install pyqt5_tools
```
## Previewing Markdown
`grip` is an excellent Flask app and python module to view markdown and easy to use. Just run:
```shell
pip install grip
```
Note that grip need Internet access because it depends on github markdown api to render.

## Pip dependency tree view
`pip` offers a `freeze` command to view installed packages, but not so good to see the dependencies.
```
pipdeptree         " to see the whole tree
pipdeptree -p pack " to see the tree of pack
pipdeptree -r -p pack " to see packages which are dependent on pack
```

## Images to PDF
package img2pdf offers a lossless and fast conversion from images to pdf file which depends on `Pillow`
