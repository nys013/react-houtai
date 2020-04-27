import {combineReducers} from 'redux'
import storage from '../utils/storageUtils.js'

import {SET_HEADER_TITLE , RECEIVE_USER , SEND_ERROR_MSG , RESET_USER , UPDATE_PAGE} from './action-types.js'

const initHeaderTitle = '首页'
function headerTitle (state=initHeaderTitle , action){
  switch (action.type){
    case SET_HEADER_TITLE:
      return action.data
    default : return state
  }
}

/*初始值一定不能是空对象，否则每次渲染都是空对象，保存的user就没有了，应该是已经登录的user*/
const inituser = storage.getUser()  //这一步算是实现自动登录的一步
function user (state=inituser , action){
  switch (action.type){
    case RECEIVE_USER :
      //const user = action.user
      return action.user
    case SEND_ERROR_MSG:
      const msg = action.msg
      /*不推荐这么写，因为不能改变原有的state*/
      /*state.msg = msg
      return state*/
      /*推荐这么写*/
      return {...state,msg}
    case RESET_USER :
      return {}
    default : return state
  }
}

function productPage (state=1 , action){
  switch (action.type){
    case UPDATE_PAGE:
      return action.pageNum
    default:
      return state
  }
}

export default combineReducers({
  headerTitle,
  user,
  productPage
})
