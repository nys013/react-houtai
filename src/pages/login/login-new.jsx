/*  antd升级至v4 (这里涉及以下3点)
1、v4 的 Form 不再需要通过 Form.create() 创建上下文。Form 组件现在自带数据域，因而 getFieldDecorator 也不再需要，直接写入 Form.Item 即可
2、对于表单校验，过去版本需要通过监听 onSubmit 事件手工触发 validateFields。新版直接使用 onFinish 事件，该事件仅当校验通过后才会执行
3、initialValue 从字段中移到 Form 中
大概是这样的，因为版本问题没有验证，也没有发送请求，仅供参考
*/

import React, {Component} from 'react'
import { Form, Icon, Input, Button ,message} from 'antd';
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import './login.less'
import logo from './../../assets/imgs/logo.png'
import {login} from '../../redux/actions.js'
// 使用redux管理了，所以不用引用下面两个了——不在UI组件发送异步请求，使用redux管理不用localstorage
/* import {reqLogin} from '../../api'
import storage from '../../utils/storageUtils.js' */

class Login extends Component {

  //在验证通过后，才会执行这个事件
  handleFinish = (values)=>{
    console.log(values)
    
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
            <Form onFinish={this.handleFinish} className="login-form">
              
              <Form.Item
                name="username"
                rules={[
                  //声名式校验
                  {required:true,message:"用户名必须输入"},
                  {max:12,message:"用户名长度不能超过12位"},
                  {min:4,message:"用户名长度不能小于4位"},
                  {pattern:/^[A-z0-9_]+$/,message:"用户名必须以字母、数字或下划线组成"}
                ]}
                // 设置初始值
                // initialValue='admin'
              >
                <Input
                  // prefix是指带有前缀图标的input，参数可为react节点，即可为Icon标签
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                  />
              </Form.Item>

              <Form.Item
                // 自定义校验
                rules={[
                  {validator:this.validatorPwd}
                ]}
              >
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                  />
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

export default connect(
  state => ({user:state.user}),
  {login}
)(Login)