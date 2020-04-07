---
Title: "Bash"
Date: 2020-03-22T07:56:57+08:00
Author: Allan Chain
Categories:
    - Daily
---

## `**/*` not recursive?
```shell
shopt -s globstar
```

## Recursive `chmod`

*From <https://stackoverflow.com/a/11512211/8810271>*

Want set all files with mode 644 and all sub directories 755?

```bash
find /opt/lampp/htdocs -type d -exec chmod 755 {} \;
find /opt/lampp/htdocs -type f -exec chmod 644 {} \;
```

> `chmod 644 {} \;` specifies the command that will be executed by `find` for each file. `{}` is replaced by the file path, and the semicolon denotes the end of the command (escaped, otherwise it would be interpreted by the shell instead of `find`). 

## If Statement

```bash
if [ $1 -gt 100 ]
then
    echo Hey that\'s a large number.
fi
```

### Single Square Brackets

<details>
<summary>
These are frequently used, and search <code>CONDITIONAL</code> in bash man page for more.
</summary>

|              Operator | Description                                                  |
| --------------------: | :----------------------------------------------------------- |
|          ! EXPRESSION | The EXPRESSION is false.                                     |
|             -n STRING | The length of STRING is greater than zero.                   |
|             -z STRING | The lengh of STRING is zero (ie it is empty).                |
|     STRING1 = STRING2 | STRING1 is equal to STRING2                                  |
|    STRING1 != STRING2 | STRING1 is not equal to STRING2                              |
| INTEGER1 -eq INTEGER2 | INTEGER1 is numerically equal to INTEGER2                    |
| INTEGER1 -gt INTEGER2 | INTEGER1 is numerically greater than INTEGER2                |
| INTEGER1 -lt INTEGER2 | INTEGER1 is numerically less than INTEGER2                   |
|               -d FILE | FILE exists and is a directory.                              |
|               -e FILE | FILE exists.                                                 |
|               -r FILE | FILE exists and the read permission is granted.              |
|               -s FILE | FILE exists and it's size is greater than zero (ie. it is not empty). |
|               -w FILE | FILE exists and the write permission is granted.             |
|               -x FILE | FILE exists and the execute permission is granted.           |
</details>

> *From <https://stackoverflow.com/a/31366734/8810271>*
>
> `[` is just a regular command with a weird name.
>
> `]` is just an argument of `[` that prevents further arguments from being used.
>
> Nothing is altered in the way that Bash parses the command. In particular, `<` is redirection, `&&` and `||` concatenate multiple commands, `( )` generates subshells unless escaped by `\`, and word expansion happens as usual.
>
> `[[ X ]]` is a single construct that makes `X` be parsed magically. `<`, `&&`, `||` and `()` are treated specially, and word splitting rules are different. There are also further differences like `=` and `=~`.
>
> `[` is a built-in command (`compgen -b`), and `[[` is a keyword (`compgen -k`)

That's why you need to type spaces after `[` and before `]`. Furthermore, there is no need to type an entire if statement to debug a condition. Just type `[[ 0 > 1 ]]` and see your shell prompt (if configured) !