---
Title: "Date in Excel"
Date: 2019-12-24T21:05:29+08:00
Author: Allan Chain
Categories:
    - Excel
---

I was trying to make a plan for the next few weeks, when I found Excel's strange behavior:

![](D:\Desktop\Program\Repo\blog\static\img\Excel_date1.png)

January 4th is missing? That's strange...

(Note that the right one is just for demo purpose and I have just typed `12-31` and `1-1`, and auto-filled it to `1-3`)

After checking the formula bar

![](D:\Desktop\Program\Repo\blog\static\img\Excel_date2.png)

Alright, Excel auto added year to the date, and the gap between the first to dates is 364 days, resulting in the correct "increase" until `2017/1/3` -- 2016 is a leap year!