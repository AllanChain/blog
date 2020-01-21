---
Title: "General Tricks about Raspberry Pi"
Date: 2020-01-21T11:20:29+08:00
Author: Allan Chain
Categories:
    - Raspberry Pi
---

## Get the Temperature

```bash
cat /sys/class/thermal/thermal_zone0/temp
```
Outputs:

    29482

And here is bash script to create temperature PS1
```bash
if [ -e /sys/class/thermal/thermal_zone0/temp ]; then
    temp=$(cat /sys/class/thermal/thermal_zone0/temp)
    if [ $temp -lt 30000 ]; then color=2
    elif [ $temp -lt 50000 ]; then color=3
    else color=1
    fi
    prompt_section $color "${temp::${#temp}-3}.${temp:${#temp}-3}"
fi
```
Adding a dot is just mixing bash substrings (`${string:offset[:length]}`) with bash string lengths (`${#string}`)
