import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/api/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/api/admin/user/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

//批量删除
export function delAllObj (obj) {
  return request({
    url: '/api/admin/user/dels',
    method: 'delete',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/api/admin/user',
    method: 'put',
    data: obj
  })
}

export function getDetails (obj) {
  return request({
    url: '/api/admin/user/details/' + obj,
    method: 'get'
  })
}


// 重置用户密码为初始值
export function resetPassword (obj) {
  return request({
    url: '/api/admin/user/reset-pwd/' + obj,
    method: 'put'
  })
}
