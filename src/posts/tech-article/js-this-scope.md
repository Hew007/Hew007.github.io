---
title: javascript中的this
date: 2020-07-26 20:02:37
category:
- 知识点
- javascript
- 技术
tag:
- this
- 作用域
- this指向
---
js中得this

this关键词是JavaScript中最令人疑惑的机制之一。this是非常特殊的关键词标识符，在每个函数的作用域中被自动创建，但它到底指向什么，是一个让大多数开发者始终比较头疼的问题，要弄明白js中this的指向问题，需要很多相关知识得储备和理解，比如作用域、作用域链以及函数的调用执行顺序，还要考虑诸多隐性的this绑定、是否在严格模式中等等。本篇文章不试图把关于this得每一点都去讲的一清二楚，而是，从小点到大的点去总结常见的this指向问题，而关于this指向的小点，只不过是大点的一个特殊例子而已。
<!-- more -->

## 首先什么是this?

> MDN关于this得定义：A property of an execution context (global, function or eval) that, in non–strict mode, is always a reference to an object and in strict mode can be any value.当前执行代码得环境对象

这是MDN中对this得一句话定义，即当前执行代码的环境对象。从这个定义中我们便可以知道，this与运行时上下文（context)环境有关。当函数被调用，一个执行上下文/执行环境被创建。这个环境包涵信息：函数在哪调用（调用栈call-stack），函数怎么调用的，以及传递得参数等等。在这其中的一个属性就是this，指向函数执行（运行时Runtime）期间的执行环境/上下文。

故this是基于函数调用时，和函数在哪定义无关，而和函数怎么调用有关。

## this在具体常见情况下的分析

### 在全局上下文context

