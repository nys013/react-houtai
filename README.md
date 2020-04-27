# 个人难点小总结
## 以下仅个人遇到的一些难点的小总结，仅供参考

## 1.前台分页和后台分页
### 前台分页：
    一次性获取所有的数据，通过组件分页器实现分页

    缺点：数据过多时，页面展现慢
    优点：有页数有记忆，不会后退后到第一页。翻页无需再发请求

    利用Table组件的 pagination api，传配置对象
        例如：pagination = {{defaultPageSize:5,showQuickJumper:true}}    具体看文档

### 后台分页：
    前台传页数，后台根据前台传的页数返回相应的数据

    优点：对于数据过多，可以达到较好的展示效果，不用用户过多等待
    缺点：页码需要处理，分页就要发送请求

    后台通过前台发来的pageNum和pageCount，查询到相应区段内的商品，然后返回给前台，可以利用mongoose的一些方法，也可自己循环


## 2.ref
    可为DOM元素或者class组件添加ref，就可获取到该DOM元素或class组件，就可以获取其内部的方法，属性
            挂到组件(class声明的组件)上的ref表示对组件实例的引用，不能在函数式组件上使用 ref 属性，因为它们没有实例
            挂载到dom元素上时表示具体的dom元素节点。

        创建：一般在constructor中创建    this.test = React.createRef()
        在DOM或class组件上设置：ref = {this.test}
        获取到DOM或class组件：node = this.refs.current

    在这个项目中，用于表单的数据获取（非受控组件）、和获取子组件的数据

    虽然这很简单，但是文档并不推荐这样使用
    官方推荐的是ref的值是传回调函数，该回调会在设置ref组件挂载、卸载和ref变化时执行，传一个参数，挂载为组件的实例，与上面一样同样可以获取到；卸载和ref变化则为null，以确保内存泄露

**【还有，不要过度使用ref，我们需要更多的考虑state属性放在哪个组件上】**


## 3.派生state
（ https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#preferred-solutions）

    视频中就是，直接复制props到state上，这就会带来一个问题，在props更新时，state没有正确渲染（这就是功能上我们看到的，选中一个角色设置其权限，无论有没有修改，再选另一个角色时，该角色的权限是上个角色的权限，这就是因为传来的角色props改变了，但是该子组件的state没有改变，这就产生了bug）

    然后视频通过UNSAFE_componentWillReceiveProps直接更新state为最新props的值，
            ——虽然当前bug可以解决，但是仍然存在问题，文档详细说明，这里不再赘述，查看文档说明更准确

    因为是unsafe，所以不推荐使用，我就使用了 componentDidUpdate(prevprops)，且进行了先后props比较，再去更新state，避免死循环，可是再仔细查看文档，文档也说不要将props‘镜像’给state，其实就跟上面用unsafe是同一个问题    

    【最终的解决办法就是按照文档说的，用完全可控的组件，不要将props复制给state
    将数据的唯一源放在父组件，更新数据的函数也在父组件，然后再传给子组件，子组件通过props得到，在相应的事件调用父组件的函数，更新数据，这样就避免了bug】

    *该博客还说到非受控组件和 memoization的做法，没怎么理解，希望随着学习深入能够更好的理解*

