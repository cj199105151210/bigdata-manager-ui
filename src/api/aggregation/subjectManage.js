import request from '@/utils/request'

export function GetMenu () {
  return request({
    url: '/api/admin/menu',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/api/aggr/subject/page',
    method: 'get',
    params: query
  })
}

export function fetchMenuTree () {
  return request({
    url: '/api/aggr/subject/getSubjectTree',
    method: 'get'
  })
}

export function getCodeDetailFromDB (codeValue) {
  return request({
    url: '/api/admin/dict/type/' + codeValue,
    method: 'get'
  })
}

export function getGroupMsg () {
  return request({
    url: '/api/aggr/subject/getUserGroupMsg',
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/api/aggr/subject/addOrUpdateTreeNode',
    method: 'post',
    data: obj
  })
}

export function getObj (subjectId, gatewayId) {
  return request({
    url: '/api/aggr/subject/subject',
    method: 'get',
    params: {'subjectId' : subjectId, 'gatewayId' : gatewayId}
  })
}

export function delObj (id) {
  return request({
    url: '/api/aggr/subject/deleteTreeNode',
    method: 'get',
    params: {'subjectId' : id}
  })
}

export function upload (data) {
  return request({
    url: '/api/aggr/subject/upload',
    method: 'post',
    data: data
  })
}
