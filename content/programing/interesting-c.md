---
Title: 'WTFs in C'
Date: 2020-01-01T13:45+08:00
Author: AllanChain
Categories:
    - C
---

为了备战变态的计算概论考试， 不得已要研究一下 C 的奇奇怪怪的东西

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
> An occurrence of a parameter in a function-like macro, unless it is the operand of # or ##, is expanded before substituting it and rescanning the whole for further expansion. Because g's parameter is the operand of #, the argument is not expanded but instead immediately stringified ("f(1,2)"). Because h's parameter is not the operand of # nor ##, the argument is first expanded (12), then substituted (g(12)), then rescanning and further expansion occurs ("12").  

<https://stackoverflow.com/a/4368983/8810271>

## Nice websites
- <https://www.geeksforgeeks.org/interesting-facts-in-c-programming/>
- <http://www.gowrikumar.com/c/index.php>
