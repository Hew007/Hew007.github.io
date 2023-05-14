---
title: useContext的使用规则及原理浅析
date: 2022-01-23
category:
- 技术
- React
tag:
- react
- hooks
- useContext
- 原理
---

> 文章为去年所写，最近翻到笔记，为了熟悉一下，也为了方便看，将其放在博客中

## Context

### 什么是Context

想象一下，我们有一个 React 应用，其中包含一个父组件，其中包含许多级别的子组件，以及子组件的子组件。现在，我们要将数据从最上面的组件一直传递到最后一个子组件。在 React 中，数据通常通过props从一个组件自上而下传递到另一个组件。此时我们通过每个组件，通过它们的 props 传递该数据，直到到达最后一个子组件。如果这样的嵌套树形结构有5层或10层，那么将是灾难式的开发维护体验，并且容易出错。如果能不经过中间的节点直接到达需要的地方就可以避免这种问题，这时 Context api 就是来解决这个问题的。Context API 允许我们轻松访问组件树中不同层级的数据，而不必通过 props 向下传递数据。

#### 使用 Context
<!--- more --->
下面将以一个示例，简单展示Context的使用，图中按钮的颜色是一个深层次的子组件通过context进行传递的，效果如下：![imagepng](https://cdn.nlark.com/yuque/0/2022/png/2400472/1642078691275-d2e67786-67d0-4f40-b60b-ccaeeb74ad48.png#clientId=u9f6342bc-7072-4&from=paste&height=187&id=u6ef158b2&originHeight=187&originWidth=361&originalType=binary&ratio=1&rotation=0&showTitle=false&size=3226&status=done&style=none&taskId=ube9ecbd4-4443-4356-b934-72f897dea2c&title=&width=361)codesanbox实例：[https://codesandbox.io/s/modest-roentgen-yeyiq?file=/src/components/Button.jsx](https://codesandbox.io/s/modest-roentgen-yeyiq?file=/src/components/Button.jsx)

组件层级结构如下`App =>Toolbar => ThemedButton =>Button`

#### 创建 context

使用 `createContext()` 来创建一个 context，为当前的 theme 创建一个 context（green为默认值）

    const ThemeContext = React.createContext('green');

#### Provider value提供值

使用 `Provider` 包裹子节点，将 `context` 提供给子节点，`value`为要传入给子孙节点的值

    
    <ThemeContext.Provider value={{ theme }} >
      <Toolbar />
    </ThemeContext.Provider>

#### Consume Value消费值

     <ThemeContext.Consumer>
        {value => (
          <button type="button" style={{ backgroundColor: value }}>
            {props.children}
          </button>
        )}
    </ThemeContext.Consumer>

#### 在使用的节点处消费 Context

更新Context我们不光需要获取`context`值，有时候我们页需要从一个在组件树中嵌套很深的组件中更新 context 。在这种场景下，我们可以通过 `context` 传递一个函数，使得 `consumers` 组件更新 `context`：**创建一个带有更新函数的context**

    // 创建一个带有更新函数的context
    const ThemeContext = React.createContext({
         theme: 'green',
         update: () => { }
     });

在`provider`处提供自定义的更新函数

    const [theme, setTheme] = useState("red");
    // 更新函数
    const updateTheme = (theme) => {
      setTheme(theme);
    };
    
    // dom使用
    <ThemeContext.Provider value={{ theme, update: updateTheme }}>
      <Toolbar />
    </ThemeContext.Provider>

**在子组件中更新context**

    class Button extends React.Component {
        // 指定 contextType 读取当前的 theme context。
        // React 会往上找到最近的 theme Provider，然后使用它的值。
        // 在这个例子中，当前的 theme 值为 “dark”。
        // static contextType = ThemeContext;
    
        static contextType = ThemeContext;
        render() {
            return (
                <>
                    <button
                        type="button"
                        style={{ backgroundColor: this.context.theme }}
                    >
                        {this.props.children}
                    </button>
                    <hr></hr>
                    <button
                        type="button"
                        onClick={() => this.context.update("blue")}
                    >
                        点我变蓝
                    </button>
                </>
            );
        }
    }
    // 使用consume

### useContext

#### 简介

在子孙组件中要获取到`context`的值，必须通过类组件的`contextType`，或者通过`consumers` 组件进行获取，而且，如果是函数式组件则只能使用`consumers` 组件消费value，如果是多个`context`使用起来则更不方便。为此，React提供了一个可以直接获取context对象的方式：**useContext**。`useContext`接收一个 `context` 对象（`React.createContext `的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 value prop 决定。当组件上层最近的 `<MyContext.Provider> `更新时，该 `Hook` 会触发重渲染，并使用最新传递给 `MyContext provider `的 `context value` 值。即使祖先使用 `React.memo` 或 `shouldComponentUpdate`，也会在组件本身使用 `useContext` 时重新渲染。调用了 `useContext` 的组件总会在 context 值变化时重新渲染。

> 注意：别忘记 useContext 的参数必须是 context 对象本身：

#### 使用

在需要获取context值的子组件中直接获取，获取到的值可以直接使用。

    const theme = useContext(ThemeContext);
    console.log(theme); // 'green' 即最近一层provider提供的值

#### 和类组件中使用的对比

类中需要使用`contextType`， 然后通过`this.context`获取

    static contextType = ThemeContext;
    console.log(this.context) // 'green'

而使用`useContext`则很方便 直接使用`useContext`创建即可。通过 useContext 可以极大的减小多个 Context 使用的代码复杂的问题。

    const theme = useContext(ThemeContext);

#### 使用useContext更新context

useContext更新方式，除了使用和上述更新context的方式，我们也可以用下面看起来很像useHook的方式进行context的定义和更新

    const ThemeContext = React.createContext([{}, () => { }]);

    export default function App() {
        const [theme, setTheme] = useState('red');
          <ThemeContext.Provider value={[theme, setTheme]} >
          <Toolbar />
        </ThemeContext.Provider>
    }

    const Button = props => {
        const [theme, setTheme] = useContext(ThemeContext);
        return (
            <>
                <button type="button" style={{ backgroundColor: theme }}>
                    {props.children}
                </button>
                <hr></hr>
                <button type="button" onClick={() => setTheme("blue")}>
                    点我变蓝
                </button>
            </>
        );
    };

#### 注意事项

> useContext(MyContext) 相当于 class 组件中的 static contextType = MyContext 或者 <MyContext.Consumer>。

> useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 context。

### 原理

#### createContext

    const MyContext = React.createContext(defaultValue);

    // packages/react/src/ReactContext.js
    
    export function createContext<T>(defaultValue: T): ReactContext<T> {
      // TODO: Second argument used to be an optional `calculateChangedBits`
      // function. Warn to reserve for future use?
    
      const context: ReactContext<T> = {
        // ReactContext中的$$typeof是作为createElement中的属性type中的对象进行存储的
        $$typeof: REACT_CONTEXT_TYPE,
        // 作为支持多个并发渲染器的解决方法，我们将一些渲染器分类为主要渲染器，将其他渲染器分类为辅助渲染器。    
        // As a workaround to support multiple concurrent renderers, we categorize    
        // some renderers as primary and others as secondary.   
    
        // 我们只希望最多有两个并发渲染器：React Native（主要）和Fabric（次要）;    
        // React DOM（主要）和React ART（次要）。    
        // 辅助渲染器将自己的context的value存储在单独的字段中。    
        // We only expect    
        // there to be two concurrent renderers at most: React Native (primary) and    
        // Fabric (secondary); React DOM (primary) and React ART (secondary).   
        // Secondary renderers store their context values on separate fields. 
    
        // <Provider value={xxx}>中的value就是赋值给_currentValue的    
        // 也就是说_currentValue和_currentValue2作用是一样的，只是分别给主渲染器和辅助渲染器使用
    
        _currentValue: defaultValue, // Provider 的value 属性
        _currentValue2: defaultValue, // Provider 的value 属性
        // Used to track how many concurrent renderers this context currently
        // supports within in a single renderer. Such as parallel server rendering.
        _threadCount: 0, // 用来追踪 context 的并发渲染器数量
        // These are circular
        Provider: (null: any),  // 提供组件
        Consumer: (null: any), // 应用组件
      };
    
      // 给context对象添加 Provider 属性，并且 Provider 中的_context指向的是 context 对象
      context.Provider = {
        $$typeof: REACT_PROVIDER_TYPE,
        _context: context,
      };
    
      let hasWarnedAboutUsingNestedContextConsumers = false;
      let hasWarnedAboutUsingConsumerProvider = false;
      let hasWarnedAboutDisplayNameOnConsumer = false;
    
      if (__DEV__) {
    
        // 删除了 DEV 部分的代码
      } else {
        // 也就是Consumber对象指向React.Context对象    
        // 在<Consumer>进行渲染时，为了保证Consumer拿到最新的值，    
        // 直接让Consumer=React.Context，    
        // React.Context中的_currentValue已经被<Provider>的value给赋值了    
        // 所以Consumer能立即拿到最新的值
        context.Consumer = context;
      }
    
      // 删除了 DEV 部分的代码
    
      return context;
    }
    

在 `createContext` 中，构建一个 context 对象，将传递进来的 `defaultValue` 赋值给 context 对象的 `_currentValue` 和 `_currentValue2` 属性，并在 context 对象上定义了一个用来追踪 context 并发渲染器数量的 `_threadCount` 属性，一个为 `Consumer`组件提供 value 的 `Provider`组件，和一个用于消费 context 的 `Consumer`组件。`_currentValue` 和 `_currentValue2` 两个属性是为了适配不同的平台，如 Web端、移动端。这两个属性在 context 对象初始化时都会赋值为传入的 `defaultValue` 。在 React 更新的过程中，会一直有一个叫做 valueCursor 的栈，这个栈可以帮助记录当前的 context，每次更新组件的时候，`_currentValue` 和 `_currentValue2` 都会被赋值为最新的value。context 对象构建好之后，就将当前的 context 对象分别挂载到 `Provider` 组件和 `Consumer` 组件上。最后将该 context 对象返回，其数据结构如下：![imagepng](https://cdn.nlark.com/yuque/0/2022/png/2400472/1642944504738-b915ac2d-fae5-4bbd-afb9-8544de33340d.png#clientId=u41fb8d3c-4d9a-4&from=paste&height=837&id=u18f6e9c1&originHeight=837&originWidth=799&originalType=binary&ratio=1&rotation=0&showTitle=false&size=175297&status=done&style=none&taskId=u64ba2d30-6cf8-4ba2-bbca-061220a7f86&title=&width=799)

#### useContext

`useContext`在`mount`时主要会调用`readContext`函数。可以看到，`readContext`会创建一个`contextItem`并以链表的结构记录在对应`fiber.dependencies`上，最后将`Provider`的`prop`上的`value`返回。`readContext` 把 context 对象上的 `_currentValue`取出来，接着构建一个新的 context项，该 context 项上存储着当前的 context 对象和 context 对象上的 `_currentValue`，并通过 `next` 指针连接下一个 context 项，接着构建一个 context 依赖列表，并将该列表挂载到当前正在渲染的 `Fiber` 节点，最后返回从 context 对象上取出来的 `_currentValue`。`readContext` 接收一个 context 对象 (`React.createContext `的返回值) 并返回该 context 的当前值。我们接下来看看这个 context 对象和该 context 的当前值。

    export function readContext<T>(context: ReactContext<T>): T {
    
          // 删除了Dev部分代码
    
      // 以下两个属性是为了适配多平台（浏览器端/移动端）
      // _currentValue
      // _currentValue2
    
      // ReactDOM 中 isPrimaryRenderer 为 true，定义的就是 true
      // 实际就是一直会返回  context._currentValue
      const value = isPrimaryRenderer
        ? context._currentValue
        : context._currentValue2;
    
      if (lastFullyObservedContext === context) {
        // Nothing to do. We already observe everything in this context.
      } else {
        // 新建一个 context 链表的节点，节点上存储着传递进来的 context 对象 和 context 对象上的value
        //  next 指针连接下一个 context 项
        const contextItem = {
          context: ((context: any): ReactContext<mixed>),
          memoizedValue: value,
          next: null,
        };
    
        if (lastContextDependency === null) {
    
                // 删除了部分代码
    
          // This is the first dependency for this component. Create a new list.
          // 这是组件的第一个依赖项，创建一个新的 context 依赖列表
          lastContextDependency = contextItem;
          currentlyRenderingFiber.dependencies = {
            lanes: NoLanes,
            firstContext: contextItem,
          };
          if (enableLazyContextPropagation) {
            currentlyRenderingFiber.flags |= NeedsPropagation;
          }
        } else {
          // Append a new context item.
          // 在链表后面添加一个新的 context 项
          lastContextDependency = lastContextDependency.next = contextItem;
        }
      }
      // readContext最终返回的是context._currentValue
      return value;
    }

## Hook 规则

Hook 本质就是 JavaScript 函数，但是在使用它时需要遵循两条规则：

### 只在最顶层使用 Hook

不要在循环，条件或嵌套函数中调用 Hook， 确保在React 函数的最顶层以及任何 return 之前调用hook。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确。

### 只在 React 函数中调用 Hook

不要在普通的 JavaScript 函数中调用 Hook。可以：在 React 的函数组件中调用 Hook在自定义 Hook 中调用其他 Hook

### 代码约束

我们可以通过使用 `eslint-plugin-react-hooks `的 ESLint 插件来强制执行这两条规则。

## 参考资料

1. [React Hooks 源码解读之 useContext](https://juejin.cn/post/7030546337552662564)
2. [React Hooks 系列之3 useContext](https://juejin.cn/post/6844904153584500749)
3. [React 官方文档-Context](https://zh-hans.reactjs.org/docs/context.html)