---
title: 前端利用Blob下载网页中的视频、音频或图片等文件
date: 2020-07-02 08:32:28
category:
- 知识点
- 技术
tag:
- Blob
- 文件下载
- 下载图片
- 下载视频
---


### 前言

在网页中，下载文件我们一般都是使用a标签指定其download属性来下载文件，比如下载excel，pdf等类型的文件，是没有任何问题的。但是，当文件链接为图片、视频或者音频类型时，此时，download属性便失效了，此时，点击a标签对应的下载链接，浏览器便会打开此文件，进行播放或者展示。遇到此种情况该如何处理呢？
<!-- more -->
### 指定请求类型

我们知道，使用ajax请求，我们可以指定`responseType`，来控制返回数据类型。当我们请求图片、视频等这类文件时，服务的返回的是对应的文件流，此时，我们只需要通过指定请求的responseType为Blob类型，服务器响应便会返回一个Blob类型的二进制对象。可参考另一篇文章：[指定responseType解决利用Blob对象导出文件乱码问题](/2020/05/指定responseType解决利用Blob对象导出文件乱码问题.html)。



### 转为对象URL下载

当我们拿到Blob对象，便可以利用`URL.createObjectURL`方法，将`BIob`对象转化为对象URL，此URL为指向源Blob对象的字符串，产生的URL通常像这样：`blob:http://localhost:8080/5b34ce1c-0c3c-4b4d-9cf2-d9f5c0800833`(这是本地服务生成结果)，我们可以看成是生成的一个唯一的标识，指向源对象。 然后，将此URL赋值到一个a标签上，指定download属性，即可通过click()触发下载，这样，浏览器就不会将其识别为可播放或的视频或者可以展示的图片进行处理了。

代码示例：

```javascript
// 使用axios请求示例

axios.get('/images/test.mp4', {}, {
	responseType: 'blob'
}).then(res => {
    console.log(res) // 打印为Blob对象
    // 下载此二进制文件
    downloadFileByBlob(res, test.mp4);
});


/**
 * blob文件xls下载
* @param {Object} blob 二进制blob对象
* @param {String} fileName 导出的文件名
*/
downloadFileByBlob(blob, fileName) {
     const url = URL.createObjectURL(blob);
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

