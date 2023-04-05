---
title: 利用Hexo轻松搭建自己的博客站点
date: 2020-06-14 10:08:37
category:
- 运维
- 技术
tag:
- hexo
- 建站
- 博客搭建
---

## 前言

本文主要讲述如何利用Hexo从零搭建一个博客系统，以及如何引入next主题，并启用相关next主题配置。然后，会接着再介绍下，如何不安装任何插件实现博客部署到自己的服务器。文章主要讲述搭建及相关的过程，具体到某个配置，参考官方文档即可。
<!-- more -->
### 背景

在此博客搭建之前，自己想做一个功能全面的博客，有完整的前后端支持。由于当前技术储备知识有限（加紧学习中），又不想把此事耽搁了。于是乎，便找到了Hexo，顺便就配置上了大家所推崇之至的next主题。后面又增加了评论系统的支持，采用的是next就已集成的Valine。完成这些，基本上就算完成了一个完整的博客搭建，剩下的无非是seo优化、部署相关的东西了。在此把博客从无到有的创建过程，做一个记录，也算是一个分享，供大家参考。

## 主要内容

> Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 [Markdown](http://daringfireball.net/projects/markdown/)（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。更多Hexo介绍可参考[Hexo官网](https://hexo.io/zh-cn/docs/)

### 安装

#### 环境配置

Hexo是基于node开发的，使用npm进行管理，所以在此之前我们必须要配置相关的环境。需要配置如下环境：

- [Node.js](http://nodejs.org/) (Node.js 版本需不低于 8.10，官方推荐使用 Node.js 10.0 及以上版本，个人建议使用nvm进行node版本的管理)
- [Git](http://git-scm.com/)

以上这两个，我想对于觉得多数开发者，特别是前端开发者，应该是必备的开发环境，当然，如果你还没有，那就安装上就可以了，具体安装过程，不再赘述。

#### Hexo安装

全局安装：`$ npm install -g hexo-cli`

局部安装：`$ npm install hexo`（此种方式执行hexo命令，需要使用npx hexo， 对于不是全局安装的包，都可以使用npx + 包执行命令)

接着初始化博客文件夹：`$ hexo init <folder（目录）>  `

此时可以看到，博客目录已经生成了类似如下的结构目录，具体目录详细介绍，请参考官网文档。

```
.├── _config.yml
 ├── package.json
 ├── scaffolds
 ├── source
 |   ├── _drafts
 |   └── _posts
 └── themes
```

然后，进入创建的目录，安装依赖

```bash
$ cd <folder>
$ npm install
```

安装完依赖，我们打开package.json文件，可以看到类似如下内容

```json
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo generate",
    "server": "hexo server"
  }
  ......
}
```

可以看到，hexo已经为我们创建了快捷的脚本命令

- 启动：server
- 构建：build
- 清理：clean
- 部署：deploy

此时我们直接运行 npm run server ，便可启动博客服务，默认端口号4000。启动完成后直接在本地访问即可看到初始化的博客了。

### 配置

博客有关的信息字段，基本上全部都可以通过配置文件`_config.yml`进行配置，比如文章的标题、描述、语言、网址等等。配置文件在根目录下，具体配置字段这里不再一一举例，请参考[Hexo配置](https://hexo.io/zh-cn/docs/configuration)。

做完基本的配置之后，便可以奋笔疾书了。直接使用hexo new 'xxxxxxxx' 即可创建对应的文章，此时，source目录下的post目录会生产刚刚创建的md文件，然后就可以在此md上愉快的写文章了。更多介绍可参考[Hexo 写作](https://hexo.io/zh-cn/docs/writing)。

### 引入next主题

next主题参考站点：[theme-next](https://theme-next.js.org/)

github地址：[hexo-theme-next](https://github.com/next-theme/hexo-theme-next)

要使用next主题可分为以下几个步骤：

1. 访问[hexo-next](https://github.com/next-theme/hexo-theme-next) github站点 ，下载或者拉去最新的[release包](https://github.com/next-theme/hexo-theme-next/releases)
2. 在hexo根目录下的theme目录新建next目录，将下载的包内对应的next里的文件全部拷贝进去
3. 在配置文件_config.yml中theme参数设置为next，修改后会自动更新，此时刷新页面即可看到变化。

主题也有对应的配置文件，其配置文件在其主题文件夹下的_config.yml，里面的配置比较多，我们对常用的配置进行一个简单的说明，具体字段根据英文意思很容易看懂。

```yaml
# 这是配置文件此处略去N个字............
# ---------------------------------------------------------------
# Site Information Settings
# See: https://theme-next.org/docs/getting-started/
# ---------------------------------------------------------------
# 站点的图标设置，包括logo
favicon:
  small: /images/favicon_16x16.ico
  medium: /images/favicon_32x32.ico
  apple_touch_icon: /images/apple-touch-icon.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml
# ......
# 底部一些版权信息设置，一般备案过的需要加上备案信息
footer:
  # Icon between year and copyright info.
  icon:
    name: user
    # If you want to animate the icon, set it to true.
    animated: false
    # Change the color of icon, using Hex Code.
    color: "#808080"
  # If not defined, `author` from Hexo `_config.yml` will be used.
  copyright: hew
  # Powered by Hexo & NexT
  powered: true

  # 备案信息
  beian:
    enable: false
    icp:
    # The digit in the num of gongan beian.
    gongan_id:
    # The full num of gongan beian.
    gongan_num:
    # The icon for gongan beian. See: http://www.beian.gov.cn/portal/download
    gongan_icon_url:

# ............

# 主题设置部分，以下四种主题分别对应4中不同的布局，可以修改后刷新页面看具体样式效果
# Schemes
scheme: Muse
#scheme: Mist
#scheme: Pisces
#scheme: Gemini

# Dark Mode 是否开启暗黑模式
darkmode: false

# 菜单设置  定义博客的导航菜单
menu:
  home: / || home
  #about: /about/ || user
  #tags: /tags/ || tags
  #categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat

# 是否展示菜单icon
menu_settings:
  icons: true
  badges: false

#-------------侧边栏设置---------------------------------

sidebar:
  # Sidebar Position.
  position: left
  #position: right
  # ....................................

# 侧边栏头像设置
avatar:
  # Replace the default image and set the url here.
  url: /images/avatar-sheld.jpg
  # If true, the avatar will be dispalyed in circle.
  rounded: true
  # If true, the avatar will be rotated with the cursor.
  rotated: false

# 个人信息链接设置
social:
  #GitHub: https://github.com/yourname || github
  E-Mail: mailto:xxxx@xxxmail.com || envelope
  #Weibo: https://weibo.com/yourname || weibo

# .................................

# 代码块主题样式设置
codeblock:
  # 可选的主题如下: normal | night | night eighties | night blue | night bright | solarized | solarized dark | galactic
  # See: https://github.com/chriskempson/tomorrow-theme
  highlight_theme: solarized dark
  # Add copy button on codeblock
  copy_button:
    enable: true
    # Show text copy result.
    show_result: false
    # Available values: default | flat | mac
    style: mac
# 返回顶部设置
back2top:
  enable: true
  # .......................

# 评论系统配置，可以开启博客评论，具体配置请惨开下一小结
comments:
  # .......省略......
```

以上是常用的配置，其实，配置上这些，基本就可以供日常使用了。其他配置，可根据自己的需要进自行修改。每一个参数基本都给出了详细的英文注释，觉大部分都是可以看懂的，对于英语不好的同学，可以借助翻译查看。

### 引入评论系统Valine

一个博客如果没有开启评论功能，给人的感觉是没有灵魂的。有了评论的支持，博客才有了灵魂，大家才能互相交流，碰撞，有问题也方便指出和提问，作者也能进行后续的解答和补充。所以，为了注入灵魂，评论系统还是要加上的。

引入Valine我单独摘出了一篇文章，起初直接放在文中，感觉本文内容太长，也不便于分类，所以，之后会将具体操作另外写了一篇博文，具体信息可参考：Hexo-next引入Valine评论系统



### 部署

Hexo可以部署在很多地方，除了能部署到自己的服务器外，还能结合github pages和gitlab pages部署到对应的站点。这里不介绍关于如何部署到github pages，一是因为相关的文章已经很多了，二是github站点有时候会抽风，原因大家都懂。这里主要讲一下如何部署到自己的云服务器，关于这点，官方文章也有介绍，可以参考官方的[Hexo一键部署](https://hexo.io/zh-cn/docs/one-command-deployment)。提供了很多的部署方式，比如Ftp、Rsync等等，但是实际部署中还是会遇到各种各样的问题。这里介绍一种官方未提供的方式，且无需安装任何插件。

传送门：[使用scp命令，轻松实现Hexo部署到云服务器](/2020/06/使用scp命令，轻松实现Hexo部署到云服务器.html)。



### 结语

整个博客从搭建到部署，其实需要准备的还是挺多的。如果，你和我一样需要部署到自己的服务器，那么云服务器是需要提前准备的，然后，你还需要准备一个域名（使用ip访问也行），域名还要备案。然后你还需要配置服务器，起码需要配置一个nginx服务来部署你的网站，整个做下来还是需要花费一定精力的。

但是，当你实实在在把以上这些都折腾了一遍，何尝不是一种提高呢？关于Hexo搭建博客的其他问题，欢迎大家在留言区讨论，有问题请随时指出，在下不吝赐教。