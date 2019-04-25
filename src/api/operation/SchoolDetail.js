import request from '@/utils/request'

export function selectAll(pageNum, pageSize) {
  return request({
    url: '/api/operation/schoolDetail/getPageData',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    }
  })
}

export function insertDetail(formData) {
  return request({
    url: '/api/operation/schoolDetail/insert',
    method: 'post',
    data: formData
  })
}

export function updateDetail(formData) {
  return request({
    url: '/api/operation/schoolDetail/update',
    method: 'post',
    data: formData
  })
}

export function deleteDetail(guid) {
  return request({
    url: '/api/operation/schoolDetail/delete',
    method: 'get',
    params: {
      guid: guid
    }
  })
}
