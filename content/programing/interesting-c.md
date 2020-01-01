---
Title: 'WTFs in C'
Date: 2020-01-01T13:45+08:00
Author: AllanChain
Categories:
    - C
---

为了备战变态的计算概论考试， 不得已要研究一下 C 的奇奇怪怪的东西

*除非有说明，均在 gcc 下测试*

## 往年题？
```c
#include <stdio.h>
#define f(x) -x*x+
int main()
{
    int i,j,x,n,k;
    x=1;
    n=2;
    k=3;
    i=-f(-x+n)-k;
    j=--x+n*-x+n+-k;
    
    printf("%d\n%d\n",i,j);
}
```
其中，`gcc -E`认为的是
```c
    i=- - -x+n*-x+n+-k;
```
注意到 C 的运算符处理和空格有关，故结果为
```
-4
-1
```
而 VC 认为的是
```c
i=- --x+n*-x+n+-k;
```
注意到第二句时 x 已自减，故结果为
```
-1
0
```

## h(x) != g(x) ?
```c
#include <stdio.h>
#define f(a,b) a##b
#define g(a)   #a
#define h(a) g(a)

int main()
{
  printf("%s\n",h(f(1,2)));
  printf("%s\n",g(f(1,2)));
  return 0;
}
```

> <https://stackoverflow.com/a/4368983/8810271>
>
> An occurrence of a parameter in a function-like macro, unless it is the operand of # or ##, is expanded before substituting it and rescanning the whole for further expansion. Because g's parameter is the operand of #, the argument is not expanded but instead immediately stringified ("f(1,2)"). Because h's parameter is not the operand of # nor ##, the argument is first expanded (12), then substituted (g(12)), then rescanning and further expansion occurs ("12").  


## Nice websites
- <https://www.geeksforgeeks.org/interesting-facts-in-c-programming/>
- <http://www.gowrikumar.com/c/index.php>

## No print?
```c
#include<stdio.h>

#define TOTAL_ELEMENTS (sizeof(array) / sizeof(array[0]))
int array[] = {23,34,12,17,204,99,16};

int main()
{
  int d;

  for(d=-1;d <= (TOTAL_ELEMENTS-2);d++)
      printf("%d\n",array[d+1]);

  return 0;
}
```
这是非常神奇的， 但是和宏没什么关系。

首先，`sizeof`返回的是 `unsigned long int`, `d` 是 `int` 类型，这两个比较的时候会比较迷，现行的是 unsigned preserving 策略，即把 `int` 变成 `unsigned int`，再行比较。

于是`TOTAL_ELEMENTS-2`还是`unsigned long int`，而 -1 就变成巨大无比，条件自然就不可能成立了。

所以呢，把`TOTAL_ELEMENTS`换成由`unsigned int a=7;`定义的`a`，还是一样的。

还有一点有意思的是：

> <https://stackoverflow.com/questions/2084949>
>
> On a platform with 32bit int with e.g.
> ```c
> int x = -1;
> unsigned y = 0xffffffff;
> ```
> the expression x == y would yield 1 because through the "usual arithmetic conversions" the value of x is converted to unsigned and thus to 0xffffffff.
>
> The expression (unsigned int)x == y is 1 as well. The only difference is that you do the conversion explicitly with a cast.
>
> The expression x == (int)y will most likely be 1 as well because converting 0xffffffff to int yields -1 on most platforms (two's complement negatives). Strictly speaking this is implementation-defined behavior and thus might vary on different platforms.
>
> ---
> Safest is to check that the number is in range before casting:
> ```c
> if (x >= 0 && ((unsigned int)x) == y)
> ```
