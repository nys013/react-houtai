// 添加或修改用户
import React, {Component} from 'react'
import {Form ,Input,Select} from 'antd'
import PropTypes from 'prop-types'

const {Option} = Select
const {Item} = Form

class UserForm extends Component {
  static propsTypes = {
    setForm:PropTypes.func.isRequired,
    roles:PropTypes.array.isRequired,
    user:PropTypes.object
  }

  constructor (props){
    super(props)
    //给父级传递form对象
    this.props.setForm(this.props.form)
  }

  render (){
    const { getFieldDecorator } = this.props.form
    const {roles} =  this.props
    const user = this.props.user || {}
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
    return(
      <Form {...formItemLayout} >
        <Item label="用户名" >
          {
            getFieldDecorator("username",{
              initialValue:user.username,
              rules:[
                {required:true,message:"用户名必须输入"},
                {min:3,message:"用户名不小于3位"},
                {max:12,message:"用户名长度不能超过12位"},
                {pattern:/^[A-z0-9_]+$/,message:"用户名必须以字母、数字或下划线组成"}
              ]
            })(
              <Input placeholder="请输入用户名称"></Input>
            )
          }
        </Item>
          {
            user._id ? null : (
              <Item label="密码" >
                {
                  getFieldDecorator("password",{
                    initialValue:'',
                    rules:[
                  {required:true,message:"密码必须输入"},
                  {min:5,message:"密码不小于5位"}
                    ]
                  })(
                    <Input type="password" placeholder="请输入密码"></Input>
                    )
                }
              </Item>
            )
          }
        <Item label="电话" >
          {
            getFieldDecorator("phone",{
              initialValue:user.phone,
              rules:[
                {pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,message:"请输入正确的手机号码"}
              ]
            })(
              <Input placeholder="请输入电话号码"></Input>
            )
          }
        </Item>
        <Item label="邮箱" >
          {
            getFieldDecorator("email",{
              initialValue:user.email,
              rules:[
                {pattern:/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,message:"请输入正确的邮箱"}
              ]
            })(
              <Input placeholder="请输入邮箱"></Input>
            )
          }
        </Item>
        <Item label="角色名称" >
          {
            getFieldDecorator("role_id",{
              initialValue:user.role_id
            })(
              <Select placeholder='请选择角色' >
                {
                  roles.map(role => (<Option value={role._id} key={role._id} >{role.name}</Option>))
                }

              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)