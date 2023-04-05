---
title: 利用commander和git创建一个自定义的脚手架
date: 2020-08-24 09:31:31
category:
- 工具
- 技术
tag:
- 前端工具
- 脚手架
- cli
- commander
---

## 概念

### 什么是脚手架？

脚手架是可以快速生成工程化项目的一类工具。使用脚手架我们可以快速形成特定的项目目录，快速进行项目搭建和开发，而不是每次都自己从0去搭建一个项目结构。
<!-- more -->
我们常见的vue-cli，create-react-app，angular-cli等都是脚手架工具，使用它们可以快速创建对象的工程化项目初始结构，然后再此基础上进行快速开发。以上都是官方的脚手架，有时候可能和我们自身对于的业务不太合适，以至于每次我们都要进行重新划分目录，引入和配置一些其他的插件等。此时，我们就可以根据自己项目定制自己的脚手架，以提高开发效率。

### 常用的依赖工具包

创建自定义的脚手架是，我们常会用到以下依赖工具包，来实现常用的功能。

- execa:  操作shell工具
- inquirer：交互式命令行工具，获取用户输入，根据用户输入做一些处理（比如命令行中做一些选择，等等）
- commander：解析命令行参数，帮助生成提示信息等。
- download-git-repo：从github下载远程仓库的模板
- 等等……

我们可以访问vue，react，和angular等对应的官方脚手架源码，可以了解其项目中依赖都有哪些，哪些是常用的，都有哪些功能……

## 原理

以vue-cli脚手架为例，当我们使用vue create xxx时，命令行会出现一系列让我们选择的提示，比如是否使用css预处理器，是否使用eslint，使用eslint什么标准的进行校验等等。最后会帮我们生成一个工程化目录，并安装对应的依赖。以上这些是如何实现的呢？

简单的说，就是利用commander定义我们自己的命令，比如create创建命令，remove删除命令等。然后使用inquirer给用户提示，处理用户输入，来达到和用户交互式效果。接着根据用户的选择，下载远程仓库的模板，生成对应的目录。最后安装依赖，完成创建。

其中，最重要的就是commander和inquirer这两个js库。

## commander介绍

commander.js是一款基于node的强大命令行工具，提供了用户命令行输入和参数解析强大功能，能利用它快速配置自定义的命令行选项。绝大多数命令行工具都是通过commander进行开发的。

### 基本命令配置

首先使用npm install -S commander安装commander，然后，引入commander。

```javascript
const { program } = require('commander');
```

使用option方法，定义参数选项。

option 第一个参数就是需要的定义的选项命令参数，包括别名/缩写；第二个参数为选项的简介。每个选项可以定义一个短选项名称（-后面接单个字符）和一个长选项名称（--后面接一个或多个单词），使用逗号、空格或`|`分隔。第三个参数可以接默认值或者执行函数。

示例：

```javascript
program
	// 创建一个create命令
	.option('-c, --create', 'create a projet')
	// 创建一个delete命令 后面跟一个参数（文件名或和文件夹），第三个参数为执行的函数
    .option('-d, --delete <file>', 'delete file', handleDelFn) 
	// 创建一个init命令 需要跟一个参数 项目名称
    .option('-i, --init <name>', 'init a project width name');

// 解析命令行参数
program.parse(process.argv);
// 打印解析到的参数及配置信息
console.log('create:', program.create, program.opts())
```

option有两种最常用的选项，一类是 boolean 型选项，选项无需配置参数，另一类选项则可以设置参数（使用尖括号声明,如上面的delet 和 init）。如果在命令行中不指定具体的选项及参数，则会被定义为`undefined`。

我们创建了一个简单的create命令，不接收任何参数。这类是属于boolean类型的选项。delete和init为可以设置参数的命令，命令后面必须传递一个参数，否则将报错。

options第三个参数，可以接收一个函数，用户输入对应的命令后将执行对应的回调函数，我们可以依此进行一些逻辑处理。如上面的delet命令，接受一个文件路径，进行删除文件。

parse方法需要传递命令行输入的参数，即`process.argv`，commander会解析这些参数。

