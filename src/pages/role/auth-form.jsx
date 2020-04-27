import React, {PureComponent} from 'react'
import {Form ,Input,Tree} from 'antd'
import PropTypes from 'prop-types'

import menuList from '../../config/menuConfig.js'

const {Item} = Form
const { TreeNode } = Tree

/*使用PureComponent，可使父组件状态改变，但是改变的状态并没有影响子组件时，子组件不会render*/
/*PureComponent利用的是shouldComponentUpdate，不用我们自己定义这个生命周期是否返回true，它会自己进行state和props的浅比较*/
export default class AuthForm extends PureComponent {

  static propTypes = {
    role:PropTypes.object.isRequired,
    onCheck:PropTypes.func.isRequired,
    checkedKeys:PropTypes.array.isRequired
  }
  constructor (props){
    super(props)
    this.treeNodes = this.getTreeNodes(menuList)
    // const {menus} = this.props.role
    // 初始化该角色的选中为传来的角色中的menus
      // 在官方文档上，是不建议将props的值赋给state的，在结构设计上应该直接用props
      // 因为这样会产生新的bug，更新props时，并不会影响state，解决bug又要通过下面的一个componentDidUpdate来解决，实在鸡肋
    // this.state = {checkedKeys:menus}
    // 所以就按官网文档的，从组件中删除state，用props，更新数据也是父组件更新，然后再把数据传给子组件
    //  https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#preferred-solutions
    
  }

  getTreeNodes = (menuList) =>{
    return menuList.reduce((pretotal , item)=>{
      pretotal.push (
        <TreeNode title={item.title} key={item.key} >
          {/* 有子标签，那就递归调用 */}
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pretotal
    },[])
  }

  /* 以下注释是原做法：将props的值复制到state上，然后更新state，再传给父组件的一系列操作
      在constructor的注释也有说，这样会产生bug，所以我们通过componentDidUpdate解决
        但是这样其实也有问题（官方说的，虽然这里没有体现出来）
        所以就不用这种官方不推荐的props复制到state的做法了
  */
  // 在选中的时候更新选中的key数组
  // onCheck = (checkedKeys, info) => {
  //   // this.setState({checkedKeys})
  //   // this.props.role.menus = checkedKeys
    
  //   console.log('onCheck', checkedKeys, this.props.role.menus);
  // }

  /*将子元素的数据通过方法传给父元素调用*/
  // getMenus = () => this.state.checkedKeys

  /*该生命周期已经过时，之后懂了回来改*/
 /* UNSAFE_componentWillReceiveProps (nextProps){
    /!*目的是每次重新获取相应角色的勾选状态，而不是缓存状态*!/
    const menus = nextProps.role.menus
    this.setState({checkedKeys:menus})
    console.log('UNSAFE_componentWillReceiveProps' , nextProps);
  }*/
  /*替代过时的UNSAFE_componentWillReceiveProps*/
  // componentDidUpdate(prevProps,prevState) 会在更新后会被立即调用（render后）。首次渲染不会执行此方法。
  // componentDidUpdate (prevProps){
  //   // 经典用法，比较新的和旧的props，因为我们要在里面setState，如果不比较，会进入死循环
  //   if(this.props.role !== prevProps.role){
  //     /*目的是每次重新获取相应角色的勾选状态，而不是缓存状态*/
  //     const menus = this.props.role.menus
  //     // 在官方文档上，是不建议将props的值赋给state的，在结构设计上应该直接用props
  //     this.setState({checkedKeys:menus})
  //     console.log('componentDidUpdate' , prevProps);
  //   }
  // }
  
  render (){
    const {role , checkedKeys , onCheck} = this.props
    console.log('render');
    // const {checkedKeys} = this.state
    /*在这里写formItemLayout，引入的时候一定要三点运算符*/
    const formItemLayout = {
      labelCol: {
         span: 4
      },
      wrapperCol: {
         span: 15
      }
    }
    return(
      <div>
        <Item label='角色名称' {...formItemLayout} >
          <Input value={role.name} disabled />
        </Item>
        {/* 设置权限的树组件 */}
        <Tree
          defaultExpandAll  //默认全部展开
          checkable   //节点前添加 Checkbox 复选框，即是否可以选中
          checkedKeys={checkedKeys}   //选中的key数组
          onCheck={onCheck}    //选中时触发
          >
          <TreeNode title="角色授权" key="0-0">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}
