import request from '@/utils/request'

export function selectOrgTree() {
  return request({
    url: '/api/operation/yellow/selectAll',
    method: 'get'
  })
}

export function updateRecord(formData) {
  return request({
    url: '/api/operation/yellow/update',
    method: 'post',
    data: formData
  })
}

export function insertRecord(formData) {
  return request({
    url: '/api/operation/yellow/insert',
    method: 'post',
    data: formData
  })
}
