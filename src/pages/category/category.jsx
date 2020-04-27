import React, {Component} from 'react'
import {Card,Icon,Button,Table,message,Modal} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api'
// 添加分类组件
import AddForm from './add-form'
// 更新（修改）分类组件
import UpdateForm from './update-form'

export default class Category extends Component {

  state = {
    loading:false,
    category:"",
    categorys : [],
    secCategory:[],
    parentId :"0",  //当前分类的父分类id，一级分类父分类就是0
    parentName:"",
    visible:0 //0不显示，1添加显示，2更新显示
  }

  // 初始化columns
  initColumns = ()=>{
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'   //列数据在数据项中对应的路径
        //key: '_id'  设置了唯一的dataIndex可以忽略key
      },
      {
        title:"操作",
        // Function(text, record, index) {}
        //text是指，在没有指定dataindex的情况下，该对象就是表示当前选中这一行的对象
        render:(category) => (
          <span>
            <LinkButton onClick={()=>this.showUpdate(category)} >修改分类</LinkButton>
            {category.parentId==="0" && <LinkButton onClick={() => this.getSecCategorys(category)} >查看子分类</LinkButton>}
          </span>
        ),
        width:300
      }
    ]
  }

  //获取分类列表  
  getCategorts = async (parentId) => {
    // async函数内部同步执行，这是在发送请求前loading为true
    this.setState({loading:true})
    // parentId 有值通过该值，无值通过状态
    parentId = parentId || this.state.parentId
    // 发送异步请求，await进行等待，获取到result后再往后执行
    const result = await reqCategorys(parentId)
    // 请求发送完，获取到数据后，更新状态loading为false，loading图标消失，展现数据
    this.setState({loading:false})
    if(result.status === 0){
      if(parentId === "0"){
        // 父分类为0，则是一级分类数据
        this.setState({categorys:result.data})
      }else{
        // 否则就是二级分类数据
        this.setState({secCategory:result.data})
      }
    }else{
      message.error('分类数据获取失败')
    }
  }
  
  //获取二级分类列表
  getSecCategorys = (category)=> {
    //在react事件回调中，更新状态是异步的，所以通过第二个参数传回调函数，使得更新二级列表在更新状态后执行
    this.setState({parentId:category._id,parentName:category.name},()=>{
      this.getCategorts(this.state.parentId)
    })
    // 其实就算不使用上面的写法也是可以的，因为可以直接用ategory._id，不必用this.state.parentId，不过这里主要是想说明setState的异步更新问题
    // this.getCategorts(category._id)
  }

  //获取一级分类列表（因为一开始就获取到了一级分类列表存在state中了，这个时候只需要更新二级相关的state就够了）
  getFirCategory = ()=>{
    this.setState({
      secCategory:[],
      parentId :"0",
      parentName:""
    })
  }
  
  //显示添加的对话框
  showAdd = () => {
    this.setState({visible:1})
  }
  //添加分类列表
  addCategory =  () => {

    //需要完成表单验证，才能添加
    this.form.validateFields(async (error,values) => {
      if(error){
        return
      }
      this.setState({visible:0})

      //因为这里的values取了form里的值，所以可以写成
      const {categoryName , parentId} = values
      //清除存储的数据，不让这些数据保留下来显示在对话框中（需要在获取之后再清除）
      this.form.resetFields()
      const result = await reqAddCategory(categoryName,parentId)
      // 获取到数据状态为0，即成功
      if(result.status===0){
        // 以下两个逻辑根据需求决定，简单梳理一下即可
        if(parentId === this.state.parentId){
          // 如果当前添加分类的父分类和点击去分类的父分类一致（即给当前分类添加子分类）就要重新获取一次分类数据以展现
          this.getCategorts(this.state.parentId)
        }else if (parentId === "0"){
          // 如果是给一级分类添加也重新获取 
          this.getCategorts("0")
        }
      }
    })

  }
  //显示更新的对话框
  showUpdate = (category) => {
    this.setState({visible:2,category})
  }
  //更新分类列表
  updateCategory =  () => {
    this.form.validateFields( async (error,values) => {
      if(error){
        return
      }
      //1.关闭对话框
      this.setState({visible:0})
      //  2.发送请求
      const categoryId = this.state.category._id
      const categoryName = this.form.getFieldValue("categoryName")
      // 获取到数据后清除缓存
      this.form.resetFields()
      const result = await reqUpdateCategory({categoryName,categoryId})
      //  3.更新列表
      if(result.status === 0){
        this.getCategorts(this.state.parentId)
      }
    })
  }
  //对话框取消
  handleCancel = () => {
    //清除存储的数据，不让这些数据保留下来显示在对话框中（需要在获取之后再清除）
    this.form.resetFields()
    this.setState({visible:0})
  }

  //初始化，在render前
  constructor (props){
    super(props)
    this.initColumns()
  }
  // 第一次render后，挂载完毕时，发送异步请求
  componentDidMount (){
    // 获取分类列表(写在外面可以使得在生命周期函数中看的清楚些)
    this.getCategorts(this.state.parentId)
  }

  render (){
    const {categorys,loading,parentId,secCategory,parentName,category} = this.state
    return(
      <div>
        <Card
          title={parentId==="0" ? "一级商品分类" : (
            <span>
              <LinkButton onClick={this.getFirCategory} >一级商品分类</LinkButton>
              <Icon type='arrow-right' style={{marginRight:5}} />
              <span>{parentName}</span>
            </span>
          )}
          extra={
            <Button type='primary' onClick={this.showAdd} >
              <Icon type='plus'/>
              <span >添加</span>
            </Button>
          }
          >
          <Table
            dataSource={parentId==="0" ? categorys : secCategory}
            columns={this.columns}
            rowKey = '_id'
            bordered
            pagination = {{defaultPageSize:5,showQuickJumper:true}}
            loading = {loading}
            />

          <Modal
            title="添加分类"
            visible={this.state.visible===1}
            onOk={this.addCategory}
            onCancel={this.handleCancel}
            >
            <AddForm categorys={categorys} parentId={parentId} setForm={form => this.form = form}/>
          </Modal>

          <Modal
            title="更新分类"
            visible={this.state.visible===2}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
            >
            <UpdateForm categoryName={category.name} setForm={form => this.form = form} />
          </Modal>
        </Card>
      </div>
    )
  }
}