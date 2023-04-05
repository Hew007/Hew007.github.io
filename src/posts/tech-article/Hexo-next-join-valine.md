---
title: Hexo-next引入Valine评论系统
date: 2020-06-20 19:45:13
category:
- 博客
- 技术
tag:
- hexo
- 评论
- valine
---

### 前言

支持Hexo的评论系统，太多了，不免让人眼花缭乱，由于鄙人博客部署的是自己的服务器，和git基本无关联，所以我就优先考虑了[Valine](https://valine.js.org/)。Valine方便，简单，本文也是以valine为例子进行说明。如果，你的博客是部署再github，也可以采用gitment之类的评论系统。大家可以参考以下知乎的[Hexo（NexT 主题）评论系统哪个好](https://www.zhihu.com/question/267598518)这个话题，<!-- more -->看下哪个更适合自己。其实，初期大家不必太纠结哪个好，我觉得能正常使用就可以，一步是不可能把博客做到完美，之后慢慢打磨便是。博客的初衷，主要是做总结、分享用的，其他功能只是锦上添花，千万不要为了追求完美，忘了初心。

### 主要步骤

#### 注册账号

>Valine 诞生于2017年8月7日，是一款基于[LeanCloud](https://leancloud.cn/)的快速、简洁且高效的无后端评论系统。理论上支持但不限于静态博客，目前已有[Hexo](https://valine.js.org/hexo.html)、[Jekyll](https://valine.js.org/jekyll.html)、[Typecho](http://typecho.org/)、[Hugo](https://gohugo.io/)、[Ghost](https://ghost.org/) 等博客程序在使用Valine。

从官方的定义，我们可以知道它是基于LeanCloud，所以，LeanCloud账号则是必不可少的。注册（现在是需要实名认证的）地址：[LeanCloud注册](https://leancloud.cn/dashboard/login.html#/signup)。

#### 创建应用

注册完之后。点击创建应用，创建一个自己的应用即可，下图是我测试注册的一个应用。

<img src="http://qncdn.yunishare.cn/image-20200620103109118.png@water" alt="image-20200620103109118" style="zoom:50%;" />

<img src="http://qncdn.yunishare.cn/image-20200614214054546.png@water" alt="image-20200614214054546" style="zoom:50%;" />

#### 创建存储库class

点击已创建的应用即可进入控制台，然后再存储tab页中，点击结构化数据，创建一个名为Comment的class。

<img src="http://qncdn.yunishare.cn/image-20200620104152180.png@water" alt="image-20200620104152180" style="zoom:50%;" />

然后点击左下方设置按钮，进入设置tab页，点击第二个`应用keys`，可以看到应用的AppID和AppKey等相关信息，下面的配置将会使用到这些信息。

<img src="http://qncdn.yunishare.cn/image-20200620104640885.png@water" alt="image-20200620104640885" style="zoom:50%;" />



#### 配置Hexo-next，开启评论功能

进入主题文件夹，找到对应的配置文件`_config.yml`。以next主题为例，下面是config配置文件关于valine配置的部分，主要需要配置的内容为appid和appkey，将上述创建的应用的appid和appkey复制到此处即可。

```yaml
# For more information: https://valine.js.org, https://github.com/xCss/Valine
valine:
  enable: true
  appid: xxxxxxxxxxxxxxxxxxx   # 这里配置appid
  appkey: xxxxxx  # 这里配置appkey
  notify: false # Mail notifier
  verify: true # Verification code
  placeholder: 说点什么吧！ # 评论框默认的placeholder
  avatar: mm # 头像
  guest_info: nick,mail,link # Custom comment header
  pageSize: 10 # Pagination size
  language: zh-cn # Language, available values: en, zh-cn
  visitor: false # Article reading statistic
  comment_count: true # If false, comment count will only be displayed in post page, not in home page
  recordIP: true # Whether to record the commenter IP
  serverURLs: # When the custom domain name is enabled,
```

然后，启动hexo，进入页面，在页面最下方你将能看到对应的评论模块。

<img src="http://qncdn.yunishare.cn/image-20200620194248685.png@water" alt="image-20200620194248685" style="zoom:67%;" />

到此为止，你已经完成了评论系统配置，是不是很简单啊，快去试试吧。

