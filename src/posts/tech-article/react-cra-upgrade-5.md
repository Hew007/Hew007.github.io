---
title: 将React项目CRA从3.x升级到5.0
date:  2022-02-07
updateDate: 2023-03-09
category:
- 知识点
- 技术
- React
tag:
- cra
- react
- create-react-app5.0
---

## 将React项目CRA从3.x升级到5.0
前置知识cra各版本日志：[https://github.com/facebook/create-react-app/releases](https://github.com/facebook/create-react-app/releases)

webpack5升级注意事项：
[https://webpack.docschina.org/migrate/5/#preparations](https://webpack.docschina.org/migrate/5/#preparations)

[https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/#syntax-deprecated](https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/#syntax-deprecated)

### 注意事项

* 建议使用低版本node的项目，先升级node版本，再升级cra
* 如果项目CRA为3.x的版本、建议先升级到4.x版本，再升级5.0版本。

## 升级过程
<!---more--->
项目升级为了稳妥起见，采用渐进升级，即先从当前的CRA3.4 =>4.0 =>5.0的方式，以下是整个升级和解决问题过程记录，供大家参考。

### 升级4.0.1

升级依赖包：react-script =>4.0.1，customize-cra => 1.0移除依赖包： 移除低版本eslint

> 原因：`react-scripts 4 package provided by Create React App requires a dependency: eslint": "^7.11.0"`

问题：

升级后项目的sass background的`url`引用出现问题，导致解析成错误路径（报错：`Error: Can't resolve '../../../gss-bi/images/xxx/xxxx.png`'）。由于项目url引用的图片都是/xxx-project/images/xxx的绝对路径，所以不需要webpack进行处理。

解决方案： 重写css-loader配置 忽略css中url解析

相关文档：

相似问题：[https://github.com/facebook/create-react-app/issues/9870](https://github.com/facebook/create-react-app/issues/9870)

webpack配置：[https://www.webpackjs.com/loaders/css-loader/#url](https://www.webpackjs.com/loaders/css-loader/#url)

### 升级5.0

升级包：react-script =>5.0

问题1：`Cannot read properties of undefined (reading 'tap') `

排查：原因为 `hard-source-webpack-plugin` 的问题，这个包太老了，考虑替换其他包，暂时移除了这个包（webpack5废弃了hard-source-webpack-plugin使用，可以使用webpack新增的cache属性替代）

问题2： `Relative imports outside of src/ are not supported. You can either move it inside src/ `.

原因为：weppack新版不支持`src`之外的导入，之所以报错，是因为项目有直接引用`node_module`的引用，修改其引用方式即可。

相关issue讨论：[https://github.com/facebook/create-react-app/issues/4177](https://github.com/facebook/create-react-app/issues/4177)

问题3：`Error: Can't resolve 'util' `，`Error: Can't resolve 'stream' in '/home/hew/work/other/sitesense-react/node_modules/jszip/lib'`

原因：webpack5版本开始不再为 Node.js 模块 自动引用 Polyfills `webpack < 5 used to include polyfills for node.js core modules by default` 

解决方案： 根据提示安装相关模块即可。比如我们的项目涉及的node模块的包：`util`, `assert`, `stream`等。

需要导出的node包：[https://webpack.js.org/configuration/resolve/#resolvefallback](https://webpack.js.org/configuration/resolve/#resolvefallback)

该问题相关issue讨论：[https://stackoverflow.com/questions/64402821/module-not-found-error-cant-resolve-util-in-webpack](https://stackoverflow.com/questions/64402821/module-not-found-error-cant-resolve-util-in-webpack)

问题：`Should not import the named export 'version' (imported as 'version') from default-exporting module` 这个是package.json 版本version导入的问题 。可参考下面的方案解决

    // 新的规范不支持这种引入方式：
    import { version } form './package.json'
    
    console.log(version)
    // 请使用如下方式代替
    impor pkg from './package.json'
    console.log(version)


注意：如果第三方包使用了老的version引入方式，则需要升级对应的新版本包。比如我们项目中使用的amap-js，antd等，都进行了相应的升级。（这两个包老版本使用了旧的version导入）

报错：ERROR in ./node_modules/rc-field-form/node_modules/@babel/runtime/helpers/esm/createSuper类似的错误，具体原因可能是node_module包问题， 安装新版babel/runtime解决。

另外一种解决方案，安装@babel/runtime: [https://stackoverflow.com/questions/57737270/how-to-fix-module-not-found-cant-resolve-babel-runtime-helpers-objectwitho](https://stackoverflow.com/questions/57737270/how-to-fix-module-not-found-cant-resolve-babel-runtime-helpers-objectwitho)

问题：Error: Failed to load parser '@typescript-eslint/parser' declared in '.eslintrc.js

解决：安装新版@typescript-eslint/eslint-plugin @typescript-eslint/parsercra已集成eslint-config-react-app 故也卸载掉

其他方案：[https://github.com/facebook/create-react-app/issues/10502](https://github.com/facebook/create-react-app/issues/10502)
[https://github.com/facebook/create-react-app/issues/8936](https://github.com/facebook/create-react-app/issues/8936)

问题： classnames 报错解决方案：将`import * as classNames from 'classnames'` 替换为`import classNames from 'classnames'`解决

问题：枚举报错：声明一个枚举有错误提示：xxx is assigned a value but never used解决：针对ts在某些情况下，ESLint 本身提供了规则，但不支持 TypeScript 语法，提供插件用以支持。

将下面的规则直接放入你的rule即可：

    {
      // note you must disable the base rule as it can report incorrect errors
      "no-unused-vars": "off", 
       "@typescript-eslint/no-unused-vars": ["error"]
    }

参考：[https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md)

其他问题: eslint/ts报错，修改代码修复即可
