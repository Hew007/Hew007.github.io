---
title: 在前端项目中进行单元(unit test)测试
date: 2020-08-02 14:49:41
category:
- 测试
- 技术
tag:
- 单元测试
- 前端测试
- 自动化测试
- unit test
---

## 分类及定义

测试分为很多类别的测试，根据测试阶段，可以从大的分类上分为单元测试、集成测试、端到端（e2e)测试和人工回归测试。单元测试只是属于测试类别中的一种，是最底层，最基本的测试类别之一。维基百科对单元测试的定义为：
<!-- more -->
> 在计算机编程中，**单元测试**（英语：Unit Testing）又称为**模块测试**，是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。程序单元是应用的最小可测试部件。在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。

我们可以理解为对代码最小颗粒度（以单个函数为单位）的测试，它是软件开发中非常基础的一部分。

**前端常见的测试框架/库。**

单元测试：mocha，jest

端到端测试：nightwatch，cypress

## 为什么要进行单元测试

**保证项目质量**

单元测试执行了最小化单元程序测试，保证了单个模块组件的正确性，从而来保证有这些程序模块组成系统的正确性。

**增强可维护性**

单元测试会封闭执行最小化单元的代码，在增加新功能是只需要增加响应的测试用例，然后执行所有的就能确定增加功能点是否对已有的项目产生影响，在什么地方产生了影响，也使得追踪问题更容易。连续的单元测试环境，通过其固有的持续维护工作，单元测试可以延续用于准确反映当任何变更发生时可执行程序和代码的表现。借助于上述开发实践和单元测试的覆盖，可以分分秒秒维持准确性。

**更好的表现api的设计**

利用单元测试提供的功能和单元测试中如何使用程序单元，开发者可以更直观的理解代码中程序单元的功能和设计。也能很好的展示需要捕获的程序异常和错误。这样，在其他人接手有单元测试的项目时，也能更快的熟悉代码以及相关的功能，而不是看着函数的调用链一层一层的去分析函数的功能设计。

## 如何进行单元测试

本文以mocha为示例，断言库使用chai，来展示如何在项目中简单得编写和使用单元测试。

### 在普通js项目中的使用

初始化一个npm项目，然后安装mocha依赖，安装对应的断言库chai。

紧接着，我们新建一个src目录放置源代码，然后，创建一个测试的js文件。

```bash
npm init -y // 初始化项目
mkdir src && cd src
touch index.js // 创建js文件
```

写一个简单的函数，用来做单元测试。

```javascript
// src/index.js
// 加法函数
function add(a, b) {
    if(isNaN(a + b)) {
        return;
    }
    return a + b;
}

```

然后再编写一个简单的测试用例js文件。创建一个名为test的文件夹，然后，在test文件夹下创建一个index.js文件，这个文件就是我们用来写测试用例的地方。

```javascript
// test/index.js
import add from '../src/index'; // 引入需要测试的文件
import { expect } from 'chai'; // 引入断言库中

// 创建一个相关联的测试代码块
describe('测试工具方法index.js', function() {
    // 测试单个方法的用例
    describe('测试add函数', function() {
        //  case1
        it('传入两个参数，得到两个值的和', function() {
            expect(add(2, 3)).to.be.equal(5);
        });
        // case2
        it('传入两个参数相加不为和以外的数', function() {
            expect(add(2, 3)).to.be.not.equal(4);
        });
    })
})
```

> 上面的用例，使用了es6语法，mocha默认是不支持的，如果运行测试是报错，需要安装对应的@babel/register让其支持es6语法。使用npm install -D @babel/core @babel/node @babel/preset-env @babel/register。

然后运行 npx mocha，执行测试用例，打印如下：

<img src="http://qncdn.yunishare.cn/image-20200802204630269.png@water" alt="image-20200802204630269" style="zoom:80%;" />

mocha还提供个4个hook钩子，我们可以利用这些钩子，在测试前和测试后去做一些处理，比如测试之前可以去定义一些用例的变量，测试后去执行一些回调之类的事情。mocha提供了4个生命周期的钩子，分别是before，befoereEach，after，afterEach。其中before和after会在每一个测试中执行一次。而beforeEach和afterEach会在每个用例前后都执行一次。有多少个用例case就会执行多少次。

我们可以在上面的测试代码中加入钩子函数进行打印，从打印中我们便可以看到，各个钩子执行的顺序及执行的规律。

