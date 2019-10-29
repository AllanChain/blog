---
Title: "谜之 Hugo"
Date: 2019-10-28T19:19:16+08:00
Author: Allan Chain
Categories:
    - Hugo
Tags: 
    - Complaints
Description: >
    吐槽 Hugo，记录被坑历程
---

## 对新手不友好的 Hugo

在之前 PKUCard 操作之后加了几个 Github 好友，发现很多（显然是主管感受）都在用 Hugo，也感觉之前用的Mkdocs 不是像样的博客，早有换掉的意思。于是近期就开始上手试了一下。

说 Hugo 之前先说一下 Python 的 Pelican。Pelican 也是一个博客写作应用，但是因为**用户量不够，主题样式太少**，并且主题的功能也不健全，（说白了就是不合胃口，）于是就很难受。

不用 Hugo 不知道，用了才发现原来 Markdown 渲染可以有这么快。但是当我按照教程，选了一个主题，按照提示一步一步来的时候。。？！为什么是白页面？怎么还是白的？把配置文件全部照抄还不行？错误提示都是虚假的！令人抓狂

无奈只好变成全部复制下来，再进行改动。。

## 从 v0.55 到 v0.59 一直有 Bug 的 Hugo

> Source block following a plain list ends up in the last plain list item #556
> 
> **kaushalmodi** commented [on 2 Aug]
> Hello,
> 
> Here's a minimal example to reproduce the issue:
> 
> -   item 1
> -   item 2
> 
```
This block should be out of <ul>...</ul>
And also out of blockquote
```
> 
> Ref: https://discourse.gohugo.io/t/possible-regression-in-v0-55-5-regarding-lists-containing-code-blocks/18502/4?u=kaushalmodi
> 
> /cc @aignas as you seem to be the last person to work on this Blackfriday plain-list/code block issue :)


来，你瞅瞅，现在还是这个样子的:sob:

这么不稳定的 Markdown 引擎，没法和 Python 比 :smirk:

## 仿佛急冰的 toc 功能

Hugo 自带的目录功能简直了，因为只能从 h1 开始，否则：

<ul><li><ul><li><ul><li>Header 3</li><li>Header 3</li></ul></li></ul></li></ul>

自带的功能，老兄！这种事情都做得出来！NOT PYTHONIC AT ALL!

最后我找到了<https://gist.github.com/skyzyx/a796d66f6a124f057f3374eff0b3f99a> @Iooeee 的代码，基本可以满足需求。

### 修改找到的 TOC 代码

如果你要更改标题级别的范围，可以把`[2-4]`替换成你想要的。

而且这位老兄的代码就是会把标题里的一些诸如`don't`的标点干掉，也不会保留加粗的格式。

解决办法就是去掉`planify | htmlEscape`, 并在
```
{{ $cleanedID := replace (replace $id "id=\"" "") "\"" "" }}
```
后加入
```
{{- $header := replaceRE "<h[2-4].*?>((.|\n])+?)</h[2-4]>" "$1" $header -}}
```

## 谜之 Template 语法

看了 Hugo 的之后这才发现 Jinja 原来是真的漂亮简洁

就问你`and (ConditionA) (ConditionB)` 是人话吗？没有`not`是什么？没有括号也叫 Function？怕是 Shell 用多了？

## 奇奇怪怪的 Toml

放着好好的 YAML 和 JSON 不用，突然冒出来一个 TOML。好像 Markdown 前面加 YAML 已经很常用了，然后跟我说用 TOML，不觉得等于号 有点 丑？不觉得 引号 有点 丑？虽然在做配置文件方面可能有独到之处，对不起，Vim 原生不支持，一键秒杀颜值。
