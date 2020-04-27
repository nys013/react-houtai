/* 
  这个是之前表单验证的版本，比较复杂，现在的表单验证简单许多了，参见另一个版本
  不过这里还是用旧版本，因为其他已经页面用了旧版本，改动太多，这里只是想说明版本更新了，如果真的需要就下载新版，然后一个个改
*/

import React, {Component} from 'react'
import { Form, Icon, Input, Button } from 'antd';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import './login.less'
import logo from './../../assets/imgs/logo.png'
import {login} from '../../redux/actions.js'
// 使用redux管理了，所以不用引用下面两个了——不在UI组件发送异步请求，使用redux管理不用localstorage
/* import {reqLogin} from '../../api'
import storage from '../../utils/storageUtils.js' */

class Login extends Component {

  handleSubmit = (event)=>{
    // react已经在浏览器兼容处理了
    // event = event || window.event
    event.preventDefault()
    //统一验证
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {username,password} = values
        //不能这么写，因为这是个异步执行的，要么分开取，要么就要在ajax返回的时候就直接返回的data
        //const result = await reqLogin(username,password).data
        /*使用redux后，下面不用了
        const result = await reqLogin(username,password)
        if(result.status===0){
          //存储user
          storage.saveUser(result.data)
          //在事件的回调函数里面，就用history的方法进行跳转，在render里面就用路由的重定向跳转
          this.props.history.replace('/home')
          message.success("登陆成功")
        }else{
          message.error(result.msg)
        }*/
        this.props.login(username,password)
      }else{
        console.log('提交失败')
      }
    })

    //尝试获取表单的数据，先要确保对应的 field 已经用 getFieldDecorator 注册过了。
   /* const values = this.props.form.getFieldsValue()
    console.log(values);*/
  }

  validatorPwd = (rule,value,callback)=>{
    if(!value){
      callback('密码必须输入')
    }else if (value.length<4){
      callback('密码长度不能小于4位')
    }else if (value.length>12){
      callback('密码长度不能超过12位')
    }else if (!/^[A-z0-9_]+$/.test(value)){
      callback('密码必须以字母、数字或下划线组成')
    }else{
      callback()
    }
  }
  render (){
    //若是已经登录成功，那么就无法访问登录界面,需要跳转到管理界面
    const {user} = this.props
    if(user._id){
      return <Redirect to='/home' />
    }

    return(
        <div className="login-wrap">
          <div className="login-header">
            <img src={logo} alt="logo"/>
            <h1>React项目：后台管理系统</h1>
          </div>
          <div className="login-content">
            <div className={user.msg ? 'error-msg show' : 'error-msg'}>{user.msg}</div>
            <h2>用户登录</h2>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {
                  this.props.form.getFieldDecorator("username", {
                    rules:[
                      //声名式校验
                      {required:true,message:"用户名必须输入"},
                      {max:12,message:"用户名长度不能超过12位"},
                      {min:3,message:"用户名长度不能小于3位"},
                      {pattern:/^[A-z0-9_]+$/,message:"用户名必须以字母、数字或下划线组成"}
                    ],
                    //设置初始值
                    initialValue:'admin'
                  })(
                    <Input
                      // prefix是指带有前缀图标的input，参数可为react节点，即可为Icon标签
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="用户名"
                      />
                  )
                }
              </Form.Item>
              <Form.Item>
                {
                  this.props.form.getFieldDecorator("password", {
                    rules:[
                      //自定义校验
                      {validator:this.validatorPwd}
                    ]
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="密码"
                      />
                  )
                }

              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
    )
  }
}

// create是高阶函数，将form上的属性赋到Login组件上
const WrapLogin = Form.create()(Login)
export default connect(
  state => ({user:state.user}),
  {login}
)(WrapLogin)