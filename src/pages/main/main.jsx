import React, {Component} from 'react'
// 引入路由
import {Redirect,Switch,Route} from 'react-router-dom'
// 引入antd中的Layout布局
import { Layout } from 'antd';
// 使用插件简化redux的编码，使UI组件和redux解耦
import {connect} from 'react-redux'

// 使用redux管理了，就用不到这个了
// import storage from '../../utils/storageUtils.js'
// 以下两个是非路由组件，若是有redux的概念就是抽出的UI组件，没有redux，不负责业务逻辑，只是UI展现
import Header from '../../components/header/header.jsx'
import LeftNav from '../../components/left-nav/left-nav.jsx'

// 引入二级路由组件（因为这个项目一开始没有设计用redux，所以没有containers的概念，这里就将所有路由组件放在一起了）
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found.jsx'

const {Footer, Sider, Content } = Layout;

class Main extends Component {
  render() {
    // 获取redux中的user  在用了connect后，Main组件上有state，所以可以通过this.props取到
    let user = this.props.user
    // 判断user的id是否存在，不存在，即到重定向到登录界面
    if (!user._id) {
      return <Redirect to='/login'/>
    }
    return (
      // 这个布局就是官方文档上的侧边布局，不过这里没有做收缩效果，感兴趣可以试试
      // 设置最小高度，使其高度为页面高
      <Layout style={{minHeight:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{backgroundColor:"white",margin:20}}>
            {/* 在Main中引入路由组件后注册路由 */}
            <Switch>
              <Redirect exact from='/'  to='/home'/>
              <Route path='/home' component={Home}/>
              <Route path='/category' component={Category}/>
              <Route path='/product' component={Product}/>
              <Route path='/role' component={Role}/>
              <Route path='/user'component={User}/>
              <Route path='/charts/bar' component={Bar}/>
              <Route path='/charts/line' component={Line}/>
              <Route path='/charts/pie' component={Pie}/>
              <Route  component={NotFound}/>
            </Switch>

          </Content>
          <Footer style={{textAlign:"center",color:"grey"}}>推荐使用谷歌浏览器，可以获得更加的页面显示操作效果</Footer>
        </Layout>
      </Layout>
    )
  }
}

// connect为高阶函数，这一步大概就是让redux中的state和封装好dispatch后的action作为组件Main的属性
export default connect(
  state => ({user:state.user}),
  {}
)(Main)