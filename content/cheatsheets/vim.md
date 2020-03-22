---
Title: "Vim"
Date: 2020-03-22T07:56:57+08:00
Author: Allan Chain
Categories:
    - vim
    - Daily
Tags:
    - Commands
---

## Getting help

`ctrl+]` to follow link, `ctrl+t` to trace back.

## Scroll the terminal
*From <https://stackoverflow.com/a/50545253/8810271>*

`ctrl+w N` (notice the capital `N`) to enter terminal normal mode. You can even search in the terminal output!

And hit either `i` or `a` to enter insert mode.

## Open terminal / help page verically

Use the `:vert[ical]` command modifier:

```vim
:vert term
:vert help ex
```
## Enter normal mode for command history
`CTRL-F` `q:` `q/` `q?`

## Paste yanked text into the Vim command line
*From <https://stackoverflow.com/a/3997110/8810271>*

Hit `Ctrl-R` then `"`. If you have literal control characters in what you have yanked, use `Ctrl-R`, `Ctrl-O`, `"`.

PS: this Stack Overflow answer is excellent, maybe I will translate it into Chinese later.

## Excute command on matched line

`:h global` for more information
```
:[range]g[lobal]/{pattern}/[cmd]
```
Execute the Ex command [cmd] (default ":p") on the lines within [range] where {pattern} matches.

For pattern not match, use `:g!` or `:v` instead. You can use another charater as delimiter or even nest `g` and `v`.

If you want to excute normal commands, just `:g/This line/norm 3dd`.

## What is Ex mode?

Switch to "Ex" mode.  This is a bit like typing ":" commands one after another, except:

- You don't have to keep pressing ":".
- The screen doesn't get updated after each command.
- There is no normal command-line editing.
- Mappings and abbreviations are not used.

Therefore, Ex command can simply be considered as command.

## Measure startup time
```bash
vim --startuptime vim.log
```
