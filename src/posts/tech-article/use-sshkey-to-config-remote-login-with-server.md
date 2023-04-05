---
title: 利用ssh-key配置SSH免密登录远程服务器
date: 2020-05-31 17:23:38
category:
- 运维
- 技术
tag:
- ssh登录
- 远程登录
- 远程服务器
- 免密登录
---

### 前言

登录远程服务器，我们通常使用 `ssh user@host -p port` 的方式，然后再输入服务器的密码，完成整个认证登录的过程。但是，对于经常需要登录远程服务器的人员，如果每次都通过账号密码的方式登录服务器，则显得有些繁琐。事实上，我们通过一定的配置，包括本地主机和远程服务器的配置，便可以大大简化 SSH 相关的操作，提高工作效率。
<!-- more -->
例如，我通过执行 `ssh my-server`，就可以登录对应的服务器，而不需要每次都要输入一堆账号密码才能登录服务器。要实现这样的功能，我们借助`ssh-key`便可以完成。大致的原理就是，通过在本地生成一组ssh密钥对，一个是私钥，一个是公钥，将公钥保存在登录的服务器上，然后，每次本地主机连接服务器时，服务器就可以校验服务器端公钥和本地的私钥是否匹配，如果匹配，即可完成登录。其原理和我们使用ssh方式登录git方式相同。

### 步骤

要配置ssh免密登录，大致分为以下四个步骤：

1. 在本地生成`ssh-key`密钥对
2. 将生成的公钥存储到远程服务器
3. 配置本地的`ssh config`，标识要连接的服务器配置
4. 重启服务器的ssh服务，完成。

所以，首要任务就是先生成一个 ssh-key 密钥对。生成ssh-key直接使用命令 `$ ssh-keygen` 即可，默认生成在用户目录下的.ssh目录下，即`~/.ssh/`下。如果本地已经存在一对ssh密钥对，你可以再生成一对命名不同的密钥对，来区分不同的项目进行使用。

例如，生成另外一个别名为`github_id-rsa`的`ssh`密钥：

`$ ssh-keygen -t rsa -C 'user@example.com' -f ~/.ssh/github_id-rsa`

-t：指定加密密钥类型，包括 RSA 和 DSA 两种密钥。

-C：指定提供的一个注释，通常为邮箱

 -f 指定要生成密钥名称。

更多ssh参数信息，[可参考ssh-keygen 中文手册](http://www.jinbuguo.com/openssh/ssh-keygen.html)然后，一路回车即可，此时.ssh文件夹内便已生产对应的密钥对。

<img src="http://qncdn.yunishare.cn/20200531170108.png@water" alt="20200531170108" style="zoom: 50%;" />

查看已经生成的密钥：`$ cat ~/.ssh/github_id-rsa.pub`

<img src="http://qncdn.yunishare.cn/image-20200531170927632.png@water" alt="image-20200531170927632" style="zoom:67%;" />

此时需要把生成的id-rsa.pub文件生成的公钥内容，复制到服务器的authorized_keys文件中，此文件位于服务器的 ~/.ssh/目录下，如果没有则创建一个authorized_keys，将公钥复制到此文件后进行保存即可。接着，重启服务器的ssh服务，接下来就需要配置本地的ssh config了。

使用$ cd ~/.ssh/ 命令进入本地ssh目录，或者直接在文件管理器中进入此目录，编辑ssh目录下的config文件，如果不存在此文件新建一个config即可，此配置文件保存需要连接的远程服务器的信息。在config目录中添加如下配置：

```yaml
Host Hew  #（host名称 之后可以使用ssh Hew 连接即可）
  Port 22          #（远程ssh端口号）
  HostName 123.13.17.65       #（远程服务器地址）
  User root        #（登录的用户名）
  IdentityFile ~/.ssh/id_rsa           #（ssh密钥存储地址)
  IdentitiesOnly yes     #(指定 ssh 只能使用配置文件指定的 identity 和 certificate 文件或通过 ssh 命令行通过身份验证)
```

如果你需要链接多个服务器，此配置文件也可以配置多个ssh远程地址，配置完成后保存，然后在本地的终端工具中输入：$ ssh myServer(这里做示例，根据实际配置输入）。如下图所示，一个命令就完成了服务器的登录。

![ssh-login](http://qncdn.yunishare.cn/ssh-login.gif@water)
