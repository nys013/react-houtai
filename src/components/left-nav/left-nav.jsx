import React, {Component} from 'react'
// 引入路由相关 withRouter是让非路由组件能够有路由组件的三个属性(history,loaction,match)；
// Link就是跳转组件，设定to的属性值为某一地址，点击跳转（类似于onClick事件触发后this.props.history.push('')
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon } from 'antd';
import {connect} from 'react-redux'

// 引入样式，虽然antd有默认样式，但是我们还需要根据自己的需求修改
import './left-nav.less'
// 封装好的menu相关信息的数组
import menuList from '../../config/menuConfig.js'
// 发送设置头部标题的请求（这里是同步的），仅仅是为了将点击的nav-list的标题存到redux中，方便header组件获取
import {setHeaderTitle} from '../../redux/actions.js'
// import storageUtils from '../../utils/storageUtils.js'

const { SubMenu } = Menu;

class LeftNav extends Component {

  setAuth = (item) => {
    /*有权限的情况
    * 1.admin
    * 2.相应item的key值
    * 3.首页必须设置，isPublic
    * */
    const {isPublic , key , children} = item
    const {role , username} = this.props.user

    if( isPublic || username==='admin' || role.menus.indexOf(key) !==-1 ){
      return true
    } else if(children){  //因为role中的menus是不含一级菜单的key，那么就算其子菜单有权限，还是不会显示，所以就要判断有无children
      return !!children.find(child => role.menus.indexOf(child.key) !== -1)
    }
    return false
  }


  //用数组reduce方法（map也可）将一个个结构加进去,用了递归调用(需要根据数据结构，一层层取出)
  getMenuNodes_reduce = (menuList)=>{
    return menuList.reduce((pretotal,item)=>{
      const path = this.props.location.pathname
      // 如果有权限才进入以下判断
      if(this.setAuth(item)){
        if(!item.children){
          if(path.indexOf(item.key)===0 ){
            // 当前请求路径中能找到item.key,就将该item的标题设为头部标题
            // (注意不直接===比较，而是用字符串的方法查找是因为如果进入三级路由也仍然要显示这个item.title)
            this.props.setHeaderTitle(item.title)
          }
          // 如果没有子菜单，那就直接push这个
          pretotal.push((
            <Menu.Item key={item.key} >
              <Link to={item.key} onClick={() => this.props.setHeaderTitle(item.title)} >
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        }else{
          // 判断 当前路径是否含有子菜单key
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0 )
          if(cItem){
            // 如果cItem存在，那么openKey为当前父Item的key(因为要用于展开，原理是当前访问了子菜单，父菜单展开，刷新后依旧展开，那就需要记录当前key)
            this.openKey = item.key
          }
          // 在有子菜单的情况下，多了SubMenu
          pretotal.push((
            <SubMenu
              key={item.key}
              title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
              >
                {/* 子菜单递归调用，形成相应的菜单 */}
              {this.getMenuNodes_reduce(item.children)}
            </SubMenu>
          ))
        }
      }
      // reduce方法最后都要返回pretotal
      return pretotal
    },[])
  }

  /*componentWillMount(){
    //只执行一遍，在render中会重复执行多次
    this.MenuNodes = this.getMenuNodes_reduce(menuList)
  }*/
  /*componentWillMount已经废弃，改用constructor，在第一次render之前执行*/
  constructor(props){
    super(props)
    //在这里只执行一遍。不在render中，因其会重复执行多次
    this.MenuNodes = this.getMenuNodes_reduce(menuList)
  }
  render (){
    let path = this.props.location.pathname
    // 重设path，用于selectedKeys，避免到三级路由时selectedKeys无对应值
    path = path.indexOf('/product')===0 ? '/product': path

    const {openKey,MenuNodes} = this
    return(
      <div className='left-nav' >

        <Link to="/" className="left-nav-header">
          <h1>后台管理项目</h1>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          // 当前选中菜单项的数组，就为当前请求的路径
          selectedKeys={[path]}
          // 设置默认展开key，openKey是通过前面reduce时得到的，在刷新后仍旧展开相应key
          defaultOpenKeys={[openKey]}
          >
          {
            MenuNodes
          }
        </Menu>

      </div>
    )
  }
}

// 因为一开始没有用redux，所以没有containers的概念，否则应该不在components文件夹下的(不过影响不大，就是个规范问题，但是还是建议在最开始就确定是否使用redux)
export default connect(
  state => ({user:state.user}),
  {setHeaderTitle}
)(withRouter(LeftNav))