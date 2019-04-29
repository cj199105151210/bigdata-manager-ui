import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/aggr/aggrlightapp/page',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/api/aggr/aggrlightapp/' + id,
    method: 'delete'
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

export function saveOrUpdate(obj) {
  return request({
    url: '/api/aggr/aggrlightapp',
    method: 'post',
    data: obj
  })
}

export function checkName(name, lightappId) {
  return request({
    url: '/api/aggr/aggrlightapp/checkName',
    method: 'get',
    params: {'name' : name, 'lightappId' : lightappId}
  })
}

export function checkCode(code, lightappId) {
  return request({
    url: '/api/aggr/aggrlightapp/checkCode',
    method: 'get',
    params: {'code' : code, 'lightappId' : lightappId}
  })
}