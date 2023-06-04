import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as p,c,b as s,d as n,e,a as i,f as l}from"./app-103a0f43.js";const r={},u={href:"https://react.docschina.org/learn/state-a-components-memory",target:"_blank",rel:"noopener noreferrer"},d=s("strong",null,"数组",-1),k={href:"https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e",target:"_blank",rel:"noopener noreferrer"},m=l(`<p>React内部的每一个<code>state</code>对（即<code>stateX</code>和<code>useStateX</code>）,都会按照hook的调用顺序，被保存在一个数组中。也就是说，每个<code>state</code>对在初次渲染之后其索引都已经固定，下次再次访问时，就可以根据当前的索引，直接取出对应的state。如果代码中state位置是动态的，Hook 的调用顺序发生了改变，就会导致更新时，产生错误。</p><h3 id="usestate-在内部是如何工作的" tabindex="-1"><a class="header-anchor" href="#usestate-在内部是如何工作的" aria-hidden="true">#</a> <code>useState</code> 在内部是如何工作的</h3><p>下面是模拟<code>usestate</code>原理的一个简化版示例</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> componentHooks <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 声明一个数组，用来存储所有state对</span>
<span class="token keyword">let</span> currentHookIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 定义一个索引变量，标识当前应该访问哪个state对</span>

<span class="token comment">// useState 在 React 中是如何工作的（简化版）</span>
<span class="token keyword">function</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token parameter">initialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 取出当前对应的state对</span>
  <span class="token keyword">let</span> pair <span class="token operator">=</span> componentHooks<span class="token punctuation">[</span>currentHookIndex<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pair<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这不是第一次渲染</span>
    <span class="token comment">// 所以 state pair 已经存在</span>
    <span class="token comment">// 将其返回并为下一次 hook 的调用做准备</span>
    currentHookIndex<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> pair<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 这是我们第一次进行渲染</span>
  <span class="token comment">// 所以新建一个 state pair 然后存储它</span>
  pair <span class="token operator">=</span> <span class="token punctuation">[</span>initialState<span class="token punctuation">,</span> setState<span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">setState</span><span class="token punctuation">(</span><span class="token parameter">nextState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当用户发起 state 的变更，</span>
    <span class="token comment">// 把新的值放入 pair 中</span>
    pair<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> nextState<span class="token punctuation">;</span>
    <span class="token function">updateDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 存储这个 pair 用于将来的渲染</span>
  <span class="token comment">// 并且为下一次 hook 的调用做准备</span>
  componentHooks<span class="token punctuation">[</span>currentHookIndex<span class="token punctuation">]</span> <span class="token operator">=</span> pair<span class="token punctuation">;</span>
  currentHookIndex<span class="token operator">++</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> pair<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 在渲染组件之前</span>
  <span class="token comment">// 重置当前 Hook 的下标</span>
  currentHookIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token comment">// 更新 DOM 以匹配输出结果</span>
  <span class="token comment">// 这部分工作由 React 为你完成</span>
  <span class="token operator">...</span><span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>新版文档比之前质量要好很多，有更多例子以及原理性的说明，建议大家再通读一遍，定能有所收获。</p>`,5);function v(b,h){const a=o("ExternalLinkIcon");return p(),c("div",null,[s("p",null,[n("这个问题再hooks刚出现时就有了，最近翻阅官方文档时，发现新版的"),s("a",u,[n("React官方文档"),e(a)]),n("给出了详细的答案，并给出了伪代码实现，这里也做一个复习总结。")]),i(" more "),s("blockquote",null,[s("p",null,[n("在 React 内部，为每个组件保存了一个"),d,n("，其中每一项都是一个 state 对。它维护当前 state 对的索引值，在渲染之前将其设置为 “0”。每次调用 useState 时，React 都会为你提供一个 state 对并增加索引值。你可以在文章 "),s("a",k,[n("React Hooks: not magic, just arrays"),e(a)]),n("中阅读有关此机制的更多信息")])]),m])}const y=t(r,[["render",v],["__file","why-only-call-Hooks-at-the-top-level.html.vue"]]);export{y as default};
