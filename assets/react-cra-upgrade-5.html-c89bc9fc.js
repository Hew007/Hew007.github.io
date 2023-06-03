import{_ as a,X as n,Y as c,$ as e,a0 as o,a1 as r,Z as l,a2 as s,H as p}from"./framework-479237b0.js";const i={},d=e("h2",{id:"将react项目cra从3-x升级到5-0",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#将react项目cra从3-x升级到5-0","aria-hidden":"true"},"#"),o(" 将React项目CRA从3.x升级到5.0")],-1),u={href:"https://github.com/facebook/create-react-app/releases",target:"_blank",rel:"noopener noreferrer"},h={href:"https://webpack.docschina.org/migrate/5/#preparations",target:"_blank",rel:"noopener noreferrer"},_={href:"https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/#syntax-deprecated",target:"_blank",rel:"noopener noreferrer"},b=e("h3",{id:"注意事项",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#注意事项","aria-hidden":"true"},"#"),o(" 注意事项")],-1),m=e("ul",null,[e("li",null,"建议使用低版本node的项目，先升级node版本，再升级cra"),e("li",null,"如果项目CRA为3.x的版本、建议先升级到4.x版本，再升级5.0版本。")],-1),f=e("h2",{id:"升级过程",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#升级过程","aria-hidden":"true"},"#"),o(" 升级过程")],-1),g=s('<p>项目升级为了稳妥起见，采用渐进升级，即先从当前的CRA3.4 =&gt;4.0 =&gt;5.0的方式，以下是整个升级和解决问题过程记录，供大家参考。</p><h3 id="升级4-0-1" tabindex="-1"><a class="header-anchor" href="#升级4-0-1" aria-hidden="true">#</a> 升级4.0.1</h3><p>升级依赖包：react-script =&gt;4.0.1，customize-cra =&gt; 1.0移除依赖包： 移除低版本eslint</p><blockquote><p>原因：<code>react-scripts 4 package provided by Create React App requires a dependency: eslint&quot;: &quot;^7.11.0&quot;</code></p></blockquote><p>问题：</p><p>升级后项目的sass background的<code>url</code>引用出现问题，导致解析成错误路径（报错：<code>Error: Can&#39;t resolve &#39;../../../gss-bi/images/xxx/xxxx.png</code>&#39;）。由于项目url引用的图片都是/xxx-project/images/xxx的绝对路径，所以不需要webpack进行处理。</p><p>解决方案： 重写css-loader配置 忽略css中url解析</p><p>相关文档：</p>',8),k={href:"https://github.com/facebook/create-react-app/issues/9870",target:"_blank",rel:"noopener noreferrer"},w={href:"https://www.webpackjs.com/loaders/css-loader/#url",target:"_blank",rel:"noopener noreferrer"},x=s('<h3 id="升级5-0" tabindex="-1"><a class="header-anchor" href="#升级5-0" aria-hidden="true">#</a> 升级5.0</h3><p>升级包：react-script =&gt;5.0</p><p>问题1：<code>Cannot read properties of undefined (reading &#39;tap&#39;) </code></p><p>排查：原因为 <code>hard-source-webpack-plugin</code> 的问题，这个包太老了，考虑替换其他包，暂时移除了这个包（webpack5废弃了hard-source-webpack-plugin使用，可以使用webpack新增的cache属性替代）</p><p>问题2： <code>Relative imports outside of src/ are not supported. You can either move it inside src/ </code>.</p><p>原因为：weppack新版不支持<code>src</code>之外的导入，之所以报错，是因为项目有直接引用<code>node_module</code>的引用，修改其引用方式即可。</p>',6),v={href:"https://github.com/facebook/create-react-app/issues/4177",target:"_blank",rel:"noopener noreferrer"},y=s("<p>问题3：<code>Error: Can&#39;t resolve &#39;util&#39; </code>，<code>Error: Can&#39;t resolve &#39;stream&#39; in &#39;/home/hew/work/other/sitesense-react/node_modules/jszip/lib&#39;</code></p><p>原因：webpack5版本开始不再为 Node.js 模块 自动引用 Polyfills <code>webpack &lt; 5 used to include polyfills for node.js core modules by default</code></p><p>解决方案： 根据提示安装相关模块即可。比如我们的项目涉及的node模块的包：<code>util</code>, <code>assert</code>, <code>stream</code>等。</p>",3),j={href:"https://webpack.js.org/configuration/resolve/#resolvefallback",target:"_blank",rel:"noopener noreferrer"},C={href:"https://stackoverflow.com/questions/64402821/module-not-found-error-cant-resolve-util-in-webpack",target:"_blank",rel:"noopener noreferrer"},q=e("p",null,[o("问题："),e("code",null,"Should not import the named export 'version' (imported as 'version') from default-exporting module"),o(" 这个是package.json 版本version导入的问题 。可参考下面的方案解决")],-1),E=e("pre",null,[e("code",null,`// 新的规范不支持这种引入方式：
import { version } form './package.json'

console.log(version)
// 请使用如下方式代替
impor pkg from './package.json'
console.log(version)
`)],-1),R=e("p",null,"注意：如果第三方包使用了老的version引入方式，则需要升级对应的新版本包。比如我们项目中使用的amap-js，antd等，都进行了相应的升级。（这两个包老版本使用了旧的version导入）",-1),N=e("p",null,"报错：ERROR in ./node_modules/rc-field-form/node_modules/@babel/runtime/helpers/esm/createSuper类似的错误，具体原因可能是node_module包问题， 安装新版babel/runtime解决。",-1),S={href:"https://stackoverflow.com/questions/57737270/how-to-fix-module-not-found-cant-resolve-babel-runtime-helpers-objectwitho",target:"_blank",rel:"noopener noreferrer"},V=e("p",null,"问题：Error: Failed to load parser '@typescript-eslint/parser' declared in '.eslintrc.js",-1),A=e("p",null,"解决：安装新版@typescript-eslint/eslint-plugin @typescript-eslint/parsercra已集成eslint-config-react-app 故也卸载掉",-1),B={href:"https://github.com/facebook/create-react-app/issues/10502",target:"_blank",rel:"noopener noreferrer"},L={href:"https://github.com/facebook/create-react-app/issues/8936",target:"_blank",rel:"noopener noreferrer"},z=e("p",null,[o("问题： classnames 报错解决方案：将"),e("code",null,"import * as classNames from 'classnames'"),o(" 替换为"),e("code",null,"import classNames from 'classnames'"),o("解决")],-1),I=e("p",null,"问题：枚举报错：声明一个枚举有错误提示：xxx is assigned a value but never used解决：针对ts在某些情况下，ESLint 本身提供了规则，但不支持 TypeScript 语法，提供插件用以支持。",-1),T=e("p",null,"将下面的规则直接放入你的rule即可：",-1),Y=e("pre",null,[e("code",null,`{
  // note you must disable the base rule as it can report incorrect errors
  "no-unused-vars": "off", 
   "@typescript-eslint/no-unused-vars": ["error"]
}
`)],-1),F={href:"https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md",target:"_blank",rel:"noopener noreferrer"},H=e("p",null,"其他问题: eslint/ts报错，修改代码修复即可",-1);function O(P,U){const t=p("ExternalLinkIcon");return n(),c("div",null,[d,e("p",null,[o("前置知识cra各版本日志："),e("a",u,[o("https://github.com/facebook/create-react-app/releases"),r(t)])]),e("p",null,[o("webpack5升级注意事项： "),e("a",h,[o("https://webpack.docschina.org/migrate/5/#preparations"),r(t)])]),e("p",null,[e("a",_,[o("https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/#syntax-deprecated"),r(t)])]),b,m,f,l("-more-"),g,e("p",null,[o("相似问题："),e("a",k,[o("https://github.com/facebook/create-react-app/issues/9870"),r(t)])]),e("p",null,[o("webpack配置："),e("a",w,[o("https://www.webpackjs.com/loaders/css-loader/#url"),r(t)])]),x,e("p",null,[o("相关issue讨论："),e("a",v,[o("https://github.com/facebook/create-react-app/issues/4177"),r(t)])]),y,e("p",null,[o("需要导出的node包："),e("a",j,[o("https://webpack.js.org/configuration/resolve/#resolvefallback"),r(t)])]),e("p",null,[o("该问题相关issue讨论："),e("a",C,[o("https://stackoverflow.com/questions/64402821/module-not-found-error-cant-resolve-util-in-webpack"),r(t)])]),q,E,R,N,e("p",null,[o("另外一种解决方案，安装@babel/runtime: "),e("a",S,[o("https://stackoverflow.com/questions/57737270/how-to-fix-module-not-found-cant-resolve-babel-runtime-helpers-objectwitho"),r(t)])]),V,A,e("p",null,[o("其他方案："),e("a",B,[o("https://github.com/facebook/create-react-app/issues/10502"),r(t)]),e("a",L,[o("https://github.com/facebook/create-react-app/issues/8936"),r(t)])]),z,I,T,Y,e("p",null,[o("参考："),e("a",F,[o("https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unused-vars.md"),r(t)])]),H])}const Z=a(i,[["render",O],["__file","react-cra-upgrade-5.html.vue"]]);export{Z as default};