```bash
# 输入及输出 假定cli名字为custom
$ custom -h # commander会为我们自动创建命令
#输出:
  -c, --create        create a projet
  -d, --delet <file>  delete file
  -i, --init <name>   init a project width name
  -h, --help          display help for command
  
$ custom -xxx # 输出： error: unknown option '-v'

$ custom -c # 输出：create: true { version: '1.0.0', create: true, delet: undefined, init: undefined }

$ custom -i # 输出：error: option '-i, --init <name>' argument missing

$ custom -i my # 输出 create: undefined { version: '1.0.0', create: undefined, delet: undefined, init: 'my' }
```



### 子命令配置

commander还支持子命令的配置，形如git clone xxx，git checkout xxx等等。这些，clone和checkout都属于git命令的子命令。

可以使用command()方法配置子命令：`command('clone <source> [destination]')`

`command()`接受一个字符串，包含命令、参数（使用尖括号）、和目标参数，中间使用空格隔开。使用description()定义命令的描述。用actions()方法定义要处理的方法，其接收一个回调函数，参数分别为source和destination。

代码如下：

```javascript
program	
	// 定义子命令参数结构
	.command('clone <source> [destination]')
	// 命令描述
    .description('clone a repository into a newly created directory')
	// 处理方法
    .action((source, destination) => {
        console.log('source:', source);
        console.log('destination:', destination);
        console.log('clone command called');
    });
```

执行：

```bash
$ hew clone git.com/xxxx aaa
```

结果：

<img src="http://qncdn.yunishare.cn/image-20200826111227290.png@water" alt="image-20200826111227290" style="zoom:67%;" />

以上就是commander使用的一些基本介绍，详细介绍请参考：[Commander.js中文文档](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)。

## Inquirer简介

Inquirer是一款基于node.js的命令行交互工具，可以通过其创建一个优雅的命令行交互效果。绝大部分脚手架也都采用了Inquirer解决方案。

我们主要使用到Inquirer.prompt()方法，去定义显示在命令行工具的信息，其返回一个Promise，结果为用户输入或者选择的参数。

示例：

提示用户是否继续操作

```javascript
// 提示用户是否覆盖目录 返回布尔值
const res = await inquirer.prompt([{
    name: 'createdir',
    type: 'confirm',
    message: 'dir has exist, overwrite your existed dir?',
    default: true
}]);
console.log('res', res) // res: true
```

让用户选择一个选项

```javascript
// 让用户选择一个选项
const ops = [1, 2, 3]
const obj = await inquirer.prompt([{
    name: 'select',
    type: 'list',
    message: 'choose a ops',
    choices: ops
}]);
console.log('res', obj) // res: {select: 1(用户选择的值)}
```

