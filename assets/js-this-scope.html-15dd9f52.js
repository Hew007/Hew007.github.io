const t=JSON.parse('{"key":"v-3c51d6cb","path":"/posts/tech-article/js-this-scope.html","title":"javascript中的this","lang":"zh-CN","frontmatter":{"title":"javascript中的this","date":"2020-07-26T20:02:37.000Z","category":["知识点","javascript","技术"],"tag":["this","作用域","this指向"],"description":"js中得this this关键词是JavaScript中最令人疑惑的机制之一。this是非常特殊的关键词标识符，在每个函数的作用域中被自动创建，但它到底指向什么，是一个让大多数开发者始终比较头疼的问题，要弄明白js中this的指向问题，需要很多相关知识得储备和理解，比如作用域、作用域链以及函数的调用执行顺序，还要考虑诸多隐性的this绑定、是否在严格模式中等等。本篇文章不试图把关于this得每一点都去讲的一清二楚，而是，从小点到大的点去总结常见的this指向问题，而关于this指向的小点，只不过是大点的一个特殊例子而已。","head":[["meta",{"property":"og:url","content":"https://blog.yunishare.cn/posts/tech-article/js-this-scope.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"javascript中的this"}],["meta",{"property":"og:description","content":"js中得this this关键词是JavaScript中最令人疑惑的机制之一。this是非常特殊的关键词标识符，在每个函数的作用域中被自动创建，但它到底指向什么，是一个让大多数开发者始终比较头疼的问题，要弄明白js中this的指向问题，需要很多相关知识得储备和理解，比如作用域、作用域链以及函数的调用执行顺序，还要考虑诸多隐性的this绑定、是否在严格模式中等等。本篇文章不试图把关于this得每一点都去讲的一清二楚，而是，从小点到大的点去总结常见的this指向问题，而关于this指向的小点，只不过是大点的一个特殊例子而已。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-04-05T13:23:09.000Z"}],["meta",{"property":"article:author","content":"Hew.iShare"}],["meta",{"property":"article:tag","content":"this"}],["meta",{"property":"article:tag","content":"作用域"}],["meta",{"property":"article:tag","content":"this指向"}],["meta",{"property":"article:published_time","content":"2020-07-26T20:02:37.000Z"}],["meta",{"property":"article:modified_time","content":"2023-04-05T13:23:09.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"javascript中的this\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2020-07-26T20:02:37.000Z\\",\\"dateModified\\":\\"2023-04-05T13:23:09.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Hew.iShare\\",\\"url\\":\\"https://blog.yunishare.cn/blog\\"}]}"]]},"headers":[{"level":2,"title":"首先什么是this?","slug":"首先什么是this","link":"#首先什么是this","children":[]},{"level":2,"title":"this在具体常见情况下的分析","slug":"this在具体常见情况下的分析","link":"#this在具体常见情况下的分析","children":[{"level":3,"title":"在全局上下文context","slug":"在全局上下文context","link":"#在全局上下文context","children":[]},{"level":3,"title":"函数内部调用","slug":"函数内部调用","link":"#函数内部调用","children":[]}]},{"level":2,"title":"与this关系密切的作用域","slug":"与this关系密切的作用域","link":"#与this关系密切的作用域","children":[{"level":3,"title":"作用域Scope是什么？","slug":"作用域scope是什么","link":"#作用域scope是什么","children":[]},{"level":3,"title":"this指向多种情况的原因","slug":"this指向多种情况的原因","link":"#this指向多种情况的原因","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1680700989000,"updatedTime":1680700989000,"contributors":[{"name":"Hew","email":"hewei_hn@foxmail.com","commits":1}]},"readingTime":{"minutes":8.28,"words":2483},"filePathRelative":"posts/tech-article/js-this-scope.md","localizedDate":"2020年7月26日","excerpt":"<p>js中得this</p>\\n<p>this关键词是JavaScript中最令人疑惑的机制之一。this是非常特殊的关键词标识符，在每个函数的作用域中被自动创建，但它到底指向什么，是一个让大多数开发者始终比较头疼的问题，要弄明白js中this的指向问题，需要很多相关知识得储备和理解，比如作用域、作用域链以及函数的调用执行顺序，还要考虑诸多隐性的this绑定、是否在严格模式中等等。本篇文章不试图把关于this得每一点都去讲的一清二楚，而是，从小点到大的点去总结常见的this指向问题，而关于this指向的小点，只不过是大点的一个特殊例子而已。</p>\\n","autoDesc":true}');export{t as data};
