import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as c,o as l,c as p,a as o,b as n,d as s,e,f as t}from"./app-d75e961b.js";const d={},u=n("h2",{id:"前言",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#前言","aria-hidden":"true"},"#"),s(" 前言")],-1),r=n("p",null,"自动化是devOps中重要的一个环节，借助于自动化构建、测试和发布等一些列动作，可以解放开发人员的双手，提高工作效率。这也是我们常说的持续集成（CI)，持续部署(CD)中比较重要的部分。自动化可以帮助我们减少人为的错误，而自动化一旦正确配置，就能永远正确的执行下去。自动化减少我们重复性的劳动从而使开发人员的双手解放出来，去做更多有意义的事情，提高人员能效。开发中自动生成一些代码？自动去区分环境启动？自动打包？自动部署？自动发布？自动报警... 等等，以上这些都可以归到自动化的范畴。",-1),m=t('<p>前端自动化流程已经有许多优秀的工具去帮助我们实现这一任务，其中，使用最广泛的就是gitlab+Jenkins，从打包到发布以及回滚等一系列流程。但是本文所要讲述的并不是jenkins，而是gitlab-runner。为什么要使用gitlab-runner，而不用jenkins呢？</p><ol><li>好奇心：想试试不同的工具，既然又另外一种选择，何不去试试，万一真香呢？</li><li>做个对比：jenkins是功能强大，插件多，无所不能，但是对于我这种单一需求，有时候不需要那么多其他功能。这个时候小而美更适合</li><li>近亲：gitlab和gitlab-runner是血亲啊，两者配合有天然的默契。</li></ol><p>本文主要使用到docker容器技术，需要对docke有基本的了解，能根据相关文档自行完成docker及compose的安装等。</p><h2 id="准备" tabindex="-1"><a class="header-anchor" href="#准备" aria-hidden="true">#</a> 准备</h2><p>既然要使用gitlab，首先我们就需要搭建一个gitlab服务，并配置上gitlab-runer。所以，前提我们要有一台服务器，用来支撑我们整个的自动化流程。服务器推荐使用Linux操作系统，国内一般使用centOS。至于环境，为了以后的可移植性以及环境的一致性，建议采用Docker进行维护。至于Docker的好处，之后会专门介绍，这里不做过多阐述。</p><p>用到的技术：Linux + docker(docker-compose) + gitlab + gitlab-CI /gitlab-runner</p><h2 id="配置环境和服务" tabindex="-1"><a class="header-anchor" href="#配置环境和服务" aria-hidden="true">#</a> 配置环境和服务</h2><p>服务器购买建议2核4G以上，带宽根据自己的预算购买即可（建议大家在搞活动的时候买，阿里、腾讯、华为等等服务商太多了，购买时可以做个对比，货比三家）。本文使用的服务器是华为的2核4G5M的云服务器，仅作参考。</p><h3 id="docker安装" tabindex="-1"><a class="header-anchor" href="#docker安装" aria-hidden="true">#</a> docker安装</h3><blockquote><p>Docker 是一个用于开发，交付和运行应用程序的开放平台。Docker 使您能够将应用程序与基础架构分开，从而可以快速交付软件。借助 Docker，您可以与管理应用程序相同的方式来管理基础架构。通过利用 Docker 的方法来快速交付，测试和部署代码，您可以大大减少编写代码和在生产环境中运行代码之间的延迟。</p></blockquote><p>docker 与虚拟机不同，虚拟机是操作系统层的隔离，每一个虚拟机是一个独立的操作系统，独立的硬件资源。而docker是在操作系统层级上的环境隔离，共享系统硬件和资源。</p>',11),v={href:"https://docs.docker.com/engine/install/centos/",target:"_blank",rel:"noopener noreferrer"},k={href:"https://docker_practice.gitee.io/zh-cn/install/centos.html",target:"_blank",rel:"noopener noreferrer"},b={href:"https://www.runoob.com/docker/ubuntu-docker-install.html",target:"_blank",rel:"noopener noreferrer"},g=n("h3",{id:"docker-compose安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#docker-compose安装","aria-hidden":"true"},"#"),s(" docker-compose安装")],-1),_=n("p",null,"docker compose 是用于定义和运行多容器 Docker 应用程序的工具。通常我们使用docker去部署一个服务，需要通过冗长的 docker 命令去将服务部署启动， 而docker compose则是通过一个声明式的配置文件描述整个应用，从而使用一条命令完成部署，可以简单理解为通过配置文件来代替冗长的docker命令，从而能更好的管理和配置docker应用。",-1),h={href:"https://docs.docker.com/compose/install/",target:"_blank",rel:"noopener noreferrer"},T={href:"https://www.runoob.com/docker/docker-compose.html",target:"_blank",rel:"noopener noreferrer"},A=n("h3",{id:"gitlab及gitlab-runner搭建和配置",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#gitlab及gitlab-runner搭建和配置","aria-hidden":"true"},"#"),s(" gitlab及gitlab-runner搭建和配置")],-1),E={href:"https://docs.gitlab.com/omnibus/docker/#install-gitlab-using-docker-compose",target:"_blank",rel:"noopener noreferrer"},y={href:"https://github.com/sameersbn/docker-gitlab/blob/master/docker-compose.yml",target:"_blank",rel:"noopener noreferrer"},S=t(`<p>下面是我自己使用的yaml的配置，并在上面的gitlab配置中，增加了gitlab-runner的镜像配置，且加了部分注释，使用此文件，可以一步到位完成gitlab和gitlab-runner的安装，配置如下：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">&#39;2&#39;</span>

services<span class="token punctuation">:</span>、
  <span class="token comment"># gitlab使用的redis</span>
  <span class="token key atrule">redis</span><span class="token punctuation">:</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always <span class="token comment">#设置自动重启</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> sameersbn/redis<span class="token punctuation">:</span>4.0.9<span class="token punctuation">-</span><span class="token number">2</span> <span class="token comment">#依赖的镜像</span>
    <span class="token key atrule">command</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>loglevel warning
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> /home/gitlab/redis<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/redis<span class="token punctuation">:</span>Z  <span class="token comment"># 前面指映射到宿主机的路径 可以自行修改 将容器内部的redis路径映射到宿主机的/home/gitlab/redis-data路径</span>
  <span class="token comment"># gitlab使用的sql</span>
  <span class="token key atrule">postgresql</span><span class="token punctuation">:</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">image</span><span class="token punctuation">:</span> sameersbn/postgresql<span class="token punctuation">:</span>10<span class="token punctuation">-</span><span class="token number">2</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> /home/gitlab/postgresql<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/var/lib/postgresql<span class="token punctuation">:</span>Z <span class="token comment"># 映射路径</span>
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> DB_USER=gitlab <span class="token comment">#数据库账户</span>
    <span class="token punctuation">-</span> DB_PASS=password <span class="token comment">#数据库密码</span>
    <span class="token punctuation">-</span> DB_NAME=gitlabhq_production
    <span class="token punctuation">-</span> DB_EXTENSION=pg_trgm

  <span class="token key atrule">gitlab</span><span class="token punctuation">:</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">image</span><span class="token punctuation">:</span> sameersbn/gitlab<span class="token punctuation">:</span>12.9.2
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span> <span class="token comment">#依赖的模块，等他们完成之后我再启动</span>
    <span class="token punctuation">-</span> redis
    <span class="token punctuation">-</span> postgresql
    <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token string">&quot;10080:80&quot;</span> <span class="token comment"># 映射到宿主机的端口</span>
    <span class="token punctuation">-</span> <span class="token string">&quot;10022:22&quot;</span>
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> /home/gitlab/gitlab<span class="token punctuation">-</span>data<span class="token punctuation">:</span>/home/git/data<span class="token punctuation">:</span>Z
    <span class="token key atrule">environment</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> DEBUG=false
    <span class="token comment"># 依赖的数据库相关配置</span>
    <span class="token punctuation">-</span> DB_ADAPTER=postgresql
    <span class="token punctuation">-</span> DB_HOST=postgresql
    <span class="token punctuation">-</span> DB_PORT=5432
    <span class="token punctuation">-</span> DB_USER=gitlab
    <span class="token punctuation">-</span> DB_PASS=password
    <span class="token punctuation">-</span> DB_NAME=gitlabhq_production
    <span class="token comment"># 依赖的redis相关配置</span>
    <span class="token punctuation">-</span> REDIS_HOST=redis
    <span class="token punctuation">-</span> REDIS_PORT=6379

    <span class="token punctuation">-</span> TZ=Asia/Kolkata
    <span class="token punctuation">-</span> GITLAB_TIMEZONE=Kolkata

    <span class="token punctuation">-</span> GITLAB_HTTPS=false
    <span class="token punctuation">-</span> SSL_SELF_SIGNED=false

    <span class="token punctuation">-</span> GITLAB_HOST=xxx.xxx.xxx.xxx <span class="token comment"># 对外域名或ip</span>
    <span class="token punctuation">-</span> GITLAB_PORT=10080 <span class="token comment"># 访问git的端口号</span>
    <span class="token punctuation">-</span> GITLAB_SSH_PORT=10022 <span class="token comment"># 指定ssh端口</span>
    <span class="token punctuation">-</span> GITLAB_RELATIVE_URL_ROOT=
    <span class="token punctuation">-</span> GITLAB_SECRETS_DB_KEY_BASE=79e7f30b<span class="token punctuation">-</span>72ce<span class="token punctuation">-</span>4710<span class="token punctuation">-</span>bf57<span class="token punctuation">-</span>f1803015c4ef <span class="token comment"># 直接用 uuidgen 生成一个就好了</span>
    <span class="token punctuation">-</span> GITLAB_SECRETS_SECRET_KEY_BASE=3284d708<span class="token punctuation">-</span>951e<span class="token punctuation">-</span>4125<span class="token punctuation">-</span>9d44<span class="token punctuation">-</span>daee021c5b54 <span class="token comment"># 直接用 uuidgen 生成一个就好了</span>
    <span class="token punctuation">-</span> GITLAB_SECRETS_OTP_KEY_BASE=79f55415<span class="token punctuation">-</span>42ad<span class="token punctuation">-</span>41d3<span class="token punctuation">-</span>a20c<span class="token punctuation">-</span>753950359csw <span class="token comment"># 直接用 uuidgen 生成一个就好了</span>

    <span class="token punctuation">-</span> GITLAB_ROOT_PASSWORD=xxxxxxx <span class="token comment">#密码 至少8位数</span>
    <span class="token punctuation">-</span> GITLAB_ROOT_EMAIL=xxxxx@xx.com <span class="token comment">#初始化管理员登录的邮箱</span>

    <span class="token punctuation">-</span> GITLAB_NOTIFY_ON_BROKEN_BUILDS=true
    <span class="token punctuation">-</span> GITLAB_NOTIFY_PUSHER=false
    <span class="token comment"># 邮箱相关配置</span>
    <span class="token punctuation">-</span> GITLAB_EMAIL=notifications@example.com
    <span class="token punctuation">-</span> GITLAB_EMAIL_REPLY_TO=noreply@example.com
    <span class="token punctuation">-</span> GITLAB_INCOMING_EMAIL_ADDRESS=reply@example.com
    <span class="token comment"># 备份相关配置</span>
    <span class="token punctuation">-</span> GITLAB_BACKUP_SCHEDULE=daily
    <span class="token punctuation">-</span> GITLAB_BACKUP_TIME=01<span class="token punctuation">:</span><span class="token number">00</span>
    <span class="token punctuation">-</span> GITLAB_BACKUP_EXPIRY=604800 <span class="token comment">#每七天备份清理之前的备份</span>
    <span class="token comment"># 邮件服务相关配置</span>
    <span class="token punctuation">-</span> SMTP_ENABLED=false
    <span class="token punctuation">-</span> SMTP_DOMAIN=xxx.com
    <span class="token punctuation">-</span> SMTP_HOST=smtp.xxx.com
    <span class="token punctuation">-</span> SMTP_PORT=465
    <span class="token punctuation">-</span> SMTP_USER=xxx@xxx.com
    <span class="token punctuation">-</span> SMTP_PASS=xxxxxxx
    <span class="token punctuation">-</span> SMTP_STARTTLS=true
    <span class="token punctuation">-</span> SMTP_AUTHENTICATION=login

    <span class="token punctuation">-</span> IMAP_ENABLED=false
    <span class="token punctuation">-</span> IMAP_HOST=imap.gmail.com
    <span class="token punctuation">-</span> IMAP_PORT=993
    <span class="token punctuation">-</span> IMAP_USER=mailer@example.com
    <span class="token punctuation">-</span> IMAP_PASS=password
    <span class="token punctuation">-</span> IMAP_SSL=true
    <span class="token punctuation">-</span> IMAP_STARTTLS=false
    
    <span class="token punctuation">-</span> OAUTH_ENABLED=false
    <span class="token punctuation">-</span> OAUTH_AUTO_SIGN_IN_WITH_PROVIDER=
    <span class="token punctuation">-</span> OAUTH_ALLOW_SSO=
    <span class="token punctuation">-</span> OAUTH_BLOCK_AUTO_CREATED_USERS=true
    <span class="token punctuation">-</span> OAUTH_AUTO_LINK_LDAP_USER=false
    <span class="token punctuation">-</span> OAUTH_AUTO_LINK_SAML_USER=false
    <span class="token punctuation">-</span> OAUTH_EXTERNAL_PROVIDERS=

    <span class="token punctuation">-</span> OAUTH_CAS3_LABEL=cas3
    <span class="token punctuation">-</span> OAUTH_CAS3_SERVER=
    <span class="token punctuation">-</span> OAUTH_CAS3_DISABLE_SSL_VERIFICATION=false
    <span class="token punctuation">-</span> OAUTH_CAS3_LOGIN_URL=/cas/login
    <span class="token punctuation">-</span> OAUTH_CAS3_VALIDATE_URL=/cas/p3/serviceValidate
    <span class="token punctuation">-</span> OAUTH_CAS3_LOGOUT_URL=/cas/logout

    <span class="token punctuation">-</span> OAUTH_GOOGLE_API_KEY=
    <span class="token punctuation">-</span> OAUTH_GOOGLE_APP_SECRET=
    <span class="token punctuation">-</span> OAUTH_GOOGLE_RESTRICT_DOMAIN=

    <span class="token punctuation">-</span> OAUTH_FACEBOOK_API_KEY=
    <span class="token punctuation">-</span> OAUTH_FACEBOOK_APP_SECRET=

    <span class="token punctuation">-</span> OAUTH_TWITTER_API_KEY=
    <span class="token punctuation">-</span> OAUTH_TWITTER_APP_SECRET=

    <span class="token punctuation">-</span> OAUTH_GITHUB_API_KEY=
    <span class="token punctuation">-</span> OAUTH_GITHUB_APP_SECRET=
    <span class="token punctuation">-</span> OAUTH_GITHUB_URL=
    <span class="token punctuation">-</span> OAUTH_GITHUB_VERIFY_SSL=

    <span class="token punctuation">-</span> OAUTH_GITLAB_API_KEY=
    <span class="token punctuation">-</span> OAUTH_GITLAB_APP_SECRET=

    <span class="token punctuation">-</span> OAUTH_BITBUCKET_API_KEY=
    <span class="token punctuation">-</span> OAUTH_BITBUCKET_APP_SECRET=

    <span class="token punctuation">-</span> OAUTH_SAML_ASSERTION_CONSUMER_SERVICE_URL=
    <span class="token punctuation">-</span> OAUTH_SAML_IDP_CERT_FINGERPRINT=
    <span class="token punctuation">-</span> OAUTH_SAML_IDP_SSO_TARGET_URL=
    <span class="token punctuation">-</span> OAUTH_SAML_ISSUER=
    <span class="token punctuation">-</span> OAUTH_SAML_LABEL=&quot;Our SAML Provider&quot;
    <span class="token punctuation">-</span> OAUTH_SAML_NAME_IDENTIFIER_FORMAT=urn<span class="token punctuation">:</span>oasis<span class="token punctuation">:</span>names<span class="token punctuation">:</span>tc<span class="token punctuation">:</span>SAML<span class="token punctuation">:</span>2.0<span class="token punctuation">:</span>nameid<span class="token punctuation">-</span>format<span class="token punctuation">:</span>transient
    <span class="token punctuation">-</span> OAUTH_SAML_GROUPS_ATTRIBUTE=
    <span class="token punctuation">-</span> OAUTH_SAML_EXTERNAL_GROUPS=
    <span class="token punctuation">-</span> OAUTH_SAML_ATTRIBUTE_STATEMENTS_EMAIL=
    <span class="token punctuation">-</span> OAUTH_SAML_ATTRIBUTE_STATEMENTS_NAME=
    <span class="token punctuation">-</span> OAUTH_SAML_ATTRIBUTE_STATEMENTS_USERNAME=
    <span class="token punctuation">-</span> OAUTH_SAML_ATTRIBUTE_STATEMENTS_FIRST_NAME=
    <span class="token punctuation">-</span> OAUTH_SAML_ATTRIBUTE_STATEMENTS_LAST_NAME=

    <span class="token punctuation">-</span> OAUTH_CROWD_SERVER_URL=
    <span class="token punctuation">-</span> OAUTH_CROWD_APP_NAME=
    <span class="token punctuation">-</span> OAUTH_CROWD_APP_PASSWORD=

    <span class="token punctuation">-</span> OAUTH_AUTH0_CLIENT_ID=
    <span class="token punctuation">-</span> OAUTH_AUTH0_CLIENT_SECRET=
    <span class="token punctuation">-</span> OAUTH_AUTH0_DOMAIN=
    <span class="token punctuation">-</span> OAUTH_AUTH0_SCOPE=

    <span class="token punctuation">-</span> OAUTH_AZURE_API_KEY=
    <span class="token punctuation">-</span> OAUTH_AZURE_API_SECRET=
    <span class="token punctuation">-</span> OAUTH_AZURE_TENANT_ID=
  <span class="token comment"># gitlab -runner配置</span>
  <span class="token key atrule">gitlab-runner</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> gitlab/gitlab<span class="token punctuation">-</span>runner<span class="token punctuation">:</span>latest
    <span class="token key atrule">container_name</span><span class="token punctuation">:</span> gitlab<span class="token punctuation">-</span>runner <span class="token comment"># 容器名称</span>
    <span class="token key atrule">restart</span><span class="token punctuation">:</span> always
    <span class="token key atrule">depends_on</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> gitlab
    <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> ./config/gitlab<span class="token punctuation">-</span>runner<span class="token punctuation">:</span>/etc/gitlab<span class="token punctuation">-</span>runner
    <span class="token punctuation">-</span> /var/run/docker.sock<span class="token punctuation">:</span>/var/run/docker.sock <span class="token comment"># 这个映射地址不需要修改，此为映射的docker再本机的地址即可</span>

<span class="token key atrule">volumes</span><span class="token punctuation">:</span>
  <span class="token key atrule">redis-data</span><span class="token punctuation">:</span>
  <span class="token key atrule">postgresql-data</span><span class="token punctuation">:</span>
  <span class="token key atrule">gitlab-data</span><span class="token punctuation">:</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在服务器上新建一个目录，比如gitlab目录，然后新建一个docker-compose.yml文件，将以上的配置，复制到此新建的yml中，并修改位自己服务器的配置，保存退出。然后，在当前文件下，执行 <code>docker-compose up -d</code>命令，可以看到docker 开始根据yml文件内的配置拉去gitlab、redis、gitlab-runner等镜像，我们耐心等待即可，拉去镜像完成后docker会按照对应得配置启动服务。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">mkdir</span> gitlab <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> gitlab
$ <span class="token function">vi</span> docker-compose.yml
$ <span class="token function">docker-compose</span> up <span class="token parameter variable">-d</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果docker拉去相关镜像过慢，请配置docker源为国内镜像，如网易镜像，清华镜像等。使用<code>vi /etc/docker/daemon.json</code>修改docker镜像源配置，下面是我的个人配置，使用了三个源，如果有一个源不可用，则会自动使用另外的源：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">&quot;registry-mirrors&quot;</span><span class="token operator">:</span>
    <span class="token punctuation">[</span>
        <span class="token string">&quot;https://dockerhub.azk8s.cn&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;https://hub-mirror.c.163.com&quot;</span><span class="token punctuation">,</span>
        <span class="token string">&quot;https://registry.docker-cn.com&quot;</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>gitlab完成启动后，可以通过<code>docker ps</code>查看当前运行的docker应用。下图为我已经按照的docker应用，这里会显示应用的服务信息，如名称，时间，端口等等。</p><figure><img src="http://qncdn.yunishare.cn/image-20200913154943702.png@water" alt="image-20200913154943702" tabindex="0" loading="lazy"><figcaption>image-20200913154943702</figcaption></figure><p>此时，如果gitlab按照正常，访问你的服务器地址加对应的端口号就可以进入gitlab登录界面了。账户和密码就是上面yml中配置的账户和密码。</p><figure><img src="http://qncdn.yunishare.cn/image-20200913155543445.png@water" alt="image-20200913155543445" tabindex="0" loading="lazy"><figcaption>image-20200913155543445</figcaption></figure><h2 id="创建项目" tabindex="-1"><a class="header-anchor" href="#创建项目" aria-hidden="true">#</a> 创建项目</h2><h3 id="创建前端项目" tabindex="-1"><a class="header-anchor" href="#创建前端项目" aria-hidden="true">#</a> 创建前端项目</h3><p>本次以一个react项目为例，创建一个react项目仓库，然后在本地开发环境，使用create-react-app脚手架创建一个工程化得react项目，然后推送到我们所新建得仓库中。</p><img src="http://qncdn.yunishare.cn/image-20200913163345054.png@water" alt="image-20200913163345054" style="zoom:50%;"><img src="http://qncdn.yunishare.cn/image-20200913170223307.png@water" alt="image-20200913170223307" style="zoom:50%;"><h2 id="配置项目ci-cd" tabindex="-1"><a class="header-anchor" href="#配置项目ci-cd" aria-hidden="true">#</a> 配置项目CI/CD</h2><p>新建完项目后，我们进入到CI/CD - 流水线，由于我们还未配置gitlab-ci，所以，此时会提示你学习流水线相关文档。从gitlab8.0 开始，持续集成 （CI） 完全集成到 GitLab，要使用gitlab-ci必须要在项目根目录创建一个<code>.gitlab-ci.yml</code>文件，gitlab-ci将根据此yml文件得配置执行相应的作业（job）流水（pipeline）。</p><h3 id="gitlab-runner配置" tabindex="-1"><a class="header-anchor" href="#gitlab-runner配置" aria-hidden="true">#</a> gitlab-runner配置</h3><h4 id="runner简介" tabindex="-1"><a class="header-anchor" href="#runner简介" aria-hidden="true">#</a> runner简介</h4><p>在 GitLab CI 中，runner运行.gitlab-ci.yml 中定义的代码。runner运行程序可以特定于某个项目，也可以为 GitLab CI 中的其他项目服务。</p><p>在此之前，如果你的gitlab还未安装gitlab-runner，则需要先安装gitlab-runner，然后配置gitlab-ci才会生效。可以将runner理解为执行自动化作业得执行者，每个项目都可以设置多个runner，也可以将一个runner设置为全局的runner供全局使用。</p><figure><img src="http://qncdn.yunishare.cn/image-20200913170758499.png@water" alt="image-20200913170758499" tabindex="0" loading="lazy"><figcaption>image-20200913170758499</figcaption></figure><h3 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a></h3><h4 id="手动设置runner" tabindex="-1"><a class="header-anchor" href="#手动设置runner" aria-hidden="true">#</a> 手动设置runner</h4><p>在gitlab设置中，点击CI/CD找到runner列，然后点击右侧的展开按钮，下滑，可以看到有一个手动设置特定的runner面板说明如何自定义设置runner。其中下图的URL和注册令牌（token）会在下面注册runner时使用到。</p><figure><img src="http://qncdn.yunishare.cn/image-20200920145945721.png@water" alt="image-20200920145945721" tabindex="0" loading="lazy"><figcaption>image-20200920145945721</figcaption></figure><p>具体配置的步骤，可以参考下图，主要分为四个步骤：</p><ol><li><p>安装gitlabe runner。我们在使用docker-compose安装gitlab的时候已经配置安装了gitlab-runner，可以跳过这一步。</p></li><li><p>注册runner。我们使用命令行的方式注册，执行 <code>gitlab-runner register</code>便可以注册runner，但是，由于我们是在docker中运行的gitlab-runner，所以，需要先进入到gitlab-runner容器，然后再执行注册的命令。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> gitlab-runner gitlab-runner register
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>以上就是在docker中注册runner的命令，其中exec是进入docker容器的命令。-i值交互式操作，-t只终端。</p></li><li><p>设置runner参数：执行完命令后，runner会提示用户选择和设置相关参数，如：url，注册runner的token（上图所示的令牌），</p><figure><img src="http://qncdn.yunishare.cn/image-20200920144503629.png@water" alt="image-20200920144503629" tabindex="0" loading="lazy"><figcaption>image-20200920144503629</figcaption></figure></li></ol><p>runner注册终端过程交互信息如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>Please enter the gitlab-ci coordinator URL <span class="token punctuation">(</span>e.g. https://gitlab.com/<span class="token punctuation">)</span>: <span class="token comment"># 选择 gitURL 这里就是上面图示所标的gitURL</span>
<span class="token punctuation">[</span>http://33.136.135.100:16080/<span class="token punctuation">]</span>:                            <span class="token comment"># 这里由于默认和我的URL一样我没有再输入          </span>
Please enter the gitlab-ci token <span class="token keyword">for</span> this runner:   <span class="token comment"># 输入上面所看到的令牌 token</span>
rHdfwWhueg76SWTdRa_vC                               <span class="token comment"># 输入的token</span>
Please enter the gitlab-ci description <span class="token keyword">for</span> this runner:  <span class="token comment"># 输入描述</span>
<span class="token punctuation">[</span>65f53d5278ce<span class="token punctuation">]</span>: react-ci  
Please enter the gitlab-ci tags <span class="token keyword">for</span> this runner <span class="token punctuation">(</span>comma separated<span class="token punctuation">)</span>: <span class="token comment"># 创建一个tag 这里后面配置要用到</span>
react
Registering runner<span class="token punctuation">..</span>. succeeded       <span class="token comment"># 注册成功了              runner=rHdfwW71</span>
Please enter the executor: custom, docker-ssh, shell, virtualbox, docker-ssh+machine, docker, parallels, ssh, docker+machine, kubernetes:   <span class="token comment"># 选择runner执行容器 在什么环境执行 这里我们选择docker</span>
<span class="token punctuation">[</span>shell<span class="token punctuation">]</span>: <span class="token function">docker</span>
Please enter the default Docker image <span class="token punctuation">(</span>e.g. ruby:2.6<span class="token punctuation">)</span>:  <span class="token comment"># 选择docker的版本 默认也可以 我们这里选择stable</span>
docker:stable
Runner registered successfully. Feel <span class="token function">free</span> to start it, but <span class="token keyword">if</span> it&#39;s running already the config should be automatically reloaded<span class="token operator">!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上，就完成了项目对应runner的注册。现在工厂和机器都已经有了，下一步就是设置机器（runner）执行的步骤和工作了。</p><h3 id="流水线gitlab-ci-yml配置" tabindex="-1"><a class="header-anchor" href="#流水线gitlab-ci-yml配置" aria-hidden="true">#</a> 流水线gitlab-ci.yml配置</h3><p>gitlab CI/CD持续集成服务，是通过gitlab.yml中的配置，去执行对应的工作。当我们在项目根目录中添加 <code>.gitlab-ci.yml</code> 文件，并配置项目的运行器( <code>GitLab Runner</code> )，那么后续的每次提交都会触发CI流水线( <code>pipeline</code> )的执行。<code>.gitlab-ci.yml</code> 文件会告诉运行器需要做哪些事情，默认情况下，流水线有 <code>build</code> 、<code>test</code> 、<code>deploy</code> 三个阶段，即 <code>构建</code> 、<code>测试</code> 、<code>部署</code> ，未被使用的阶段将会被自动忽略。下面，我们就来配置下对应的工作流水。</p><h4 id="gitlab-ci-yml配置参数" tabindex="-1"><a class="header-anchor" href="#gitlab-ci-yml配置参数" aria-hidden="true">#</a> .gitlab-ci.yml配置参数</h4><table><thead><tr><th>关键词</th><th>描述</th></tr></thead><tbody><tr><td>script</td><td>必选参数，指定runner运行的脚本（如 npm run build)</td></tr><tr><td>image</td><td>需要在docker中使用到的环境镜像（如 node:8.11.2)</td></tr><tr><td>services</td><td>需要的service镜像</td></tr><tr><td>before_script</td><td>作业执行前需要执行的命令</td></tr><tr><td>after_script</td><td>作业执行后需要执行的命令</td></tr><tr><td>stages</td><td>定义流水线所有的阶段</td></tr><tr><td>stage</td><td>定义作业所处流水线的阶段(默认test阶段)</td></tr><tr><td>only</td><td>限制作业在什么时候创建运行（比如是某个分支、某个tag等）</td></tr><tr><td>except</td><td>限制作业在什么时候不创建运行</td></tr><tr><td>tags</td><td>作用使用的Runner运行器的标签列表</td></tr><tr><td>allow_failure</td><td>允许作业失败，失败的作业不影响提交的状态</td></tr><tr><td>when</td><td>指定什么时候运行作业</td></tr><tr><td>environment</td><td>部署的环境</td></tr><tr><td>cache</td><td>指定需要在job之间缓存的文件或目录</td></tr><tr><td>artifacts</td><td>归档文件列表，指定成功后应附加到job的文件和目录的列表</td></tr><tr><td>dependencies</td><td>当前作业依赖的其他作业，你可以使用依赖作业的归档文件</td></tr><tr><td>coverage</td><td>作业的代码覆盖率</td></tr><tr><td>retry</td><td>作业失败时，可以自动尝试的次数</td></tr><tr><td>parallel</td><td>指定并行运行的作业实例</td></tr><tr><td>trigger</td><td>定义下游流水线的触发器</td></tr><tr><td>include</td><td>作业加载其他YAML文件</td></tr><tr><td>extends</td><td>控制实体从哪里继承</td></tr><tr><td>variables</td><td>定义环境变量</td></tr></tbody></table><p>可以看到，上面可以配置的参数非常之多，不过，我们常用的并没有多少，如script、only、stage、before_script等。下面我们只对常用的几个参数进行说明，更多的请参考文档底部的参考文章，去查看更多更详细的配置介绍。</p><h4 id="项目配置" tabindex="-1"><a class="header-anchor" href="#项目配置" aria-hidden="true">#</a> 项目配置</h4><p>由于，我们这次的项目为react项目，所以，我们只需要runner执行相应的打包、测试、和部署命令即可。</p><h5 id="script" tabindex="-1"><a class="header-anchor" href="#script" aria-hidden="true">#</a> <code>script</code></h5><p><code>script</code> 是作业中唯一必须的关键字参数，是运行器需要执行的脚本，如:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>build1:
  script:
    - echo &quot;hello build&quot;
    - ls -a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>表示build1作业需要执行的命令是输出”Do your build here”。</p><h5 id="image" tabindex="-1"><a class="header-anchor" href="#image" aria-hidden="true">#</a> <code>image</code></h5><p><code>image</code> 指定Docker中使用的镜像。如 <code>iamge:node</code> 。</p><h5 id="before-script" tabindex="-1"><a class="header-anchor" href="#before-script" aria-hidden="true">#</a> <code>before_script</code></h5><p><code>before_script</code> 用于定义在所有作业之前需要执行的命令，比如更新代码、安装依赖、打印调试信息之类的事情。</p><p><code>after_script</code> 类似。</p><p>示例:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>before_script:
  - echo &quot;Before script section&quot;
  - echo &quot;For example you might run an update here or install a build dependency&quot;
  - echo &quot;Or perhaps you might print out some debugging details&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="stage" tabindex="-1"><a class="header-anchor" href="#stage" aria-hidden="true">#</a> <code>stage</code></h5><p><code>stage</code> 定义流水线中每个作业所处的阶段，处于相同阶段的作业并行执行。</p><h5 id="only-和-except" tabindex="-1"><a class="header-anchor" href="#only-和-except" aria-hidden="true">#</a> <code>only</code> 和 <code>except</code></h5><p><code>only</code> 和 <code>except</code> 用于在创建作业时对作业的限制策略。</p><ul><li><code>only</code> 定义了哪些分支或标签(branches and tags)的作业会运行</li><li><code>except</code> 定义了哪些分支或标签(branches and tags)的作业不会运行</li></ul><p>下面是策略规则：</p><ul><li><code>only</code> 和 <code>except</code> 可同时使用，如果在一个作业中同时定义了 <code>only</code> 和 <code>except</code> ，则同时 <code>only</code> <code>except</code> 进行过滤(注意，不是忽略 <code>except</code> 条件) 。</li><li><code>only</code> 和 <code>except</code> 可以使用正则表达式。</li><li><code>only</code> 和 <code>except</code> 允许指定用于过滤forks作业的存储库路径。</li><li><code>only</code> 和 <code>except</code> 中可以使用特殊的关键字，如 <code>branches</code> 、 <code>tags</code> 、 <code>api</code> 、 <code>external</code> 、 <code>pipelines</code> 、 <code>pushes</code> 、 <code>schedules</code> 、 <code>triggers</code> 、 <code>web</code> 、 <code>merge_requests</code> 、 <code>chats</code> 等。</li></ul><p>根据以上内容，我们配置下构建build和测试test阶段的配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">image</span><span class="token punctuation">:</span> node<span class="token punctuation">:</span>8.11.2  <span class="token comment"># 指定node镜像及版本</span>

<span class="token key atrule">cache</span><span class="token punctuation">:</span>  <span class="token comment"># 定义缓存的目录 由于是node项目需要缓存node_modules即可</span>
  <span class="token key atrule">paths</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> node_modules/

<span class="token key atrule">stages</span><span class="token punctuation">:</span>  <span class="token comment"># 定义工作要执行的几个阶段 测试、构建和部署</span>
  <span class="token punctuation">-</span> test
  <span class="token punctuation">-</span> build
  <span class="token punctuation">-</span> deploy

<span class="token key atrule">unit_test</span><span class="token punctuation">:</span>   <span class="token comment"># 自定义的测试阶段名字 </span>
  <span class="token key atrule">stage</span><span class="token punctuation">:</span> test <span class="token comment"># 指定要执行的阶段 test（测试）</span>
  <span class="token key atrule">tags</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> react  <span class="token comment"># 这里就是我们上面注册runner时所定义的tag</span>
  <span class="token key atrule">only</span><span class="token punctuation">:</span>   <span class="token comment"># 定义触发执行的分支 master</span>
    <span class="token punctuation">-</span> master  
  <span class="token key atrule">script</span><span class="token punctuation">:</span>  <span class="token comment"># test阶段需要执行的脚本</span>
    <span class="token punctuation">-</span> echo &#39;我是模拟的测试test过程<span class="token punctuation">...</span>&#39;
  <span class="token key atrule">after_script</span><span class="token punctuation">:</span> <span class="token comment">#执行完后要执行的东西</span>
    <span class="token punctuation">-</span> echo &#39;unit test done.&#39;

<span class="token key atrule">compile</span><span class="token punctuation">:</span>  <span class="token comment"># 自动逸的构建阶段名称</span>
  <span class="token key atrule">stage</span><span class="token punctuation">:</span> build
  <span class="token key atrule">tags</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> react
  <span class="token key atrule">only</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> master
  <span class="token key atrule">before_script</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> npm install
  <span class="token key atrule">script</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> npm run build
  <span class="token key atrule">artifacts</span><span class="token punctuation">:</span>  <span class="token comment"># 定义runner工作成功或失败后产物/文件,作业完成后文件被发送到gitlab 这里我们留存生成的dist文件</span>
    <span class="token key atrule">expire_in</span><span class="token punctuation">:</span> 1 week  <span class="token comment"># 设置文件过期时间为一周</span>
    <span class="token key atrule">paths</span><span class="token punctuation">:</span>  <span class="token comment"># 文件路径</span>
      <span class="token punctuation">-</span> dist

<span class="token key atrule">deploy_test</span><span class="token punctuation">:</span>
  <span class="token key atrule">stage</span><span class="token punctuation">:</span> deploy
  <span class="token key atrule">tags</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> react
  <span class="token key atrule">only</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> master
  <span class="token key atrule">dependencies</span><span class="token punctuation">:</span> <span class="token comment"># 当前作业阶段依赖的作业 部署依赖于build构建作业</span>
    <span class="token punctuation">-</span> compile
  
  <span class="token key atrule">script</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> echo &#39;登录项目部署服务器，部署项目&#39;
  <span class="token key atrule">when</span><span class="token punctuation">:</span> <span class="token comment"># 只有前面的阶段的所有作业都success成功时才执行</span>
    on_success


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="触发runner" tabindex="-1"><a class="header-anchor" href="#触发runner" aria-hidden="true">#</a> 触发runner</h4><p>我们在react项目中新建一个.gitlab-ci.yml文件，然后将上述内容复制进去，保存，提交，推送到远程gitlab中。然后，进入到项目的CI/CD - 流水线 就可以看到设置的任务执行了。由于第一次执行，所以耐心等待编译即可。</p><figure><img src="http://qncdn.yunishare.cn/image-20200920163810026.png@water" alt="image-20200920163810026" tabindex="0" loading="lazy"><figcaption>image-20200920163810026</figcaption></figure><figure><img src="http://qncdn.yunishare.cn/image-20200920164932292.png@water" alt="image-20200920164932292" tabindex="0" loading="lazy"><figcaption>image-20200920164932292</figcaption></figure><img src="http://qncdn.yunishare.cn/image-20200920165019791.png@water" alt="image-20200920165019791" style="zoom:67%;"><p>到此为止，从gitlab搭建，gitlab-runner安装、注册，自动化构建部署已基本完成。至于部署部分，后面再更新，有条件的自己可以试试如何部署到另外一台服务器。</p>`,64);function f(O,x){const a=c("ExternalLinkIcon");return l(),p("div",null,[u,r,o(" more "),m,n("p",null,[s("docker的安装和配置，直接参考"),n("a",v,[s("官网安装文档"),e(a)]),s("即可，对于英语不好的童鞋，可以参考下面的两个中文文档：")]),n("ul",null,[n("li",null,[n("a",k,[s("CentOS 安装 Docker CE"),e(a)])]),n("li",null,[n("a",b,[s("菜鸟教程-CentOS Docker安装"),e(a)])])]),g,_,n("p",null,[s("docker-compose安装比较简单，可以直接参照官方的"),n("a",h,[s("docker-compose的安装文档"),e(a)]),s("，或者参考"),n("a",T,[s("菜鸟教程的docker-compose的简介和安装"),e(a)]),s("。")]),A,n("p",null,[s("配置完docker和docker compose后，我们就可以使用docker快速搭建gitlab了，可以直接参考官方的"),n("a",E,[s("Install GitLab using Docker Compose"),e(a)]),s("进行安装。这里，推荐一个github开源项目"),n("a",y,[s("docker-gitlab"),e(a)]),s("，可以使用其配置好的docker-compose文件，然后，改成自己的服务器地址和账户信息即可。具体的参数说明可以查看github上的说明文档，这里不再一一说明。")]),S])}const R=i(d,[["render",f],["__file","gitlab-ci-runner-auto.html.vue"]]);export{R as default};
