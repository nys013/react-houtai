import React, {Component} from 'react'
import {Card , Icon ,Form , Input ,  Button , Cascader , message } from 'antd'

import {reqCategorys , reqAddOrUpdateProduct} from '../../api/index.js'
import PicturesWall from './picture-wall.jsx'
import RichTextEditor from './rich-text-editor.jsx'

const { Item } = Form
const { TextArea } = Input


class AddUpdate extends Component {

  state = {
    options:[]
  }

  handleSubmit =  () =>{
    this.props.form.validateFields ( async (error,values) =>{
      //获取数据
      if(!error){
        const imgs = this.pw.current.getPictures()
        const detail = this.editor.current.getEditor()
        const {name , desc , price , categoryIds} = values
        // 级联列表收集到的是categoryIds，是数组，可能两个id--一个父id一个子id，或者只有1个id
        let pCategoryId , categoryId
        if(categoryIds.length ===1){
          // 只有一个id，说明为一级分类
          pCategoryId="0"
          categoryId=categoryIds[0]
        } else {
          // 两个id，父id和自身id
          pCategoryId=categoryIds[0]
          categoryId=categoryIds[1]
        }
        // 将表单获取的数据整合到product对象中
        const product = {name ,desc , price , pCategoryId , categoryId ,imgs , detail}
        // 如果是更新，那就有初始_id，就把路由跳转时的_id赋给当前封装好的product对象上，以便后续更新商品
        if(this.isUpdate){
          product._id = this.product._id
        }

        //发送ajax请求
        const result = await reqAddOrUpdateProduct(product)
        if(result.status === 0){
          message.success((this.isUpdate ? '更新' : "添加") +"商品成功")
          //成功要返回home
          this.props.history.goBack()
        } else {
          message.error((this.isUpdate ? '更新' : "添加") +"商品失败")
        }

      }
    })

  }

  // 表单验证
  validatorPrice = (rule , value ,callback) =>{
    if(value*1 > 0){
      callback()
    } else {
      callback('价格必须大于0')
    }
  }
  validatorCategorys = (rule , value , callback) =>{
    if (!value[0]) {
      callback('商品分类必须选择')
    } else {
      callback()
    }
  }

  // 获取分类
  // async函数返回一个promise对象，该promise对象的结果和值由函数的结果决定
  getCategorys = async (parentId) =>{
    const result = await reqCategorys(parentId)
    if(result.status===0){
      /*传来的是一级分类（初始化时传的就是0）*/
      if(parentId==="0"){
        // 初始化options
        const firCategorys = result.data
        const options = firCategorys.map(c => (
          {
            value: c._id,
            label: c.name,
            isLeaf: false
          }
        ))
        // 更新options状态（因为这是第一次，之前是空数组，直接更新，覆盖上一次就可以了）
        this.setState({options})

        const {pCategoryId} = this.product
        // 如果是获取更新界面（非添加），且商品父id不为0（即二级分类），那就递归调用获取该父分类下的二级分类
        if(this.isUpdate && pCategoryId!=="0"){
          const secCategorys = await this.getCategorys(pCategoryId)
          // 通过二级分类循环处理得到子选项
          const cOptions = secCategorys.map(c => ({
            label: c.name,
            value: c._id,
            isLeaf:true
          }))
          // 通过所有options数组find方法找到当前应该选中的选项
          const targetOption = options.find( option => option.value===pCategoryId)
          // 将当前选中选项与其子选项对上
          targetOption.children = cOptions
          // 更新options
          this.setState({options:[...this.state.options]})
        }
        
      } else {
        /*传来的是二级分类*/
        return result.data
      }
    }
  }

