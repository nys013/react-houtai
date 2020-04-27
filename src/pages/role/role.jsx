import React, {Component} from 'react'
import {Card ,Table , Button , message , Modal} from 'antd'
import {connect} from 'react-redux'

import {reqRoleList} from '../../api'
import {PAGE_SIZE} from '../../utils/constants.js'
import AddForm from './add-form'
import {reqAddRole , reqUpdateRole} from '../../api'
import AuthForm from './auth-form'
//import storage from '../../utils/storageUtils.js'
import {formateDate} from '../../utils/dateUtils'
import {logout} from '../../redux/actions'

class Role extends Component {
  state = {
    roles:[],
    role:{},
    isShowAdd:false,
    isShowAuth:false,
    checkedKeys:[]
  }

  initColumns = [
    {
      title: '角色名',
      dataIndex: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render:(create_time) => formateDate(create_time)
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      render:formateDate
    },
    {
      title: '授权人',
      dataIndex: 'auth_name'
    },
  ]

  getRoleList = async ()=>{
    const result = await reqRoleList()
    if(result.status === 0){
      this.setState({roles:result.data})
    } else {
      message.error('角色列表获取失败')
    }
  }

  // 设置行属性，为函数，参数为该行记录，返回一个配置对象，可以根据需要配置
  onRow = role => {
    return {
      // 点击行时触发,将role更新，且将checkedKeys更新，子组件就有初始选中数组了
      onClick: event => {
        this.setState({role,checkedKeys:role.menus})
      }
    }
  }

  addRole = ()=> {
    this.form.validateFields (async(error, values) =>{
        if(error){
          return
        }
        const {roleName} = values
        this.form.resetFields()
        const result = await reqAddRole(roleName)
        if(result.status === 0){
          this.setState({isShowAdd:false})
          message.success('添加角色成功')
        /*更新数据方法1，重新发送请求，从后台获取数据，再更新数据--不推荐，因为不宜多次发送请求*/
          //this.getRoleList()
        /*更新数据方法2———2、3差不多，都是通过添加角色后台返回的数据，直接更新状态
          只是形式不一样，但注意的是最好不要直接更改state，因为setState是会对新旧state进行对比进行render，所以都采用了...运算符*/
          const role = result.data
          this.setState(state =>({
            roles:[...state.roles,role]
          }))
          /*更新数据方法3*/
          /*const roles = [...this.state.roles]
          roles.push(role)
          this.setState({roles})*/

        } else {
          message.error('添加角色成功')
        }
      }
    )


  }

  setRole = async () => {
    const role = this.state.role
    // 通过ref获取子组件的数据
    // role.menus = this.menus.current.getMenus()
    role.menus = this.state.checkedKeys
    role.auth_time = Date.now()
    //role.auth_name = storage.getUser().username
    role.auth_name = this.props.user.username

    /*这样是另一个role，加进去的menus、auth等都不会保存给当前选中的role，只有当再发送请求，重新获取role时才得到当前role*/
    //const role = {menus , _id , auth_time , auth_name}

    const result = await reqUpdateRole(role)
    if(result.status === 0){
      this.setState({isShowAuth:false})
      //const role = result.data
      /*this.setState(state => ({
        roles:[...state.roles,role]
      }))*/
      this.setState({
        roles:[...this.state.roles]
      })
      //this.getRoleList()

      // 如果修改的是自己角色的权限，那就重新登录，重新渲染角色权限该有的界面
      if(role._id === this.props.user.role_id ){
        /*storage.removeUser()
        this.props.history.replace('/login')*/
        this.props.logout()
        message.success('权限发生改变，请重新登录')
      } else {
        message.success('授权管理成功')
      }

    } else {
      message.error('授权管理失败')
    }

  }

  // 将checkedKeys数据和该函数传给子组件，在子组件行点击调用，因为函数作用域+箭头函数this向上捕获，改变的是父组件的state
  onCheck = (checkedKeys, info) => {
    this.setState({checkedKeys})
    // console.log('onCheck', checkedKeys);
  }

  constructor (props) {
    super(props)
    this.columns = this.initColumns
    this.menus = React.createRef()
  }
  componentDidMount (){
    this.getRoleList()
  }
  render (){
    const {roles , role , isShowAdd , isShowAuth , checkedKeys} = this.state
    const title = (
      <span>
        <Button type='primary' onClick={() =>this.setState({isShowAdd:true})} >创建角色</Button>&nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={() =>this.setState({isShowAuth:true , role})}>设置角色权限</Button>
      </span>
    )

    return(
      <div>
        <Card title={title} >
          <Table
            rowKey="_id"
            dataSource={roles}
            columns={this.columns}
            pagination={{defaultPageSize:PAGE_SIZE , showQuickJumper:true}}
            onRow={this.onRow}
            rowSelection={{type:'radio' , selectedRowKeys:[role._id] , onSelect:(role) => this.setState({role}) } }
            />

          <Modal
            title="添加角色"
            visible={isShowAdd}
            onOk={this.addRole}
            onCancel={()=>{this.setState({isShowAdd:false})}}
            >
            <AddForm setForm={ form => this.form = form} />
          </Modal>

          <Modal
            title="设置角色权限"
            visible={isShowAuth}
            onOk={this.setRole}
            onCancel={()=>{this.setState({isShowAuth:false,checkedKeys:role.menus})}}
            >
            <AuthForm role={role} 
            // 将checkedKeys数据和onCheck函数传给子组件
            checkedKeys={checkedKeys} onCheck={this.onCheck} 
            // ref={this.menus} 用了上面这种方式，将函数和数据放在父组件上，不在子组件上，就不用获取子组件的数据了
             />
          </Modal>
        </Card>
      </div>
    )
  }
}

export default connect (
  state => ({user:state.user}),
  {logout}
)(Role)