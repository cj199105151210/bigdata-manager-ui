import request from '@/utils/request'

export function selectAll(page, rows) {
  return request({
    url: '/api/operation/problem/getPageDataAll',
    method: 'get',
    params: {
      pageNum: page,
      pageSize: rows
    }
  })
}

export function addRecord(formData) {
  return request({
    url: '/api/operation/problem/insert',
    method: 'post',
    data: formData
  })
}

export function updateRecord(formData) {
  return request({
    url: '/api/operation/problem/update',
    method: 'post',
    data: formData
  })
}
