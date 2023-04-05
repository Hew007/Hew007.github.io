import{_ as i,W as c,X as p,Y as r,Z as n,$ as s,a0 as e,a1 as d,a2 as o,G as t}from"./framework-5ac44389.js";const u={},m=n("h2",{id:"前言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#前言","aria-hidden":"true"},"#"),s(" 前言")],-1),v=n("p",null,"本文主要讲述如何利用Hexo从零搭建一个博客系统，以及如何引入next主题，并启用相关next主题配置。然后，会接着再介绍下，如何不安装任何插件实现博客部署到自己的服务器。文章主要讲述搭建及相关的过程，具体到某个配置，参考官方文档即可。",-1),k=n("h3",{id:"背景",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#背景","aria-hidden":"true"},"#"),s(" 背景")],-1),b=n("p",null,"在此博客搭建之前，自己想做一个功能全面的博客，有完整的前后端支持。由于当前技术储备知识有限（加紧学习中），又不想把此事耽搁了。于是乎，便找到了Hexo，顺便就配置上了大家所推崇之至的next主题。后面又增加了评论系统的支持，采用的是next就已集成的Valine。完成这些，基本上就算完成了一个完整的博客搭建，剩下的无非是seo优化、部署相关的东西了。在此把博客从无到有的创建过程，做一个记录，也算是一个分享，供大家参考。",-1),h=n("h2",{id:"主要内容",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#主要内容","aria-hidden":"true"},"#"),s(" 主要内容")],-1),g={href:"http://daringfireball.net/projects/markdown/",target:"_blank",rel:"noopener noreferrer"},x={href:"https://hexo.io/zh-cn/docs/",target:"_blank",rel:"noopener noreferrer"},_=n("h3",{id:"安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装","aria-hidden":"true"},"#"),s(" 安装")],-1),f=n("h4",{id:"环境配置",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#环境配置","aria-hidden":"true"},"#"),s(" 环境配置")],-1),y=n("p",null,"Hexo是基于node开发的，使用npm进行管理，所以在此之前我们必须要配置相关的环境。需要配置如下环境：",-1),q={href:"http://nodejs.org/",target:"_blank",rel:"noopener noreferrer"},w={href:"http://git-scm.com/",target:"_blank",rel:"noopener noreferrer"},E=o(`<p>以上这两个，我想对于觉得多数开发者，特别是前端开发者，应该是必备的开发环境，当然，如果你还没有，那就安装上就可以了，具体安装过程，不再赘述。</p><h4 id="hexo安装" tabindex="-1"><a class="header-anchor" href="#hexo安装" aria-hidden="true">#</a> Hexo安装</h4><p>全局安装：<code>$ npm install -g hexo-cli</code></p><p>局部安装：<code>$ npm install hexo</code>（此种方式执行hexo命令，需要使用npx hexo， 对于不是全局安装的包，都可以使用npx + 包执行命令)</p><p>接着初始化博客文件夹：<code>$ hexo init &lt;folder（目录）&gt; </code></p><p>此时可以看到，博客目录已经生成了类似如下的结构目录，具体目录详细介绍，请参考官网文档。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.├── _config.yml
 ├── package.json
 ├── scaffolds
 ├── source
 |   ├── _drafts
 |   └── _posts
 └── themes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，进入创建的目录，安装依赖</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> <span class="token operator">&lt;</span>folder<span class="token operator">&gt;</span>
$ <span class="token function">npm</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>安装完依赖，我们打开package.json文件，可以看到类似如下内容</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;hexo-site&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;version&quot;</span><span class="token operator">:</span> <span class="token string">&quot;0.0.0&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;private&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">&quot;build&quot;</span><span class="token operator">:</span> <span class="token string">&quot;hexo generate&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;clean&quot;</span><span class="token operator">:</span> <span class="token string">&quot;hexo clean&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;deploy&quot;</span><span class="token operator">:</span> <span class="token string">&quot;hexo generate&quot;</span><span class="token punctuation">,</span>
    <span class="token property">&quot;server&quot;</span><span class="token operator">:</span> <span class="token string">&quot;hexo server&quot;</span>
  <span class="token punctuation">}</span>
  ......
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，hexo已经为我们创建了快捷的脚本命令</p><ul><li>启动：server</li><li>构建：build</li><li>清理：clean</li><li>部署：deploy</li></ul><p>此时我们直接运行 npm run server ，便可启动博客服务，默认端口号4000。启动完成后直接在本地访问即可看到初始化的博客了。</p><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3>`,15),H=n("code",null,"_config.yml",-1),B={href:"https://hexo.io/zh-cn/docs/configuration",target:"_blank",rel:"noopener noreferrer"},j={href:"https://hexo.io/zh-cn/docs/writing",target:"_blank",rel:"noopener noreferrer"},A=n("h3",{id:"引入next主题",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#引入next主题","aria-hidden":"true"},"#"),s(" 引入next主题")],-1),N={href:"https://theme-next.js.org/",target:"_blank",rel:"noopener noreferrer"},S={href:"https://github.com/next-theme/hexo-theme-next",target:"_blank",rel:"noopener noreferrer"},V=n("p",null,"要使用next主题可分为以下几个步骤：",-1),C={href:"https://github.com/next-theme/hexo-theme-next",target:"_blank",rel:"noopener noreferrer"},I={href:"https://github.com/next-theme/hexo-theme-next/releases",target:"_blank",rel:"noopener noreferrer"},z=n("li",null,"在hexo根目录下的theme目录新建next目录，将下载的包内对应的next里的文件全部拷贝进去",-1),D=n("li",null,"在配置文件_config.yml中theme参数设置为next，修改后会自动更新，此时刷新页面即可看到变化。",-1),T=o(`<p>主题也有对应的配置文件，其配置文件在其主题文件夹下的_config.yml，里面的配置比较多，我们对常用的配置进行一个简单的说明，具体字段根据英文意思很容易看懂。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 这是配置文件此处略去N个字............</span>
<span class="token comment"># ---------------------------------------------------------------</span>
<span class="token comment"># Site Information Settings</span>
<span class="token comment"># See: https://theme-next.org/docs/getting-started/</span>
<span class="token comment"># ---------------------------------------------------------------</span>
<span class="token comment"># 站点的图标设置，包括logo</span>
<span class="token key atrule">favicon</span><span class="token punctuation">:</span>
  <span class="token key atrule">small</span><span class="token punctuation">:</span> /images/favicon_16x16.ico
  <span class="token key atrule">medium</span><span class="token punctuation">:</span> /images/favicon_32x32.ico
  <span class="token key atrule">apple_touch_icon</span><span class="token punctuation">:</span> /images/apple<span class="token punctuation">-</span>touch<span class="token punctuation">-</span>icon.png
  <span class="token key atrule">safari_pinned_tab</span><span class="token punctuation">:</span> /images/logo.svg
  <span class="token comment">#android_manifest: /images/manifest.json</span>
  <span class="token comment">#ms_browserconfig: /images/browserconfig.xml</span>
<span class="token comment"># ......</span>
<span class="token comment"># 底部一些版权信息设置，一般备案过的需要加上备案信息</span>
<span class="token key atrule">footer</span><span class="token punctuation">:</span>
  <span class="token comment"># Icon between year and copyright info.</span>
  <span class="token key atrule">icon</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> user
    <span class="token comment"># If you want to animate the icon, set it to true.</span>
    <span class="token key atrule">animated</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token comment"># Change the color of icon, using Hex Code.</span>
    <span class="token key atrule">color</span><span class="token punctuation">:</span> <span class="token string">&quot;#808080&quot;</span>
  <span class="token comment"># If not defined, \`author\` from Hexo \`_config.yml\` will be used.</span>
  <span class="token key atrule">copyright</span><span class="token punctuation">:</span> hew
  <span class="token comment"># Powered by Hexo &amp; NexT</span>
  <span class="token key atrule">powered</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

  <span class="token comment"># 备案信息</span>
  <span class="token key atrule">beian</span><span class="token punctuation">:</span>
    <span class="token key atrule">enable</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">icp</span><span class="token punctuation">:</span>
    <span class="token comment"># The digit in the num of gongan beian.</span>
    <span class="token key atrule">gongan_id</span><span class="token punctuation">:</span>
    <span class="token comment"># The full num of gongan beian.</span>
    <span class="token key atrule">gongan_num</span><span class="token punctuation">:</span>
    <span class="token comment"># The icon for gongan beian. See: http://www.beian.gov.cn/portal/download</span>
    <span class="token key atrule">gongan_icon_url</span><span class="token punctuation">:</span>

<span class="token comment"># ............</span>

<span class="token comment"># 主题设置部分，以下四种主题分别对应4中不同的布局，可以修改后刷新页面看具体样式效果</span>
<span class="token comment"># Schemes</span>
<span class="token key atrule">scheme</span><span class="token punctuation">:</span> Muse
<span class="token comment">#scheme: Mist</span>
<span class="token comment">#scheme: Pisces</span>
<span class="token comment">#scheme: Gemini</span>

<span class="token comment"># Dark Mode 是否开启暗黑模式</span>
<span class="token key atrule">darkmode</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>

<span class="token comment"># 菜单设置  定义博客的导航菜单</span>
<span class="token key atrule">menu</span><span class="token punctuation">:</span>
  <span class="token key atrule">home</span><span class="token punctuation">:</span> / <span class="token punctuation">|</span><span class="token punctuation">|</span> home
  <span class="token comment">#about: /about/ || user</span>
  <span class="token comment">#tags: /tags/ || tags</span>
  <span class="token comment">#categories: /categories/ || th</span>
  <span class="token key atrule">archives</span><span class="token punctuation">:</span> /archives/ <span class="token punctuation">|</span><span class="token punctuation">|</span> archive
  <span class="token comment">#schedule: /schedule/ || calendar</span>
  <span class="token comment">#sitemap: /sitemap.xml || sitemap</span>
  <span class="token comment">#commonweal: /404/ || heartbeat</span>

<span class="token comment"># 是否展示菜单icon</span>
<span class="token key atrule">menu_settings</span><span class="token punctuation">:</span>
  <span class="token key atrule">icons</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">badges</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>

<span class="token comment">#-------------侧边栏设置---------------------------------</span>

<span class="token key atrule">sidebar</span><span class="token punctuation">:</span>
  <span class="token comment"># Sidebar Position.</span>
  <span class="token key atrule">position</span><span class="token punctuation">:</span> left
  <span class="token comment">#position: right</span>
  <span class="token comment"># ....................................</span>

<span class="token comment"># 侧边栏头像设置</span>
<span class="token key atrule">avatar</span><span class="token punctuation">:</span>
  <span class="token comment"># Replace the default image and set the url here.</span>
  <span class="token key atrule">url</span><span class="token punctuation">:</span> /images/avatar<span class="token punctuation">-</span>sheld.jpg
  <span class="token comment"># If true, the avatar will be dispalyed in circle.</span>
  <span class="token key atrule">rounded</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token comment"># If true, the avatar will be rotated with the cursor.</span>
  <span class="token key atrule">rotated</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>

<span class="token comment"># 个人信息链接设置</span>
<span class="token key atrule">social</span><span class="token punctuation">:</span>
  <span class="token comment">#GitHub: https://github.com/yourname || github</span>
  <span class="token key atrule">E-Mail</span><span class="token punctuation">:</span> mailto<span class="token punctuation">:</span>xxxx@xxxmail.com <span class="token punctuation">|</span><span class="token punctuation">|</span> envelope
  <span class="token comment">#Weibo: https://weibo.com/yourname || weibo</span>

<span class="token comment"># .................................</span>

<span class="token comment"># 代码块主题样式设置</span>
<span class="token key atrule">codeblock</span><span class="token punctuation">:</span>
  <span class="token comment"># 可选的主题如下: normal | night | night eighties | night blue | night bright | solarized | solarized dark | galactic</span>
  <span class="token comment"># See: https://github.com/chriskempson/tomorrow-theme</span>
  <span class="token key atrule">highlight_theme</span><span class="token punctuation">:</span> solarized dark
  <span class="token comment"># Add copy button on codeblock</span>
  <span class="token key atrule">copy_button</span><span class="token punctuation">:</span>
    <span class="token key atrule">enable</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token comment"># Show text copy result.</span>
    <span class="token key atrule">show_result</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token comment"># Available values: default | flat | mac</span>
    <span class="token key atrule">style</span><span class="token punctuation">:</span> mac
<span class="token comment"># 返回顶部设置</span>
<span class="token key atrule">back2top</span><span class="token punctuation">:</span>
  <span class="token key atrule">enable</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token comment"># .......................</span>

<span class="token comment"># 评论系统配置，可以开启博客评论，具体配置请惨开下一小结</span>
<span class="token key atrule">comments</span><span class="token punctuation">:</span>
  <span class="token comment"># .......省略......</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上是常用的配置，其实，配置上这些，基本就可以供日常使用了。其他配置，可根据自己的需要进自行修改。每一个参数基本都给出了详细的英文注释，觉大部分都是可以看懂的，对于英语不好的同学，可以借助翻译查看。</p><h3 id="引入评论系统valine" tabindex="-1"><a class="header-anchor" href="#引入评论系统valine" aria-hidden="true">#</a> 引入评论系统Valine</h3><p>一个博客如果没有开启评论功能，给人的感觉是没有灵魂的。有了评论的支持，博客才有了灵魂，大家才能互相交流，碰撞，有问题也方便指出和提问，作者也能进行后续的解答和补充。所以，为了注入灵魂，评论系统还是要加上的。</p><p>引入Valine我单独摘出了一篇文章，起初直接放在文中，感觉本文内容太长，也不便于分类，所以，之后会将具体操作另外写了一篇博文，具体信息可参考：Hexo-next引入Valine评论系统</p><h3 id="部署" tabindex="-1"><a class="header-anchor" href="#部署" aria-hidden="true">#</a> 部署</h3>`,7),$={href:"https://hexo.io/zh-cn/docs/one-command-deployment",target:"_blank",rel:"noopener noreferrer"},M=n("h3",{id:"结语",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#结语","aria-hidden":"true"},"#"),s(" 结语")],-1),G=n("p",null,"整个博客从搭建到部署，其实需要准备的还是挺多的。如果，你和我一样需要部署到自己的服务器，那么云服务器是需要提前准备的，然后，你还需要准备一个域名（使用ip访问也行），域名还要备案。然后你还需要配置服务器，起码需要配置一个nginx服务来部署你的网站，整个做下来还是需要花费一定精力的。",-1),L=n("p",null,"但是，当你实实在在把以上这些都折腾了一遍，何尝不是一种提高呢？关于Hexo搭建博客的其他问题，欢迎大家在留言区讨论，有问题请随时指出，在下不吝赐教。",-1);function R(F,P){const a=t("ExternalLinkIcon"),l=t("RouterLink");return c(),p("div",null,[m,v,r(" more "),k,b,h,n("blockquote",null,[n("p",null,[s("Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 "),n("a",g,[s("Markdown"),e(a)]),s("（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。更多Hexo介绍可参考"),n("a",x,[s("Hexo官网"),e(a)])])]),_,f,y,n("ul",null,[n("li",null,[n("a",q,[s("Node.js"),e(a)]),s(" (Node.js 版本需不低于 8.10，官方推荐使用 Node.js 10.0 及以上版本，个人建议使用nvm进行node版本的管理)")]),n("li",null,[n("a",w,[s("Git"),e(a)])])]),E,n("p",null,[s("博客有关的信息字段，基本上全部都可以通过配置文件"),H,s("进行配置，比如文章的标题、描述、语言、网址等等。配置文件在根目录下，具体配置字段这里不再一一举例，请参考"),n("a",B,[s("Hexo配置"),e(a)]),s("。")]),n("p",null,[s("做完基本的配置之后，便可以奋笔疾书了。直接使用hexo new 'xxxxxxxx' 即可创建对应的文章，此时，source目录下的post目录会生产刚刚创建的md文件，然后就可以在此md上愉快的写文章了。更多介绍可参考"),n("a",j,[s("Hexo 写作"),e(a)]),s("。")]),A,n("p",null,[s("next主题参考站点："),n("a",N,[s("theme-next"),e(a)])]),n("p",null,[s("github地址："),n("a",S,[s("hexo-theme-next"),e(a)])]),V,n("ol",null,[n("li",null,[s("访问"),n("a",C,[s("hexo-next"),e(a)]),s(" github站点 ，下载或者拉去最新的"),n("a",I,[s("release包"),e(a)])]),z,D]),T,n("p",null,[s("Hexo可以部署在很多地方，除了能部署到自己的服务器外，还能结合github pages和gitlab pages部署到对应的站点。这里不介绍关于如何部署到github pages，一是因为相关的文章已经很多了，二是github站点有时候会抽风，原因大家都懂。这里主要讲一下如何部署到自己的云服务器，关于这点，官方文章也有介绍，可以参考官方的"),n("a",$,[s("Hexo一键部署"),e(a)]),s("。提供了很多的部署方式，比如Ftp、Rsync等等，但是实际部署中还是会遇到各种各样的问题。这里介绍一种官方未提供的方式，且无需安装任何插件。")]),n("p",null,[s("传送门："),e(l,{to:"/2020/06/%E4%BD%BF%E7%94%A8scp%E5%91%BD%E4%BB%A4%EF%BC%8C%E8%BD%BB%E6%9D%BE%E5%AE%9E%E7%8E%B0Hexo%E9%83%A8%E7%BD%B2%E5%88%B0%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%99%A8.html"},{default:d(()=>[s("使用scp命令，轻松实现Hexo部署到云服务器")]),_:1}),s("。")]),M,G,L])}const Y=i(u,[["render",R],["__file","use-hexo-to-build-yourself-blog-site.html.vue"]]);export{Y as default};
