---
title: js上传文件夹 H5
date:  2017-11-29 19:22:12
category:
- 知识点
- 技术
tag:
- 文件上传
- 文件夹上传
- 批量上传
---

> 前言：本文摘自我的个人cnblog博客（原文发表于2017年），并在原来的基础上进行修改，主要阐述通过一个属性即可开启浏览器中网页文件夹上传，更准确的说是input[type=file]的一个属性。本文只是做一个简单的知识点记录。

### 背景

当时公司所在项目，有一个文件上传小需求，要求上传文件要可以同时选择文件及文件夹，文件可以多选。如果选择文件夹即默认将文件夹内的文件全部上传。当时想到的唯一解决方案就是便利所选文件夹内的文件，然后进行上传，但始终觉得此方案不是太好，冥冥之中感觉应该是有现成的解决方案的。借助于搜索引擎，当时并未发现其他较好的解决方案，此时，我却记得某些网盘有此功能，遂研究百度网盘文件上传功能。
<!-- more -->
进入百度网盘网页版，发现百度网盘个人主页上还真有上传文件夹的按钮，点击此按钮弹出的资源管理器中（windowsOS)，就可以直接选择文件夹。故推断此功能应该不是js实现的，于是就在html标签属性中下功夫，果不其然，就在百度网盘上传的input type=file 的标签上发现了一个未曾见过的属性“[webkitdirectory](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/webkitdirectory)”，进入MDN一查，果然就是这个属性开启了input的文件夹上传功能。但是，此属性还处在实验非标准 non-standard中，兼容性是最大的问题。2017年当时使用是实际测试仅支持chrome浏览器，而到目前为止，MDN给出的兼容性还算不错，支持chrome、edge、firefox较新版本浏览器。具体信息可以点这里查看：[HTMLInputElement.webkitdirectory](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/webkitdirectory)。

### 示例

下面的示例将展示一个或多个选择文件夹，触发change事件后，将选择的文件的文件名显示在列表中进行展示。(摘自MDN)

#### HTML


```html
<input type="file" id="filepicker" name="fileList" webkitdirectory multiple />
<ul id="listing"></ul>
```

#### Javascript


```js
document.getElementById("filepicker").addEventListener("change", function(event) {
  let output = document.getElementById("listing");
  let files = event.target.files;

  for (let i=0; i<files.length; i++) {
    let item = document.createElement("li");
    item.innerHTML = files[i].name;
    output.appendChild(item);
  };
}, false);
```



#### 结语

对于目前要实现上传文件夹功能，此属性可作为一个选择，但要追求兼容各浏览器，恐怕要曲线救国，采用其他方式和了。其实，我们都可以参考百度网盘网页版做法，对支持此属性的浏览器则显示上传文件夹选项，如果不支持此属性则不显示上传文件夹选项，从而做到一定的兼容。
