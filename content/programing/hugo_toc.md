---
Title: "TOC in Hugo"
Date: 2019-12-31T21:18:17+08:00
Author: Allan Chain
Categories:
    - Hugo
Tags:
    - ToC
---

As mentioned in [previous blog about Hugo](hugo.md), The  built-in Toc feature is very inconvenient. And recently, I find that the code I found on the Internet is not perfect. It just ensures enough end tags are rendered, And do not support where the first header is not the biggest. And I tried to fix them all.

## First Attempt

It is easy to render all the start tags, and the code I copied is correctly dealing with start tags, so it wouldn't be covered here.

I tried to remove some of the unnecessary end tags. The errors by `htmlhint` was less, but still some: some markdown files has some empty level of headers, which is not handled correctly, such as:

<blockquote>
<ul>
<li>Header 1
<ul><ul>
<li>Header 3</li>
</ul></ul>
</li>
</ul>
</blockquote>

```html
<ul>
<li>Header 1
<ul><ul>
<li>Header 3
</li>
</ul>
</ul></li>
</ul>
```
But normally, it should be:
<blockquote>
<ul>
<li>Header 1
<ul>
<li>Header 2
<ul>
<li>Header 3
</li>
</ul></li>
</ul></li>
</ul>
</blockquote>

```html
<ul>
<li>Header 1
<ul>
<li>Header 2
<ul>
<li>Header 3
</li>
</ul></li>
</ul></li>
</ul>
```
By looking into it carefully, you would find that when dealing with the end tags, first render `</li>`, and render `</ul></li>`  per loop fits the usual case, but if some level is skipped, you should just render `</ul>`

## Second Attempt
I use a variable to record how many blank level previous indent made, and render corresponding number of `</ul>` when dedenting, and rest will be `</ul></li>`

But this is still not enough, what if your dedent is less than the blank level, or in other words, you don't actually need to close all these blank levels, such as:

<blockquote>
<ul>
<li>Header 1
<ul><ul><ul>
<li>Header 4
</li>
</ul>
<li>Header 3
</li>
</ul>
</ul></li>
</ul>
</blockquote>

```html
<ul>
<li>Header 1
<ul><ul><ul>
<li>Header 4
</li>
</ul>
<li>Header 3
</li>
</ul>
</ul></li>
</ul>
```
If you think that you could use a variable to record number of previous blank levels, and substract some from it in every dedent until it become 0, take a look at this example:
<blockquote>
<ul>
<li>Header 1
<ul><ul>
<li>Header 3
<ul><ul>
<li>Header 5
</li>
</ul>
<li>Header 4
</li>
</ul></li>
</ul>
</ul>
<li>Header 1
</li>
</ul>
</blockquote>

```html
<ul>
<li>Header 1
<ul><ul>
<li>Header 3
<ul><ul>
<li>Header 5
</li>
</ul>
<li>Header 4
</li>
</ul></li>
</ul>
</ul>
<li>Header 1
</li>
</ul>
```

## Third Attempt
I need a stack to record what levels are left blank, and just render `</ul>` if closing that level, and pop that level out of the stack. Else, I will render `</ul></li>` 

But unfortunately, Hugo does not have a stack implementation, so I have to build a wheel.

Luckily, Hugo has `Scratch`, which supports:

- Create an entry
    - `$.Scratch.Set "key" slice`
- Add to an entry
    - `$.Scratch.Add "key" 2`
- Get all of an entry
    - `$.Scratch.Get "key"`
- Delete the whole key
    - `$.Scratch.Delete "key"`
- In the value
    - `if in ($.Scratch.Get "key") .`

That's just enough for making a stack, the only tedious part is poping item, and I did this the hard way:
```django
{{- $tmp := $.Scratch.Get "bareul" -}}
{{- $.Scratch.Delete "bareul" -}}
{{- $.Scratch.Set "bareul" slice}}
{{- range seq (sub (len $tmp) 1) -}}
  {{- $.Scratch.Add "bareul" (index $tmp (sub . 1)) -}}
{{- end -}}
```
Note that in hugo, `seq` is 1-based, but `index` is 0-based :joy:

Besides, `{{ seq $a [1] $b}}` only supports auto detect increase or decrease, which means at least one element will be generated, and you cannot force a `seq` not to be executed by using `{{ seq $a 1 $b}}` if by chance `$b` is smaller than `$a`:sob:. But bare `{{ seq $a }}` will do nothing if `$a` is 0.

As a result, manually add and sub will be inevitable...

## Ultimate Solution

The discussion above did not cover the tricks to handle start of the toc and end of it. But it is a simple trick if you understand what I mentioned in the *Third Attempt* Section. 
<blockquote>
<ul>
<ul><ul><ul>
<li>Header 4
</li>
</ul>
<li>Header 3
</li>
</ul>
</ul>
<li>Header 1</li>
</ul>
</blockquote>

Just make a loop to find the biggest header, and render correct number of `<ul>`s before and record blank
```django
{{- $largest := 6 -}}
{{- range $headers -}}
  {{- $headerLevel := index (findRE "[1-4]" . 1) 0 -}}
  {{- $headerLevel := len (seq $headerLevel) -}}
  {{- if lt $headerLevel $largest -}}
    {{- $largest = $headerLevel -}}
  {{- end -}}
{{- end -}}

{{- $firstHeaderLevel := len (seq (index (findRE "[1-4]" (index $headers 0) 1) 0)) -}}

{{- $.Scratch.Set "bareul" slice -}}
<div id="TableOfContents">
<ul>
  {{- range seq (sub $firstHeaderLevel $largest) -}}
    <ul>
    {{- $.Scratch.Add "bareul" (sub (add $largest .) 1) -}}
  {{- end -}}
  {{/* ... */}}
```
As for the end of toc, just do the same closing from last header  to the biggest header.

So, [here](<https://github.com/AllanChain/hugo-xmag-solarized/blob/master/layouts/partials/toc.html>) is the ultimate code.

(May be not so ultimate if you see this post long time after it was wriiten :smile:)
