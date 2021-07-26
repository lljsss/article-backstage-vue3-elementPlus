// 获取 粉丝列表
import request  from "./request";

export const getFans = params => {
  return request({
    method: 'GET',
    url: '/followers',
    params
  })
}
