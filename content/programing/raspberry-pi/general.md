---
Title: "General Tricks about Raspberry Pi"
Date: 2020-02-07T11:20:29+08:00
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

## `vcgencmd`

*From <https://www.raspberrypi.org/documentation/raspbian/applications/vcgencmd.md>*

To get all commands, use:

```Bash
vcgencmd commands
```

### Voltage

```Bash
vcgencmd get_throttled
```

If voltage is okay, you will get `0x0`

Else, say `0x50000`, convert it to binary, and see each bit:


    19 18 17 16 15 14 13 12 11 10  9  8  7  6  5  4  3  2  1  0
     0  1  0  1  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0  0


| Bit  | Meaning                             |
| :--- | :---------------------------------- |
| 0    | Under-voltage detected              |
| 1    | Arm frequency capped                |
| 2    | Currently throttled                 |
| 3    | Soft temperature limit active       |
| 16   | Under-voltage has occurred          |
| 17   | Arm frequency capping has occurred  |
| 18   | Throttling has occurred             |
| 19   | Soft temperature limit has occurred |

Generally, the 3 `0`s in the middle do not have specific meaning. Just need to care about the first `5` and the last `0`.

### Screen on / off

When you start the Raspberry Pi with display / monitor / screen on, it will automatically turn on display power. If not, display power will never turn on even if you later connect it to a screen. So it is necessary to control the display power.

```Bash
vcgencmd display_power 1
```

`1` for on and `0` for off. bare `vcgencmd display_power` shows current state.

It is possible to specify a certain display ID. For more info, visit the doc above.