```javascript
describe('测试工具方法index.js', function() {
    before(function () {
        // runs once before the first test in this block
        console.log('before')
    });

    after(function () {
        // runs once after the last test in this block
        console.log('after')
    });

    beforeEach(function () {
        // runs before each test in this block
        console.log('beforeEach')
    });

    afterEach(function () {
        // runs after each test in this block
        console.log('afterEach')
    });
    // 测试单个方法的用例
    describe('测试add函数', function() {
        //  case1
        it('传入两个参数，得到两个值的和', function() {
            expect(add(2, 3)).to.be.equal(5);
        });
        it('传入两个参数相加不为和以外的数', function() {
            expect(add(2, 3)).to.be.not.equal(4);
        });
    })
});
```

打印结果如下：

![image-20200812104116718](http://qncdn.yunishare.cn/image-20200812104116718.png@water)



### 在vue-cli项目中的使用

在新项目中使用，只需要使用vue-cli创建项目是勾选对应的测试工具即可，vue中我们以jest为例。如果是再现有的项目中添加，需要安装Vue Test Utils和Jest。Vue Test Utils 是 Vue.js 官方的单元测试实用工具库。方便进行vue组件的测试。Jest相对mocha来说配置简单，更易上手操作。

安装 Jest 和 Vue Test

```bash
$ npm install --save-dev jest @vue/test-utils
```

如果是cli3创建的项目可以直接安装[cli-plugin-unit-jest](https://cli.vuejs.org/core-plugins/unit-jest.html#injected-commands)插件，进行jest单元测试。

```bash
$ vue add unit-jest
```

更多配置信息请参考官方测试文档：[用Jest测试单文件组件](https://vue-test-utils.vuejs.org/zh/installation/testing-single-file-components-with-jest.html)，这里不再一一赘述。

使用vue-cli创建的项目，如果选择了test工具，会自动在项目中生成一个test文件夹以及相应的测试文件demo，如下所示，引入组件，使用shallowMount渲染组件，然后验证渲染的dom中是否包含props传递的msg。

```javascript
import { shallowMount } from '@vue/test-utils' // 引入vue单元测试
import HelloWorld from '@/components/HelloWorld.vue' // 引入要测试的组件

// 测试helloword组件
describe('HelloWorld.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message'; 
        // 使用定义得到变量作为props渲染组件
        const wrapper = shallowMount(HelloWorld, {
            propsData: { msg }
        })
        // 验证是否渲染了对应的信息
        expect(wrapper.text()).toMatch(msg);
    });
    
});
```

在上面的的demo示例中，首先从vue单元测试方法中导出了一个shallowMount方法，此方法会创建一个包含被挂载和渲染的 Vue 组件的包裹器 [`Wrapper`](https://vue-test-utils.vuejs.org/zh/api/wrapper/)，此包裹器会暴露很多封装、遍历和查询其内部的 Vue 组件实例的便捷的方法。还有一个与值相同的方法mount，与shallowMount不同的是，shallowMount只挂载一个组件而不渲染其子组件，而mount会将子组件一起渲染。

#### 一个简单的组件测试例子

这个组件：

- 默认展示一个“Welcome to the Unit Test”的问候语
- 提示用户输入用户名
- 如果输入的用户名少于5个字符则展示错误信息

代码如下：

```vue
<template>
    <div>
        <div class="message">
            {{ message }}
        </div>
        Enter your username: <input v-model="username">

        <div
            v-if="error"
            class="error"
        >
            Please enter a username with at least seven letters.
        </div>
        <h4 v-else>my name is {{username}}</h4>
    </div>
</template>

<script>
    export default {
        name: 'Foo',
        props: {
            message: {
                type: String,
                default: 'Welcome to the Unit Test'
            }
        },
        data() {
            return {
                username: '',
            };
        },
        computed: {
            error() {
                return this.username.trim().length < 5;
            }
        }
    };
</script>

<style lang="less">
    .error {
        color: #db6415;
    }
</style>
```

我们应该测试的内容有：

- `message` 是否被渲染，且初次渲染为默认值
- 如果传递了`props message`，渲染的内容是否为message
- 如果 `error` 是 `true`，则 `<div class="error">` 应该展示
- 如果 `error` 是 `false`，则 `<div class="error">` 不应该展示

根据以上，我们编写出第一次测试代码：

```javascript
import { shallowMount } from '@vue/test-utils';
import Welcome from '@/components/Welcome';

describe('Welcome', () => {
    it('renders a message and responds correctly to user input', () => {
        const wrapper = shallowMount(Welcome, {
            data() {
                return {
                    username: '',
                };
            },
        });

        // 确认是否渲染了 `message`
        expect(wrapper.find('.message').text()).toEqual('Welcome to the Unit Test');

        // 断言渲染了错误信息 未输入任何信息会展示错误信息
        expect(wrapper.find('.error').exists()).toBeTruthy();

        // 更新 `username` 并断言错误信息不再被渲染
        wrapper.setData({ username: 'Hahaha' });
        // 由于更新了username 且长度超过了5 断言找不到错误信息
        expect(wrapper.find('.error').exists()).toBeFalsy();
    });
});
```

上述代码其实是存在一些问题的：

- 单个测试，断言了不同的用例
- 很难阐述组件可以处于哪些不同的状态，以及它该被渲染成什么样子

接下来的我们从这以下几个方面改善了上面的测试：

- 每个 `it` 块只做一个断言，即每个为一个最小的用例块
- 让测试描述更简短清晰
- 只提供测试需要的最小化数据
- 把重复的逻辑重构到了一个工厂函数中 (创建 `wrapper` 和设置 `username` 变量)

更新后的测试代码：

```javascript
import { shallowMount } from '@vue/test-utils';
import Welcome from '@/components/Welcome.vue';

// 创建一个工厂函数用来传递参数然后创建wrapper
const factory = (datas = {}, props = {}) => {
    return shallowMount(Welcome, {
        data() {
            return {
                ...datas
            };
        },
        propsData: {
            ...props
        }
    });
};

describe('Welcome', () => {
    // 初始化断言message 用例
    it('渲染一个welcome欢迎信息', () => {
        console.log('第1个case：', '渲染一个welcome欢迎信息');
        const wrapper = factory();

        expect(wrapper.find('.message').text()).toEqual('Welcome to the Unit Test');
    });
    it('传递一个message为welcome!的信息，断言渲染一个welcome!欢迎信息', () => {
        console.log('第2个case：', '渲染一个welcome! 欢迎信息信息');
        const wrapper = factory({}, {
            message: 'Welcome!'
        });

        expect(wrapper.find('.message').text()).toEqual('Welcome!');
    });
 
    it('当输入的字符为空少于5时渲染一个错误信息提示', () => {
        console.log('第3个case：', '当输入的字符为空少于5时渲染一个错误信息提示');
        const wrapper = factory({ username: '' });
        expect(wrapper.find('.error').exists()).toBeTruthy();
    });

    it('当username为5个空格时也应该渲染错误信息提示', () => {
        console.log('第4个case：', '当username为5个空格时也应该渲染错误信息提示');
        const wrapper = factory({ username: ' '.repeat(5) });

        expect(wrapper.find('.error').exists()).toBeTruthy();
    });

    it('当username为5个字符以上是，不渲染错误信息提示', () => {
        console.log('第4个case：', '当username为5个字符以上是，不渲染错误信息提示');
        const wrapper = factory({ username: 'Lachlan' }, { message: 'Welcome to the Vue Unit Test Case !' });

        expect(wrapper.find('.error').exists()).toBeFalsy();
    });
    
    it('当username为5个空格时也应该渲染错误信息提示', () => {
        const username = 'abcdefg';
        const wrapper = factory({ username })
        console.log('第5个case：', '当username为5个字符以上是，包含传递的username');
        expect(wrapper.find('.show-name').text()).toMatch(username);
    });
});

```

在一开始，工厂函数将 `datas,props` 对象合并到了 `data,prop` 并返回了一个新的 `wrapper` 实例。这样，我们就不需要在每个测试中重复 `const wrapper = shallowMount(Welcome)`。另外，当我们想为更复杂的组件在每个测试中伪造或存根一个方法或计算属性时，你只需要声明一次即可。

运行test打印结果：

<img src="http://qncdn.yunishare.cn/image-20200814161337184.png@water" alt="image-20200814161337184" style="zoom:50%;" />

上述的测试是非常简单的组件测试，但是在实际生产情况下 Vue 组件测试还包括：调用 API，为 `Vuex` 的 store，commit 或 dispatch 一些变更或 action，为路由更新做一些处理，测试用户交互......。以上这些，在官方的文档中都有相关的示例和api，学会了基本使用，更为复杂的组件测试，也只不过是时间问题。

## 总结

其实从以上简单的例子中，我们就能看出，虽然，写用例时会耗费我们一定的精力，但是当我们在原有的js或组件中增加功能时，测试用例能帮助我们很好的验证之前功能的完整性，从而增强项目的稳定性和可维护性。

这里放一个知乎的问题，应该能很好的总结了：[单元测试到底是什么？应该怎么做？](https://www.zhihu.com/question/28729261/answer/1058317111)