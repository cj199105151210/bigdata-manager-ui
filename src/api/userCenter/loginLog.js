import request from '@/utils/request'

export function onSubmit(currentPage, pageSize, userName, loginType) {
  return request({
    url: '/api/center/userLog/relationQuery',
    method: 'get',
    params: {
      page: currentPage,
      rows: pageSize,
      userName: userName,
      loginType: loginType
    }
  })
}
