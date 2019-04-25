import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/admin/parameter/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/admin/parameter',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/admin/parameter/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/parameter/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/parameter',
    method: 'put',
    data: obj
  })
}