更多使用介绍请参考：[Inquirer介绍](https://github.com/SBoudrias/Inquirer.js#documentation)

## 实现

纸上得来终觉浅，绝知此事要躬行。根据上面的介绍，我们来实现一个自定义的脚手架。

### 初始化一个项目

首先，我们创建一个文件夹，并初始化一个npm 项目

```bash
$ mkdir test-cli && cd test-cli
$ npm init -y
```

配置项目目录，创建一个bin目录和src目录，分别为脚手架主目录和代码目录，并在package.json配置对应的js地址。

```json
// package.json 添加bin配置
"bin": {
    "test": "./bin/test.js"
}
```

```javascript
// test.js配置
#! /usr/bin/env node // 定义为node可执行文件
// 从源代码导入主js 代码全部放在src中编写
require('../src/index.js');
```



### 实现自定义命令

这里我们先实现两个个基本命令，创建`create`， 删除 `delete`。create用来创建生成项目目录，delete用来删除目录或者文件。

在src目录下新建一个actions文件夹和两个js文件分别存放create和delete的逻辑。src目录下的index.js文件为入口文件。

#### 入口文件index.js

```javascript
const path = require('path');
const { program } = require('commander');

// 定义命令参数对象
const actions = {
    // create命令
    create: {
        alias: 'ct',
        desc: 'create a project'
    },
    // 删除命令
    delete: {
        alias: 'del',
        desc: 'delete a file form path'
    },
    // 其他的命令处理
    '*': {
        alias: '',
        desc: 'command not found'
    }
};

// 遍历actions配置命令
Object.keys(actions).forEach(key => {
    program
        .command(key) // 定义命令字段
        .alias(actions[key].alias) // 定义别名delete => del
        .description(actions[key].desc) // 定义描述
    	// 命令方法处理
        .action((source, destination) => {
            if (key === '*') {
                console.log(actions[key].desc)
            } else {
                // 向create.js和delete.js传递参数
                require(
                    path.resolve(__dirname, `./actions/${key}`) // 对应actions文件夹下的名称
                )(process.argv.slice(3)); // 取第四个参数之后的参数
            }
        });
});

program.parse(process.argv);
```

我们在index.js中定义有哪些命令，然后，遍历此配置即可完成命令的配置，然后，根据导入的文件处理各个命令对应的逻辑。

#### 删除命令delete.js

```javascript
const path = require('path');
const del = require('del');
/**
* 删除处理的函数
* @param {String} name 文件或文件夹名称
*/ 
const handleDelFn = async (name) => {
    // 解析要删除的文件夹路径
    const dir = path.resolve(`./${name}`);

    console.log('dir', dir);
    // 调用del 删除文件夹
    await del(dir);
}

module.exports = (args) => {
    console.log('args:', args) // ['dir']
    handleDelFn(args[0]);
}
```

delete删除命令比较简单，只需要拿到文件夹或文件名，然后解析到全路径，调用del删除即可。

#### 创建项目create命令create.js

创建目录大致可分为以下两个个步骤：

1. 根据传入的路径判断是否已存在，存在则提示用户是否覆盖，否则直接创建
2. 根据用户输入y/n 进行处理覆盖还是结束任务

```javascript
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const del = require('del');

/**
* 判断路径目录是否存在，存在则调用inquirir 交互式命令 提示用户
* @param {String} projectName 项目名称
*/
const existDir = async(projectName) => {
    // 获取当前路径
    const curDir = path.resolve('./');
    // 获取全路径
    const newDir = path.resolve(curDir, `./${projectName}`);
    // console.log('newDir', newDir)；
    
    // 判断目录是否已经存在，如果不存在目录直接创建，并返回创建目录路径
    if(!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
        return newDir;
    }
    // 如果已存在，使用inquirer 提示用户是否覆盖，返回一个boolean值
    const res = await inquirer.prompt([{
        name: 'createdir',
        type: 'confirm',
        message: 'dir has exist, can you overwrite?', // 提示语
        default: true // 默认值
    }]);
    // 如果用户选择覆盖，则删除当前文件下所有内容 然后再创建，并返回新创建的目录
    if (res) {
        // 强制删除
        await del(newDir, {force: true});
        // 创建文件夹
        fs.mkdirSync(newDir);
        return newDir;
    } else {
        console.log('create dir has been cancle');
        // 以退出状态 1 指示 Node.js 同步地终止进程
        process.exit(1);
    }
};

module.exports = async (projectName) => {
    // 创建目录 如果存在提示用户是否覆盖
    const dir = await existDir(projectName);
    console.log('dir', dir);
}
```

执行效果图：

![image-20200826150805482](http://qncdn.yunishare.cn/image-20200826150805482.png@water)



### 在github上创建自己的template

创建项目的模板一般我们不会直接放在脚手架中，而是放在gitlab或者github中，这样即使更新了模板也不需要更新脚手架，我们只需要根据实际需要更新template即可。所以，我们需要先在github中创建一个模板仓库，然后使用github api拉去对应的模板即可。

这里我分别在github中创建了两个仓库，分别为vue-tpl和h5-tpl。并分别发布了几个版本，定义了对应的tag。之后我们就可以根据仓库repo和tag获取到远程仓库模板，下载到本地。

### 使用github api获取远程仓库上的模板

获取仓库列表和仓库对应的tag版本，需要使用到两个github-api:

- [list-repositories-for-a-user](https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user) 获取用户下的仓库数据
- [list-repository-tags](https://docs.github.com/en/rest/reference/repos#list-repository-tags) 根据仓库获取tags

获取到仓库对应的tag之后，便可以使用download-git-repo下载对应的template到本地指定的目录

安装并引入axios，获取仓库列表和tag

```javascript
// ......添加获取仓库及tag逻辑
// 定义github api请求路径
const baseGitApi = 'https://api.github.com';
// 定义加载进度条对象
let spinner = null;
// 获取仓库列表 返回对应的仓库数组
const getReposList = async () => {
    // 加载的进度显示
    spinner = ora('Loading repos...').start();
    // 获取仓库列表
    const { data } = await axios.get(`${baseGitApi}/users/hew007/repos`);
    spinner.succeed('Loading Success!');
    // 获取符合条件的仓库名 由于这里模板仓库都是使用的-tpl后缀，所以可以筛选
    const reposNames = data.map(ele => ele.name).filter(item => /tpl/.test(item));
    return reposNames;
};

// 根据仓库 获取tag列表
const getReposTags = async (repo) => {
    // 加载的友好进度条
    spinner.text = 'Loading tags...';
    spinner.start();
    // 获取tags
    const { data } = await axios.get(`${baseGitApi}/repos/hew007/${repo}/tags`);
    // 加载成功显示
    spinner.succeed('Loading Success!');
    // 获取符合条件的仓库名
    const reposTags = data.map(ele => ele.name);
    返回tags数组
    return reposTags;
};

module.exports = async (projectName) => {
    // 创建目录 如果存在提示用户是否覆盖
    const dir = await existDir(projectName);

    console.log('dir', dir);

    // 拉去github templete 选择指定的tag和仓库
    const repos = await getReposList();
    console.log('repos:', repos);
    // 获取用户选择的仓库repo
    const { repo } = await inquirer.prompt([{
        name: 'repo',
        type: 'list',
        message: 'choose a repo',
        choices: repos
    }]);

    
    // 获取用户选择的tag
    console.log('repo', repo);
    // 获取tags
    const tags = await getReposTags(repo);
    // 让用户选择使用哪一个版本的tag
    const { tag } = await inquirer.prompt([{
        name: 'tag',
        type: 'list',
        message: 'choose a tag',
        choices: tags
    }]);
    console.log('select-tag', tag);
}
```



### 下载git仓库中的模板

获取到对应的tag或者分支后，我们可以使用[download-git-repo](https://www.npmjs.com/package/download-git-repo)下载对应的文件到本地指定目录。download-git-repo支持github、gitlab和Bitbucket。其download方法接收三个参数，第一个参数是下载的地址，格式为owner/name#my-branch(tag)，第二个参数为目标地址，即要下载到本地的路径。第三个参数为要执行的回调函数。

download(path, destination, callback)

我们可以添加以下代码到exports中

```javascript
// 下载模板
let downUrl = `hew007/${repo}/#`
if (tag) {
    downUrl += tag;
}
console.log('url:', downUrl);

// 下载模板并安装对应的依赖

// 加载中的交互提示
spinner.text = 'download template...';
spinner.start();
// 要下载到的目录，这里我们以/temp目录为例
const destinationDir = path.resolve(dir, './temp');
console.log('destinationDir', destinationDir);
// 执行下载模板
downloadRepo(downUrl, destinationDir, (err) => {
    spinner.succeed('download Success!');
});
```

### 进入项目目录，安装依赖

下载完成后，我们需要进入到创建的目录，然后安装对应的依赖。由于我们是在js里面，需要使用到shell命令，所以需要使用到一个shelljs的依赖包。

在下载完成的回调函数中增加安装依赖步骤

```javascript
downloadRepo(downUrl, destinationDir, (err) => {
    spinner.succeed('download Success!');
    // 进入到下载到的文件夹
    shell.cd(destinationDir);
    
    spinner.text = 'install depends...';
    spinner.start();
    // 安装依赖
    shell.exec('npm install');
    spinner.succeed();
});
```



## 发布到npm

创建一个npm账户，验证邮箱（不然发布不了）。使用npm login 输入账户和密码进行登录，然后使用npm publish即可发布到npm上。之后我们便可以直接全局安装使用此脚手架。

