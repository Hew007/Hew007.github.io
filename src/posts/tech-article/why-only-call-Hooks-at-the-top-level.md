---
title: 为什么只能在顶层调用 Hooks？
date: 2023-04-16 19:49:00
category:
- React
- 技术
tag:
- hooks
- useState
- 原理
---

这个问题再hooks刚出现时就有了，最近翻阅官方文档时，发现新版的[React官方文档](https://react.docschina.org/learn/state-a-components-memory)给出了详细的答案，并给出了伪代码实现，这里也做一个复习总结。

<!-- more -->
> 在 React 内部，为每个组件保存了一个**数组**，其中每一项都是一个 state 对。它维护当前 state 对的索引值，在渲染之前将其设置为 “0”。每次调用 useState 时，React 都会为你提供一个 state 对并增加索引值。你可以在文章 [React Hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)中阅读有关此机制的更多信息

React内部的每一个`state`对（即`stateX`和`useStateX`）,都会按照hook的调用顺序，被保存在一个数组中。也就是说，每个`state`对在初次渲染之后其索引都已经固定，下次再次访问时，就可以根据当前的索引，直接取出对应的state。如果代码中state位置是动态的，Hook 的调用顺序发生了改变，就会导致更新时，产生错误。

###  `useState` 在内部是如何工作的

下面是模拟`usestate`原理的一个简化版示例

```javascript
let componentHooks = []; // 声明一个数组，用来存储所有state对
let currentHookIndex = 0; // 定义一个索引变量，标识当前应该访问哪个state对

// useState 在 React 中是如何工作的（简化版）
function useState(initialState) {
  // 取出当前对应的state对
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // 这不是第一次渲染
    // 所以 state pair 已经存在
    // 将其返回并为下一次 hook 的调用做准备
    currentHookIndex++;
    return pair;
  }

  // 这是我们第一次进行渲染
  // 所以新建一个 state pair 然后存储它
  pair = [initialState, setState];

  function setState(nextState) {
    // 当用户发起 state 的变更，
    // 把新的值放入 pair 中
    pair[0] = nextState;
    updateDOM();
  }

  // 存储这个 pair 用于将来的渲染
  // 并且为下一次 hook 的调用做准备
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function updateDOM() {
  // 在渲染组件之前
  // 重置当前 Hook 的下标
  currentHookIndex = 0;
  // 更新 DOM 以匹配输出结果
  // 这部分工作由 React 为你完成
  ......
}
```

新版文档比之前质量要好很多，有更多例子以及原理性的说明，建议大家再通读一遍，定能有所收获。
