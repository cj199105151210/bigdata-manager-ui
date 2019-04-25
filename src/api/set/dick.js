import request from '@/utils/request'

export function fetchDeptTree (query) {
    return request({
      url: '/api/admin/dept/user-tree',
      method: 'get',
      params: query
    })
  }