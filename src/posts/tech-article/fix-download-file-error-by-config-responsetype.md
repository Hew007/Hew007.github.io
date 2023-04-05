---
title: 指定responseType解决利用Blob对象导出文件乱码问题
date: 2020-05-29 16:05:34
category:
- 知识点
- 技术
tag:
- Blob
- 文件导出
- 文件处理
- 二进制文件
- responseType
---
### 背景

最近开发项目中使用后端提供的post接口导出csv表格时，遇到了导出的表格乱码的问题。之前所做的导出功能，基本都是通过浏览器get方式直接访问即可，此次通过在浏览器直接拼接参数进行请求导出的文档确实是正常的，而采取直接post请求接口的方式导出时，导出的文档出现了乱码。
<!-- more -->
post接口导出的实现：后端返回的是文件流，采用的是将后端返回的文件流转换为`Blob`对象，然后使用`URL.createObjectURL`方法，将`BIob`对象转化为对象URL,此URL为指向源Blob对象的字符串，产生的URL通常像这样："blob:http://localhost:8080/5b34ce1c-0c3c-4b4d-9cf2-d9f5c0800833" 可以看成是生成的一个唯一的标识，指向源对象。 然后，将此URL赋值到一个a标签上，指定download属性，即可通过click()触发下载。

#### 导出代码

```javascript
/**
 * 文件xls下载
* @param {Object} stream 二进制流对象
* @param {String} fileName 导出的文件名
*/
downloadXls(stream, fileName) {
     const blob = new Blob([stream])
     let url = URL.createObjectURL(blob);
     let a = document.createElement('a');
     a.style.display = 'none';
     a.href = url;
     a.setAttribute('download', fileName);
     document.body.appendChild(a);
     a.click();
     // 清除数据
     document.body.removeChild(a);
     a = null;
     URL.revokeObjectURL(url);
}
```

但是，这种常用的导出方式，如果不做设置，很有可能出现乱码的情况。要解决乱码问题，请求的时候需在请求中指定`responseType`，其类型为`ArrayBuffer`或者`Blob`。由以上的导出方法我们可以看出，我们是先将二进制流转换为`Blob`，然后再做的进一步处理。所以，传回的二进制流对象必须是Blob构造函数接受的对象，否则就会导致格式不对，而引起乱码问题。但是为什么必须要指定`responseType`呢？要弄清楚这个问题，首先要了解`responseType`是什么，有什么作用。

> XMLHttpRequest.responseType属性是一个枚举类型的属性，定义返回响应数据的类型。它允许我们手动设置返回数据的类型。如果我们将它设置为一个空字符串，它将使用默认的"text"类型。（详细信息可参考文章最后的参考链接）

`responseType`取值如下图：

![resType](http://qncdn.yunishare.cn/resType.png@water)



以下是传`arraybuffer`和blob两种不同类型的`responseType`，打印的数据结果。

 

`blob:`

![img](http://qncdn.yunishare.cn/blob-type.png@water)



`arraybuffer:`

![img](http://qncdn.yunishare.cn/arraybuffer-type.png@water)

从具体的解释可以看出，后端返回数据的类型，都依赖这个参数指定的类型，默认是 ""。而我们使用的`axios`中对应的默认值是是`json`，所以我们在不指定的情况下，由于返回的格式不匹配，导致我们转`blob`后出现乱码。

我们还可以对下载文档的方法进一步精简，上述方法是先拿到`arraybuffer`对象，然后再转Blob，之后再通过`createObjectURL`方法创建URL。既然我们可以通过 `responseType`指定返回的数据类型，为什么不直接设置`responseType`值为blob，这样就减少了转换的过程。优化后代码如下：

```javascript
/**
 * 文件xls下载
 * @param {Blob} blob Blob对象
 * @param {String} fileName 导出的文件名
 */
downloadXls(blob, fileName) {
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    // 清楚数据
    document.body.removeChild(a);
    a = null;
    URL.revokeObjectURL(url);
}
```



#### 扩展阅读

**[什么是ArrayBuffer，Blob，File? 他们有什么区别和联系？](/2020/05/article.html)**

