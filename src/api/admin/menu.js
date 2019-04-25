import request from '@/utils/request'

export function GetMenu () {
  return request({
    url: '/api/admin/menu',
    method: 'get'
  })
}

export function fetchMenuTree (query) {
  return request({
    url: '/api/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/api/admin/menu',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/api/admin/menu/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/api/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/api/admin/menu',
    method: 'put',
    data: obj
  })
}
