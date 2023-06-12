---
title: set-cookie与登录
date:  2021-05-30
updateDate: 2023-03-09
category:
- http
- 知识点
tag:
- http
- cookie
- 登录
- set-cookie
---

## 背景

最近在做接口转发服务相关的东西，其大致架构如下图所示，本地的项目使用的是devServer启动，然后代理到了一个中间接口服务（暂且称为API Server），此接口服务监又监听和代理了Mock Server和真实的此时服务器Server。
<!-- more -->
当客户端请求时，本地服务将接口代理到API Server，API Server会进行判断，然后将请求转发给MockSever或者后端测试Server，并将返回的数据再转发回客户端。
但是问题来了，在浏览器页面中执行登录后，访问其他页面依然是无权限访问。在浏览器控制台调试发现页面接口请求时一直带不上正确的cookie。为什么会这样呢？最后排查发现因为set-cookie出问题了，缺少了path。

![img.jpg](http://qncdn.yunishare.cn/blog/api-proxy-flow.jpg@water)

### 查找原因

直接访问测试服务器登录接口，页面能正常携带cookie访问接口。但是，通过API Server转发后页面权限访问就会出现问题，一直会处于无权限状态，推测cookie验证出现问题。接着对比headers里面的set-cookie，发现直接访问测试服务器返回的set-cookie有path属性，且设置了httpOnly。而走API Server后便会丢失path和HttpOnly属性。进一步排查发现，中间的API Server 其代码中确实对set-cookie字段做了手脚，导致set-cookie只会取cookie对应的key-value而其他属性则会过滤掉。

### 解决问题

1. 本地客户端devServer proxy代理时主动添加path字段为'/'。
2. 修改API Server代码，去除set-cookie过滤

![image.png](http://qncdn.yunishare.cn/blog/set-cookie.png)

## cookie登录过程

使用cookie登录过程大致可分为以下三个步骤

1. 客户端请求登录接口进行登录
2. 验证登录成功后，服务端将cookie下发至客户端（通过headers中的set-cookie下发）
3. 客户端将cookie写入本地，下次请求接口将携带此cookie供服务端验证

## cookie的作用域

虽然，客户端保存的cookie信息，但是并不是在所有的地方都可以进行访问的。cookie也有一个作用域的概念，来约束cookie能在哪些地方使用。其中，set-cookie中的Domain 和 Path 标识定义了Cookie的作用域：即允许 Cookie 应该发送给哪些URL。

### set-cookie

一个请求中的相应headers里面的`set-cookie`属性值大致如下，包含了很多属性。
`Set-Cookie: qwerty=219ffwef9w0f; Domain=somecompany.co.uk; Path=/; httpOnly`
Domain 指定了哪些主机可以接受 Cookie。如果不指定，默认为 origin（源域），不包含子域名。如果指定了Domain，则一般包含子域名。因此，指定 Domain 比省略它的限制要少。
Path 标识指定了主机下的哪些路径可以接受 Cookie（该 URL 路径必须存在于请求 URL 中）。以字符 %x2F ("/") 作为路径分隔符，子路径也会被匹配。
例如，设置 Path=/docs，则以下地址都会匹配：

- `/docs`
- `/docs/Web/`
- `/docs/Web/HTTP`

> 注意：如果不设置path属性，则很可能会导致cookie携带错误，从而导致权限校验失败。

根据 HTTP 标准 RFC6265，没有指定 set-cookie 的 path 属性时，默认为请求 uri 的路径。例如：请求 `http://example.com/api?id=1 `，那么 path 默认是 `"/api"`。如果请求是 `http://example.com/api/common?id=1` ，那么 path 默认就是 `"/api/common"`。
下面的截图就证实了这一点：
![image.png](http://qncdn.yunishare.cn/blog/cookie-path.png)

> 参考资料:[https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.4](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.4)
> **The Path Attribute**    If the attribute-name case-insensitively matches the string "Path",    the user agent MUST process the cookie-av as follows.    If the attribute-value is empty or if the first character of the    attribute-value is not %x2F ("/"):       Let cookie-path be the default-path.    Otherwise:       Let cookie-path be the attribute-value.    Append an attribute to the cookie-attribute-list with an attribute-    name of Path and an attribute-value of cookie-path. 

正是由于set-cookie中path的丢失，导致path取了默认值，即接口的路径。这样就会导致其他接口无法携带正确的cookie，导致接口鉴权失败。

### 参考资料

1. [Http cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
2. [HTTP-set-cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie)
3. [Rfc6265-5.2.4](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.4)