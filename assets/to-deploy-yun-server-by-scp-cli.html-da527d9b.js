import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as n,o as c,c as l,a as r,b as s,d as e,e as a,w as d,f as o}from"./app-8be8ff26.js";const h={},u=s("h3",{id:"前言",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#前言","aria-hidden":"true"},"#"),e(" 前言")],-1),m=s("p",null,"对于Hexo的部署，官方提供了多种方式，我的最初的考虑是使用Rsync进行部署，奈何按照官方的文档，安装Rasyn插件后，windows上本地会报错，查阅资料才得知window还要装sync有关的其他组件，于是决定放弃使用，另寻捷径。",-1),v=o(`<p>由于之前使用过scp命令进行服务器之间的文件传输，再配置上ssh-key免密登录，体验还是很好的。所以，这么方面为什么不使用呢？况且无需安装任何插件。对于scp命令Linux本来就支持，至于windows是否支持，之前的版本不太了解，但是现在我所使用的Windows10是支持的（笔者系统版本为window10专业版1909）。接下来我们就实际操作以下，实现一键部署。</p><h3 id="主要内容-步骤" tabindex="-1"><a class="header-anchor" href="#主要内容-步骤" aria-hidden="true">#</a> 主要内容/步骤</h3><h4 id="scp简介" tabindex="-1"><a class="header-anchor" href="#scp简介" aria-hidden="true">#</a> SCP简介</h4><p>首先，我们先简单了解下什么是scp？</p><p>scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。区别于rcp，两者都能实现远程拷贝，但是scp 是加密的，rcp是不加密的，scp 可以说是 rcp 的加强版。既然scp是基于ssh登录进行安全拷贝的，我们只要实现了ssh免密登录服务器，即可实现scp免密传输文件。</p><p>命令示例：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#scp 命令使用端口号 4588 将本地主机/usr/local/下的xxx.sh 拷贝到远程主机的/home/www目录下</span>
<span class="token function">scp</span> <span class="token parameter variable">-P</span> <span class="token number">4588</span> remote@www.domain.com:/usr/local/xxx.sh /home/www
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,7),b={href:"https://www.runoob.com/linux/linux-comm-scp.html",target:"_blank",rel:"noopener noreferrer"},k=s("h4",{id:"配置ssh远程免密登录",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#配置ssh远程免密登录","aria-hidden":"true"},"#"),e(" 配置ssh远程免密登录")],-1),w=s("code",null,"ssh my-server",-1),g=o(`<h4 id="编写shell脚本-实现本地到远程部署" tabindex="-1"><a class="header-anchor" href="#编写shell脚本-实现本地到远程部署" aria-hidden="true">#</a> 编写shell脚本，实现本地到远程部署</h4><p>通过上述配置完shh免密登录之后，便可以通过scp，像使用ssh免密登录服务器一样，实现登录并传输文件。接下来我们编写下具体的shell脚本。</p><p>首先，我们可以在Hexo搭建的根目录下创建一个build目录，然后在此目录中创建一个deploy.sh的文件，便于之后的管理。如下图：</p><figure><img src="http://qncdn.yunishare.cn/image-20200531105834975.png@water" alt="目录结构" tabindex="0" loading="lazy"><figcaption>目录结构</figcaption></figure><p>接着，我们开始编写shell脚本，实现部署功能。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token comment"># 定义当前路径</span>
<span class="token assign-left variable">LOCAL_PATH</span><span class="token operator">=</span><span class="token variable"><span class="token variable">\`</span><span class="token builtin class-name">pwd</span><span class="token variable">\`</span></span>
<span class="token comment"># 输出当前所在路径</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;shell start! <span class="token variable">$LOCAL_PATH</span>&quot;</span>
<span class="token comment"># 登录目标服务器删除/home/www/目录下的文件</span>
<span class="token function">ssh</span> myCloud <span class="token string">&quot;rm -rf /home/www/*&quot;</span>
<span class="token comment"># 使用 scp 命令远程拷贝文件 将当前目录下public下的所有文件传送到远程服务器/home/www目录</span>
<span class="token function">scp</span> <span class="token parameter variable">-r</span> public/* myCloud:/home/www/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们首先打印下当前的路径，避免出现错误。然后登录远程服务器，清理掉/home/www/目录中已经存在的文件。完成清理之后再将本地public（Hexo静态文件输出目录，默认是public）目录下的文件传输到服务器的www目录，完成部署。</p><p>然后，我们找到跟目录下的package.json文件，修改scripts中的脚本命令。添加或者修改已有的deploy命令，设置为<code>hexo generate &amp;&amp; sh ./build/deploy.sh</code>。先运行hexo generate，生成静态文件，然后，执行bulid文件夹下的shell部署脚本。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string-property property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span><span class="token operator">...</span>
    <span class="token comment">// 打包生产静态文件然后调用部署脚本进行部署</span>
    <span class="token string-property property">&quot;deploy&quot;</span><span class="token operator">:</span> <span class="token string">&quot;hexo generate &amp;&amp; sh ./build/deploy.sh&quot;</span>
 <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，使用 <code>npm run deploy</code>，便可完成博客的部署。</p><p>运行示例如下：</p><figure><img src="http://qncdn.yunishare.cn/image-20200531111900788.png@water" alt="image-20200531111900788" tabindex="0" loading="lazy"><figcaption>image-20200531111900788</figcaption></figure><p>此时，刷新下访问地址，就可以看到最新发布的内容了。</p>`,13);function x(_,f){const i=n("ExternalLinkIcon"),p=n("RouterLink");return c(),l("div",null,[u,m,r(" more "),v,s("p",null,[e("更懂介绍参考"),s("a",b,[e("Linux scp命令介绍"),a(i)])]),k,s("p",null,[e("所谓免密登录，即利用ssh-key进行登录验证，不需要输入账户密码的方式登录服务器。我们通过执行 "),w,e("，就可以登录对应的服务器，而不需要每次都要输入一堆账号密码才能登录服务器。如果你还未配置免密登录可以参考文章："),a(p,{to:"/2020/05/%E5%88%A9%E7%94%A8ssh-key%E9%85%8D%E7%BD%AESSH%E5%85%8D%E5%AF%86%E7%99%BB%E5%BD%95%E8%BF%9C%E7%A8%8B%E6%9C%8D%E5%8A%A1%E5%99%A8.html"},{default:d(()=>[e("利用ssh-key配置SSH免密登录远程服务器")]),_:1})]),g])}const q=t(h,[["render",x],["__file","to-deploy-yun-server-by-scp-cli.html.vue"]]);export{q as default};