---
Title: "Working with tmux and SSH"
Date: 2020-01-21T20:24:48+08:00
Author: Allan Chain
Categories:
    - tmux
    - SSH
---

## How to automatically start tmux on SSH session?

*From <https://stackoverflow.com/a/40192494/8810271>*

Just put it in server-side `.bashrc`

```bash
if [[ -n "$PS1" ]] && [[ -z "$TMUX" ]] && [[ -n "$SSH_CONNECTION" ]]; then
  tmux attach-session -t ssh_$USER || tmux new-session -s ssh_$USER
fi
```

## Detach from tmux session and close SSH session with 1 command

*From <https://unix.stackexchange.com/a/546831>*

Just type 

```bash
tmux detach -P
```

## Copy Content Inside tmux

1. enter copy mode using `c-b [`
2. navigate to beginning of text, you want to select and hit `C-Space`
3. move around using arrow keys to select region
4. when you reach end of region simply hit `M-w` to copy the region
5. now `c-b ]` will paste the selection

## Copy over SSH with MinTTY

Options &rarr; Selection &rarr; Allow setting selection

And copy as usual in tmux.

If inside vim, enter copy mode first by hitting `c-b [ `