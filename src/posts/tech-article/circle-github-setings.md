---
title: 使用circleci + github实现前端项目自动化构建和部署
date: 2020-07-05 17:10:28
category:
- 技术
- 部署
tag:
- circleci
- deploy
- 前端自动化
- CI,CD
---


## 前言

circleci是一个云服务CI平台，可以帮助我们实现项目的持续集成，也就是所谓的CI。

> 持续集成是一种软件开发实践，即团队开发成员经常集成他们的工作，通常每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。
<!-- more -->

通常我们提到CI（Continuous Integration持续集成）和CD（Continuous Deployment持续部署）都是一起的，二者是相互联系的。这里，使用的circleci就是我们用来实现CI,CD功能的一个服务平台。和其他服务平台一样，我们无需关注具体的实现，只需要关注自己的业务逻辑即可。通过circleci我们只需要编写相关的配置文件即可，然后后续的测试、编译，发布等等都会通过circleci平台自动进行。

对于开源项目，使用circleci是免费的。如果是私有化项目，则需要付费才能使用。所以，这里更适合个人项目使用，或者，作为一个CICD入门学习，也是不错的。

## 注册

要使用circleci，需要先注册一个账户。进入[circleci官网](https://circleci.com/)，点击注册或者使用github账户进行注册登录。推荐使用github账户授权，下图即为github授权登录页面。

<img src="http://qncdn.yunishare.cn/image-20200705200213541.png" alt="image-20200705200213541" style="zoom:50%;" />

进入circleci主页，右上角点击Log In将进入github授权，授权之后进入配置页面，此时，即完成了登录。

<img src="http://qncdn.yunishare.cn/image-20200705195841992.png" alt="image-20200705195841992" style="zoom:50%;" />



## 配置

### 基本配置

使用github授权登录之后，会跳转进入项目控制面板，如果没有跳转，也没关系，登录之后进入到主页，点击右上角的Go to app，也可以直接进入控制面板。进入控制台后，首先会让你添加一个项目，如下图，ci-test是已经添加和配置过的项目。

<img src="http://qncdn.yunishare.cn/image-20200706153258297.png@water" alt="image-20200706153258297" style="zoom:50%;" />

如果，你是一个新项目，只需要再github上新建仓库，然后在这里进行设置你的项目即可。点击set up project，进入配置页面。

<img src="http://qncdn.yunishare.cn/image-20200706155006524.png@water" alt="image-20200706155006524" style="zoom: 40%;" />

点击add config按钮，它将自动会为你当前的项目创建一个名为circleci-project-setup的分支，并写入demo配置。这里，我们手动添加即可，点击add Manually。接下来我们需要手动创建一个.circleci文件夹，然后新建一个config.yml文件，然后推送到github上。此时circle-ci就会自动检查到我们的提交，然后根据config.yml的配置开始执行对应的任务。

circle-ci实现CI大致流程：监听到github代码推送之后，会拉去对应代码仓库，并读取仓库中的config.yml配置文件。然后安装配置文件设置的环境和任务进行执行。所以再进行CI配置之前，我们需要去和github做一个授权以及生成一个auth key来赋予circle一定的权限。

### 关联github ssh-key

<img src="http://qncdn.yunishare.cn/image-20200706162618378.png@water" alt="image-20200706162618378" style="zoom:50%;" />

在Pipelines标签页，点击右上角的 Project Settings 进入项目设置。如下图，然后点击ssh keys，进入授权页面。下面是已经授权的checkout ssh key。这个是用来进行代码检出的。另外，还需要添加一个用户的ssh key，后面进行部署到github pages需要用到，点击add ssh key即可添加。添加完成之后同样会生成一串指纹id，后面在配置yml文件时需要用到。



<img src="http://qncdn.yunishare.cn/image-20200706163422349.png@water" alt="image-20200706163422349" style="zoom:50%;" />



### CI配置

config.yml文件遵循yaml语法，靠缩进来表示上下级关系，同样也使用键值对，比较简单。可以参考官方的[配置参考](https://circleci.com/docs/2.0/configuration-reference/#section=configuration)。下面是一个简单是config.yml示例。

```yaml
version: 2
jobs:
  build:
    docker: #执行容器
      - image: circleci/node:10 #依赖环境
    branches: #分支
      only:
      - master
    # Steps are a list of commands to run inside the docker container above.
    steps:
      - run: 
          name: Install
          command: console.log('installing ...')
      - run: 
          name: Test
          command: console.log('Test ...')
```

上述配置的功能就是：在docker容器中使用版本号为10的node环境，使用的分支为master分支。然后运行Install任务，完成之后接着运行Test测试任务，就这一，一层一层任务执行，我们称之为流水线作业。

#### vue项目示例

接下来，我们以一个vue-cli项目为例进行说明，来实现自动化构建和发布的整个CI流程。

首先我们将github代码拉到本地之后，将生成的vue项目直接拷贝进来即可。或者，直接在项目所在文件夹，执行vue create xxx命令，将生成的cli项目和本地的进行合并，然后推送到远程仓库即可。

完成之后，我们便可以开始编写下基本的circle-ci配置了。我们首先实现依赖包的安装Install、项目的打包构建Build功能。并添加缓存，和复用缓存，将node-modules目录进行缓存。这样，在完成第一次Install之后，会将node-modules目录依赖进行缓存。以后再执行Install，便可以利用缓存的文件，大大提高安装速度。示例代码如下：

```yaml
version: 2
jobs:
  build:
    docker: #执行容器
      - image: circleci/node:10 #依赖环境
    branches: #分支
      only:
      - master
    # Steps are a list of commands to run inside the docker container above.
    steps:
      - add_ssh_keys:
          fingerprints:
            - '93:15:15:64:15:64:15:64:15:16:64:9b'  # 这个就是添加ssh key生成的指纹id，将其复制到这里即可
      - checkout # 从githun拉去代码
      # 使用缓存
      - restore_cache:
          key: node-dependens # 这个key和save_cache的key相对应，表示使用的是这个key对应的缓存
      - run: 
          name: Install
          command: yarn install
      # 设置缓存
      - save_cache:
          key: node-dependens
          paths:
            - node_modules
      - run:
          name: Build
          command: yarn build
```

将其推送到github仓库之后我们可以可以在circleci 流水线页面看到项目已经开始了自动化流程。执行完成后，我们可以看到所有执行过程，花费的事件以及打印的一些信息等等。

<img src="http://qncdn.yunishare.cn/image-20200706165059527.png@water" alt="image-20200706165059527" style="zoom:50%;" />

### 发布到github pages

还是以上面的vue cli项目为例，当我们构建完成之后，通常需要将构建出的静态资源发布到自己的服务器中，这一过程就是部署。我们需要将打包后的代码发布到项目的github pages页面，这样就可以通过github链接访问项目了。

#### 配置环境变量

在部署过程中，我们将会使用到一些常量，比如，仓库的远端地址，账户的邮箱、构建的目录等等。为了方便维护以及安全问题，我们需要在此之前设置几个环境变量，存储在circleci中。然后再编写相关任务脚本时，便可以直接使用这些变量。

我们先进入到项目设置页面：点击添加三个环境变量，键名自己可以随意命名，分别是github对应的邮箱，用户名和构建打包后的文件夹名称，如下所示。点击add variable按钮即可添加，这三个变量，将会在我们编写部署脚本时使用到。

<img src="http://qncdn.yunishare.cn/image-20200706200442181.png@water" alt="image-20200706200442181" style="zoom:50%;" />

#### 编写部署脚本

部署代码过程虽然不复杂，但是也不是一两行代码就能实现的。所以，我们可以单独抽离一个部署的脚本文件出来。可以在项目根目录下建立一个circleci-deploy.sh的shell脚本。

大致分为以下几个步骤：

- 创建目录：当打包完成之后，我们需要在本地创建一个目录来关联github pages默认仓库的代码（项目的gh-pages分支即为github pages发布分支）。

  ```yaml
  # 新建一个发布项目的目录
  mkdir git-pages-rp
  cd git-pages-rp
  ```

  

- 关联仓库：设置账户信息，初始化git，将本地和远程仓库地址关联，即指定远端地址。

  ```yaml
  # 创建的一个新的仓库
  # 设置发布的用户名与邮箱 这里的邮箱和用户名都是取自上面设置的环境变量
  git config --global user.email "$GH_EMAIL" >/dev/null 2>&1 # 这里的处理是为了不让其输出信息到控制台
  git config --global user.name "$GH_NAME" >/dev/null 2>&1
  # 初始化一个临时的git仓库
  git init
  # 和远程仓库建立关联
  git remote add --fetch origin "$remote" #这里的remote是自己定义的变量
  ```

  

- 切换分支：切换分支到gh-pages，并删除之前的文件。

  ```yaml
  # 切换gh-pages分支
  # 验证git 是否存在gh-pages分支 如果存在则切换 不存在则创建一个空历史分支
  if git rev-parse --verify origin/gh-pages >/dev/null 2>&1; then
    # 检出此分支
    git checkout gh-pages
    # 删除掉旧的文件内容
    git rm -rf .
  else
    git checkout --orphan gh-pages
  fi
  ```

  

- 推送部署：将打包生成的dist目录文件拷贝到此文件夹内，然后，提交代码，推送到远程仓库。

  ```yaml
  # 把构建好的文件目录给拷贝进来
  cp -a "../${STATIC_SOURCE}/." .
  # 把所有的文件添加到git
  git add -A
  # 添加一条提交内容
  git commit --allow-empty -m "Deploy to GitHub pages [ci skip]"  # ci skip是为了跳过ci的构建
  # 推送文件
  git push --force --quiet origin gh-pages
  ```

以上基本就完成了整个脚本的编写，当然，这里面还需要添加一些信息打印，以及部分变量的设置和取值。比如第二步骤中的remote远程地址，就是设置的一个变量，我们可以在一开始就进行设置。

最后放上完整的脚本配置文件：

```yaml
#!/bin/sh
# 开头的这一句是为了标识我是一个shell脚本，按照shell进行执行
# 出现非0错误 终止脚本 
set -e
# 打印当前的工作路径
pwd
# 查看当前目录下的文件信息
ls -la
# 定义远程仓库地址变量
remote=$(git config remote.origin.url)
echo 'remote address is: '$remote

# 新建一个发布项目的目录
mkdir git-pages-rp
cd git-pages-rp

# 创建的一个新的仓库
# 设置发布的用户名与邮箱 这里的邮箱和用户名都是取自上面设置的环境变量
git config --global user.email "$GH_EMAIL" >/dev/null 2>&1 # 这里的处理是为了不让其输出信息到控制台
git config --global user.name "$GH_NAME" >/dev/null 2>&1 # 这里的处理是为了不让其输出信息到控制台
# 初始化一个临时的git仓库
git init
# 和远程仓库建立关联
git remote add --fetch origin "$remote" #这里的remote是上面定义的变量

# 切换gh-pages分支
# 验证git 是否存在gh-pages分支 如果存在则切换 不存在则创建一个空历史分支
if git rev-parse --verify origin/gh-pages >/dev/null 2>&1; then
  # 检出此分支
  git checkout gh-pages
  # 删除掉旧的文件内容
  git rm -rf .
else
  git checkout --orphan gh-pages
fi

# 把构建好的文件目录给拷贝进来
cp -a "../${STATIC_SOURCE}/." .
# 查看拷贝的文件
ls -la

# 把所有的文件添加到git
git add -A
# 添加一条提交内容
git commit --allow-empty -m "Deploy to GitHub pages [ci skip]" # 【ci skip】是为了跳过ci的构建
# 推送文件
git push --force --quiet origin gh-pages
# 资源回收，删除临时分支与目录
cd ..
rm -rf git-pages-rp

echo "Delpoy Sucessful"
```

最后一步，将部署添加为一个CI任务，放在最后执行。编辑config.yml文件，在最后添加一行发布任务。

```yaml
# 如果出现权限问题，请加上权限设置任务，给脚本添加执行权限，然后再执行发布任务
- run:
    name: AuthSet
    command: chmod +x scripts/deploy.sh
    
- run:
    name: Deploy
    command: ./circle-deploy.sh
```

提交代码，推送到github，circleci将开始按照配置的设置执行整个CI流程，执行成功完成后，打开github pages即可看到部署成功之后的内容。



