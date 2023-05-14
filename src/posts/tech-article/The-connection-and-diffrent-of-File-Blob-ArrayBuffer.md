---
title: File、Blob、ArrayBuffer等文件类的对象有什么区别和联系
date: 2021-03-13 20:12:13
category:
- 知识点
- 技术
tag:
- File
- Blob
- ArrayBuffer
- 文件处理
- 二进制文件
---

## 前言

在前端中处理文件时会经常遇到File、Blob、ArrayBuffer以及相关的处理方法或方式如FileReader、FormData等等这些名词，对于这些常见而又不常见的名词，我相信大多数人对它们都有一种熟悉的陌生人的感觉。究其原因，相关的东西接触的不够多，且每次都网上随手拈来，不求甚解。今天，我们就稍微仔细一点，去做一个探究，弄清他们是谁，能做什么，又有什么区别，
<!-- more -->
争取下次再见既是“老朋友”。如果，你想更深入的了解相关知识点，可以参阅w3c和MDN的解释，文后会附上相关的参考链接供参考。

## 内容

### File

#### 定义/概念

File即我们通常所说的文件，我们硬盘里存储的音视频、文档等等都是文件。我们通常使用`<input type="file">`来选取并读取本地计算机中的文件，返回一个Filelist对象，此对象为一个类数组可迭代对象。File对象是特殊类型的Blob,所以顺便也继承了Blob特有的方法和属性,同时又有自己独特的属性和方法。

> MDN定义：文件（**`File`**）接口提供有关文件的信息，并允许网页中的 JavaScript 访问其内容。通常情况下， `File` 对象是来自用户在一个 [`<input>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input) 元素上选择文件后返回的 [`FileList`](https://developer.mozilla.org/zh-CN/docs/Web/API/FileList) 对象,也可以是来自由拖放操作生成的 [`DataTransfer`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer) 对象，或者来自 [`HTMLCanvasElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement) 上的 `mozGetAsFile`() API。

#### 用法/示例

File常用的属性有：

 `File.name` 只读,返回当前File 对象所引用文件的名称。

 `File.size` 只读,返回当前File 对象文件的大小。

 `File.type` 只读,返回文件的多用途互联网邮件扩展类型（MIME Type）

更多属性及方法信息可参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/File),这里就不再详细赘述。

FileList:  `<input type="file">` 元素有一个files属性,用来存储用户所选择的文件,当用户点击选择文件按钮之后，便可以获取到选择的文件组成的FileList对象。

```js
const fileList = document.getElementById('file').files;
console.log(fileList);
```

