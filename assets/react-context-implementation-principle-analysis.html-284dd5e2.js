const t=JSON.parse('{"key":"v-19ebc2b8","path":"/posts/tech-article/react-context-implementation-principle-analysis.html","title":"React Context 实现原理解析","lang":"zh-CN","frontmatter":{"title":"React Context 实现原理解析","date":"2023-07-09T00:00:00.000Z","description":"React Context 的用法，优化以及实现原理解析","category":["React","javascript"],"tag":["React context","Context","源码","解析"],"head":[["meta",{"property":"og:url","content":"https://blog.yunishare.cn/posts/tech-article/react-context-implementation-principle-analysis.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"React Context 实现原理解析"}],["meta",{"property":"og:description","content":"React Context 的用法，优化以及实现原理解析"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-07-09T02:09:18.000Z"}],["meta",{"property":"article:author","content":"Hew.iShare"}],["meta",{"property":"article:tag","content":"React context"}],["meta",{"property":"article:tag","content":"Context"}],["meta",{"property":"article:tag","content":"源码"}],["meta",{"property":"article:tag","content":"解析"}],["meta",{"property":"article:published_time","content":"2023-07-09T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-07-09T02:09:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"React Context 实现原理解析\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-09T00:00:00.000Z\\",\\"dateModified\\":\\"2023-07-09T02:09:18.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Hew.iShare\\",\\"url\\":\\"https://blog.yunishare.cn/blog\\"}]}"]]},"headers":[{"level":3,"title":"什么是 React Context？","slug":"什么是-react-context","link":"#什么是-react-context","children":[]},{"level":3,"title":"Context API 概览及使用","slug":"context-api-概览及使用","link":"#context-api-概览及使用","children":[]},{"level":3,"title":"React Context 的实现原理","slug":"react-context-的实现原理","link":"#react-context-的实现原理","children":[]},{"level":3,"title":"4. Context 的性能优化","slug":"_4-context-的性能优化","link":"#_4-context-的性能优化","children":[]},{"level":3,"title":"参考资料","slug":"参考资料","link":"#参考资料","children":[]}],"git":{"createdTime":1688868558000,"updatedTime":1688868558000,"contributors":[{"name":"Hew","email":"hewei_hn@foxmail.com","commits":1}]},"readingTime":{"minutes":9.76,"words":2928},"filePathRelative":"posts/tech-article/react-context-implementation-principle-analysis.md","localizedDate":"2023年7月9日","excerpt":"<p><strong>本文由我和ChatGTP联合共创，参考资料在文末，如有勘误请指出，如有侵权请联系我删除，谢谢！</strong>\\n<img src=\\"http://qncdn.yunishare.cn/blog/react-context.png@water\\" alt=\\"image.png\\" loading=\\"lazy\\"></p>\\n<h3> 什么是 React Context？</h3>\\n<p><code>Context</code> 是 <code>React</code> 提供的一种跨层级组件通信的机制，它允许你在组件树中共享数据，而不必手动通过 <code>props</code> 一层层传递。</p>"}');export{t as data};