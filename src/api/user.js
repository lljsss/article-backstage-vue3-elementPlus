import request from "./request";

export const login=data=>{
  return request({
    method:'post',
    url:'/authorizations',
    data,
  })
}
// 获取用户资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/user/profile'
    // 后端要求把需要授权的 用户身份 放到请求头中
    // axios可以通过headers设置请求头
    // headers: {
    //   // 属性名和属性值 要看后端的要求
    //   Authorization: `Bearer ${userInfo.token}`
    // }
  })
}

// 编辑用户头像
export const updataUserAvatar = data => {
  return request({
    method: 'PATCH',
    url: '/user/photo',
    data
  })
}

// 编辑用户资料
export const updataUser = data => {
  return request({
    method: 'PATCH',
    url: '/user/profile',
    data
  })
}