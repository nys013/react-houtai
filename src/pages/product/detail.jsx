import React, {Component} from 'react'
import {Card ,Icon , List } from 'antd'

import {reqCategory} from '../../api/index.js'
import {BASE_PIC_URL} from '../../utils/constants.js'

const Item = List.Item

export default class Detail extends Component {

  state = {
    cName1:'',
    cName2:''
  }

  async componentDidMount (){
    const {pCategoryId,categoryId} = this.props.location.state
    if(pCategoryId==="0"){
      const result = await reqCategory(categoryId)
      this.setState({cName1:result.data.name})
    }else{
      //多次发送
      /*const result1 = await reqCategory(pCategoryId)
      const result2 = await reqCategory(categoryId)
      this.setState({cName1:result1.data.name , cName2:result2.data.name})*/
      //一次性发送
      const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
      this.setState({cName1:results[0].data.name , cName2:results[1].data.name})
    }


  }

  render (){
    const {cName1,cName2} = this.state
    const title = (
      <span>
        <Icon type='arrow-left'
              style={{fontSize:20 , marginRight:10,color:"#1DA57A"}}
              onClick={() => this.props.history.goBack()}
          />
        商品详情
      </span>
    )

    /*获取push传给这个组件的第二个参数state*/
    const {name,desc,price,imgs,detail} = this.props.location.state

    return(
      <Card title={title} >
        <List className='product-detail'>
          <Item>
            <span className="left">商品名称：</span>
            {name}
          </Item>
          <Item>
            <span className="left">商品描述：</span>
            {desc}
          </Item>
          <Item>
            <span className="left">商品价格：</span>
            {price}
          </Item>
          <Item>
            <span className="left">所属分类：</span>
            <span>{cName1} {cName2 ? "-->" + cName2 :""} </span>
          </Item>
          <Item>
            <span className="left">商品图片：</span>
            {
              imgs.map(img => (
                <img src={BASE_PIC_URL + img} alt="img" key={img}/>
              ))
            }
          </Item>
          <Item>
            <span className="left">商品详情：</span>
            <span className="right" dangerouslySetInnerHTML={{__html:detail}} ></span>
          </Item>
        </List>
      </Card>
    )
  }
}