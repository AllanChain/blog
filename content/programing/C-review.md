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
　
`score` 看成一维数组，
则`*score`就是获得该数组的第一个元素。
由于二维数组，第一个元素还是数组。
`average(*score,12)`就相当于传一个数组进去。
与`float *p`相符。

而`float (*p)[4]`是 a pointer to array of 4 float，
`score`本身一维数组就等同于指针，指向第一个数组元素。
故这两个是相符的。
### 指针与字符串
#### 常量区？
有家可归的字符串常量呆在“家”里，无家可归的字符串常量呆在常量区。

有无static相同
```c
char *day_name(int n)
{
    static char *name[] = {
        "Illegal day", "Monday",
        "Tuesday", "Wednesday",
        "Thursday", "Friday",
        "Saturday", "Sunday"};
    return((n<1||n>7) ? name[0] : name[n]);
}
```
有无static不相同,有：可正确打印；无：打印值有时不对
```c
char *day_name(int n)
{
    static char name[][20] = {
        "Illegal day", "Monday",
        "Tuesday", "Wednesday",
        "Thursday", "Friday",
        "Saturday", "Sunday"};
    return ((n < 1 || n > 7) ? name[0] : name[n]);
}
```
