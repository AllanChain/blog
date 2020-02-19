---
Title: "TamperMonkey PKU Auto Click"
Date: 2020-02-19T13:12:07+08:00
Author: Allan Chain
Categories:
    - TamperMonkey
    - JavaScript
---

## Final code
*And test gist!*
<div>
<script src="https://gist.github.com/AllanChain/c0782061f9e9836e2807a81acfe3b254.js"></script>
</div>

## Things to Note
### Trailing slash
For example, `https://course.pku.edu.cn/`. Slash forgotten, the script will never be triggered.
### `include` vs `match`
Use `include` to include multiple site in a single script.
### Use `*` Properly
Only the home page of `https://course.pku.edu.cn/` needs auto click, but `https://iaaa.pku.edu.cn/iaaa/oauth.jsp*` can some time include query string.
### Invisible Element Value
And this script does not act so stable, because sometimes, the auto completed value is invisible to js. You need user inteaction.