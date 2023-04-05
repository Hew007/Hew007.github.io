---
title: 利用gitlab配合gitlab-runner 配置前端自动化
date: 2020-09-13 20:17:32
category:
- 运维
- 技术
tag:
- gitlab
- gitlab-CI
- gitlab-runner
- 前端自动化
- CI,CD
---

## 前言

自动化是devOps中重要的一个环节，借助于自动化构建、测试和发布等一些列动作，可以解放开发人员的双手，提高工作效率。这也是我们常说的持续集成（CI)，持续部署(CD)中比较重要的部分。自动化可以帮助我们减少人为的错误，而自动化一旦正确配置，就能永远正确的执行下去。自动化减少我们重复性的劳动从而使开发人员的双手解放出来，去做更多有意义的事情，提高人员能效。开发中自动生成一些代码？自动去区分环境启动？自动打包？自动部署？自动发布？自动报警... 等等，以上这些都可以归到自动化的范畴。
<!-- more -->
前端自动化流程已经有许多优秀的工具去帮助我们实现这一任务，其中，使用最广泛的就是gitlab+Jenkins，从打包到发布以及回滚等一系列流程。但是本文所要讲述的并不是jenkins，而是gitlab-runner。为什么要使用gitlab-runner，而不用jenkins呢？

1. 好奇心：想试试不同的工具，既然又另外一种选择，何不去试试，万一真香呢？
2. 做个对比：jenkins是功能强大，插件多，无所不能，但是对于我这种单一需求，有时候不需要那么多其他功能。这个时候小而美更适合
3. 近亲：gitlab和gitlab-runner是血亲啊，两者配合有天然的默契。

本文主要使用到docker容器技术，需要对docke有基本的了解，能根据相关文档自行完成docker及compose的安装等。

## 准备

既然要使用gitlab，首先我们就需要搭建一个gitlab服务，并配置上gitlab-runer。所以，前提我们要有一台服务器，用来支撑我们整个的自动化流程。服务器推荐使用Linux操作系统，国内一般使用centOS。至于环境，为了以后的可移植性以及环境的一致性，建议采用Docker进行维护。至于Docker的好处，之后会专门介绍，这里不做过多阐述。

用到的技术：Linux + docker(docker-compose) + gitlab + gitlab-CI /gitlab-runner

## 配置环境和服务

服务器购买建议2核4G以上，带宽根据自己的预算购买即可（建议大家在搞活动的时候买，阿里、腾讯、华为等等服务商太多了，购买时可以做个对比，货比三家）。本文使用的服务器是华为的2核4G5M的云服务器，仅作参考。

### docker安装

> Docker 是一个用于开发，交付和运行应用程序的开放平台。Docker 使您能够将应用程序与基础架构分开，从而可以快速交付软件。借助 Docker，您可以与管理应用程序相同的方式来管理基础架构。通过利用 Docker 的方法来快速交付，测试和部署代码，您可以大大减少编写代码和在生产环境中运行代码之间的延迟。

docker 与虚拟机不同，虚拟机是操作系统层的隔离，每一个虚拟机是一个独立的操作系统，独立的硬件资源。而docker是在操作系统层级上的环境隔离，共享系统硬件和资源。

