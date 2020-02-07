---
Title: "MySQL 存储 emoji"
Date: 2019-12-23T22:21:24+08:00
Author: Allan Chain
Categories:
    - Database
Tags: 
    - MySQL
    - Server
    - Emoji
---

**UPDATE:** See <https://docs.sqlalchemy.org/en/11/dialects/mysql.html#unicode> for detail

最近需要使用 SQLAlchemy 存弹幕的内容，但是遇到了存 emoji 的问题。

### `utf8_bin`?

一开始就套用存储中文姓名的那一套，使用`utf8_bin`的 collation，觉得 utf8 这种万能的东西直接用就行了。可谁知给我报错：

```python
mysql.connector.errors.DatabaseError: 1366 (HY000): Incorrect string value: '\xE8\x86\x9C' for column 'text' at row 1
```

蛤？竟有如此操作？

### `utf8mb4_unicode_ci`?

一波搜索之后就看到了使用`utf8mb4_unicode_ci`的 collation。于是就写：

```python
text = db.Column(db.Unicode(256, collation='utf8mb4_unicode_ci'))
```

可惜并没有实质性效果

### 暴力二进制

utf8 解决不了，二进制存储总行了吧？

果然，存进去并没有问题。但是当要读取出来的时候又报了奇怪的错误：

```python
TypeError: string argument without an encoding
```

明明是二进制怎么给我搞出来一个编码问题？

后期查阅[资料](https://stackoverflow.com/a/49188772/8810271)发现，SQL 似乎有一个动态类型，每列的数据类型是建议值，并不强制。其结果就是我存一个二进制编码的字符串，他就真的以为是字符类型，并且数据库表里没有存编码，导致了问题出现。

疾病设计:angry:！！！

### 直接escape

二进制也不行，全 escape 总可以了吧！

```python
>>> text.encode('unicode_escape').decode()
>>> text.decode('unicode_escape').encode()
```

总算成功存储和读取了！

### 人人都说`utf8mb4_unicode_ci`好

为什么就是不行呢？

哦，还要改数据库 charset, collation

```mysql
ALTER DATABASE databasename CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE tablename CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

还要给 SQLAlchemy 加`?charset=utf8mb4`

可是为什么还是不行？

```python
mysql.connector.errors.DatabaseError: 1273 (HY000): Unknown collation: 'utf8mb4_0900_ai_ci'
```

我几几年用过这编码？

### 版本大坑

我找到了`mysql-connector-python`的官方文档：<https://dev.mysql.com/doc/connector-python/en/connector-python-connectargs.html>

collation 一栏中：

> | Argument Name | Default | Description |
> | ------------- | ------- | ----------- |
> | `collation` | `utf8mb4_general_ai_ci` (is `utf8_general_ci` in 2.x | Which MySQL collation to use. The 8.x default values are generated from the latest MySQL Server 8.0 defaults. |

什么？8.0 的默认值？我们只有 5.7 呢！

虽然并不是`utf8mb4_0900_ai_ci`这种东西，我还是试着把链接数据库参数修改成`utf8mb4_unicode_ci`。

```yaml
SQLALCHEMY_ENGINE_OPTIONS:
    connect_args:
        collation: utf8mb4_unicode_ci
```

噫！成功了！

事实证明`utf8mb4_0900_ai_ci`和`utf8mb4_unicode_ci`应该是同义词一样的存在。

可是：

> MySQL Connector/Python 8.0 is highly recommended for use with MySQL Server 8.0, 5.7, 5.6, and 5.5. Please upgrade to MySQL Connector/Python 8.0.

好一个`recommended`，就给我挖这种坑？版本问题害死人！