  // 加了await，外层函数就要加async
  loadData = async selectedOptions => {
    // loadData参数为函数，函数回传选择选项的数组（一个也是数组，所以需要去除第一个）
    const targetOption = selectedOptions[0];
    // 将loading状态设为true
    targetOption.loading = true;

    /*获取二级列表 ， 因为getCategorys函数外加了async，返回了一个promise，所以要加await*/
    const secCategorys = await this.getCategorys(targetOption.value)
    // await等待后，获取到数据，将loading改为false
    targetOption.loading = false;
    if(secCategorys && secCategorys.length>0){
      // 如果获取到的数据存在且长度大于0，就对数据遍历处理，赋值给子选项
      const cOptions = secCategorys.map(c => ({
        label: c.name,
        value: c._id,
        isLeaf:true
      }))
      // 然后设置目标选项的children属性值
      targetOption.children = cOptions
    }else{
      // 没有获取到二级列表，那么就没有子选项，即是叶子
      targetOption.isLeaf = true
    }
    // 更新options状态，涉及引用数据类型，targetOption就是指向options中的某个option
    // 在上面的操作中我们相当于修改了state.options.xxx  ，但是需要通过setState才会重新render
    this.setState({
      // 这里最好用解构的语法来写，这样相当于是新的但相同的对象，指向的不是原对象，避免后续修改产生bug，虽然这里没有什么问题，但还是严谨一些
      options: [...this.state.options],
    })
  }



  constructor (props){
    super(props)
    // 在路由push跳转的时候，传了点击的商品给目标路由，就在location.state中
    const product = this.props.location.state
    // 如果是更新，product是有值的，将product强制转为布尔值来判断是否为更新
    this.isUpdate = !!product
    // product其他函数也要用，所以放到this上
    this.product = product || {}

    //通过ref得到子组件的方法
    this.pw = React.createRef()
    this.editor = React.createRef()

  }

  // 一般在这里发送异步请求，页面第一次render后，获取数据——获取级联列表1级分类
  componentDidMount (){
    this.getCategorys("0")
  }

  render (){
    const {product,isUpdate} = this
    const {pCategoryId , categoryId , imgs , detail} = product
    const categoryIds = []
     if(pCategoryId === "0"){
       categoryIds.push(categoryId)
     } else {
       categoryIds.push(pCategoryId)
       categoryIds.push(categoryId)
     }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      }
    }

    const title = (
      <span>
        <Icon type='arrow-left' style={{color:"#1DA57A" , fontSize:20 , marginRight:5}} onClick={this.props.history.goBack}/>
        {isUpdate ? "修改商品" : '添加商品' }
      </span>
    )

    return(
      <div>
        <Card title={title} >
          <Form {...formItemLayout} >
            <Item label='商品名称'>
              {
                //这是高阶函数
                this.props.form.getFieldDecorator('name',{
                  initialValue:isUpdate ? product.name:'' ,
                  rules:[
                    {required:true , message:'名称必须输入'}
                  ]
                })(
                  <Input placeholder="请输入商品名称" />
                )
              }
            </Item>
            <Item label='商品描述'>
              {
                //这是高阶函数
                this.props.form.getFieldDecorator('desc',{
                  initialValue:isUpdate ? product.desc:'' ,
                  rules:[
                    {required:true , message:'描述必须输入'}
                  ]
                })(
                  <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
                )
              }
            </Item>
            <Item label='商品价格'>
              {
                //这是高阶函数
                this.props.form.getFieldDecorator('price',{
                  initialValue:isUpdate ? product.price:'' ,
                  rules:[
                    {required:true , message:'价格必须输入'},
                    {validator:this.validatorPrice}
                  ]
                })(
                  <Input type="number" placeholder="请输入商品价格" addonAfter="元"/>
                )
              }
            </Item>
            <Item label='商品分类'>
              {
                //这是高阶函数
                this.props.form.getFieldDecorator('categoryIds',{
                  initialValue:categoryIds,
                  rules:[
                    {required:true , message:'分类必须选择'},
                    {validator:this.validatorCategorys}
                  ]
                })(
                  <Cascader
                    options={this.state.options}/*需要显示的列表数据*/
                    loadData={this.loadData}/*用于动态加载选项:当选择某个列表项，加载下一级列表的监听回调*/
                    />
                )
              }
            </Item>
            <Item label='商品图片'>
              <PicturesWall ref={this.pw} imgs={imgs} />
            </Item>
            <Item label='商品详情' wrapperCol={{sm:{span:20}}} >
              <RichTextEditor ref={this.editor} detail={detail} />
            </Item>
            <Item >
              <Button type='primary' onClick={this.handleSubmit} >提交</Button>
            </Item>
          </Form>
        </Card>
      </div>
    )
  }
}

//要想进行表单验证，就要用Form的create的方法，将form传给组件
export default Form.create()(AddUpdate)