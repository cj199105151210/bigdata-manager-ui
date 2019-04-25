import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/aggr/aggrgateway/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/aggr/aggrgateway',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/aggr/aggrgateway/' + id,
    method: 'delete'
  })
}

export function batchDelObj (objs) {
  return request({
    url: '/api/aggr/aggrgateway/batchDelObj',
    method: 'post',
    data: objs
  })
}

export function handleBatchEnable (objs) {
  return request({
    url: '/api/aggr/aggrgateway/handleBatchEnable',
    method: 'post',
    data: objs
  })
}

export function handleBatchDisable (objs) {
  return request({
    url: '/api/aggr/aggrgateway/handleBatchDisable',
    method: 'post',
    data: objs
  })
}

export function putObj(obj) {
  return request({
    url: '/api/aggr/aggrgateway',
    method: 'put',
    data: obj
  })
}

export function checkName(name, gatewayId) {
  return request({
    url: '/api/aggr/aggrgateway/checkName',
    method: 'get',
    params: {'name' : name, 'gatewayId' : gatewayId}
  })
}

export function checkCode(code, gatewayId) {
  return request({
    url: '/api/aggr/aggrgateway/checkCode',
    method: 'get',
    params: {'code' : code, 'gatewayId' : gatewayId}
  })
}