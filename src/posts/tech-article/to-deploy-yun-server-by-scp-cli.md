---
title: 使用scp命令，轻松实现Hexo部署到云服务器
date: 2020-06-10 13:12:39
category:
- 运维
- 技术
tag:
- scp
- hexo部署
- 远程部署
---


### 前言

对于Hexo的部署，官方提供了多种方式，我的最初的考虑是使用Rsync进行部署，奈何按照官方的文档，安装Rasyn插件后，windows上本地会报错，查阅资料才得知window还要装sync有关的其他组件，于是决定放弃使用，另寻捷径。
<!-- more -->
由于之前使用过scp命令进行服务器之间的文件传输，再配置上ssh-key免密登录，体验还是很好的。所以，这么方面为什么不使用呢？况且无需安装任何插件。对于scp命令Linux本来就支持，至于windows是否支持，之前的版本不太了解，但是现在我所使用的Windows10是支持的（笔者系统版本为window10专业版1909）。接下来我们就实际操作以下，实现一键部署。

### 主要内容/步骤

#### SCP简介

首先，我们先简单了解下什么是scp？

scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。区别于rcp，两者都能实现远程拷贝，但是scp 是加密的，rcp是不加密的，scp 可以说是 rcp 的加强版。既然scp是基于ssh登录进行安全拷贝的，我们只要实现了ssh免密登录服务器，即可实现scp免密传输文件。

命令示例：

```bash
#scp 命令使用端口号 4588 将本地主机/usr/local/下的xxx.sh 拷贝到远程主机的/home/www目录下
scp -P 4588 remote@www.domain.com:/usr/local/xxx.sh /home/www
```

更懂介绍参考[Linux scp命令介绍](https://www.runoob.com/linux/linux-comm-scp.html)

#### 配置ssh远程免密登录

所谓免密登录，即利用ssh-key进行登录验证，不需要输入账户密码的方式登录服务器。我们通过执行 `ssh my-server`，就可以登录对应的服务器，而不需要每次都要输入一堆账号密码才能登录服务器。如果你还未配置免密登录可以参考文章：[利用ssh-key配置SSH免密登录远程服务器](/2020/05/利用ssh-key配置SSH免密登录远程服务器.html)

#### 编写shell脚本，实现本地到远程部署

通过上述配置完shh免密登录之后，便可以通过scp，像使用ssh免密登录服务器一样，实现登录并传输文件。接下来我们编写下具体的shell脚本。

首先，我们可以在Hexo搭建的根目录下创建一个build目录，然后在此目录中创建一个deploy.sh的文件，便于之后的管理。如下图：

![目录结构](http://qncdn.yunishare.cn/image-20200531105834975.png@water)

接着，我们开始编写shell脚本，实现部署功能。

```bash
#!/bin/bash
# 定义当前路径
LOCAL_PATH=`pwd`
# 输出当前所在路径
echo "shell start! $LOCAL_PATH"
# 登录目标服务器删除/home/www/目录下的文件
ssh myCloud "rm -rf /home/www/*"
# 使用 scp 命令远程拷贝文件 将当前目录下public下的所有文件传送到远程服务器/home/www目录
scp -r public/* myCloud:/home/www/
```

我们首先打印下当前的路径，避免出现错误。然后登录远程服务器，清理掉/home/www/目录中已经存在的文件。完成清理之后再将本地public（Hexo静态文件输出目录，默认是public）目录下的文件传输到服务器的www目录，完成部署。

然后，我们找到跟目录下的package.json文件，修改scripts中的脚本命令。添加或者修改已有的deploy命令，设置为`hexo generate && sh ./build/deploy.sh`。先运行hexo generate，生成静态文件，然后，执行bulid文件夹下的shell部署脚本。

```javascript
"scripts": {
    ......
    // 打包生产静态文件然后调用部署脚本进行部署
    "deploy": "hexo generate && sh ./build/deploy.sh"
 },
```

然后，使用 `npm run deploy`，便可完成博客的部署。

运行示例如下：

![image-20200531111900788](http://qncdn.yunishare.cn/image-20200531111900788.png@water)

此时，刷新下访问地址，就可以看到最新发布的内容了。