import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as a,o as c,c as l,a as i,b as n,d as s,e,w as u,f as r}from"./app-d75e961b.js";const d={},k=n("h3",{id:"背景",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#背景","aria-hidden":"true"},"#"),s(" 背景")],-1),m=n("p",null,"最近开发项目中使用后端提供的post接口导出csv表格时，遇到了导出的表格乱码的问题。之前所做的导出功能，基本都是通过浏览器get方式直接访问即可，此次通过在浏览器直接拼接参数进行请求导出的文档确实是正常的，而采取直接post请求接口的方式导出时，导出的文档出现了乱码。",-1),b=n("code",null,"Blob",-1),v=n("code",null,"URL.createObjectURL",-1),f=n("code",null,"BIob",-1),y={href:"http://localhost:8080/5b34ce1c-0c3c-4b4d-9cf2-d9f5c0800833",target:"_blank",rel:"noopener noreferrer"},h=r(`<h4 id="导出代码" tabindex="-1"><a class="header-anchor" href="#导出代码" aria-hidden="true">#</a> 导出代码</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 文件xls下载
* <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> <span class="token parameter">stream</span> 二进制流对象
* <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> <span class="token parameter">fileName</span> 导出的文件名
*/</span>
<span class="token function">downloadXls</span><span class="token punctuation">(</span><span class="token parameter">stream<span class="token punctuation">,</span> fileName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
     <span class="token keyword">const</span> blob <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Blob</span><span class="token punctuation">(</span><span class="token punctuation">[</span>stream<span class="token punctuation">]</span><span class="token punctuation">)</span>
     <span class="token keyword">let</span> url <span class="token operator">=</span> <span class="token constant">URL</span><span class="token punctuation">.</span><span class="token function">createObjectURL</span><span class="token punctuation">(</span>blob<span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token keyword">let</span> a <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">&#39;a&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     a<span class="token punctuation">.</span>style<span class="token punctuation">.</span>display <span class="token operator">=</span> <span class="token string">&#39;none&#39;</span><span class="token punctuation">;</span>
     a<span class="token punctuation">.</span>href <span class="token operator">=</span> url<span class="token punctuation">;</span>
     a<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;download&#39;</span><span class="token punctuation">,</span> fileName<span class="token punctuation">)</span><span class="token punctuation">;</span>
     document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
     a<span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
     <span class="token comment">// 清除数据</span>
     document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
     a <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
     <span class="token constant">URL</span><span class="token punctuation">.</span><span class="token function">revokeObjectURL</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是，这种常用的导出方式，如果不做设置，很有可能出现乱码的情况。要解决乱码问题，请求的时候需在请求中指定<code>responseType</code>，其类型为<code>ArrayBuffer</code>或者<code>Blob</code>。由以上的导出方法我们可以看出，我们是先将二进制流转换为<code>Blob</code>，然后再做的进一步处理。所以，传回的二进制流对象必须是Blob构造函数接受的对象，否则就会导致格式不对，而引起乱码问题。但是为什么必须要指定<code>responseType</code>呢？要弄清楚这个问题，首先要了解<code>responseType</code>是什么，有什么作用。</p><blockquote><p>XMLHttpRequest.responseType属性是一个枚举类型的属性，定义返回响应数据的类型。它允许我们手动设置返回数据的类型。如果我们将它设置为一个空字符串，它将使用默认的&quot;text&quot;类型。（详细信息可参考文章最后的参考链接）</p></blockquote><p><code>responseType</code>取值如下图：</p><figure><img src="http://qncdn.yunishare.cn/resType.png@water" alt="resType" tabindex="0" loading="lazy"><figcaption>resType</figcaption></figure><p>以下是传<code>arraybuffer</code>和blob两种不同类型的<code>responseType</code>，打印的数据结果。</p><p><code>blob:</code></p><figure><img src="http://qncdn.yunishare.cn/blob-type.png@water" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p><code>arraybuffer:</code></p><figure><img src="http://qncdn.yunishare.cn/arraybuffer-type.png@water" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>从具体的解释可以看出，后端返回数据的类型，都依赖这个参数指定的类型，默认是 &quot;&quot;。而我们使用的<code>axios</code>中对应的默认值是是<code>json</code>，所以我们在不指定的情况下，由于返回的格式不匹配，导致我们转<code>blob</code>后出现乱码。</p><p>我们还可以对下载文档的方法进一步精简，上述方法是先拿到<code>arraybuffer</code>对象，然后再转Blob，之后再通过<code>createObjectURL</code>方法创建URL。既然我们可以通过 <code>responseType</code>指定返回的数据类型，为什么不直接设置<code>responseType</code>值为blob，这样就减少了转换的过程。优化后代码如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 文件xls下载
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Blob<span class="token punctuation">}</span></span> <span class="token parameter">blob</span> Blob对象
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> <span class="token parameter">fileName</span> 导出的文件名
 */</span>
<span class="token function">downloadXls</span><span class="token punctuation">(</span><span class="token parameter">blob<span class="token punctuation">,</span> fileName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> url <span class="token operator">=</span> <span class="token constant">URL</span><span class="token punctuation">.</span><span class="token function">createObjectURL</span><span class="token punctuation">(</span>blob<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> a <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span><span class="token string">&#39;a&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    a<span class="token punctuation">.</span>style<span class="token punctuation">.</span>display <span class="token operator">=</span> <span class="token string">&#39;none&#39;</span><span class="token punctuation">;</span>
    a<span class="token punctuation">.</span>href <span class="token operator">=</span> url<span class="token punctuation">;</span>
    a<span class="token punctuation">.</span><span class="token function">setAttribute</span><span class="token punctuation">(</span><span class="token string">&#39;download&#39;</span><span class="token punctuation">,</span> fileName<span class="token punctuation">)</span><span class="token punctuation">;</span>
    document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
    a<span class="token punctuation">.</span><span class="token function">click</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 清楚数据</span>
    document<span class="token punctuation">.</span>body<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>
    a <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token constant">URL</span><span class="token punctuation">.</span><span class="token function">revokeObjectURL</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="扩展阅读" tabindex="-1"><a class="header-anchor" href="#扩展阅读" aria-hidden="true">#</a> 扩展阅读</h4>`,15);function g(_,w){const t=a("ExternalLinkIcon"),p=a("RouterLink");return c(),l("div",null,[k,m,i(" more "),n("p",null,[s("post接口导出的实现：后端返回的是文件流，采用的是将后端返回的文件流转换为"),b,s("对象，然后使用"),v,s("方法，将"),f,s('对象转化为对象URL,此URL为指向源Blob对象的字符串，产生的URL通常像这样："blob:'),n("a",y,[s("http://localhost:8080/5b34ce1c-0c3c-4b4d-9cf2-d9f5c0800833"),e(t)]),s('" 可以看成是生成的一个唯一的标识，指向源对象。 然后，将此URL赋值到一个a标签上，指定download属性，即可通过click()触发下载。')]),h,n("p",null,[n("strong",null,[e(p,{to:"/2020/05/article.html"},{default:u(()=>[s("什么是ArrayBuffer，Blob，File? 他们有什么区别和联系？")]),_:1})])])])}const R=o(d,[["render",g],["__file","fix-download-file-error-by-config-responsetype.html.vue"]]);export{R as default};