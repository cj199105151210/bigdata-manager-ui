import request from '@/utils/request'

export function selectAll(page, rows) {
  return request({
    url: '/api/operation/middleLeave/getPageData',
    method: 'get',
    params: {
      pageNum: page,
      pageSize: rows
    }
  })
}