在全局上下文（任何函数以外），this指向全局对象(以下都以在浏览器环境中为例）。

`this === window`

### 函数内部调用

#### 简单调用

简单调用，即独立函数调用。由于this没有通过call来指定，且this必须指向对象，那么默认就指向全局对象。

```javascript
function f1(){
    return this;
}
f1() === window; // true
```

在严格模式下，this保持进入执行环境时被设置的值。如果没有设置，那么默认是undefined。它可以被设置为任意值**（包括null/undefined/1等等基础值，不会被转换成对象）**。

```javascript
function f2(){
    "use strict";
    return this;
}
f2() === undefined; // true
```

#### 箭头函数

在箭头函数中，this由词法/静态作用域设置。它被设置为包含它的执行上线文的this，并且不再被调用方式影响（也包括call/apply/bind）。

```javascript
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject); // true
// 作为对应的方法调用
var obj = {foo: foo};
console.log(obj.foo() === globalObject); // true
// 绑定this
console.log(foo.call(obj) === globalObject); // true
foo = foo.bind(obj);
console.log(foo() === globalObject); // true
```

#### 作为对象的方法调用

当函数作为对象方法调用时，this指向该对象（不包括箭头函数）。原型链上的方法根对象方法一样，作为对象方法调用时this指向该对象。

```javascript
var o = {
    prop: 37,
    f: function() {
        return this.prop;
    }
};
console.log(o.f()); // 37
```

#### 构造函数

在构造函数（函数用new调用）中，this指向要被创建的新对象。

```javascript
function Test(name) {
    this.name = name;
    console.log(name);
}
new Test('xiao ming');
```

注意，当用call和apply而传进去作为this的不是对象时，将会调用内置的ToObject操作转换成对象。所以4将会装换成new Number(4)，而null/undefined由于无法转换成对象，全局对象将作为this。

#### bind

ES5引进了Function.prototype.bind。f.bind(someObject)会创建新的函数（函数体和作用域与原函数一致），但this被永久绑定到someObject，不论你怎么调用。

```javascript
function f(){
  return this.a;
}
 
var g = f.bind({a:"azerty"});
console.log(g()); // azerty
 
var h = g.bind({a:'yoo'}); // bind只生效一次！
console.log(h()); // azerty
 
var o = {a:37, f:f, g:g, h:h};
console.log(o.f(), o.g(), o.h()); // 37, azerty, azerty
```

#### 作为DOM事件处理程序调用

this自动设置为触发事件的dom元素

```javascript
// 被调用时，将关联的元素变成蓝色
function bluify(e){
  console.log(this === e.currentTarget); // 总是 true
  // 当 currentTarget 和 target 是同一个对象时为 true
  console.log(this === e.target);       
  this.style.backgroundColor = '#A5D9F3';
}
 
// 获取文档中的所有元素的列表
var elements = document.getElementsByTagName('*');
 
// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
for(var i=0 ; i<elements.length ; i++){
  elements[i].addEventListener('click', bluify, false);
}
```

## 与this关系密切的作用域

### 作用域Scope是什么？

Scope这个术语被用来描述在某个代码块可见的所有实体（或有效的所有标识符），更精准一点，叫做上下文（context）或环境（environment）。
当前执行的上下文（The current context of execution）。https://developer.mozilla.org/zh-CN/docs/Glossary/Scope
综合一下，Scope即上下文，包含当前所有可见的变量。

Scope分为词法作用域和动态作用域。顾名思义，词法作用域即词法阶段定义的作用域。换种说法，作用域是根据源代码中变量和块的位置，在词法分析器（lexer）处理源代码时设置。

让我们考虑下面的代码来分析词法作用域：

```javascript
function foo(a) {
    // 当前的作用域时foo
    var b = a * 2;
    var c= 6;
    return function(b) {
        var c= 3;
        console.log(a + b +c)
    }
}
// 此处的时外部作用域 当前为globe window
foo(1)(4); // 8
```

**作用域Scope是分层的，内层Scope可以访问外层Scope的变量，反之则不行。上面的代码中即有嵌套Scope。Scope在我们写代码的时候就被定义好了，比如谁嵌套在谁里面。**

##### *JavaScript采用的是词法作用域。*

于是，我们仅仅通过查看代码（因为JavaScript采用词法作用域Lexical Scope），就可以确定各个变量到底指代哪个值。

另外，变量的查找是从里往外的，直到最顶层（全局作用域），并且一旦找到，即停止向上查找。所以内层的变量可以掩盖外层的同名变量。


如果Scope仅仅由函数在哪定义的决定（在写代码时决定），那么还有方式更改Scope吗？JS有eval和with两种机制，但两者都会导致代码性能更差。我们一般也不会使用，也不推荐使用，所以大致做一个了解即可。


eval接受字符串为参数，把这些字符串当做真的在程序的这个点写下的代码——意味着可以编码方式来在某个点生成代码，就像真的在程序运行前在这里写了代码。

```jav
function foo(str, a) {
    eval( str ); // cheating!
    console.log( a, b );
}
var b = 2;
foo( "var b = 3;", 1 ); // 1, 3
```

默认情况下，eval会动态执行代码，并改变当前Scope。但非直接调用eval可以让代码执行在全局作用域，即修改全局Scope。

JavaScript没有动态作用域 Dynamic Scope。但是，JS中的this机制跟动态作用域Dynamic Scope很像，都是Runtime运行时绑定。

在ES5之前由于Javascript没有块级作用域，除了全局作用域，只有function可以创建新作用域（Function Scope）。

ES6之后，便有了块级作用域。另外，with和try catch都可以创建块级作用域Block Scope。

```javascript
{
    let x = 0;
}
console.log(x); // Uncaught ReferenceError: x is not defined
 
try {
    undefined();
}catch (err) {
    console.log( err );
}
console.log( err ); // ReferenceError: `err` not found
```

以上便是常见的this指向问题，绝大多数常见我们在开发过程中应该都有遇到，但是this指向为什么会有这么多情况呢？

### this指向多种情况的原因

JavaScript 语言之所以有`this`的设计，跟内存里面的数据结构有关系。另外，之所以使用this是因为this提供了一种优雅的方式来隐式传递一个引用，以便在函数中就能访问到，而不是做为一个参数，在函数之间互相传递。我们可以考虑如下例子：（参考你不知道的JavaScript）

```javascript
function identify() {
    return this.name.toUpperCase();
}

function speak() {
    var gerrting = "你好，我是" + identify.call(this)
}

var me = {
    name: "舍利子"
};

var you = {
    name: '好人'
};

identify.call(me); // 舍利子
identify.call(you); // 好人

speak.call(me); // 你好，我是舍利子
speak.all(you); // 你好，我是好人
```

以上函数可以在不同的上下问对象中重复使用，函数中this会自动根据上下文对象来取到对应正确的值。假如，没有this的设计，那么我们要实现这种功能，就不得不给函数显式传递一个上下文对象来实现相同的功能。

```javascript
function identify(context) {
    return context.name.toUpperCase();
}

function speak() {
    var gerrting = "你好，我是" + identify.call(context)
}
```

可以预见，随着你使用的模式越来越复杂，显示传递上下文对象，将变得异常复杂和混乱，而使用this就在一定程度上避免了这个问题。对于this的原理，推荐大家去看阮一峰的：[JavaScript 的 this 原理](https://www.ruanyifeng.com/blog/2018/06/javascript-this.html)

## 总结

从以上的总结中，我们可以把常见的this判断分为两大类，一类为在普通函数中的this调用，一类为在箭头函数中this调用。 而在这两大类又可以延申组合出很多小类，比如是否在DOM事件中、调用了call,bind、new操作符等等。

所以依据以上两大类，我们可以总价出这两类的this指向特点：

**常规函数，this指向最近调用它的那个对象，或者说执行时函数所在的作用域。**

**箭头函数, 不绑定this, 指向创建时所在的最近的作用域对象。**

把作用域和执行环境分析清楚，绝大多数的this指向问题，便能迎刃而解。