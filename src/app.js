// 整个app的入口，主要是配置一级路由（写在index.js也可）
import React, {Component} from 'react'
// 引入路由，注意这里用的是BrowserRouter
  // 与HashRouter区别在于，不带#，且问题在于生产环境打包后，若是前台后台用同一个服务器（不跨域），那么就会访问不到主界面，需要在后台使用中间件将其引导访问到打包好后的index.html
import {BrowserRouter,Switch,Route} from 'react-router-dom'

// 引入一级路由
import Login from "./pages/login/login.jsx"
import Main from './pages/main/main.jsx'

export default class App extends Component {
  render (){
    return(
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/' component={Main} />
          </Switch>
        </BrowserRouter>
    )
  }
}