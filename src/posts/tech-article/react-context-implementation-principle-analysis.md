---
title: React Context 实现原理解析
date:  2023-07-09
description: 'React Context 的用法，优化以及实现原理解析'
category:
- React
- javascript
tag:
- React context
- Context
- 源码
- 解析
---
**本文由我和ChatGTP联合共创，参考资料在文末，如有勘误请指出，如有侵权请联系我删除，谢谢！**
![image.png](http://qncdn.yunishare.cn/blog/react-context.png@water)

### 什么是 React Context？

`Context` 是 `React` 提供的一种跨层级组件通信的机制，它允许你在组件树中共享数据，而不必手动通过 `props` 一层层传递。
<!--more-->

我们通常使用 `props` 将数据显式传递到使用它的组件，这是组件数据传递最好的方式。但是当我们需要在组件树中深层传递参数，逐层传递 `props` 就会变得很麻烦。

那有没有一种方式可以将数据直达所需要的组件中，而不需要层层传递呢？`React` 的 `Context` 就能满足我们的这个需求。使用`Context`我们可以将数据传递到任何需要使用他的子组件中，而不需要额外的声明`props`。

### Context API 概览及使用

`Context` 主要由三个部分组成：`React.createContext` 方法、`Context.Provider` 组件和 `Context.Consumer` 组件。

#### **定义Context - React.createContext ：**

是一个用于创建 `Context` 对象的方法。它接收一个默认值作为参数，并返回一个包含 `Provider` 和 `Consumer` 组件的对象。默认值在组件树中找不到匹配的 `Provider` 时被使用。

```jsx
// 创建一个名为 MyContext 的 Context 对象，并指定默认值为 "default value"
const MyContext = React.createContext("default value");
```

#### **赋值Context - Context.Provider 组件：**

`Context.Provider` 是用于提供数据的组件，它接收一个 `value` 属性作为数据的值。`Provider` 组件将 value 中的数据传递给其子组件中的所有 `Consumer` 组件。当 `Provider` 的 `value` 发生变化时，所有依赖该 `Provider` 的 `Consumer` 组件都会重新渲染。

```jsx
import { MyContext } from './MyContext';

function App() {
  // 使用 MyContext.Provider 提供共享数据
  return (
    <MyContext.Provider value="Hello from Context">
      <ChildComponent />
    </MyContext.Provider>
  );
}
```

#### **消费Context - Context.Consumer 组件：**

`Context.Consumer` 组件用于在组件树中消费共享的数据。它必须包含在 `Context.Provider `内部，并且使用函数作为其子元素。这个函数接收当前的 `Context` 值作为参数，并返回 `React` 元素。当 `Context.Provider` 的 `value` 发生变化时，`Context.Consumer` 组件会重新渲染，获取最新的 `Context` 值。<br />`Consumer` 组件通过函数作为子组件的方式，将 `Provider` 提供的值作为该函数的参数，可以在函数体内使用该值。

```jsx
import { MyContext } from './MyContext';
function ChildComponent() {
  // 使用 MyContext.Consumer 消费共享数据
  return (
    <MyContext.Consumer>
      {value => <div>{value}</div>}
    </MyContext.Consumer>
  );
}

```

#### 使用 useContext 钩子简化 **Context 的消费**

`React` 16.8 引入了 `useContext hooks`，我们可以通过使用 `useContext hook` 简化 `Context` 的使用。以上面`Consumer` 消费的例子为例，使用 `useContext` 可以这样写：

```jsx
import { MyContext } from './MyContext';
function ChildComponent() {
  const value = useContext(MyContext);
  return <div>{value}</div>;
}
```

在上述示例中，`useContext(MyContext) `的调用会返回 `MyContext` 的当前值，然后可以直接在组件中使用该值。`useContext` 的好处在于简化了代码，消除了嵌套的 `Context.Consumer` 组件，使得组件的代码更加简洁和易读。<br />需要注意，`useContext` 只能用于函数组件中，并且只能用于获取一个 `Context` 对象的值。如果需要获取多个 `Context` 对象的值，仍然需要使用多个 `useContext`。

通过 `Context API`，我们可以在组件树中方便地共享数据，避免了逐层传递 props 的繁琐。使用 `React.createContext()` 方法创建 `Context` 对象，`Context.Provider` 提供数据，而 `Context.Consumer` / `useContext` 消费数据，这样可以轻松实现跨组件层级的数据传递。

### React Context 的实现原理

#### 数据结构：Context 对象

![image.png](http://qncdn.yunishare.cn/blog/console-context.png@water)

```typescript
export function createContext<T>(defaultValue: T): ReactContext<T> {
  // 源码中context对象
  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: (null: any),
    Consumer: (null: any),
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };
  ......
  context.Consumer = context;
  return context;
}
```

从 [ReactContext.js 源码](https://github.com/facebook/react/blob/17.0.2/packages/react/src/ReactContext.js)中可以看出，`React Context `是一个 `JavaScript` 对象，它包含了两个属性：`Provider` 和 `Consumer`。`Provider` 组件用于提供数据，`Consumer` 组件用于消费数据。<br />同时还有两个变量 `_currentValue` 和`_currentValue2` 用来储存值，默认取`createContext` 创建时传入得 `defaultValue`。`_currentValue` 主要用来保存传递给`Provider`的`value`属性值。从注释可以看出, 保存 `2` 个 `value` 是为了支持多个渲染器并发渲染。<br />`context`工作流程可以概括为三个步骤：

1. 实例化`context`，并将默认值`defaultValue`赋值给`context._currentValue`
2. 每遇到一个同类型`context.Provier`，将value赋值给`context._currentValue`
3. `Consumer` / `useContext`取`context._currentValue`上的值

通过上述流程我们可以看出，`Context`的核心实现主要是步骤`2`，即`value`值的更新。

#### Context 的更新与触发-基于 Fiber 架构的实现

> 当 `Provider` 的值发生变化时，React 会重新渲染与之相关的所有 `Consumer` 组件。这是通过一种叫做“订阅/发布模式”（`Publish/Subscribe`）的机制实现的。`Provider` 组件维护一个订阅列表，当值发生变化时，会通知订阅了该 `Provider` 的所有 `Consumer` 组件，触发它们的重新渲染。—ChatGTP如是一本正经的说（这一点感觉它说的不太对，感觉是在瞎编糊弄我呢😂）

React Fiber 架构对于 `Context` 的实现起到了重要的作用。在 `Fiber` 架构下，`React` 使用单链表的数据结构来表示组件树，这样可以更高效地进行协调和更新。当 `Provider` 的值发生变化时，`React` 会通过遍历 Fiber 树的方式，找到所有依赖于该 `Provider` 的节点，并触发它们的重新渲染。

其主要更新逻辑在 [propagateContextChange](https://github.com/facebook/react/blob/17.0.2/packages/react-reconciler/src/ReactFiberNewContext.new.js#L182)方法：

- 向下遍历: 从`ContextProvider`类型的节点开始, 向下查找所有`fiber.dependencies`依赖该`context`的节点(`consumer`).
- 向上遍历: 从`consumer`节点开始, 向上遍历（每个子元素都引用了父节点）, 修改父路径上所有节点的`fiber.childLanes`属性, 表明其子节点有改动, 子节点会进入更新逻辑.

![fiber树](http://qncdn.yunishare.cn/blog/fiber-constructor-tree.png@water "fiber树")



##### 主要更新步骤：

1. 当 `Context` 的值发生变化时，`React` 会触发 `Context` 的更新，来更新 `Provider` 组件的状态。
2. `Provider` 组件的状态更新完成后，会调用 ReactFiber 中的 [scheduleUpdateOnFiber(markRootUpdated)](https://github.com/facebook/react/blob/17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L506) 方法来标记 `Context` 相关的 `Fiber` 节点为“脏”状态，表示需要重新渲染。
3. 在 `React` 的调度过程中，`React` 会遍历“脏”状态的 `Fiber` 节点，并进行协调和更新操作。对于依赖于 `Context` 的 `Consumer` 组件，会触发它们的重新渲染。在遍历过程中，React 会根据 Fiber 节点的类型，调用对应的更新函数（如函数组件的 `updateFunctionComponent`、类组件的 `updateClassComponent`）。
4. 在更新函数中，`React` 会检查 `Consumer` 组件是否依赖于发生变化的 `Context`。如果依赖的 `Context` 发生了更新，React 会标记 `Consumer` 对应的 Fiber 节点为“脏”状态，触发重新渲染。
5. 在协调和更新过程完成后，`React` 会进行提交阶段，将新的 Fiber 树的变更应用到实际的 DOM 中。在`commit`提交阶段，React 会遍历 `Fiber` 树，并根据 `Fiber` 节点的类型执行不同的操作，如创建新的 `DOM` 节点、更新属性、插入、移动或删除 `DOM` 节点等。在更新过程中，`React` 会将新的 `Fiber` 树与旧的 `Fiber` 树进行比较和交换（diff算法），确保更新是以高效的方式进行的。

#### 嵌套组件的数据生产（更新）和消费

```tsx
const MyContext = React.createContext(0);

<MyContext.Provider value={1}>
  <MyContext.Provider value={2}>
    <MyContext.Provider value={3}>
      <Child1 />
    </MyContext.Provider>
    <Child2 />
  </MyContext.Provider>
  <Child3 />
</MyContext.Provider>
```

在上面代码中，`MyContext` 的值会从默认值0，逐渐被更新为`1`、`2`、`3`，沿途消费的`Child`组件取得的值分别为：`3`、`2`、`1`。整个后进先出的流程很像栈（其实就是）：`1`、`2`、`3`分别入栈，`3`、`2`、`1`分别出栈，过程中栈顶的值就是`context`当前的值。

![](http://qncdn.yunishare.cn/blog/stack-context.png@water)

实现这种嵌套的机制，React 利用的就是是栈的特性（后进先出），通过 `pushProvider` 方法进行入栈 和 `popProvider`方法进行出栈。<br />每次执行`pushProvider`时将`context._currentValue`更新为当前值：使用`push` 方法将 `cursor.current` 的值推到 `valueStack` 的栈顶，然后把当前 `provider` 节点的变化了的 `value` 值放到 `cursor.current` 中。

```typescript
// 使用栈存储 context._currentValue 值
function pushProvider(providerFiber, context, nextValue) {
  // 入栈
  push(valueCursor, context._currentValue, providerFiber)
  // 修改 context 的值
  context._currentValue = nextValue
}

function push<T>(cursor: StackCursor<T>, value: T, fiber: Fiber): void {
  index++;
	
  valueStack[index] = cursor.current;

  // ...
  
	// 保存最新值
  cursor.current = value;
}
```

![image.png](http://qncdn.yunishare.cn/blog/fiber-stack.png@water)

`popProvider`出栈操作执行时，会将`context._currentValue`更新为上一个`context._currentValue`：`pop` 方法则将 `cursor.current` 的值替换成 `valueStack` 栈顶的值，然后栈顶的值重置为 `null`，接着 `index--`。

```typescript
function popProvider(
  context: ReactContext<any>,
  providerFiber: Fiber,
): void {
  
  const currentValue = valueCursor.current;
  // ...
 	context._currentValue = currentValue;
  // ...
  pop(valueCursor, providerFiber);
}

function pop<T>(cursor: StackCursor<T>, fiber: Fiber): void {
  // ...
	// 取出栈顶元素
  cursor.current = valueStack[index];

  valueStack[index] = null;
	// ...
  index--;
}
```

### 4. Context 的性能优化

在大型应用中，`React Context` 可能会面临性能问题，主要涉及以下几个方面：

- **嵌套层级过深**：当 `Context` 嵌套层级过深时，每个 `Consumer` 组件在渲染时都需要检查其上层是否存在匹配的 Provider 组件。这种嵌套关系会增加渲染的开销，特别是在庞大的组件树中。
- **未优化的更新触发**：如果 `Context` 的值发生变化时，所有依赖该 `Context` 的 `Consumer` 组件都会触发重新渲染。在某些情况下，这可能会导致无关的组件重新渲染，造成性能浪费。

针对这些性能问题，可以采取以下优化策略：

1. **避免过深的嵌套层级**：尽量避免在组件树中创建过深的 `Context` 嵌套结构。可以通过重构组件结构、合并多个 `Context`，或者使用更细粒度的 `Context` 来减少嵌套层级。
2. **使用 shouldComponentUpdate 或 React.memo**：在 `Consumer` 组件中，可以使用 `shouldComponentUpdate` 或 `React.memo` 来进行性能优化。通过对比前后的 `Context` 值，可以避免不必要的重新渲染。
3. **使用 useContext 和 useReducer**：在性能要求较高的情况下，可以使用 `useContext` 配合 `useReducer` 来替代 `useContext` 配合 `useState`。因为 `useReducer` 提供了更细粒度的更新控制，可以减少不必要的重新渲染。
4. **使用局部化的 Context**：对于大型应用中的某些模块或功能，可以使用局部化的 `Context`，而不是将 `Context` 放置在整个应用的顶层。这样可以减少不必要的 `Consumer` 组件，提高渲染性能。
5. **使用数据分离**：对于只读的全局数据，可以考虑使用状态管理库（如 `Redux` 或 `MobX`）来管理，而不是使用 `Context`。这样可以提供更高效的状态管理和更新机制。

性能优化应该根据具体的应用场景和需求进行评估和实施。在进行优化时，可以使用性能分析工具（如 `React DevTools` 和 `Chrome DevTools`）来定位性能瓶颈，并针对性地进行调整。

### 参考资料

1. Chatgtp 对话
2. [React 官方文档](https://react.docschina.org/learn/scaling-up-with-reducer-and-context)
3. [React github 源码](https://github.com/facebook/react/tree/17.0.2)
4. [深入 React Context 源码与实现](https://juejin.cn/post/7213752661761523772)
5. [Context原理](https://7km.top/main/context)
6. [React Context的核心实现，就5行代码](https://mp.weixin.qq.com/s/qpQS3ne7HXSL5Dle-ts4qQ)

