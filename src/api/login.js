import request from '@/utils/request'
const scope = 'server'
export function login(username, password, code, randomStr) {
  const grant_type = 'password'
  return request({
    url: '/api/auth/oauth/token',
    headers: {
      'Authorization': 'Basic Ym9zOmJvcw=='
    },
    method: 'post',
    params: {username, password, code, randomStr, grant_type, scope}
  })
}

export const refreshToken = (refresh_token) => {
  const grant_type = 'refresh_token'
  return request({
    url: '/api/auth/oauth/token',
    headers: {
      'isToken': false,
      'Authorization': 'Basic Ym9zOmJvcw==',
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/user/info',
    method: 'get'
  })
}

export function getMenu() {
  return request({
    url: '/api/admin/menu',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/api/auth/token/logout',
    method: 'delete'
  })
}
