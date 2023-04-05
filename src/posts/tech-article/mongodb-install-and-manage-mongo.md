---
title: MongoDB安装、配置及服务状态监控
date: 2020-10-18 16:14:11
category:
- 数据库
- 技术
tag:
- mongo
- mongodb
- mongo 安装
---

## 前言

最新项目需要用到MongoDB作为数据库进行开发，再次重新学习总结下MongoDB安装、配置以及服务启动状态监控相关得操作，做一个记录和分享。

MongoDB 是一个基于分布式文件存储的数据库，是一个开源的文档数据库，它基于 C++ 语言编写，性能高，可用性强，能够自动扩展。 MongoDB 是最流行的 NoSQL 数据库之一。

<!-- more -->

## MongoDB安装

MongoDB安装可以进行全局安装，也可以通过Docker容器进行安装，这里推荐使用Docker进行安装和管理。

### 全局安装

MongoDB 在Linux系统中安装，可以直接参考官方文档：[安装MongoDB（Install MongoDB Community Edition on Red Hat or CentOS）](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/安装)。本文都是以CentOS为例进行说明。

1. 配置系统包管理工具文件

   首先，执行 `vi /etc/yum.repos.d/mongodb-org-4.4.repo` 在`/etc/yum.repos.d/` 目录下，创建并编辑MongoDB的包安装配置文件`mongodb-org-4.4.repo` ，这里已最新版本4.4为例。

   然后将以下配置代码写入到配置文件中：

   ```
   [mongodb-org-4.4]  
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.4/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
   ```

2. 使用yum安装MongoDB包

   在命令行中执行 `sudo yum install -y mongodb-org`，将会按照最新稳定版本的MongoDB，等待其安装完成即可。

3. 安装完成后，启动Mongo服务。

   可以使用命令：`service mongod status` 或者 `systemctl status mongod` 查看 mongo 服务是否启动。如果未启动，需要执行命令 `service mongo start` 启动mongo服务。

4. 加入开机自启  `systemctl enable start`

5. 启用身份验证和远程连接

   使用 `vi /etc/mongod.conf` 打开mongo 配置文件，找到 net 配置，将bindIP修改为 `0.0.0.0`

   然后找到security配置，将权限`authorization`设置为“enable”，如下所示，然后，重启服务即可。

   ```
   # network interfaces
   net:
     port: 27017
     bindIp: 0.0.0.0  # 127.0.0.1 => 0.0.0.0
     
   security:
     authorization: "enabled"   # disable or enabled
   ```

### Docker（docker-compose)安装

使用docker方式安装MongoDB比较简单，直接执行命令 `sudo docker run --name my-mongo -d mongo:4.4` ，docker便会自动拉去对应的镜像并启动。也可以使用docker-compose进行安装，推荐使用docker-compose方式进行安装，也便于维护管理。

使用docker-compose方式安装，首先要创建并配置对应的docker-compose.yml文件，下面为使用的一个配置供参考：

```yaml
version: '3.1'

services:
  mongo:
    image: mongo  # 镜像
    restart: always  # 是否自动重启
    container_name: 'monge_db' # 容器名称
    environment:
      MONGO_INITDB_ROOT_USERNAME: root  # root账户
      MONGO_INITDB_ROOT_PASSWORD: admin@root22  # root密码
    ports:
      - 27018:27017  # 映射的端口
    volumes:
        - /home/mongo/db_data:/data/db  # 数据映射到宿主机的目录
```

创建完配置文件，直接使用命令 `sudo docker-compose up -d` 运行，docker将会按照yaml文件中配置拉去对应的镜像并启动。

## 管理

对于MongoDB日常管理可以使用命令行的方式进行管理，做一些GURD操作。也可以使用GUI应用进行管理。

管理MongoDB的GUI工具这里推荐使用Robo 3T。如下，很方便进行GURD等操作。

<img src="http://qncdn.yunishare.cn/image-20201018154204925.png@water" alt="image-20201018154204925" style="zoom: 50%;" />

### 使用命令行进行mongo数据库操作

#### 创建用户、配置权限

如果是全局安装的mongo，初始化之后需要配置root账户及密码，再配置几个其他权限的用户，用户数据库远程连接。

创建root用户和用户认证

```bash
// 展示已创建的数据库
db
// 使用admin数据库
> use admin
switched to db admin
// 创建root账户和密码
> db.createUser({ user:"root", pwd:"12345678", roles:["root"] })
Successfully added user: { "user" : "root", "roles" : [ "root" ] }

// 切换到test数据库
> use test
switched to db test
// 用户认证，相当于登录，如果没有登录，则无法进行下一步操作
> db.auth('username', 'password');
1 // 1就表示成功
// 创建新用户
> db.createUser({ user:"test", pwd:"123456", roles:["readWrite", "dbAdmin"] })
Successfully added user: { "user" : "root", "roles" : ["readWrite", "dbAdmin"] }
```

远程连接数据库

``````
// 终端连接
mongo 10.128.218.14:27017/database -u username -p password
// mongoose方式连接
mongoose.connect('mongodb://username:password@host:port/database?options...', {useNewUrlParser: true});
``````



#### GURD常用操作

create创建、新增

- [`db.collection.insertOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne)  插入一条数据
- [`db.collection.insertMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany)  插入多条数据

删除、移除

- [`db.collection.deleteOne()`](https://mongodb.net.cn/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne)   删除一条数据
- [`db.collection.deleteMany()`](https://mongodb.net.cn/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany)   删除多条数据

更改、更新数据

- [`db.collection.updateOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne)   更新一条数据
- [`db.collection.updateMany()`](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)  更新多条数据
- [`db.collection.replaceOne()`](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne)   替换数据

查询

- [`db.collection.find()`](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)  查询数据

## 监控Mongo服务

Mongo 可以设置随系统重启，但是，这并不满足我们的需求，我们希望mongo服务意外停止后能自动启动，所以此时就需要跑一个定时脚本，去监听mongo服务的运行状态，如果mongo服务已停止就重启它。这是，就需要用到Linux corntab 定时任务处理了。

首先，建立要执行的脚本sh

```sh
exec 1>>crawl_log   # 输出标准日志到crawl_log
exec 2>>crawl_log_err  # 输出标准错误日志到crawl_log_err
#!/bin/sh
. ~/.bash_profile  # 设置环境
# 下面放置要执行的脚本即可

```

然后，使用vi编辑`/var/spool/cron/$user(对应用户名，如root)`，添加定时任务设置，设置执行频率以及要执行的文件路径。如：

```shell
# 每15分钟执行 /home/xxxx目录下的 test.sh文件
*/15 * * * * cd /home/xxxxx && sh test.sh
```

接着，保存退出即可。