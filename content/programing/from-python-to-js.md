---
Title: "From Python to JavaScript"
Date: 2020-02-06T08:56:17+08:00
Author: Allan Chain
Categories:
    - JavaScript
    - Python
---

Although the title *Top Ten Mistakes Python Programmers Make When Learning JavaScript* may sound better, I have only noticed a few mistakes now. And I will update this post when I make more mistakes :smile:

## Element in Array or Key in Object / dict

In Python, we have:

```Python
>>> 3 in [1, 2, 3]
True
>>> 3 in {1: 2, 3: 4}
True
```

However, in JavaScript:

```JavaScript
> 3 in [1, 2, 3]
false
> 3 in {1: 2, 3: 4}
true
```

That's because in JavaScript, even Array act like a Object:

```JavaScript
> let a = [1, 2, 3]
undefined
> a.b = 5
5
> a
[ 1, 2, 3, b: 5 ]
```

So, JS just always detects keys. To determine whether an element in Array, you should do:

```JavaScript
> a.includes(3)
true
```

## Weird map / Are they Different? 

```Python
>>> list(map(int, ['1', '2', '3']))
[1, 2, 3]
>>> list(map(lambda s: int(s), ['1', '2', '3']))
[1, 2, 3]
```

```JavaScript
> ['1', '2', '3'].map(parseInt)
[ 1, NaN, NaN ]
> ['1', '2', '3'].map(s => parseInt(s))
[ 1, 2, 3 ]
> [1, 2, 3].map(console.log)
1 0 [ 1, 2, 3 ]
2 1 [ 1, 2, 3 ]
3 2 [ 1, 2, 3 ]
[ undefined, undefined, undefined ]
> [1, 2, 3].map(s => console.log(s))
1
2
3
[ undefined, undefined, undefined ]
> [1, 2, 3].forEach(console.log)
1 0 [ 1, 2, 3 ]
2 1 [ 1, 2, 3 ]
3 2 [ 1, 2, 3 ]
undefined
```

`map`will pass 3 parameters: value, index, and the Array itself, as shown in `[1, 2, 3].map(console.log)`

And, passing too many arguments will not cause error:

```JavaScript
> const g = s => console.log(s)
undefined
> g(1, 2, 3)
1
undefined
```

And as for `parseInt`, there is a second parameter (see below). That's why `parseInt` and `s => parseInt(s)` are different.

## `parseInt` v.s. `int`

> `parseInt(string [, radix])`
>
> Parameters
>
> string
>
> The value to parse. If this argument is not a string, then it is converted to one using the `ToString` abstract operation. Leading whitespace in this argument is ignored.
>
> radix Optional
>
> An integer between 2 and 36 that represents the radix (the base in mathematical numeral systems) of the string. Be careful—this does not default to 10!

> If `radix` is `undefined`, `0`, or unspecified, JavaScript assumes the following:
>
> 1. If the input `string` begins with `"0x"` or `"0X"` (a zero, followed by lowercase or uppercase X), `radix` is assumed to be `16` and the rest of the string is parsed as a hexidecimal number.
> 2. If the input `string` begins with `"0"` (a zero), `radix` is assumed to be `8` (octal) or `10` (decimal). Exactly which radix is chosen is implementation-dependent. ECMAScript 5 clarifies that `10` (decimal) *should* be used, but not all browsers support this yet. For this reason, **always specify a *radix* when using `parseInt`**.
> 3. If the input `string` begins with any other value, the radix is `10` (decimal).
>
> If the first character cannot be converted to a number, `parseInt` returns `NaN` unless the `radix` is bigger than `10`.

Well, that makes sense. And I'm going to specify a radix when using `parseInt`.

And note that  Python is more friendly:

    class int(object)
     |  int([x]) -> integer
     |  int(x, base=10) -> integer
     |
     |  Convert a number or string to an integer, or return 0 if no arguments
     |  are given.  If x is a number, return x.__int__().  For floating point
     |  numbers, this truncates towards zero.
     |
     |  If x is not a number or if base is given, then x must be a string,
     |  bytes, or bytearray instance representing an integer literal in the
     |  given base.  The literal can be preceded by '+' or '-' and be surrounded
     |  by whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.
     |  Base 0 means to interpret the base from the string as an integer literal.
     |  >>> int('0b100', base=0)
     |  4