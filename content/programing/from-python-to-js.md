---
Title: "From Python to JavaScript"
Date: 2020-02-12T08:56:17+08:00
Author: Allan Chain
Categories:
    - JavaScript
    - Python
---

Although the title *Top Ten Mistakes Python Programmers Make When Learning JavaScript* may sound better, I have only noticed a few mistakes now. And I will update this post when I make more mistakes :smile:

## The `new` Operator

You can simply create an instance of a class by `ClassName(...)` in Python. But in JavaScript you need the `new` operator. It can be easily forgotten!

*See also <https://stackoverflow.com/q/1646698/8810271>, <https://stackoverflow.com/q/383402/8810271>*

But why sometimes it still works when I forget `new`? For example:

```JavaScript
> b = new Date()
2020-02-08T05:20:14.069Z
> c = Date()
'Sat Feb 08 2020 13:20:19 GMT+0800 (GMT+08:00)'
```

As the second link shows, there is a trick:

```JavaScript
function foo() {
   // if user accidentally omits the new keyword, this will 
   // silently correct the problem...
   if ( !(this instanceof foo) )
      return new foo();
   // constructor logic follows...
}
```

However, you must use `new` if you are using class:

```JavaScript
> class Bar {
... constructor() {
..... if ( !(this instanceof Bar) ) return new Bar()
..... this.foo = 1
..... }
... }
undefined
> Bar()
Thrown:
TypeError: Class constructor Bar cannot be invoked without 'new'
> new Bar()
Bar { foo: 1 }
```

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
## Dead Variable

*Based on <https://stackoverflow.com/a/54980674/8810271>*

```JavaScript
> let a = nothing
Thrown:
ReferenceError: nothing is not defined
> let a = 1
Thrown:
SyntaxError: Identifier 'a' has already been declared
> a = 1
Thrown:
ReferenceError: a is not defined
```

Once you have a typo when using `let` in console (such as forgetting `new`), the variable name will never come back. That's because variable initialization did not complete successfully, and you can't re-declare a variable that's already been declared.

Worse still, you cannot delete the variable declared using `let`, `const` or `var`. Only things like "global variable" can be deleted. See also <https://stackoverflow.com/q/1596782/8810271>

You have to reinvent a good variable name, or reopen the console.

## Sure Sorted?

```JavaScript
> [2, 1].sort()
[ 1, 2 ]
> [8, 10].sort()
[ 10, 8 ]
```

No, JS `sort` is just String sorting:

> The `sort()` method sorts the elements of an array *in place* and returns the sorted array. The default sort order is ascending, built upon converting the elements into strings, then comparing their sequences of UTF-16 code units values.

And if you want number sorting, write:

```JavaScript
> [8, 10, 6, 19].sort((a, b) => a - b)
[ 6, 8, 10, 19 ]
```

