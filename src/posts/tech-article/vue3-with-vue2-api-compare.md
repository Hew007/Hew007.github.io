---
title: Vue2到Vue3API及使用变化梳理
date: 2021-02-27 18:20:09
category:
- vue
- 技术
tag:
- vue3
- vue
- api
---

vue3相对于vue2是一个较大版本的升级，不仅从API上有较大变化，从底层设计上也有很多变化，这里仅对比其API方面的变化，底层原理的改变，暂不比较。

## 基础API用法改变
<!-- more -->

### 创建实例

由原来的new Vue() 变为 Vue.createApp() 方法；

```javascript
// vue2
const app = new Vue({...});
// vue3
const app = Vue.createApp({...});
```

### vue3 templete支持多个根元素

```vue
<template>
	<h3>{{ post.title }}</h3>
  <div>{{ post.content }}</div>
</template>
```

vue2有一个每个组件必须[只有一个根元素得限制](https://cn.vuejs.org/v2/guide/components.html#%E5%8D%95%E4%B8%AA%E6%A0%B9%E5%85%83%E7%B4%A0)，如果向上面那样，Vue 会显示一个错误。而vue3开始，支持了多个根元素，可以自由书写。

> 注意：当组件有多个根元素时，在向组件传递了没有在组件prop定义的属性（attribute），会抛出一个警告，此时，必须指定一个[接收父级传递的attribute的节点，或者禁用attribute的集成](https://v3.cn.vuejs.org/guide/component-attrs.html#attribute-%E7%BB%A7%E6%89%BF)。（建议使用单个根元素)

### 增加了emits选项

**可以通过**[** emits 选项**](https://v3.cn.vuejs.org/guide/component-custom-events.html#%E4%BA%8B%E4%BB%B6%E5%90%8D)**在组件上定义已发出的事件。**

```javascript
app.component('custom-form', {
  emits: ['in-focus', 'submit', 'click']
})
```

当在 emits 选项中定义了原生事件 (如 click) 时，将使用组件中的事件替代原生事件侦听器。

> 建议定义所有发出的事件，以便更好地记录组件应该如何工作。

**还可以通过emits验证抛出的事件**
与prop类型验证类似，使用对象语法为其添加验证，该对象值为一个函数，参数为$emit传递的参数，并需要返回一个布尔值，表示验证是否通过。

```javascript
app.component('custom-form', {
  emits: {
    // 没有验证
    click: null,

    // 验证submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { email, password })
    }
  }
})
```

### 组件v-model的变化

**v-model默认绑定值由 `value` 变为 `modelValue`**

```vue
<script>
// vue2
Vue.component('custom-input', {
  props: {
    value: ''
  },
  template: `
    <input
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
  `
})

// vue3
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
</script>

<custom-input v-model="searchText"></custom-input>

```

**支持多个v-model绑定：**

```vue
// 使用
<user-name
  v-model:first-name="firstName"
  v-model:last-name="lastName"
></user-name>
```

```javascript
app.component('user-name', {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName'],
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
})
```

**自定义`v-model`修饰符，类似于 `v-model.trim`**
在 vue3 中，除了内置修饰符——.trim、.number 和 .lazy，还支持自定义v-model修饰符。 添加到组件 v-model 的修饰符将通过 modelModifiers prop 提供给组件。
自定义修饰符 capitalize，它将 v-model 绑定提供的字符串的第一个字母大写，[打开sandbox运行](https://codesandbox.io/s/vibrant-stonebraker-q0exj?file=/src/App.vue)

### 在组件中使用自定义指令

vue3可以在组件中使用自定义指令，和非 prop 的 attribute 类似，当在组件中使用时，自定义指令总是会被应用在组件的根节点上。如果有多个根节点则不会应用此指令，比给出警告提示。

### Teleport

当我们在自定义一个modal模态框组件时，可以看到一个问题——模态框是在深度嵌套的 div 中渲染的，此时，我们只能使用fixed定位将其样式定位到窗口某个位置。而[Teleport](https://v3.cn.vuejs.org/guide/teleport.html#%E4%B8%8E-vue-components-%E4%B8%80%E8%B5%B7%E4%BD%BF%E7%94%A8) 提供了一种干净的方法，允许我们控制DOM在哪个节下渲染，而不必求助于全局状态或将其拆分为两个组件。

- 控制部分DOM脱离根节点
- 使用本地化逻辑控制组件
- 适用于固定fixed定位或者绝对absolute定位

```javascript
app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
    </button>

    <teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
      </div>
    </teleport>
  `,
  data() {
    return { 
      modalOpen: false
    }
  }
})
```

示例：[sandBox运行示例](https://codesandbox.io/s/vibrant-stonebraker-q0exj?file=/src/components/Modal.vue)

### 渲染函数的变化

由`createElementj` 简化为 `h `函数。`h()` 函数是一个用于创建 vnode虚拟 DOM 的实用程序。也许可以更准确地将其命名为 `createVNode()`，但由于频繁使用和为了简洁，它被称为 `h()`；

> vue2中有说明：将 h 作为 createElement 的别名是 Vue 生态系统中的一个通用惯例。从名字是看没变化，实际是发生了变化。

### 生命周期API

组件卸载/销毁生命周期名称变化，由 `beforeDestroy` 和 `destoryed` 变更为 `beforeUnmount` 和 `unmounted` 。另外新增了 `renderTracked` 和 `renderTriggered` API，这两个新增的API都能帮助我们更好的调试vue 应用。
`renderTracked` 将在跟踪虚拟 DOM 重新渲染时调用，此事件告诉你哪个操作**跟踪**了组件以及该操作的目标对象和键。
`renderTriggered` 和 `renderTraced` 功能类似，它将告诉你是什么操作触发了**重新渲染**，以及该操作的目标对象和键。

```vue
<div id="app">
  <button v-on:click="addToCart">Add to cart</button>
  <p>Cart({{ cart }})</p>
</div>
<script>
	const app = Vue.createApp({
  data() {
    return {
      cart: 0
    }
  },
  renderTracked({ key, target, type }) {
    console.log('renderTracked =>', { key, target, type })
    /* 当组件第一次渲染时，这将被记录下来:
    {
      key: "cart", // 目标键
      target: {    // 目标对象
        cart: 0
      },
      type: "get"  // 什么操作
    }
    */
  },
  renderTriggered({ key, target, type }) {
    console.log('renderTriggered =>', { key, target, type })
  },
  methods: {
    addToCart() {
      this.cart += 1
    }
  }
})

app.mount('#app')
</script>
```

示例：[sandPen运行示例](https://codepen.io/hew007/pen/BaQdRYM)

### 模板引用ref变化（在组合式api使用）

在组合式API setup 中使用ref 时，需要在setup中显式返回 ref，然后在 onMounted回调中就可以拿到对应 dom 对象。

```vue
<template> 
  <!--在模板中定义和vue2一致 添加ref属性绑定即可-->
  <div ref="root" id="test-ref">这是根元素</div>
</template>

<script>
  import { ref, onMounted } from 'vue';

  export default {
    setup() {
      // 需要声明一个 ref 变量为null
      const root = ref(null);

      onMounted(() => {
        // DOM元素将在初始渲染后分配给ref
        console.log(root.value) // <div>这是根元素</div>
      });

      return {
        // 返回name和模板中ref name 一致的变量
        root
      }
    }
  }
</script>
```




## 新增响应性API和组合式API

### 响应性基础API

_**reactive**_
reactive方法会为 JavaScript 对象创建响应式状态，返回响应式副本。类似于我们在data中声明的对象。

```javascript
import { reactive } from 'vue'

// 响应式状态
const state = reactive({
  count: 0
})
```

**readonly**
获取一个对象的只读proxy。
**isProxy**
检查对象是否是由 reactive 或 readonly 创建的 proxy。
**isReactive**
检查对象是否是 reactive 创建的响应式 proxy。
**isReadonly**
检查对象是否是由 readonly 创建的制度proxy。
**toRaw**
返回 reactive 或 readonly proxy 的原始对象，临时读取而不会引起 proxy 访问/跟踪开销。
**markRaw**
标记一个对象，使其永远不会转换为 proxy。返回对象本身。
**shallowReactive**
创建一个响应式 proxy，跟踪其自身 property 的响应性，但不执行嵌套对象的深度响应式转换 (暴露原始值)。
**shallowReadonly**
创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。

### refs API

_**ref**_
ref 函数接受一个值并返回一个响应式且可变的 ref 对象。ref 接受参数并返回它包装在具有 value property 的对象中，然后可以使用该 vulue 属性访问或更改响应式变量的值。对于基本数据类型的值，包装之后将变为引用类型，这样，在程序中传递这个响应性值时，就不会丢失其响应性。

```javascript
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

**unRef**
可以理解为去除ref 响应式包装，如果参数为 ref，则返回内部值，否则返回参数本身
**toRef**
用来为源响应式对象上的 property 新创建一个 ref。然后可以将 ref 传递出去，从而保持对其源 property 的响应式连接。

```javascript
const state = reactive({
  foo: 1,
  bar: 2
});

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

**toRefs**
将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的ref。其结果相当于对该对象的每一个属性都执行了一遍toRef。

```javascript
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)

// ref 和 原始property “链接”
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

**isRef**
检查对象是否是 ref 创建的对象。
**customRef**
接收一个工厂函数，返回一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。
**shallowRef**
创建一个 ref，它跟踪自己的 .value 更改，但不会使其值成为响应式的。
**triggerRef**
手动执行与 shallowRef 关联的任何副作用。

### 组合式API的常见用法

下面是一个简单的列表页面，包含分页，可以感受下composition的用法。

```vue
<template>
    <div class="page-department-list">
        <!--- 页头--->
        <page-header :bread-list="breadData">
            <template #title>
                部门列表
            </template>
        </page-header>
        <div class="table-box card-box">
            <div class="table-wrap">
                <div class="table-box-header">
                    <span>
                      第{{startPageSize}}-{{endPageSize}}条，
                      共{{ pages.totalNum }}条数据</span>
                    <a-button
                        type="primary"
                        @click="modal.visible = true"
                    >
                        <PlusOutlined />
                        添加
                    </a-button>
                </div>
                <a-table
                    :pagination="tablePages"
                    :columns="columns"
                    :data-source="dataList"
                    :loading="loading"
                    @change="handleTableChange"
                >
                    <template #action="{ record }">
                        <a-popconfirm
                            title="确认删除此部门?"
                            ok-text="确认"
                            cancel-text="取消"
                            @confirm="confirmDelete(record.userId)"
                        >
                            <a-button
                                class="btn-del"
                                type="link"
                            >
                                删除
                            </a-button>
                        </a-popconfirm>
                        <!-- <a-button
                            type="link"
                            @click="editUser(record.userId)"
                        >
                            编辑
                        </a-button> -->
                    </template>
                </a-table>
            </div>
        </div>
        <create-depart-modal v-model:visible="modal.visible" />
    </div>
</template>

<script>
    import { ref, onMounted, reactive } from 'vue';
    import { PlusOutlined } from '@ant-design/icons-vue';
    import PageHeader from '@/components/PageHeader';
    import api from '../api/departmentList.api';
    import { breadData, columns } from '../config/departmentList.config';
    import { message } from 'ant-design-vue';
    import { useRouter } from 'vue-router';
    import CreateDepartModal from '../components/CreateDepartModal';
    import oPages from '../common/pages';
    export default {
        components: {
            PlusOutlined,
            PageHeader,
            CreateDepartModal
        },
        setup() {
          	// 路由创建
            const router = useRouter();
            // table列表数据
            const dataList = ref([]);
          	// table loading
            const loading = ref(false);
            // 分页
            const { pages, startPageSize, endPageSize, tablePages } = oPages;
            // 获取列表信息
            const getListInfo = async (options) => {
                try {
                    loading.value = true;
                    const { code, data } = await api.getDepartmentList(options);
                    loading.value = false;
                    if (code === 1000) {
                        const list = data && data.data;
                        dataList.value = list.map((ele, idx) => ({
                            ...ele,
                            id: idx + 1,
                            key: ele.value
                        }));
                        pages.totalNum = data.totalNum;
                    }
                } catch (error) {
                    loading.value = false;
                    console.warn(error);
                }
            };
            // 初始化信息方法
            const pageInitInfo = () => {
                getListInfo(pages);
            };
						// monted 回调
            onMounted(pageInitInfo);

            // 删除方法
            const confirmDelete = async (uid) => {
                try {
                    const { code, desc } = await api.deleteUserOne({ userId: uid });
                    if (code === 1000) {
                        message.success(desc);
                        // 更新表格信息
                        getListInfo(pages);
                    }
                } catch (error) {
                    console.warn(error);
                }
            };

            // 编辑
            const editInfo = (id) => {
                // 跳转到编辑页面
                router.push({
                    name: 'UserEdit',
                    query: {
                        userId: id
                    }
                });
            };

            // 模态框
            const modal = reactive({
                visible: false
            });
            // table 分页变化事件处理
            const handleTableChange = (pagination, filters, sorter) => {
                pages.pageNo = pagination.current;
                getListInfo(pages);
            };
            // template 用到的变量和方法都需要在setup中返回。
            return {
                // 面包屑
                breadData,
                // 用户信息列表数据
                dataList,
                // 表格列数据
                columns,
                // 分页
                tablePages,
              	// 分页数据
                pages,
                startPageSize,
                endPageSize,
                // 确认删除
                confirmDelete,
              	// 编辑
                editInfo,
                // 弹窗对象
                modal,
                // table change处理方法
                handleTableChange
            };
        }
    };
</script>

<style lang="less" scoped>
</style>
```







