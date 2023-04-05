---
title: sendBeacon 一个专门用来上报统计或诊断数据API 
date: 2020-12-05 19:17:32
category:
- javascript
- 技术
tag:
- sendBeacon
- api
- 数据上报
- 前端监控
---


## 背景

通常在进行客户端数据分析和诊断时，我们需要将用户在客户端的浏览等记录，在一个合适的时机发送到服务端进行分析。这个时机显然是非常重要的，如果过早发送数据，那必然会导致某些数据无法收集到，比如用户的停留时长、页面关闭时间等等。所以，在当前页面卸载unload之前，将收集到的数据发送出去，就显得很必要了。
<!-- more -->
为了解决上述所说的问题，通常需要在页面卸载（ `beforunload/unload`时间)之前，使用同步的`XHR(XMLHttpRequest)`请求数据，但是，这会导致页面卸载的时间大大增加，且强依赖于接口请求时间，对用户的体验十分不友好。另外，也可以通过Image Beacon图片信标方式进行数据上报，其原理是创建一个图片元素，然后设置它的 src 属性，此时绝大多数浏览器会延迟卸载以保证这个图片的载入，但是，这也避免不了页面卸载时间的增加，从而增加跳转到下一个页面的时间。

此时，就需要一个api来解决以上问题，即可以保证数据可靠的被传输到服务端，且不阻塞页面的卸载。`navigator.sendBeacon`便横空出世。

## 简介

`navigator.sendBeacon()` 方法可通过HTTP将少量数据（ ~65536个字符）使用post方式异步传输到Web服务器，满足了统计和诊断代码的需要。

- 保证数据可靠传输

  其底层是基于Fetch Api封装，浏览器会为其创建一个基于Fetch的keepalive标志，来保证无论是否关闭页面，浏览器都会保证其最终的完成。

- 极低性能影响，异步低优先级执行

  当文档可视状态为隐藏时，浏览器会安排所有`sendBeacon`请求的立即传输，且会允许所有此类请求运行直到完成，而不阻塞其他紧迫和高优先级的任务。浏览器对其进行任务调度，以最大限度地减少资源(CPU和网络)与其他迫和高优先级任务的争用

- 不受跨域限制

  和请求`js`、`image`等资源类似，`sendBeacon`请求不受跨域限制

## 语法syntax

> ```javascript
> partial interface Navigator {
>  boolean sendBeacon(USVString url, optional BodyInit? data = null);
> };
> ```

- `url`

  `url` 参数表明 `data` 将要被发送到的网络地址。

- `data`

  `data` 参数是将要发送的 [BodyInit](https://fetch.spec.whatwg.org/#bodyinit)类型的数据，比如： [`ArrayBufferView`](https://developer.mozilla.org/zh-CN/docs/Web/API/ArrayBufferView) 或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob), [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 或者 [`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData) 等。

- return 返回值

  当浏览器成功把数据加入传输队列时，`sendBeacon()` 方法将会返回 true，否则返回 false。即执行成功为true，否则为false。

## 使用

```javascript
// 数据的上报
// data为收集到的数据
let data = {};
if(navigator.sendBeacon) {
    const status = navigator.sendBeacon('domain.com/api/postData', data);
} else {
    // 这里使用向下兼容的方式进行数据传输上报
}
```

由于`sendBeacon`方法不接受回调函数，所以，我们没有办法去做出成功后的处理。但是，我们可以根据其返回值去做下一步处理，当其返回值为true，我们便可以认为其成功了。其实，`sendBeacon`本身设计时，就是用来上报诊断等数据，类似于图片打点上报方式，不需要什么特殊的返回值。

> 注意：sendBeacon传输不止有传输长度的限制（Chrome40-86约65536个字符），数据大小的限制64kb，这些都是浏览器层面的限制，不同的浏览器可能还存在细微的差别。



## 兼容性

Beacon API已支持除IE之外的绝大多数PC和手机浏览器，包括国产UC、QQ、baidu等浏览器，可以放心使用，兼容性可以参考[Can I Use](https://caniuse.com/?search=sendBeacon)关于此API列表。

![image-20201202134641377](http://qncdn.yunishare.cn/image-20201202134641377.png@water)

## 参考资料：

1. [W3c Beacon ](https://w3c.github.io/beacon/#sendbeacon-method)
2. [Navigator.sendBeacon() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon)
3. [关于 navigator.sendBeacon 接口](https://juejin.cn/post/6844904094226710535)
4. [Navigator.sendBeacon() data size limits](https://stackoverflow.com/questions/28989640/navigator-sendbeacon-data-size-limits)