docker的安装和配置，直接参考[官网安装文档](https://docs.docker.com/engine/install/centos/)即可，对于英语不好的童鞋，可以参考下面的两个中文文档：

- [CentOS 安装 Docker CE](https://docker_practice.gitee.io/zh-cn/install/centos.html)
- [菜鸟教程-CentOS Docker安装](https://www.runoob.com/docker/ubuntu-docker-install.html)

### docker-compose安装

docker compose 是用于定义和运行多容器 Docker 应用程序的工具。通常我们使用docker去部署一个服务，需要通过冗长的 docker 命令去将服务部署启动， 而docker compose则是通过一个声明式的配置文件描述整个应用，从而使用一条命令完成部署，可以简单理解为通过配置文件来代替冗长的docker命令，从而能更好的管理和配置docker应用。

docker-compose安装比较简单，可以直接参照官方的[docker-compose的安装文档](https://docs.docker.com/compose/install/)，或者参考[菜鸟教程的docker-compose的简介和安装](https://www.runoob.com/docker/docker-compose.html)。

### gitlab及gitlab-runner搭建和配置

配置完docker和docker compose后，我们就可以使用docker快速搭建gitlab了，可以直接参考官方的[Install GitLab using Docker Compose](https://docs.gitlab.com/omnibus/docker/#install-gitlab-using-docker-compose)进行安装。这里，推荐一个github开源项目[docker-gitlab](https://github.com/sameersbn/docker-gitlab/blob/master/docker-compose.yml)，可以使用其配置好的docker-compose文件，然后，改成自己的服务器地址和账户信息即可。具体的参数说明可以查看github上的说明文档，这里不再一一说明。

下面是我自己使用的yaml的配置，并在上面的gitlab配置中，增加了gitlab-runner的镜像配置，且加了部分注释，使用此文件，可以一步到位完成gitlab和gitlab-runner的安装，配置如下：

```yaml
version: '2'

services:、
  # gitlab使用的redis
  redis:
    restart: always #设置自动重启
    image: sameersbn/redis:4.0.9-2 #依赖的镜像
    command:
    - --loglevel warning
    volumes:
    - /home/gitlab/redis-data:/var/lib/redis:Z  # 前面指映射到宿主机的路径 可以自行修改 将容器内部的redis路径映射到宿主机的/home/gitlab/redis-data路径
  # gitlab使用的sql
  postgresql:
    restart: always
    image: sameersbn/postgresql:10-2
    volumes:
    - /home/gitlab/postgresql-data:/var/lib/postgresql:Z # 映射路径
    environment:
    - DB_USER=gitlab #数据库账户
    - DB_PASS=password #数据库密码
    - DB_NAME=gitlabhq_production
    - DB_EXTENSION=pg_trgm

  gitlab:
    restart: always
    image: sameersbn/gitlab:12.9.2
    depends_on: #依赖的模块，等他们完成之后我再启动
    - redis
    - postgresql
    ports:
    - "10080:80" # 映射到宿主机的端口
    - "10022:22"
    volumes:
    - /home/gitlab/gitlab-data:/home/git/data:Z
    environment:
    - DEBUG=false
    # 依赖的数据库相关配置
    - DB_ADAPTER=postgresql
    - DB_HOST=postgresql
    - DB_PORT=5432
    - DB_USER=gitlab
    - DB_PASS=password
    - DB_NAME=gitlabhq_production
    # 依赖的redis相关配置
    - REDIS_HOST=redis
    - REDIS_PORT=6379

    - TZ=Asia/Kolkata
    - GITLAB_TIMEZONE=Kolkata

    - GITLAB_HTTPS=false
    - SSL_SELF_SIGNED=false

    - GITLAB_HOST=xxx.xxx.xxx.xxx # 对外域名或ip
    - GITLAB_PORT=10080 # 访问git的端口号
    - GITLAB_SSH_PORT=10022 # 指定ssh端口
    - GITLAB_RELATIVE_URL_ROOT=
    - GITLAB_SECRETS_DB_KEY_BASE=79e7f30b-72ce-4710-bf57-f1803015c4ef # 直接用 uuidgen 生成一个就好了
    - GITLAB_SECRETS_SECRET_KEY_BASE=3284d708-951e-4125-9d44-daee021c5b54 # 直接用 uuidgen 生成一个就好了
    - GITLAB_SECRETS_OTP_KEY_BASE=79f55415-42ad-41d3-a20c-753950359csw # 直接用 uuidgen 生成一个就好了

    - GITLAB_ROOT_PASSWORD=xxxxxxx #密码 至少8位数
    - GITLAB_ROOT_EMAIL=xxxxx@xx.com #初始化管理员登录的邮箱

    - GITLAB_NOTIFY_ON_BROKEN_BUILDS=true
    - GITLAB_NOTIFY_PUSHER=false
    # 邮箱相关配置
    - GITLAB_EMAIL=notifications@example.com
    - GITLAB_EMAIL_REPLY_TO=noreply@example.com
    - GITLAB_INCOMING_EMAIL_ADDRESS=reply@example.com
    # 备份相关配置
    - GITLAB_BACKUP_SCHEDULE=daily
    - GITLAB_BACKUP_TIME=01:00
    - GITLAB_BACKUP_EXPIRY=604800 #每七天备份清理之前的备份
    # 邮件服务相关配置
    - SMTP_ENABLED=false
    - SMTP_DOMAIN=xxx.com
    - SMTP_HOST=smtp.xxx.com
    - SMTP_PORT=465
    - SMTP_USER=xxx@xxx.com
    - SMTP_PASS=xxxxxxx
    - SMTP_STARTTLS=true
    - SMTP_AUTHENTICATION=login

    - IMAP_ENABLED=false
    - IMAP_HOST=imap.gmail.com
    - IMAP_PORT=993
    - IMAP_USER=mailer@example.com
    - IMAP_PASS=password
    - IMAP_SSL=true
    - IMAP_STARTTLS=false
    
    - OAUTH_ENABLED=false
    - OAUTH_AUTO_SIGN_IN_WITH_PROVIDER=
    - OAUTH_ALLOW_SSO=
    - OAUTH_BLOCK_AUTO_CREATED_USERS=true
    - OAUTH_AUTO_LINK_LDAP_USER=false
    - OAUTH_AUTO_LINK_SAML_USER=false
    - OAUTH_EXTERNAL_PROVIDERS=

    - OAUTH_CAS3_LABEL=cas3
    - OAUTH_CAS3_SERVER=
    - OAUTH_CAS3_DISABLE_SSL_VERIFICATION=false
    - OAUTH_CAS3_LOGIN_URL=/cas/login
    - OAUTH_CAS3_VALIDATE_URL=/cas/p3/serviceValidate
    - OAUTH_CAS3_LOGOUT_URL=/cas/logout

    - OAUTH_GOOGLE_API_KEY=
    - OAUTH_GOOGLE_APP_SECRET=
    - OAUTH_GOOGLE_RESTRICT_DOMAIN=

    - OAUTH_FACEBOOK_API_KEY=
    - OAUTH_FACEBOOK_APP_SECRET=

    - OAUTH_TWITTER_API_KEY=
    - OAUTH_TWITTER_APP_SECRET=

    - OAUTH_GITHUB_API_KEY=
    - OAUTH_GITHUB_APP_SECRET=
    - OAUTH_GITHUB_URL=
    - OAUTH_GITHUB_VERIFY_SSL=

    - OAUTH_GITLAB_API_KEY=
    - OAUTH_GITLAB_APP_SECRET=

    - OAUTH_BITBUCKET_API_KEY=
    - OAUTH_BITBUCKET_APP_SECRET=

    - OAUTH_SAML_ASSERTION_CONSUMER_SERVICE_URL=
    - OAUTH_SAML_IDP_CERT_FINGERPRINT=
    - OAUTH_SAML_IDP_SSO_TARGET_URL=
    - OAUTH_SAML_ISSUER=
    - OAUTH_SAML_LABEL="Our SAML Provider"
    - OAUTH_SAML_NAME_IDENTIFIER_FORMAT=urn:oasis:names:tc:SAML:2.0:nameid-format:transient
    - OAUTH_SAML_GROUPS_ATTRIBUTE=
    - OAUTH_SAML_EXTERNAL_GROUPS=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_EMAIL=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_NAME=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_USERNAME=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_FIRST_NAME=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_LAST_NAME=

    - OAUTH_CROWD_SERVER_URL=
    - OAUTH_CROWD_APP_NAME=
    - OAUTH_CROWD_APP_PASSWORD=

    - OAUTH_AUTH0_CLIENT_ID=
    - OAUTH_AUTH0_CLIENT_SECRET=
    - OAUTH_AUTH0_DOMAIN=
    - OAUTH_AUTH0_SCOPE=

    - OAUTH_AZURE_API_KEY=
    - OAUTH_AZURE_API_SECRET=
    - OAUTH_AZURE_TENANT_ID=
  # gitlab -runner配置
  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner # 容器名称
    restart: always
    depends_on:
    - gitlab
    volumes:
    - ./config/gitlab-runner:/etc/gitlab-runner
    - /var/run/docker.sock:/var/run/docker.sock # 这个映射地址不需要修改，此为映射的docker再本机的地址即可

volumes:
  redis-data:
  postgresql-data:
  gitlab-data:

```

在服务器上新建一个目录，比如gitlab目录，然后新建一个docker-compose.yml文件，将以上的配置，复制到此新建的yml中，并修改位自己服务器的配置，保存退出。然后，在当前文件下，执行 `docker-compose up -d`命令，可以看到docker 开始根据yml文件内的配置拉去gitlab、redis、gitlab-runner等镜像，我们耐心等待即可，拉去镜像完成后docker会按照对应得配置启动服务。

```bash
$ mkdir gitlab && cd gitlab
$ vi docker-compose.yml
$ docker-compose up -d
```

如果docker拉去相关镜像过慢，请配置docker源为国内镜像，如网易镜像，清华镜像等。使用`vi /etc/docker/daemon.json`修改docker镜像源配置，下面是我的个人配置，使用了三个源，如果有一个源不可用，则会自动使用另外的源：

```json
{
    "registry-mirrors":
    [
        "https://dockerhub.azk8s.cn",
        "https://hub-mirror.c.163.com",
        "https://registry.docker-cn.com"
    ]
}
```

gitlab完成启动后，可以通过`docker ps`查看当前运行的docker应用。下图为我已经按照的docker应用，这里会显示应用的服务信息，如名称，时间，端口等等。

![image-20200913154943702](http://qncdn.yunishare.cn/image-20200913154943702.png@water)

此时，如果gitlab按照正常，访问你的服务器地址加对应的端口号就可以进入gitlab登录界面了。账户和密码就是上面yml中配置的账户和密码。

![image-20200913155543445](http://qncdn.yunishare.cn/image-20200913155543445.png@water)



## 创建项目

### 创建前端项目

本次以一个react项目为例，创建一个react项目仓库，然后在本地开发环境，使用create-react-app脚手架创建一个工程化得react项目，然后推送到我们所新建得仓库中。

<img src="http://qncdn.yunishare.cn/image-20200913163345054.png@water" alt="image-20200913163345054" style="zoom: 50%;" />



<img src="http://qncdn.yunishare.cn/image-20200913170223307.png@water" alt="image-20200913170223307" style="zoom:50%;" />



## 配置项目CI/CD

新建完项目后，我们进入到CI/CD - 流水线，由于我们还未配置gitlab-ci，所以，此时会提示你学习流水线相关文档。从gitlab8.0 开始，持续集成 （CI） 完全集成到 GitLab，要使用gitlab-ci必须要在项目根目录创建一个`.gitlab-ci.yml`文件，gitlab-ci将根据此yml文件得配置执行相应的作业（job）流水（pipeline）。

### gitlab-runner配置

#### runner简介

在 GitLab CI 中，runner运行.gitlab-ci.yml 中定义的代码。runner运行程序可以特定于某个项目，也可以为 GitLab CI 中的其他项目服务。

在此之前，如果你的gitlab还未安装gitlab-runner，则需要先安装gitlab-runner，然后配置gitlab-ci才会生效。可以将runner理解为执行自动化作业得执行者，每个项目都可以设置多个runner，也可以将一个runner设置为全局的runner供全局使用。

![image-20200913170758499](http://qncdn.yunishare.cn/image-20200913170758499.png@water)

### 

#### 手动设置runner

在gitlab设置中，点击CI/CD找到runner列，然后点击右侧的展开按钮，下滑，可以看到有一个手动设置特定的runner面板说明如何自定义设置runner。其中下图的URL和注册令牌（token）会在下面注册runner时使用到。

![image-20200920145945721](http://qncdn.yunishare.cn/image-20200920145945721.png@water)

具体配置的步骤，可以参考下图，主要分为四个步骤：

1. 安装gitlabe runner。我们在使用docker-compose安装gitlab的时候已经配置安装了gitlab-runner，可以跳过这一步。

2. 注册runner。我们使用命令行的方式注册，执行 `gitlab-runner register`便可以注册runner，但是，由于我们是在docker中运行的gitlab-runner，所以，需要先进入到gitlab-runner容器，然后再执行注册的命令。

   ```bash
   $ docker exec -it gitlab-runner gitlab-runner register
   ```

   以上就是在docker中注册runner的命令，其中exec是进入docker容器的命令。-i值交互式操作，-t只终端。

3. 设置runner参数：执行完命令后，runner会提示用户选择和设置相关参数，如：url，注册runner的token（上图所示的令牌），

   ![image-20200920144503629](http://qncdn.yunishare.cn/image-20200920144503629.png@water)

runner注册终端过程交互信息如下：

```bash
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/): # 选择 gitURL 这里就是上面图示所标的gitURL
[http://33.136.135.100:16080/]:                            # 这里由于默认和我的URL一样我没有再输入          
Please enter the gitlab-ci token for this runner:   # 输入上面所看到的令牌 token
rHdfwWhueg76SWTdRa_vC                               # 输入的token
Please enter the gitlab-ci description for this runner:  # 输入描述
[65f53d5278ce]: react-ci  
Please enter the gitlab-ci tags for this runner (comma separated): # 创建一个tag 这里后面配置要用到
react
Registering runner... succeeded       # 注册成功了              runner=rHdfwW71
Please enter the executor: custom, docker-ssh, shell, virtualbox, docker-ssh+machine, docker, parallels, ssh, docker+machine, kubernetes:   # 选择runner执行容器 在什么环境执行 这里我们选择docker
[shell]: docker
Please enter the default Docker image (e.g. ruby:2.6):  # 选择docker的版本 默认也可以 我们这里选择stable
docker:stable
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

以上，就完成了项目对应runner的注册。现在工厂和机器都已经有了，下一步就是设置机器（runner）执行的步骤和工作了。



### 流水线gitlab-ci.yml配置

gitlab CI/CD持续集成服务，是通过gitlab.yml中的配置，去执行对应的工作。当我们在项目根目录中添加 `.gitlab-ci.yml` 文件，并配置项目的运行器( `GitLab Runner` )，那么后续的每次提交都会触发CI流水线( `pipeline` )的执行。`.gitlab-ci.yml` 文件会告诉运行器需要做哪些事情，默认情况下，流水线有 `build` 、`test` 、`deploy` 三个阶段，即 `构建` 、`测试` 、`部署` ，未被使用的阶段将会被自动忽略。下面，我们就来配置下对应的工作流水。

#### .gitlab-ci.yml配置参数

| 关键词        | 描述                                                    |
| ------------- | ------------------------------------------------------- |
| script        | 必选参数，指定runner运行的脚本（如 npm run build)       |
| image         | 需要在docker中使用到的环境镜像（如 node:8.11.2)         |
| services      | 需要的service镜像                                       |
| before_script | 作业执行前需要执行的命令                                |
| after_script  | 作业执行后需要执行的命令                                |
| stages        | 定义流水线所有的阶段                                    |
| stage         | 定义作业所处流水线的阶段(默认test阶段)                  |
| only          | 限制作业在什么时候创建运行（比如是某个分支、某个tag等） |
| except        | 限制作业在什么时候不创建运行                            |
| tags          | 作用使用的Runner运行器的标签列表                        |
| allow_failure | 允许作业失败，失败的作业不影响提交的状态                |
| when          | 指定什么时候运行作业                                    |
| environment   | 部署的环境                                              |
| cache         | 指定需要在job之间缓存的文件或目录                       |
| artifacts     | 归档文件列表，指定成功后应附加到job的文件和目录的列表   |
| dependencies  | 当前作业依赖的其他作业，你可以使用依赖作业的归档文件    |
| coverage      | 作业的代码覆盖率                                        |
| retry         | 作业失败时，可以自动尝试的次数                          |
| parallel      | 指定并行运行的作业实例                                  |
| trigger       | 定义下游流水线的触发器                                  |
| include       | 作业加载其他YAML文件                                    |
| extends       | 控制实体从哪里继承                                      |
| variables     | 定义环境变量                                            |

可以看到，上面可以配置的参数非常之多，不过，我们常用的并没有多少，如script、only、stage、before_script等。下面我们只对常用的几个参数进行说明，更多的请参考文档底部的参考文章，去查看更多更详细的配置介绍。



#### 项目配置

由于，我们这次的项目为react项目，所以，我们只需要runner执行相应的打包、测试、和部署命令即可。

##### `script`

`script` 是作业中唯一必须的关键字参数，是运行器需要执行的脚本，如:

```
build1:
  script:
    - echo "hello build"
    - ls -a
```

表示build1作业需要执行的命令是输出”Do your build here”。



##### `image`

`image` 指定Docker中使用的镜像。如 `iamge:node` 。



##### `before_script`

`before_script` 用于定义在所有作业之前需要执行的命令，比如更新代码、安装依赖、打印调试信息之类的事情。

`after_script` 类似。

示例:

```
before_script:
  - echo "Before script section"
  - echo "For example you might run an update here or install a build dependency"
  - echo "Or perhaps you might print out some debugging details"
```



##### `stage` 

`stage` 定义流水线中每个作业所处的阶段，处于相同阶段的作业并行执行。



##### `only` 和 `except`

`only` 和 `except` 用于在创建作业时对作业的限制策略。

- `only` 定义了哪些分支或标签(branches and tags)的作业会运行
- `except` 定义了哪些分支或标签(branches and tags)的作业不会运行

下面是策略规则：

- `only` 和 `except` 可同时使用，如果在一个作业中同时定义了 `only` 和 `except` ，则同时 `only` `except` 进行过滤(注意，不是忽略 `except` 条件) 。
- `only` 和 `except` 可以使用正则表达式。
- `only` 和 `except` 允许指定用于过滤forks作业的存储库路径。
- `only` 和 `except` 中可以使用特殊的关键字，如 `branches` 、 `tags` 、 `api` 、 `external` 、 `pipelines` 、 `pushes` 、 `schedules` 、 `triggers` 、 `web` 、 `merge_requests` 、 `chats` 等。

根据以上内容，我们配置下构建build和测试test阶段的配置：

```yaml
image: node:8.11.2  # 指定node镜像及版本

cache:  # 定义缓存的目录 由于是node项目需要缓存node_modules即可
  paths:
  - node_modules/

stages:  # 定义工作要执行的几个阶段 测试、构建和部署
  - test
  - build
  - deploy

unit_test:   # 自定义的测试阶段名字 
  stage: test # 指定要执行的阶段 test（测试）
  tags:
    - react  # 这里就是我们上面注册runner时所定义的tag
  only:   # 定义触发执行的分支 master
    - master  
  script:  # test阶段需要执行的脚本
    - echo '我是模拟的测试test过程...'
  after_script: #执行完后要执行的东西
    - echo 'unit test done.'

compile:  # 自动逸的构建阶段名称
  stage: build
  tags:
    - react
  only:
    - master
  before_script:
    - npm install
  script:
    - npm run build
  artifacts:  # 定义runner工作成功或失败后产物/文件,作业完成后文件被发送到gitlab 这里我们留存生成的dist文件
    expire_in: 1 week  # 设置文件过期时间为一周
    paths:  # 文件路径
      - dist

deploy_test:
  stage: deploy
  tags:
    - react
  only:
    - master
  dependencies: # 当前作业阶段依赖的作业 部署依赖于build构建作业
    - compile
  
  script:
    - echo '登录项目部署服务器，部署项目'
  when: # 只有前面的阶段的所有作业都success成功时才执行
    on_success


```



#### 触发runner

我们在react项目中新建一个.gitlab-ci.yml文件，然后将上述内容复制进去，保存，提交，推送到远程gitlab中。然后，进入到项目的CI/CD - 流水线 就可以看到设置的任务执行了。由于第一次执行，所以耐心等待编译即可。

![image-20200920163810026](http://qncdn.yunishare.cn/image-20200920163810026.png@water)

![image-20200920164932292](http://qncdn.yunishare.cn/image-20200920164932292.png@water)

<img src="http://qncdn.yunishare.cn/image-20200920165019791.png@water" alt="image-20200920165019791" style="zoom:67%;" />

到此为止，从gitlab搭建，gitlab-runner安装、注册，自动化构建部署已基本完成。至于部署部分，后面再更新，有条件的自己可以试试如何部署到另外一台服务器。