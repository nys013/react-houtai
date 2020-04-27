/* 用户管理界面 */

import React, {Component} from 'react'
import {Card , Button , Modal , Table ,message} from 'antd'

import LinkButton from '../../components/link-button/index.js'
import {formateDate} from '../../utils/dateUtils'
import {reqUserList , reqAddOrUpdateUSer ,reqDeleteUser } from '../../api/index.js'
import {PAGE_SIZE} from '../../utils/constants'
import UserForm from './user-form.jsx'

const { confirm } = Modal;

export default class User extends Component {
  state = {
    visible:false,
    users:[],
    roles:[],
    user:{}
  }

  initColumns = ()=>{
    return [
      {
        title:"用户名",
        dataIndex:'username'
      },
      {
        title:"电话",
        dataIndex:'phone'
      },
      {
        title:"邮箱",
        dataIndex:'email'
      },
      {
        title:"角色",
        dataIndex:'role_id',
        render:(role_id) => this.rolesName[role_id]
      },
      {
        title:"创建时间",
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:"操作",
        render:(user)=>(
          <span>
            <LinkButton onClick={() => {this.setState({user,visible:true})}} >修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)} >删除</LinkButton>
          </span>
        )
      }
    ]
  }

  getUsers = async()=>{
    const result = await reqUserList()
    if(result.status === 0){
      const {users,roles} = result.data
      this.rolesName = this.getRolesName(roles)
      this.setState({users,roles})
    }
  }

  getRolesName = (roles) => {
    return roles.reduce((preTotal , role) => {
      preTotal[role._id] = role.name
      return preTotal
    },[])
  }

  showAdd = () => {
    this.setState({visible:true , user:{}})
  }

  addOrUpdateUser = () => {
    this.form.validateFields( async (error,values) => {
      if(error){
        return
      }
      const {_id} = this.state.user
      values._id = _id
      const result = await reqAddOrUpdateUSer(values)
      this.form.resetFields()
      if(result.status ===0){
        this.getUsers()
        this.setState({visible:false})
        message.success((_id ? "修改" : "添加") + "用户成功")
      } else {
        message.error((_id ? "修改" : "添加") + "用户失败")
      }
    })
  }

  deleteUser =  (user) => {
    console.log(user);
    confirm({
      title: `你确定要删除<${user.username}>吗？`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk:async () =>{
        const result = await reqDeleteUser(user._id)
        console.log(result);
        if(result.status === 0){
          this.getUsers()
          message.success("删除用户成功")
        }else{
          message.error("删除用户失败")
        }
      }
    })

  }
  constructor(props){
    super(props)
    this.columns = this.initColumns()
    this.getUsers()
  }

  render (){
    const {roles , users , visible ,user} = this.state
    return(
      <Card title={<Button type="primary" onClick={this.showAdd} >创建用户</Button>} >
        <Table
          dataSource={users}
          columns={this.columns}
          rowKey = '_id'
          bordered
          pagination = {{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
          />

        <Modal
          title={(user._id ? '修改' : "添加") + "用户" }
          visible={visible}
          onOk={this.addOrUpdateUser}
          onCancel={() =>{
            this.form.resetFields()
            this.setState({visible:false})
          }}
          >
          <UserForm setForm={form => this.form = form} roles={roles} user={user} />
        </Modal>

      </Card>
    )
  }
}