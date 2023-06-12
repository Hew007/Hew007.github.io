import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as c,o as p,c as l,a as o,b as n,d as s,e,f as t}from"./app-d75e961b.js";const u={},d=n("h2",{id:"前言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#前言","aria-hidden":"true"},"#"),s(" 前言")],-1),r=n("p",null,"circleci是一个云服务CI平台，可以帮助我们实现项目的持续集成，也就是所谓的CI。",-1),m=n("blockquote",null,[n("p",null,"持续集成是一种软件开发实践，即团队开发成员经常集成他们的工作，通常每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。")],-1),k=n("p",null,"通常我们提到CI（Continuous Integration持续集成）和CD（Continuous Deployment持续部署）都是一起的，二者是相互联系的。这里，使用的circleci就是我们用来实现CI,CD功能的一个服务平台。和其他服务平台一样，我们无需关注具体的实现，只需要关注自己的业务逻辑即可。通过circleci我们只需要编写相关的配置文件即可，然后后续的测试、编译，发布等等都会通过circleci平台自动进行。",-1),v=n("p",null,"对于开源项目，使用circleci是免费的。如果是私有化项目，则需要付费才能使用。所以，这里更适合个人项目使用，或者，作为一个CICD入门学习，也是不错的。",-1),g=n("h2",{id:"注册",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#注册","aria-hidden":"true"},"#"),s(" 注册")],-1),b={href:"https://circleci.com/",target:"_blank",rel:"noopener noreferrer"},h=t('<img src="http://qncdn.yunishare.cn/image-20200705200213541.png" alt="image-20200705200213541" style="zoom:50%;"><p>进入circleci主页，右上角点击Log In将进入github授权，授权之后进入配置页面，此时，即完成了登录。</p><img src="http://qncdn.yunishare.cn/image-20200705195841992.png" alt="image-20200705195841992" style="zoom:50%;"><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><h3 id="基本配置" tabindex="-1"><a class="header-anchor" href="#基本配置" aria-hidden="true">#</a> 基本配置</h3><p>使用github授权登录之后，会跳转进入项目控制面板，如果没有跳转，也没关系，登录之后进入到主页，点击右上角的Go to app，也可以直接进入控制面板。进入控制台后，首先会让你添加一个项目，如下图，ci-test是已经添加和配置过的项目。</p><img src="http://qncdn.yunishare.cn/image-20200706153258297.png@water" alt="image-20200706153258297" style="zoom:50%;"><p>如果，你是一个新项目，只需要再github上新建仓库，然后在这里进行设置你的项目即可。点击set up project，进入配置页面。</p><img src="http://qncdn.yunishare.cn/image-20200706155006524.png@water" alt="image-20200706155006524" style="zoom:40%;"><p>点击add config按钮，它将自动会为你当前的项目创建一个名为circleci-project-setup的分支，并写入demo配置。这里，我们手动添加即可，点击add Manually。接下来我们需要手动创建一个.circleci文件夹，然后新建一个config.yml文件，然后推送到github上。此时circle-ci就会自动检查到我们的提交，然后根据config.yml的配置开始执行对应的任务。</p><p>circle-ci实现CI大致流程：监听到github代码推送之后，会拉去对应代码仓库，并读取仓库中的config.yml配置文件。然后安装配置文件设置的环境和任务进行执行。所以再进行CI配置之前，我们需要去和github做一个授权以及生成一个auth key来赋予circle一定的权限。</p><h3 id="关联github-ssh-key" tabindex="-1"><a class="header-anchor" href="#关联github-ssh-key" aria-hidden="true">#</a> 关联github ssh-key</h3><img src="http://qncdn.yunishare.cn/image-20200706162618378.png@water" alt="image-20200706162618378" style="zoom:50%;"><p>在Pipelines标签页，点击右上角的 Project Settings 进入项目设置。如下图，然后点击ssh keys，进入授权页面。下面是已经授权的checkout ssh key。这个是用来进行代码检出的。另外，还需要添加一个用户的ssh key，后面进行部署到github pages需要用到，点击add ssh key即可添加。添加完成之后同样会生成一串指纹id，后面在配置yml文件时需要用到。</p><img src="http://qncdn.yunishare.cn/image-20200706163422349.png@water" alt="image-20200706163422349" style="zoom:50%;"><h3 id="ci配置" tabindex="-1"><a class="header-anchor" href="#ci配置" aria-hidden="true">#</a> CI配置</h3>',16),y={href:"https://circleci.com/docs/2.0/configuration-reference/#section=configuration",target:"_blank",rel:"noopener noreferrer"},f=t(`<div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token number">2</span>
<span class="token key atrule">jobs</span><span class="token punctuation">:</span>
  <span class="token key atrule">build</span><span class="token punctuation">:</span>
    <span class="token key atrule">docker</span><span class="token punctuation">:</span> <span class="token comment">#执行容器</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> circleci/node<span class="token punctuation">:</span><span class="token number">10</span> <span class="token comment">#依赖环境</span>
    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token comment">#分支</span>
      <span class="token key atrule">only</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> master
    <span class="token comment"># Steps are a list of commands to run inside the docker container above.</span>
    <span class="token key atrule">steps</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">run</span><span class="token punctuation">:</span> 
          <span class="token key atrule">name</span><span class="token punctuation">:</span> Install
          <span class="token key atrule">command</span><span class="token punctuation">:</span> console.log(&#39;installing <span class="token punctuation">...</span>&#39;)
      <span class="token punctuation">-</span> <span class="token key atrule">run</span><span class="token punctuation">:</span> 
          <span class="token key atrule">name</span><span class="token punctuation">:</span> Test
          <span class="token key atrule">command</span><span class="token punctuation">:</span> console.log(&#39;Test <span class="token punctuation">...</span>&#39;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述配置的功能就是：在docker容器中使用版本号为10的node环境，使用的分支为master分支。然后运行Install任务，完成之后接着运行Test测试任务，就这一，一层一层任务执行，我们称之为流水线作业。</p><h4 id="vue项目示例" tabindex="-1"><a class="header-anchor" href="#vue项目示例" aria-hidden="true">#</a> vue项目示例</h4><p>接下来，我们以一个vue-cli项目为例进行说明，来实现自动化构建和发布的整个CI流程。</p><p>首先我们将github代码拉到本地之后，将生成的vue项目直接拷贝进来即可。或者，直接在项目所在文件夹，执行vue create xxx命令，将生成的cli项目和本地的进行合并，然后推送到远程仓库即可。</p><p>完成之后，我们便可以开始编写下基本的circle-ci配置了。我们首先实现依赖包的安装Install、项目的打包构建Build功能。并添加缓存，和复用缓存，将node-modules目录进行缓存。这样，在完成第一次Install之后，会将node-modules目录依赖进行缓存。以后再执行Install，便可以利用缓存的文件，大大提高安装速度。示例代码如下：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token number">2</span>
<span class="token key atrule">jobs</span><span class="token punctuation">:</span>
  <span class="token key atrule">build</span><span class="token punctuation">:</span>
    <span class="token key atrule">docker</span><span class="token punctuation">:</span> <span class="token comment">#执行容器</span>
      <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> circleci/node<span class="token punctuation">:</span><span class="token number">10</span> <span class="token comment">#依赖环境</span>
    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token comment">#分支</span>
      <span class="token key atrule">only</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> master
    <span class="token comment"># Steps are a list of commands to run inside the docker container above.</span>
    <span class="token key atrule">steps</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">add_ssh_keys</span><span class="token punctuation">:</span>
          <span class="token key atrule">fingerprints</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token string">&#39;93:15:15:64:15:64:15:64:15:16:64:9b&#39;</span>  <span class="token comment"># 这个就是添加ssh key生成的指纹id，将其复制到这里即可</span>
      <span class="token punctuation">-</span> checkout <span class="token comment"># 从githun拉去代码</span>
      <span class="token comment"># 使用缓存</span>
      <span class="token punctuation">-</span> <span class="token key atrule">restore_cache</span><span class="token punctuation">:</span>
          <span class="token key atrule">key</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>dependens <span class="token comment"># 这个key和save_cache的key相对应，表示使用的是这个key对应的缓存</span>
      <span class="token punctuation">-</span> <span class="token key atrule">run</span><span class="token punctuation">:</span> 
          <span class="token key atrule">name</span><span class="token punctuation">:</span> Install
          <span class="token key atrule">command</span><span class="token punctuation">:</span> yarn install
      <span class="token comment"># 设置缓存</span>
      <span class="token punctuation">-</span> <span class="token key atrule">save_cache</span><span class="token punctuation">:</span>
          <span class="token key atrule">key</span><span class="token punctuation">:</span> node<span class="token punctuation">-</span>dependens
          <span class="token key atrule">paths</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> node_modules
      <span class="token punctuation">-</span> <span class="token key atrule">run</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> Build
          <span class="token key atrule">command</span><span class="token punctuation">:</span> yarn build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将其推送到github仓库之后我们可以可以在circleci 流水线页面看到项目已经开始了自动化流程。执行完成后，我们可以看到所有执行过程，花费的事件以及打印的一些信息等等。</p><img src="http://qncdn.yunishare.cn/image-20200706165059527.png@water" alt="image-20200706165059527" style="zoom:50%;"><h3 id="发布到github-pages" tabindex="-1"><a class="header-anchor" href="#发布到github-pages" aria-hidden="true">#</a> 发布到github pages</h3><p>还是以上面的vue cli项目为例，当我们构建完成之后，通常需要将构建出的静态资源发布到自己的服务器中，这一过程就是部署。我们需要将打包后的代码发布到项目的github pages页面，这样就可以通过github链接访问项目了。</p><h4 id="配置环境变量" tabindex="-1"><a class="header-anchor" href="#配置环境变量" aria-hidden="true">#</a> 配置环境变量</h4><p>在部署过程中，我们将会使用到一些常量，比如，仓库的远端地址，账户的邮箱、构建的目录等等。为了方便维护以及安全问题，我们需要在此之前设置几个环境变量，存储在circleci中。然后再编写相关任务脚本时，便可以直接使用这些变量。</p><p>我们先进入到项目设置页面：点击添加三个环境变量，键名自己可以随意命名，分别是github对应的邮箱，用户名和构建打包后的文件夹名称，如下所示。点击add variable按钮即可添加，这三个变量，将会在我们编写部署脚本时使用到。</p><img src="http://qncdn.yunishare.cn/image-20200706200442181.png@water" alt="image-20200706200442181" style="zoom:50%;"><h4 id="编写部署脚本" tabindex="-1"><a class="header-anchor" href="#编写部署脚本" aria-hidden="true">#</a> 编写部署脚本</h4><p>部署代码过程虽然不复杂，但是也不是一两行代码就能实现的。所以，我们可以单独抽离一个部署的脚本文件出来。可以在项目根目录下建立一个circleci-deploy.sh的shell脚本。</p><p>大致分为以下几个步骤：</p><ul><li><p>创建目录：当打包完成之后，我们需要在本地创建一个目录来关联github pages默认仓库的代码（项目的gh-pages分支即为github pages发布分支）。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 新建一个发布项目的目录</span>
mkdir git<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>rp
cd git<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>rp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>关联仓库：设置账户信息，初始化git，将本地和远程仓库地址关联，即指定远端地址。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 创建的一个新的仓库</span>
<span class="token comment"># 设置发布的用户名与邮箱 这里的邮箱和用户名都是取自上面设置的环境变量</span>
git config <span class="token punctuation">-</span><span class="token punctuation">-</span>global user.email &quot;$GH_EMAIL&quot; <span class="token punctuation">&gt;</span>/dev/null 2<span class="token punctuation">&gt;</span><span class="token important">&amp;1</span> <span class="token comment"># 这里的处理是为了不让其输出信息到控制台</span>
git config <span class="token punctuation">-</span><span class="token punctuation">-</span>global user.name &quot;$GH_NAME&quot; <span class="token punctuation">&gt;</span>/dev/null 2<span class="token punctuation">&gt;</span><span class="token important">&amp;1</span>
<span class="token comment"># 初始化一个临时的git仓库</span>
git init
<span class="token comment"># 和远程仓库建立关联</span>
git remote add <span class="token punctuation">-</span><span class="token punctuation">-</span>fetch origin &quot;$remote&quot; <span class="token comment">#这里的remote是自己定义的变量</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>切换分支：切换分支到gh-pages，并删除之前的文件。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 切换gh-pages分支</span>
<span class="token comment"># 验证git 是否存在gh-pages分支 如果存在则切换 不存在则创建一个空历史分支</span>
if git rev<span class="token punctuation">-</span>parse <span class="token punctuation">-</span><span class="token punctuation">-</span>verify origin/gh<span class="token punctuation">-</span>pages <span class="token punctuation">&gt;</span>/dev/null 2<span class="token punctuation">&gt;</span><span class="token important">&amp;1;</span> then
  <span class="token comment"># 检出此分支</span>
  git checkout gh<span class="token punctuation">-</span>pages
  <span class="token comment"># 删除掉旧的文件内容</span>
  git rm <span class="token punctuation">-</span>rf .
else
  git checkout <span class="token punctuation">-</span><span class="token punctuation">-</span>orphan gh<span class="token punctuation">-</span>pages
fi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>推送部署：将打包生成的dist目录文件拷贝到此文件夹内，然后，提交代码，推送到远程仓库。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 把构建好的文件目录给拷贝进来</span>
cp <span class="token punctuation">-</span>a &quot;../$<span class="token punctuation">{</span>STATIC_SOURCE<span class="token punctuation">}</span>/.&quot; .
<span class="token comment"># 把所有的文件添加到git</span>
git add <span class="token punctuation">-</span>A
<span class="token comment"># 添加一条提交内容</span>
git commit <span class="token punctuation">-</span><span class="token punctuation">-</span>allow<span class="token punctuation">-</span>empty <span class="token punctuation">-</span>m &quot;Deploy to GitHub pages <span class="token punctuation">[</span>ci skip<span class="token punctuation">]</span>&quot;  <span class="token comment"># ci skip是为了跳过ci的构建</span>
<span class="token comment"># 推送文件</span>
git push <span class="token punctuation">-</span><span class="token punctuation">-</span>force <span class="token punctuation">-</span><span class="token punctuation">-</span>quiet origin gh<span class="token punctuation">-</span>pages
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>以上基本就完成了整个脚本的编写，当然，这里面还需要添加一些信息打印，以及部分变量的设置和取值。比如第二步骤中的remote远程地址，就是设置的一个变量，我们可以在一开始就进行设置。</p><p>最后放上完整的脚本配置文件：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment">#!/bin/sh</span>
<span class="token comment"># 开头的这一句是为了标识我是一个shell脚本，按照shell进行执行</span>
<span class="token comment"># 出现非0错误 终止脚本 </span>
set <span class="token punctuation">-</span>e
<span class="token comment"># 打印当前的工作路径</span>
pwd
<span class="token comment"># 查看当前目录下的文件信息</span>
ls <span class="token punctuation">-</span>la
<span class="token comment"># 定义远程仓库地址变量</span>
remote=$(git config remote.origin.url)
<span class="token key atrule">echo &#39;remote address is</span><span class="token punctuation">:</span> &#39;$remote

<span class="token comment"># 新建一个发布项目的目录</span>
mkdir git<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>rp
cd git<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>rp

<span class="token comment"># 创建的一个新的仓库</span>
<span class="token comment"># 设置发布的用户名与邮箱 这里的邮箱和用户名都是取自上面设置的环境变量</span>
git config <span class="token punctuation">-</span><span class="token punctuation">-</span>global user.email &quot;$GH_EMAIL&quot; <span class="token punctuation">&gt;</span>/dev/null 2<span class="token punctuation">&gt;</span><span class="token important">&amp;1</span> <span class="token comment"># 这里的处理是为了不让其输出信息到控制台</span>
git config <span class="token punctuation">-</span><span class="token punctuation">-</span>global user.name &quot;$GH_NAME&quot; <span class="token punctuation">&gt;</span>/dev/null 2<span class="token punctuation">&gt;</span><span class="token important">&amp;1</span> <span class="token comment"># 这里的处理是为了不让其输出信息到控制台</span>
<span class="token comment"># 初始化一个临时的git仓库</span>
git init
<span class="token comment"># 和远程仓库建立关联</span>
git remote add <span class="token punctuation">-</span><span class="token punctuation">-</span>fetch origin &quot;$remote&quot; <span class="token comment">#这里的remote是上面定义的变量</span>

<span class="token comment"># 切换gh-pages分支</span>
<span class="token comment"># 验证git 是否存在gh-pages分支 如果存在则切换 不存在则创建一个空历史分支</span>
if git rev<span class="token punctuation">-</span>parse <span class="token punctuation">-</span><span class="token punctuation">-</span>verify origin/gh<span class="token punctuation">-</span>pages <span class="token punctuation">&gt;</span>/dev/null 2<span class="token punctuation">&gt;</span><span class="token important">&amp;1;</span> then
  <span class="token comment"># 检出此分支</span>
  git checkout gh<span class="token punctuation">-</span>pages
  <span class="token comment"># 删除掉旧的文件内容</span>
  git rm <span class="token punctuation">-</span>rf .
else
  git checkout <span class="token punctuation">-</span><span class="token punctuation">-</span>orphan gh<span class="token punctuation">-</span>pages
fi

<span class="token comment"># 把构建好的文件目录给拷贝进来</span>
cp <span class="token punctuation">-</span>a &quot;../$<span class="token punctuation">{</span>STATIC_SOURCE<span class="token punctuation">}</span>/.&quot; .
<span class="token comment"># 查看拷贝的文件</span>
ls <span class="token punctuation">-</span>la

<span class="token comment"># 把所有的文件添加到git</span>
git add <span class="token punctuation">-</span>A
<span class="token comment"># 添加一条提交内容</span>
git commit <span class="token punctuation">-</span><span class="token punctuation">-</span>allow<span class="token punctuation">-</span>empty <span class="token punctuation">-</span>m &quot;Deploy to GitHub pages <span class="token punctuation">[</span>ci skip<span class="token punctuation">]</span>&quot; <span class="token comment"># 【ci skip】是为了跳过ci的构建</span>
<span class="token comment"># 推送文件</span>
git push <span class="token punctuation">-</span><span class="token punctuation">-</span>force <span class="token punctuation">-</span><span class="token punctuation">-</span>quiet origin gh<span class="token punctuation">-</span>pages
<span class="token comment"># 资源回收，删除临时分支与目录</span>
cd ..
rm <span class="token punctuation">-</span>rf git<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>rp

echo &quot;Delpoy Sucessful&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后一步，将部署添加为一个CI任务，放在最后执行。编辑config.yml文件，在最后添加一行发布任务。</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token comment"># 如果出现权限问题，请加上权限设置任务，给脚本添加执行权限，然后再执行发布任务</span>
<span class="token punctuation">-</span> <span class="token key atrule">run</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> AuthSet
    <span class="token key atrule">command</span><span class="token punctuation">:</span> chmod +x scripts/deploy.sh
    
<span class="token punctuation">-</span> <span class="token key atrule">run</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> Deploy
    <span class="token key atrule">command</span><span class="token punctuation">:</span> ./circle<span class="token punctuation">-</span>deploy.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提交代码，推送到github，circleci将开始按照配置的设置执行整个CI流程，执行成功完成后，打开github pages即可看到部署成功之后的内容。</p>`,25);function _(q,x){const a=c("ExternalLinkIcon");return p(),l("div",null,[d,r,m,o(" more "),k,v,g,n("p",null,[s("要使用circleci，需要先注册一个账户。进入"),n("a",b,[s("circleci官网"),e(a)]),s("，点击注册或者使用github账户进行注册登录。推荐使用github账户授权，下图即为github授权登录页面。")]),h,n("p",null,[s("config.yml文件遵循yaml语法，靠缩进来表示上下级关系，同样也使用键值对，比较简单。可以参考官方的"),n("a",y,[s("配置参考"),e(a)]),s("。下面是一个简单是config.yml示例。")]),f])}const S=i(u,[["render",_],["__file","circle-github-setings.html.vue"]]);export{S as default};
