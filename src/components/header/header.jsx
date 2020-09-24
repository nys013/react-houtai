import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import {connect} from 'react-redux'

import './header.less'
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils.js'
import LinkButton from '../link-button'
import {logout} from '../../redux/actions.js'
// import menuList from '../../config/menuConfig.js'
//import storage from '../../utils/storageUtils.js'

const { confirm } = Modal;

class Header extends Component {

  state = {
    currentTime:'',
    weather:'',
    dayPictureUrl :''
  }

  // 通过循环定时器，1s获取一次当前时间，然后进行格式化后，更新组件状态
  getCurrentTime = ()=>{
    this.intervalId = setInterval(()=>{
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  // 获取天气信息，通过调用封装好的ajax获取(因为天气只有头部组件需要，就没有交于redux管理，就不需要像之前通过action)
  getWeather = async(city)=>{
    const {dayPictureUrl,weather} = await reqWeather(city)
    // 获取到的天气信息数据，更新当前组件状态
    this.setState({dayPictureUrl,weather})
  }

  /*这个用了redux之后就用不着了*/
  /*getTitle = ()=>{
    const path = this.props.location.pathname
    menuList.forEach((item) =>{
      if(item.key === path){
        //debugger
        this.title = item.title
      }else if(item.children){
          const cItem =item.children.find(cItem => path.indexOf(cItem.key)===0)
          if (cItem){
            this.title = cItem.title
          }
      }
    })
  }*/

  logout = ()=>{
    // 使用UI函数，confirm是Modal对话框中的方法
      confirm({
        title: '你确定要退出吗？',
        okText: '确定',
        cancelText: '取消',
        //这里必须用箭头函数，因为里面的this需要是外部的this，而不是函数的this
        onOk:() => {
          /*用了redux就不用这个了*/
          /*storage.removeUser()
          this.props.history.replace('/login')*/

          this.props.logout()
        }
      })

  }


  //异步操作，执行定时器，一般都在这--在render后执行，只执行一次
  componentDidMount (){
    this.getCurrentTime()
    this.getWeather('上海')
  }

  //在要卸载时关闭定时器，防止内存泄露(例如：退出登录后不需要定时器)
  componentWillUnmount (){
    clearInterval(this.intervalId)
  }

  render (){
    const {currentTime, weather, dayPictureUrl} = this.state
    return(
      <div className='header' >
        <div className="header-top">
          <span>欢迎：{this.props.user.username}</span>
          <LinkButton onClick={this.logout} >退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <h1>{this.props.headerTitle}</h1>
          </div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt=""/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headerTitle:state.headerTitle,user:state.user}),
  {logout}
)(withRouter(Header))