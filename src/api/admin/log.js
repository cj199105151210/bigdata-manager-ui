import request from '@/utils/request'

export function fetchList (query) {
  return request({
    url: '/api/admin/log/page',
    method: 'get',
    params: query
  })
}

export function delObj (id) {
  return request({
    url: '/api/admin/log/' + id,
    method: 'delete'
  })
}

export function addObj (obj) {
  return request({
    url: '/api/admin/log/',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/api/admin/log/' + id,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: '/api/admin/log/',
    method: 'put',
    data: obj
  })
}

export function sendLogs (logsList) {
  return request({
    url: '/api/admin/log/logs',
    method: 'post',
    data: logsList
  })
}
