import ajax from './ajax.js'
import {message} from 'antd'
import jsonp from 'jsonp'

const BASE = '/api'
//获取登录数据
export const reqLogin = (username,password) => ajax(BASE +"/login",{username,password},"POST")
//添加、更新用户
export const reqAddOrUpdateUSer = (user) => ajax(BASE +"/manage/user/"+ (user._id ? "update" : "add"),user,"POST")
//获取天气
export const reqWeather = (city)=>{
  return new Promise((resolve , reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    // 使用jsonp的库获取数据
    jsonp(url,{},(err,data)=>{
      if(!err){
        // 通过浏览器和插件访问url可以查看数据结构，然后取出我们想要的数据
        const {dayPictureUrl,weather} = data.results[0].weather_data[0]
        if(data.status==='success'){
          resolve({dayPictureUrl,weather})
        }else{
          message.error('获取天气信息失败')
        }
      }

    })
  })
}
//获取1级/2级分类
export const reqCategorys = (parentId) => ajax(BASE +'/manage/category/list',{parentId})
//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE +'/manage/category/add',{categoryName,parentId},"POST")
//更新分类
export const reqUpdateCategory = ({categoryName,categoryId}) => ajax(BASE +'/manage/category/update',{categoryName,categoryId},"POST")

//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE +'/manage/product/list',{pageNum,pageSize})

//搜索商品
export const reqSearchProducts = ({pageNum,pageSize,searchKey,searchType}) => ajax(BASE +'/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchKey
})

//根据分类ID获取分类
export const reqCategory = (categoryId) => ajax(BASE +'/manage/category/info',{categoryId})
//对商品进行上架/下架处理
export const reqUpdateStatus = (productId , status ) => ajax(BASE +'/manage/product/updateStatus',{productId , status},"POST")

//删除图片
export const reqDeletePic = (name) => ajax(BASE +'/manage/img/delete',{name},'POST')

//添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE +'/manage/product/' + (product._id? 'update' : 'add') ,product ,'POST')

//获取角色列表
export const reqRoleList = () => ajax(BASE +'/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => ajax(BASE +'/manage/role/add',{roleName},'POST')
//更新角色
export const reqUpdateRole = (role) => ajax(BASE +'/manage/role/update',role,'POST')

//获取用户列表
export const reqUserList = ()=> ajax(BASE +'/manage/user/list')
// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE +'/manage/user/delete' , {userId} , "POST")