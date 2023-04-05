---
title: 使用 Import 动态导入
date: 2021-02-27 19:21:00
category:
- javascript
- 技术
tag:
- import
- js模块
- 动态导入
---

# 使用 Import 动态导入

我们在使用 import 导入时，绝大部分都是使用的静态的 import 语句，静态的 import 导入会使所有被导入的模块，在加载时就被编译。但是，在有些使用场景中，我们可能希望根据某个条件来进行动态的导入模块。此时就可以使用 import 动态导入代替静态导入。
<!-- more -->
### 静态导入

```javascript
// import 导入示例
import defaultExport from "module-name";
import * as name from "module-name";
import { export } from "module-name";
import { export as alias } from "module-name";
import { export1 , export2 } from "module-name";
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "module-name";
......
```

## 使用场景

- 当静态导入的模块比较明显的阻碍了页面代码加载速度或者占用大量系统资源影响了代码运行速度，并且该模块被使用的可能性很低。
- 当被导入的模块，在加载时并不存在，需要异步获取时。
- 当导入模块的说明符，需要动态构建。
- 当被导入的模块有副作用（这里说的副作用，可以理解为模块中会直接运行的代码），这些副作用只有在触发了某些条件才被需要时。（原则上来说，模块不能有副作用，但是很多时候，你无法控制你所依赖的模块的内容）

> 注意：请不要滥用动态导入（只有在必要情况下采用）。静态框架能更好的初始化依赖，而且更有利于静态分析工具和[tree shaking](https://wiki.developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)发挥作用

## 使用示例

动态 import 导入可以像调用函数一样来动态的导入模块。如下这种方式调用，将返回一个 promise。

```javascript
// 使用promise
import('./my-module.js')
  .then((module) => {
    // Do something with the module.
  	console.log(module);
  });
// 也可以使用await
(async () => {
  let module = await import('./my-module.js');
})();

```

> 注意，当使用动态 import 导入默认导出时，工作原理略有不同。需要从返回的对象中解构并重命名“default”键。

```javascript
(async () => {
  if (somethingIsTrue) {
    const { default: myDefault, foo, bar } = await import('/modules/my-module.js');
  }
})();
```

## 兼容性

除IE，绝大多数较新版本主流浏览器都支持动态导入
![image.png](https://cdn.nlark.com/yuque/0/2021/png/2400472/1614424582599-d71afb4f-1fee-4f8f-8a5d-f5c55f955db1.png#align=left&display=inline&height=363&margin=%5Bobject%20Object%5D&name=image.png&originHeight=726&originWidth=1621&size=134567&status=done&style=none&width=810.5)











