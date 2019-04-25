import request from '@/utils/request'

export function roleList () {
  return request({
    url: '/api/admin/role/roleList',
    method: 'get'
  })
}

export function fetchList (query) {
  return request({
    url: '/api/admin/role/page',
    method: 'get',
    params: query
  })
}

export function deptRoleList () {
  return request({
    url: '/api/admin/role/list',
    method: 'get'
  })
}

export function getObj (id) {
  return request({
    url: '/api/admin/role/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/api//admin/role',
    method: 'post',
    data: obj
  })
}

export function putObj (obj) {
  return request({
    url: '/api/admin/role',
    method: 'put',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/api/admin/role/' + id,
    method: 'delete'
  })
}

export function permissionUpd (roleId, menuIds) {
  return request({
    url: '/api/admin/role/menu',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree (roleName) {
  return request({
    url: '/api/admin/menu/tree/' + roleName,
    method: 'get'
  })
}
