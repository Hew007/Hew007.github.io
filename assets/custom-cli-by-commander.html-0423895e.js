const e=JSON.parse('{"key":"v-00318609","path":"/posts/tech-article/custom-cli-by-commander.html","title":"利用commander和git创建一个自定义的脚手架","lang":"zh-CN","frontmatter":{"title":"利用commander和git创建一个自定义的脚手架","date":"2020-08-24T09:31:31.000Z","category":["工具","技术"],"tag":["前端工具","脚手架","cli","commander"],"description":"概念 什么是脚手架？ 脚手架是可以快速生成工程化项目的一类工具。使用脚手架我们可以快速形成特定的项目目录，快速进行项目搭建和开发，而不是每次都自己从0去搭建一个项目结构。","head":[["meta",{"property":"og:url","content":"https://blog.yunishare.cn/posts/tech-article/custom-cli-by-commander.html"}],["meta",{"property":"og:site_name","content":"个人博客"}],["meta",{"property":"og:title","content":"利用commander和git创建一个自定义的脚手架"}],["meta",{"property":"og:description","content":"概念 什么是脚手架？ 脚手架是可以快速生成工程化项目的一类工具。使用脚手架我们可以快速形成特定的项目目录，快速进行项目搭建和开发，而不是每次都自己从0去搭建一个项目结构。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-04-05T13:23:09.000Z"}],["meta",{"property":"article:author","content":"Hew.iShare"}],["meta",{"property":"article:tag","content":"前端工具"}],["meta",{"property":"article:tag","content":"脚手架"}],["meta",{"property":"article:tag","content":"cli"}],["meta",{"property":"article:tag","content":"commander"}],["meta",{"property":"article:published_time","content":"2020-08-24T09:31:31.000Z"}],["meta",{"property":"article:modified_time","content":"2023-04-05T13:23:09.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"利用commander和git创建一个自定义的脚手架\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2020-08-24T09:31:31.000Z\\",\\"dateModified\\":\\"2023-04-05T13:23:09.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Hew.iShare\\",\\"url\\":\\"https://blog.yunishare.cn/blog\\"}]}"]]},"headers":[{"level":2,"title":"概念","slug":"概念","link":"#概念","children":[{"level":3,"title":"什么是脚手架？","slug":"什么是脚手架","link":"#什么是脚手架","children":[]},{"level":3,"title":"常用的依赖工具包","slug":"常用的依赖工具包","link":"#常用的依赖工具包","children":[]}]},{"level":2,"title":"原理","slug":"原理","link":"#原理","children":[]},{"level":2,"title":"commander介绍","slug":"commander介绍","link":"#commander介绍","children":[{"level":3,"title":"基本命令配置","slug":"基本命令配置","link":"#基本命令配置","children":[]},{"level":3,"title":"子命令配置","slug":"子命令配置","link":"#子命令配置","children":[]}]},{"level":2,"title":"Inquirer简介","slug":"inquirer简介","link":"#inquirer简介","children":[]},{"level":2,"title":"实现","slug":"实现","link":"#实现","children":[{"level":3,"title":"初始化一个项目","slug":"初始化一个项目","link":"#初始化一个项目","children":[]},{"level":3,"title":"实现自定义命令","slug":"实现自定义命令","link":"#实现自定义命令","children":[]},{"level":3,"title":"在github上创建自己的template","slug":"在github上创建自己的template","link":"#在github上创建自己的template","children":[]},{"level":3,"title":"使用github api获取远程仓库上的模板","slug":"使用github-api获取远程仓库上的模板","link":"#使用github-api获取远程仓库上的模板","children":[]},{"level":3,"title":"下载git仓库中的模板","slug":"下载git仓库中的模板","link":"#下载git仓库中的模板","children":[]},{"level":3,"title":"进入项目目录，安装依赖","slug":"进入项目目录-安装依赖","link":"#进入项目目录-安装依赖","children":[]}]},{"level":2,"title":"发布到npm","slug":"发布到npm","link":"#发布到npm","children":[]}],"git":{"createdTime":1680700989000,"updatedTime":1680700989000,"contributors":[{"name":"Hew","email":"hewei_hn@foxmail.com","commits":1}]},"readingTime":{"minutes":12.41,"words":3724},"filePathRelative":"posts/tech-article/custom-cli-by-commander.md","localizedDate":"2020年8月24日","excerpt":"<h2> 概念</h2>\\n<h3> 什么是脚手架？</h3>\\n<p>脚手架是可以快速生成工程化项目的一类工具。使用脚手架我们可以快速形成特定的项目目录，快速进行项目搭建和开发，而不是每次都自己从0去搭建一个项目结构。</p>\\n","autoDesc":true}');export{e as data};
