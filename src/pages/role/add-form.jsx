import React, {Component} from 'react'
import {Form ,Input} from 'antd'
import PropTypes from 'prop-types'


const {Item} = Form

class AddForm extends Component {
  static propsTypes = {
    setForm:PropTypes.func.isRequired
  }

  constructor (props){
    super(props)
    //给父级传递form对象
    this.props.setForm(this.props.form)
  }

  render (){
    const { getFieldDecorator } = this.props.form
    return(
      <Form>

        <Item>
          {
            getFieldDecorator("roleName",{
              rules:[
                {required:true,message:"角色名必须输入"}
              ]
            })(
              <Input placeholder="请输入角色名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)