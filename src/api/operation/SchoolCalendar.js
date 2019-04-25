import request from '@/utils/request'

export function selectAll(page, rows) {
  return request({
    url: '/api/operation/schoolCalendar/getPageData',
    method: 'get',
    params: {
      pageNum: page,
      pageSize: rows
    }
  })
}

export function addRecord(formData) {
  return request({
    url: '/api/operation/schoolCalendar/insert',
    method: 'post',
    data: formData
  })
}

export function updateRecord(formData) {
  return request({
    url: '/api/operation/schoolCalendar/update',
    method: 'post',
    data: formData
  })
}
