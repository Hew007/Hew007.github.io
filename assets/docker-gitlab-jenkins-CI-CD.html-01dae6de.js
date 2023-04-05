import{_ as t,W as o,X as c,Y as r,Z as n,$ as a,a0 as s,a2 as i,G as l}from"./framework-5ac44389.js";const p={},d=n("h2",{id:"前言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#前言","aria-hidden":"true"},"#"),a(" 前言")],-1),g=n("p",null,"在当前的项目工作中，由于还没有完全的实现整个前端自动化流程，导致许多劳动可能都是重复性的，但又不得不做，算是一个痛点。同时，自己也相对前端自动化方面有更深入的了解，俗话说，实践出真知。于是，便亲自购买服务器，安装配置相关环境，应用等，亲自实践了circle-ci、gitlab-ci和Jenkins这三种工具，来实现前端的自动化流程，今天主要分享利用jenkins对接gitlab，利用docker容器技术，实现前端项目的测试构建发布流程。",-1),k=i('<h2 id="主要步骤" tabindex="-1"><a class="header-anchor" href="#主要步骤" aria-hidden="true">#</a> 主要步骤</h2><h3 id="准备" tabindex="-1"><a class="header-anchor" href="#准备" aria-hidden="true">#</a> 准备</h3><p>在此之前，你需要一台Linxu服务器，推荐2C4G以上的配置，带宽越大越好。然后，需要安装配置docker，以及gitlab和jenkins的安装和配置。对于以上环境和应用的安装配置，利用docker安装的话是比较简单的，也不是本文的重点，可以参考另一篇文章：利用docker-compose安装并配置gitlab。</p><h3 id="创建项目" tabindex="-1"><a class="header-anchor" href="#创建项目" aria-hidden="true">#</a> 创建项目</h3><p>首先我们在gitlab中创建一个新项目，这里以一个vue cli初始化项目为例。创建完成后，在本地生成一个vue项目，然后推送到gitlab。</p><img src="http://qncdn.yunishare.cn/image-20200709143049776.png@water" alt="image-20200709143049776" style="zoom:50%;"><p>下图为推送到master的vue cli初始化项目。</p><figure><img src="http://qncdn.yunishare.cn/image-20200709143745317.png@water" alt="image-20200709143745317" tabindex="0" loading="lazy"><figcaption>image-20200709143745317</figcaption></figure><p>在jenkins中，点击创建任务，创建一个任务项目。下图示例创建了一个jenkins-git-test项目，创建完成后就会进入到项目配置页面。</p><img src="http://qncdn.yunishare.cn/image-20200709152001428.png@water" alt="image-20200709152001428" style="zoom:50%;"><h3 id="配置访问密钥" tabindex="-1"><a class="header-anchor" href="#配置访问密钥" aria-hidden="true">#</a> 配置访问密钥</h3><p>为了jenkins能访问到gitlab，我们需要创建一个ssh密钥对，将公钥配置到gitlab，私钥配置到jenkins。这样，jenkins和gitlab就能通过公私钥对实现通信。</p><p>使用命令：<code>ssh-keygen -t rsa -C &quot;your_email@example.com&quot;</code>在本地生成一个密钥对。将生成的公钥（.pub后缀）复制到gitlab部署密钥中。位置：设置 =&gt;部署密钥 =&gt;新增部署密钥。或者，在项目的设置，CI/CD中的deploy keys设置。设置完成后要在项目设置中，将此部署密钥勾选启用。</p><figure><img src="http://qncdn.yunishare.cn/image-20200709145447604.png@water" alt="image-20200709145447604" tabindex="0" loading="lazy"><figcaption>image-20200709145447604</figcaption></figure><figure><img src="http://qncdn.yunishare.cn/image-20200709150501182.png@water" alt="image-20200709150501182" tabindex="0" loading="lazy"><figcaption>image-20200709150501182</figcaption></figure><p>然后，进入到jenkins凭据设置，添加一个凭据，类型选中<code>SSH Username with private key</code>，id留空，系统会自动生成。描述、username自己自定义写就可以，选中Enter directly，将私钥复制进去，Passphrase密码就是你生成ssh key时候的输入的密码。</p><figure><img src="http://qncdn.yunishare.cn/image-20200709170654683.png@water" alt="image-20200709170654683" tabindex="0" loading="lazy"><figcaption>image-20200709170654683</figcaption></figure><h3 id="配置webhook-jenkins和git对接" tabindex="-1"><a class="header-anchor" href="#配置webhook-jenkins和git对接" aria-hidden="true">#</a> 配置webhook，jenkins和git对接</h3><p>以上创建完成之后，进入我们创建的jenkins项目jenkins-git-test，然后点击左侧的配置，进入项目配置页面。可以看到，jenkins配置从上往下依次分为通用、源码关联、构建触发器、构建环境、构建、和构建后操作。jenkins整个执行流就是按照这几个顺序依次进行执行的。</p><figure><img src="http://qncdn.yunishare.cn/image-20200710165030914.png@water" alt="image-20200710165030914" tabindex="0" loading="lazy"><figcaption>image-20200710165030914</figcaption></figure><p>首先往下滚动页面，进入到源码管理，配置项目的源码地址。勾选git，然后填写上面我们新建项目的仓库地址，以及选中对应的凭据，也就是我们在jenkins创建凭据时保存在jenkins中的私钥。如果，这里出现权限相关的报错，请检查密钥对是否一致，gitlab项目中的部署密钥是否启用。指定一个分支，我们这里直接默认master。</p><figure><img src="http://qncdn.yunishare.cn/image-20200710165426499.png@water" alt="image-20200710165426499" tabindex="0" loading="lazy"><figcaption>image-20200710165426499</figcaption></figure><p>接着，向下，我们进入到构建触发器设置。勾选<code>Build when a change is pushed to GitLab. GitLab webhook URL：xxx</code>，记住这里的web hook url，然后，点击下方的高级，点击Generate生成一个Secret token，复制此处的web hook url和token，进入gitlab。</p><figure><img src="http://qncdn.yunishare.cn/image-20200710170424672.png@water" alt="image-20200710170424672" tabindex="0" loading="lazy"><figcaption>image-20200710170424672</figcaption></figure><figure><img src="http://qncdn.yunishare.cn/image-20200710170729746.png@water" alt="image-20200710170729746" tabindex="0" loading="lazy"><figcaption>image-20200710170729746</figcaption></figure><p>进入到我们创建的gitlab项目的设置页面，点击Webhooks，将jenkins中复制的webhook url和生成的token复制到gitlab对应的配置中。如果你没有配置https，请取消勾选Enable SSL选项，然后点击 Add添加即可。</p><figure><img src="http://qncdn.yunishare.cn/image-20200710171247829.png@water" alt="image-20200710171247829" tabindex="0" loading="lazy"><figcaption>image-20200710171247829</figcaption></figure><h3 id="配置构建命令" tabindex="-1"><a class="header-anchor" href="#配置构建命令" aria-hidden="true">#</a> 配置构建命令</h3><p>最后，再进入jienkins项目配置，滑动到构建脚本设置，选择增加构建步骤，选择shell。然后，我们先在这里做一个测试，让其输入一个hello world。点击保存。此时回返回到项目工程页面，点击立即构建，开始执行构建过程。</p><figure><img src="http://qncdn.yunishare.cn/image-20200710172434645.png@water" alt="image-20200710172434645" tabindex="0" loading="lazy"><figcaption>image-20200710172434645</figcaption></figure><img src="http://qncdn.yunishare.cn/image-20200710172640904.png@water" alt="image-20200710172640904" style="zoom:50%;"><p>构建完成后，点击查看控制台输出，我们就可以看到执行了我们配置的shell脚本。</p><img src="http://qncdn.yunishare.cn/image-20200710172830139.png@water" alt="image-20200710172830139" style="zoom:67%;"><figure><img src="http://qncdn.yunishare.cn/image-20200710173026508.png@water" alt="image-20200710173026508" tabindex="0" loading="lazy"><figcaption>image-20200710173026508</figcaption></figure><p>此时整个git接入jenkins配置基本完成。接下来，我们配置一个vue项目完整的测试、构建和部署的步骤。</p><h3 id="编写dockfile文件" tabindex="-1"><a class="header-anchor" href="#编写dockfile文件" aria-hidden="true">#</a> 编写Dockfile文件</h3><p>我们接下来会使用docker构建部署我们的应用，通过Dockerfile，运行docker build，生成定制一个自己的镜像，然后再使用docker执行启动此镜像即可按照Dockerfile我们编写的步骤进行执行相关任务了。</p>',37),m={href:"https://www.jianshu.com/p/cbce69c7a52f",target:"_blank",rel:"noopener noreferrer"},u={href:"https://cn.vuejs.org/v2/cookbook/dockerize-vuejs-app.html",target:"_blank",rel:"noopener noreferrer"},h=i(`<p>下面是vue官网给出的一个Dockerfile一个真实示例：</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># build stage</span>
<span class="token instruction"><span class="token keyword">FROM</span> node:lts-alpine <span class="token keyword">as</span> build-stage</span>
<span class="token instruction"><span class="token keyword">WORKDIR</span> /app </span>
<span class="token instruction"><span class="token keyword">COPY</span> package*.json ./ </span>
<span class="token instruction"><span class="token keyword">RUN</span> npm install</span>
<span class="token instruction"><span class="token keyword">COPY</span> . .</span>
<span class="token instruction"><span class="token keyword">RUN</span> npm run build</span>

<span class="token comment"># production stage</span>
<span class="token instruction"><span class="token keyword">FROM</span> nginx:stable-alpine <span class="token keyword">as</span> production-stage</span>
<span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">build-stage</span></span> /app/dist /usr/share/nginx/html</span>
<span class="token instruction"><span class="token keyword">EXPOSE</span> 80</span>
<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;nginx&quot;</span>, <span class="token string">&quot;-g&quot;</span>, <span class="token string">&quot;daemon off;&quot;</span>]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的Dockerfile文件，分了两个阶段，构建阶段和部署到生产阶段。构建阶段，首先会拉去node，以此为运行环境，然后创建一个应用app目录，拷贝项目，安装依赖，然后构建。接着，进入到生产阶段，拉去nginx作为生产中的环境，复制构建阶段中打包生成的静态文件到nginx静态资源目录，暴露80端口，启动服务。这样就完成了整个构建和发布的过程。这里应用直接发布在了当前的服务器中，但是一般说来，构建的服务器和运行应用的服务器一般不是同一台服务器，此时，我们根据实际需要添加远程部署的脚本即可。</p><p>我们对上述官方提供的Dockerfile文件可以做进一步优化，首先在项目中，可以添加一个.dockerignore文（和.gitignore文件相似，将node_modules，dist等配置进去即可），忽略不必要的文件，不让其参与之后的构建。另外，对应依赖的安装，我们可以借助淘宝镜像源加速安装速度。优化后的Dockerfile如下，然后将其推送到git仓库。</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token comment"># build stage</span>
<span class="token instruction"><span class="token keyword">FROM</span> node:lts-alpine <span class="token keyword">as</span> build-stage # 这里的版本根据自己项目实际需要配置即可</span>
<span class="token comment"># 创建工作目录</span>
<span class="token instruction"><span class="token keyword">WORKDIR</span> /app</span>
<span class="token comment"># 将当前文件夹下的所有文件copy一份到docker镜像中 不需要的文件通过dockerignor文件忽略</span>
<span class="token instruction"><span class="token keyword">COPY</span> . .</span>
<span class="token comment"># 使用淘宝镜像源进行加速</span>
<span class="token instruction"><span class="token keyword">RUN</span> npm install --registry=https://registry.npm.taobao.org</span>
<span class="token comment"># 构建</span>
<span class="token instruction"><span class="token keyword">RUN</span> npm run build</span>

<span class="token comment"># production stage</span>
<span class="token instruction"><span class="token keyword">FROM</span> nginx:stable-alpine <span class="token keyword">as</span> production-stage</span>
<span class="token instruction"><span class="token keyword">COPY</span> <span class="token options"><span class="token property">--from</span><span class="token punctuation">=</span><span class="token string">build-stage</span></span> /app/dist /usr/share/nginx/html</span>
<span class="token instruction"><span class="token keyword">EXPOSE</span> 80</span>
<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">&quot;nginx&quot;</span>, <span class="token string">&quot;-g&quot;</span>, <span class="token string">&quot;daemon off;&quot;</span>]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置jenkins脚本" tabindex="-1"><a class="header-anchor" href="#配置jenkins脚本" aria-hidden="true">#</a> 配置jenkins脚本</h3><p>以上，设置完项目的Dockerfile后，我们就可以进入jenkins配置正式的构建脚本。想一下，我们需要哪些步骤？首先，我们jenkins会从git拉去我们配置的项目，然后，我们读取项目中的Dockerfile文件，使用docker build构建此Dockerfile对应的镜像images，接着，运行生成的镜像即可。</p><p>在此之前，我们还需要先在jenkins中配置几个环境变量，当然，也可以不配置，直接在构建脚本中写死也是可以的。为了，可定制性以及更好的扩展性，定义变量还是有必要的，这样，在点击构建之前，我们都可以设置对应变量的值，达到我们想要的效果。</p><p>进入jenkins配置，勾选‘参数化构建过程’，点击添加参数，选择字符参数。可以定义以下几个参数，容器名称，镜像名称，版本号，端口等。</p><img src="http://qncdn.yunishare.cn/image-20200711174538306.png@water" alt="image-20200711174538306" style="zoom:50%;"><img src="http://qncdn.yunishare.cn/image-20200711174720093.png@water" alt="image-20200711174720093" style="zoom:50%;"><p>变量定义完成之后，便可以开始配置构建阶段的脚本了。下面是一个构建脚本示例，注释已经很详细了，不再一一阐述。配置完，之后进行保存，此时便可以点击构建执行整个vue构建发布过程了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 打印工作目录</span>
<span class="token builtin class-name">pwd</span>
<span class="token comment"># 列出当前文件夹文件详情</span>
<span class="token function">ls</span> <span class="token parameter variable">-la</span>
<span class="token comment"># 以当前文件夹下的Dockerfile构建docker镜像 设置不缓存 这里的image_name和version便是上面我们定义的变量</span>
<span class="token function">docker</span> build --no-cache <span class="token parameter variable">-t</span> <span class="token variable">\${image_name}</span><span class="token builtin class-name">:</span><span class="token variable">\${version}</span> <span class="token builtin class-name">.</span> <span class="token comment"># 注意这里的. 表示当前目录</span>
<span class="token comment"># 运行docker镜像 -itd值交互式终端且不进入容器 name指定容器名  -p指定映射到宿主机的端口 \${image_name}:\${version}表示启动的镜像的名称和版本  这里即上面我们构建的镜像</span>
<span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token parameter variable">--name</span> <span class="token variable">\${container_name}</span> <span class="token parameter variable">-p</span> <span class="token variable">\${port}</span>:80 <span class="token variable">\${image_name}</span><span class="token builtin class-name">:</span><span class="token variable">\${version}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，jenkins就按照配置的步骤和脚本执行，最后启动一个nginx服务，我们直接访问对应的地址和端口就可以看到部署的应用了。</p><img src="http://qncdn.yunishare.cn/image-20200712194408556.png@water" alt="image-20200712194408556" style="zoom:67%;">`,15);function b(v,f){const e=l("ExternalLinkIcon");return o(),c("div",null,[d,g,r(" more "),k,n("blockquote",null,[n("p",null,[a("Dockfile是一种被Docker程序解释的脚本，Dockerfile由一条一条的指令组成，每条指令对应Linux下面的一条命令。Docker程序将这些Dockerfile指令翻译真正的Linux命令。更多信息可参考："),n("a",m,[a("使用Dockerfile构建Docker镜像"),s(e)])])]),n("p",null,[a("vue官网也给出了一个Dockerfile示例（"),n("a",u,[a("Dockerize Vue.js App"),s(e)]),a("），我们可以根据这个示例进行自定义修改即可。")]),h])}const w=t(p,[["render",b],["__file","docker-gitlab-jenkins-CI-CD.html.vue"]]);export{w as default};
