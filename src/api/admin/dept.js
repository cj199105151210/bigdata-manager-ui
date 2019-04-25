import request from '@/utils/request'

export function fetchDeptTree (query) {
  return request({
    url: '/api/admin/dept/tree',
    method: 'get',
    params: query
  })
}

export function fetchTree (query) {
  return request({
    url: '/api/admin/dept/tree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/api/admin/dept/',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/api/admin/dept/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/api/admin/dept/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/api/admin/dept/',
    method: 'put',
    data: obj
  })
}
