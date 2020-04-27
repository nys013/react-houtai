// 原生js对localStorage的操作，在老版本浏览器不兼容，所以用了个小库
import store from 'store'

const USER_KEY = 'user_key'

export default {
  //保存
  saveUser (user) {store.set(USER_KEY,user)},
  //获取
  getUser () {return store.get(USER_KEY) || {}},
  //删除
  removeUser () {store.remove(USER_KEY)}
}

// 原生js写法
/* export default {
  //保存
  saveUser (user) {
    localStorage.setItem(USER_KEY,JSON.stringify(user))
  },
  //获取
  getUser () {
    return JSON.parse(localStorage.getItem(USER_KEY) || "{}" )
  },
  //删除
  removeUser () {
    localStorage.removeItem(USER_KEY)
  }
} */