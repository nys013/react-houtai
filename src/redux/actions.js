import {SET_HEADER_TITLE , RECEIVE_USER , SEND_ERROR_MSG , RESET_USER  ,UPDATE_PAGE} from './action-types.js'
import {reqLogin} from '../api/index.js'
import storage from '../utils/storageUtils.js'
import {message} from 'antd'

export const setHeaderTitle = (headerTitle) => ({type:SET_HEADER_TITLE,data:headerTitle})

export const receiveUser = (user) => ({type:RECEIVE_USER , user})

export const errorMsg = (msg) => ({type:SEND_ERROR_MSG , msg})

export const logout = () => {
  //清除浏览器localstorage中储存的数据
  storage.removeUser()
  //返回action，让reducer去处理数据
  return {type:RESET_USER }
}

/*登录的异步action*/
export const login = (username,password) => {
  return async dispatch => {
    const result = await reqLogin(username,password)
    if(result.status===0){
      //存储user
      storage.saveUser(result.data)
      dispatch(receiveUser(result.data))
      // 提示登录成功
      message.success('登录成功')
    }else{
      /*1.直接显示错误信息(在reducer中将msg放入redux了，就在页面显示用自己定义的，不同UI组件了)*/
      // message.error(result.msg)
      /*2.分发错误action*/
      dispatch(errorMsg(result.msg))

    }
  }
}

// 更新商品页数的同步action
export const updatePage = (pageNum) => ({type:UPDATE_PAGE,pageNum})
