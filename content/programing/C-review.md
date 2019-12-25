---
Title: "C Review"
Date: 2019-12-25T10:43:22+08:00
Author: Allan Chain
Categories:
    - C
---
### 函数改变指针所指变量

> 调用函数不可能改变实参指针变量的值，但可以改变实参指针变量所指变量的值。

```c
swap(int *p1,int *p2)
{
    int *p;
    p=p1; p1=p2; p2=p;
}
```
和
```c
swap(int *p1,int *p2)
{
    int t;
    t=*p1; *p1=*p2; *p2=t;
}
```
的区别
### ++
> a++错，a是数组首地址，是常量，不能++。

> 函数p中a++正确，a其实为指针变量
> main()中a++错，数组头地址为常数

### 多维数组与指针
#### 一点提示
> &a[1]只是地址的一种计算方法，不要简单理解为a[1]的物理地址，因不存在变量a[1]。
#### 理解指针－数组传递
```c
void average(float *p, int n);
void search(float (*p)[4], int n);
main()
{
    float score[3][4] = {{65, 67, 70, 60},
                         {80, 87, 90, 81},
                         {90, 99, 100, 98}};
    average(*score, 12);
    search(score, 2);
}
```
　
