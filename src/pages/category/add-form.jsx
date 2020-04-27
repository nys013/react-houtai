import React, {Component} from 'react'
import {Form , Select,Input} from 'antd'
import PropTypes from 'prop-types'

const {Item} = Form
const {Option} =Select

class AddForm extends Component {
  static propsTypes = {
    categorys:PropTypes.array.isRequired,   //一级分类数组
    parentId:PropTypes.string.isRequired,   //父分类id
    setForm:PropTypes.func.isRequired
  }

  constructor (props){
    super(props)
    //给父级传递form对象（通过父组件传函数，子组件调用函数的形式，给父组件传递子组件数据）
    this.props.setForm(this.props.form)
  }

  render (){
    const { getFieldDecorator } = this.props.form
    const { parentId ,categorys } = this.props
    return(
      <Form>
        <Item>
        {
          getFieldDecorator("parentId",{
            initialValue:parentId
          })(
              // 通过下拉列表选择分类
              <Select>
                <Option value="0" >一级分类</Option>
                {
                  categorys.map(c => (
                    <Option value={c._id} key={c._id} >{c.name}</Option>
                  ))
                }
              </Select>
          )
        }
        </Item>

        <Item>
          {
            getFieldDecorator("categoryName",{
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

export default Form.create()(AddForm)