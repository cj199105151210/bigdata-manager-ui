import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/aggr/aggrlightapp/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/aggr/aggrlightapp',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/aggr/aggrlightapp/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/aggr/aggrlightapp/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/aggr/aggrlightapp',
    method: 'put',
    data: obj
  })
}

export function getDept() {
  return request({
    url: '/api/aggr/aggrlightapp/organization/getAll',
    method: 'get'
  })
}

export function upload (data) {
  return request({
    url: '/api/aggr/aggrlightapp/upload',
    method: 'post',
    data: data
  })
}

export function batchDelObj (objs) {
  return request({
    url: '/api/aggr/aggrlightapp/batchDelObj',
    method: 'post',
    data: objs
  })
}