![结果](http://qncdn.yunishare.cn/fileList.png@water)

在这几个当中，File应该是我们使用的频率最高的一个，应该也是最熟悉的一个，所以过多的内容这里就不一一示例。这里引入一个很久之前遇到的一个相关的IE兼容性问题。

*input[type=file]这个文件上传原生按钮不够美观，通常都是采取隐藏此原生的按钮，使用另外一个自定义的按钮，然后，通过点击此按钮间接触发隐藏的原生按钮，从而实现这一功能。但是，由于IE安全限制，我们间接通过clik()触发的，在IE9某些版本就会报`SCRIPT: 拒绝访问`的错误。解决这个问题，要主动触发上传按钮，此时借助label的for属性，绑定到对应的input上即可解决此问题。*

### Blob

#### 定义/概念

Blob是`Binary Large Object`的缩写，表示二进制大对象，它并不是前端的所特有对象，而是计算机界的通用术语，在一些数据库中，例如，MYSQL中的BLOB类型就表示二进制数据的容器。MDN上对其的定义是：`Blob` 对象表示一个不可变、原始数据的类文件对象。可以通俗的说，Blob就是一只读的二进制对象。从File的介绍我们已知File继承自Blob，有许多相同的方法和属性，因此可以像操作File对象一样操作Blob对象。

#### 用法/示例

Blob主要包含两个属性

- `Blob.size`：只读，对象中所包含数据的大小（字节）
- `Blob.type`：只读，一个字符串，表明该 `Blob` 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串。（[MIME类型参考](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)）

创建一个Blob对象，需要调用Blob构造函数。

```javascript
/**
* @param {Array} array 一个由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的数组
* @param {Object} options 一个可选的BlobPropertyBag字典
*/
function Blob( array, options ){};

```

> *array* 是一个由`ArrayBuffer`, `ArrayBufferView`, `Blob`, `DOMString` 等对象构成的 `Array` ，或者其他类似对象的混合体，它将会被放进 `Blob`。`DOMStrings`会被编码为UTF-8。
>
> *options* 是一个可选的`BlobPropertyBag`字典，它可能会指定如下两个属性：
>
> - `type`，默认值为 `""`，它代表了将会被放入到blob中的数组内容的MIME类型。
> - `endings`，默认值为`"transparent"`，用于指定包含行结束符`\n`的字符串如何被写入。 它是以下两个值中的一个： `"native"`，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 `"transparent"`，代表会保持blob中保存的结束符不变 

使用示例：

```javascript
const data1 = "a";
const data2 = "b";
const data3 = "<div style='color:red;'>This is a blob</div>";
const data4 = { "name": "abc" };
// 创建blob对象
const blob1 = new Blob([data1]);
const blob2 = new Blob([data1, data2]);
const blob3 = new Blob([data3], {type : 'text/html'});
const blob4 = new Blob([JSON.stringify(data4)]);
const blob5 = new Blob([data4]);
const blob6 = new Blob([data3, data4]);

console.log(blob1);  //输出：Blob {size: 1, type: ""}
console.log(blob2);  //输出：Blob {size: 2, type: ""}
console.log(blob3);  //输出：Blob {size: 44, type: "text/html"}
console.log(blob4);  //输出：Blob {size: 14, type: ""}
console.log(blob5);  //输出：Blob {size: 15, type: ""}
console.log(blob6);  //输出：Blob {size: 59, type: ""}
```

以上blob5的size值打印为什么是15呢？原因是，当使用普通对象创建Blob对象时，相当于调用了普通对象的`toString()`方法得到字符串数据，然后再创建Blob对象。所以，blob5保存的数据是`"[object Object]"`，是15个字节(不包含最外层的引号)。

Blob目前有四个方法：

`Blob.slice([start[, end[, contentType]]])`：返回一个新的 `Blob` 对象，包含了源 `Blob` 对象中指定范围内的数据。（由于File继承自Blob，可用此方法分割本地文件，实现分片上传）

`Blob.stream()`：返回一个能读取blob内容的 `ReadableStream`。

`Blob.text()`：返回一个promise且包含blob所有内容的UTF-8格式的 `USVString`。

`Blob.arrayBuffer()`：返回一个promise且包含blob所有内容的二进制格式的 `ArrayBuffer` 

### ArrayBuffer

#### 定义/概念

你从XHR、File API、Canvas等等各种地方，读取了一大串字节流，如果用JS里的Array去存，又浪费，又低效。
于是为了配合这些新的API增强JS的二进制处理能力，就有了ArrayBuffer。

`ArrayBuffer`简单说就是一片内存，表示原始二进制数据缓冲区。但不能直接操作它，而是要通过[类型数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)`TypedArray`或 `DataView` （数据视图）对象来操作它，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。`TypedArray`给`ArrayBuffer`提供了一个“`View`”，对它们进行下标读写。也可以使用[DataView](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/DataView)来读写`ArrayBuffer`，`DataView`能更自由的选择字节序，不用考虑不同平台的字节序问题。

> MDN将**`ArrayBuffer`** 对象定义为用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个字节数组，通常在其他语言中称为“byte array”。

#### 用法示例

由于`ArrayBuffer`不能直接进行操作，故需要借助`TypedArray`或者`DataView`来进行读写。

```javascript
// 生成一个可以16个字节的连续内存，每个字节的默认值是0
const buffer = new ArrayBuffer(16);

// TypedArray 使用标准数组语法来获取和设置属性值
var int16 = new Int16Array(2);
int16[0] = 42;
console.log(int16[0]); // 42

const buffer = new ArrayBuffer(16);
const a = new Uint8Array(buffer); // 建立Uint8Array视图
const b = new Int32Array(buffer); // 建立Int32Array视图
a[0] = 1;
b[0] = 2;
// 由于两个视图是对应的是同一段内存，所以其中一个视图更改了内存，会影响到另一个视图
a[0]; // 2

```

## 结语

### 区别/联系

##### File和Blob

- 相同点： File和Blob都可以用来表示类文件对象，处理文件；

- FIle:  File可以看作一个承载文件的桥梁，将DOM接口和文件联系起来，通过File这个桥梁，获取计算及内的文件，从而对才能对文件做进一步处理。

- Blob：File继承自Blob，他们之间很方便进行转换，Blob是File都原型对象。

- 联系：File继承自Blob，同时又有自己独特的属性和方法。从下面的打印可以看出，其实Blob对象就是File的原型对象，自然就拥有了Blob对象的方法和属性。

  ```html
  <input type="file" id="myfiles" />
  ```
  ```javascript
  const fileDOM = document.querySelector("#myfiles");
  const fileChange = (e) => {
    const files = fileDOM.files;
    console.log(files[0].__proto__) // 输出File
    console.log(files[0].__proto__.__proto__) // 输出Blob
  }
  fileDOM.onchange = fileChange;
  ```

  

##### Blob与ArrayBuffer

- 相同点： `Blob`和`ArrayBuffer`都是二进制的容器。

- ArrayBuffer：`ArrayBuffer`更底层，是一段纯粹的内存上的二进制数据，我们可以对其任何一个字节进行单独的修改，也可以根据我们的需要以我们指定的形式读取指定范围的数据。

- Blob：`Blob`就是将二进制数据做了一个封装，我们拿到的就是一个整体，可以看到它的整体属性大小、类型；可以对其分割，但看不到它内部的细节

- 联系：`Blob`可以接受一个`ArrayBuffer`作为参数生成一个`Blob`对象，此行为就相当于对`ArrayBuffer`数据做一个封装。

- 应用上的区别：由于`ArrayBuffer`和`Blob`的特性，`Blob`作为一个整体文件，适合用于文件传输；而只有需要关注细节（比如要修改某一段数据时），此时使用`ArrayBuffer`比较好。

  

从以上我们的介绍以及联系，我们可以得出如下的转换函数

```javascript
/**
** file转blob
* @param {FileList} files fileList对象
* @param {String} type MIME类型
*/
function fileToBlob(files, type=''){
	return new Blob(files, {type});
}
```

```javascript
/**
* blob转arrayBuffer，file转arrayBuffer同理。
* file转arrayBuffer也可通过FileReader,能控制更多交互细节，在此暂不介绍
**
* @param {Blob} blob blob对象
* @return {Promise} Promise对象
*/
function blobToArrayBuffer(blob) {
	return new Promise((resolve, rejejct) => {
		blob.arrayBuffer().then(buffer => {
			resolve(buffer);
		}).catch(err => {
			rejejct(err);
		});
	});
}
```

弄清了他们之间的关系，在以后的工作学习中，才能刚好的去使用这些对象，让其用在最适用的地方。而不是每次都一头雾水，熟悉并陌生着。对于和他们相关的FileReader、Base64、FormData，后续会更新相关内容，将其进行联系起来，更好的理解他们。

### 参考资料

- [MDN Web API 接口参考 - File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)
- [MDN Web API 接口参考 - Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)
- [JavaScript 标准内置对象 - ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [Blob、ArrayBuffer、File、FileReader和FormData的区别](https://www.psvmc.cn/article/2019-09-17-blob-buffer-file.html)
- [细说Web API中的Blob](https://juejin.im/post/59e35d0e6fb9a045030f1f35)