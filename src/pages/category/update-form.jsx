import React, {Component} from 'react'
import {Form  ,Input} from 'antd'
import PropTypes from 'prop-types'

const {Item} = Form

class UpdateForm extends Component {

  static propsTypes = {
    categoryName:PropTypes.string.isRequired,
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
            getFieldDecorator("categoryName",{
              initialValue:this.props.categoryName,
              rules:[
                {required:true,message:"分类名必须输入"}
              ]
            })(
              <Input placeholder="请输入分类名称"></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateForm)