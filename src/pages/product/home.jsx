import React, {Component} from 'react'
import {Card , Select , Input , Button , Icon , Table , message} from 'antd'
import {connect} from 'react-redux'

import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api/index.js'
import {PAGE_SIZE} from '../../utils/constants.js'
import {updatePage} from '../../redux/actions'

const {Option} = Select

class Home extends Component {

  state = {
    products:[],
    total: 0 ,
    searchKey:'',
    searchType:'productName',
    // pageNum:0
  }

  getProducts = async(pageNum)=>{
    //const pageNum = 1;
    // 原做法：用该组件的state存
    // this.setState({pageNum})
    // 使用redux将pageNum存起来了
    this.props.updatePage(pageNum)
    const pageSize = PAGE_SIZE ;
    let result
    const {searchKey,searchType} = this.state
    if(searchKey){
      result = await reqSearchProducts({pageNum,pageSize,searchKey,searchType})
    }else{
      result = await reqProducts(pageNum,pageSize)
    }
    if(result.status ===0 ){
      const {list , total} = result.data
      this.setState({
        products:list,
        total
      })
    }
  }

  updateStatus = async (productId , status)=>{
    const result = await reqUpdateStatus(productId , status)
    if(result.status === 0){
      message.success('更新成功')
      this.getProducts(this.props.productPage || 1)
    }
  }

  addProduct = ()=>{
   this.props.history.push('/product/addupdate')
  }

  constructor (props) {
    super(props)

    this.columns = [
      {
        title:"商品名称",
        dataIndex:"name"
      },
      {
        title:"商品描述",
        dataIndex:"desc"
      },
      {
        title:"价格",
        dataIndex:"price",
        render:(price)=>("￥" + price)
      },
      {
        title:"状态",
        width:80,
        render:(product)=>{
          let {_id , status} = product

          const btnText = status===1 ? "下架" : "上架"
          const statusText = status===1 ? "在售" : "已售空"

          status = status===1 ? 2 : 1 //1：在售，2：售空
          return (
              <span>
                <Button type='primary' onClick={() => this.updateStatus(_id , status)} >{btnText}</Button>
                <span>{statusText}</span>
              </span>
          )
        }
      },
      {
        title:"操作",
        width:80,
        render:(product) => {
          return (
            <span >
              {/*push可以传两个参数，第一个是跳转地址，第二个是传state给目标路由组件——location.state*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail' , product )} >详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate' , product )}>修改</LinkButton>
            </span>
          )
        }
      }
    ]
  }

  componentDidMount(){
    //发送异步请求
    this.getProducts(this.props.productPage || 1)
  }

  render (){
    const {products , total ,searchKey} = this.state
    const title = (
      <span>
        <Select
          defaultValue='productName'
          style={{width:120}}
          onChange={value => this.setState({searchType:value})}
          >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width:120,margin:"0 10px"}}
          value={searchKey}
          onChange={event => this.setState({searchKey:event.target.value})}
          />
        <Button type='primary' onClick={() => this.getProducts(1)} >搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={this.addProduct} >
        <Icon type='plus'/>
        添加商品
      </Button>
    )


    return(
      <Card
        title={title}
        extra={extra}
        >
        <Table
          dataSource={products}
          columns={this.columns}
          bordered
          rowKey="_id"
          pagination={{//分页配置
            current:this.props.productPage,
            defaultPageSize:PAGE_SIZE,
            total,
            showQuickJumper:true,
            onChange:value =>{
              return  this.getProducts(value)
            }
          }}
          />
      </Card>
    )
  }
}

export default connect(
  state => ({productPage:state.productPage}),
  {updatePage}
)(Home)