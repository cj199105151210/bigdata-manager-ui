import request from '@/utils/request'

export function getTreeList(type, isShowCrew) {
  return request({
    url: '/api/center/userGroup/selectTreeList',
    method: 'get',
    params: {
      type: type,
      isShowCrew: isShowCrew
    }
  })
}

export function getTableList(nodeId, currentPage, pageSize) {
  return request({
    url: '/api/center/organization/selectUserPageByNodeId',
    method: 'get',
    params: {
      nodeId: nodeId,
      currentPage: currentPage,
      pageSize: pageSize
    }
  })
}

export function getAllUserList(nodeId) {
  return request({
    url: '/api/center/organization/selectAllUserByNodeId',
    method: 'get',
    params: {
      nodeId: nodeId
    }
  })
}

export function getShowForm(nodeId) {
  return request({
    url: '/api/center/organization/selectOrganization',
    method: 'get',
    params: {
      orgId: nodeId
    }
  })
}

export function getCacheTableList(nodeId) {
  return request({
    url: '/api/center/organization/selectUserByNodeId',
    method: 'get',
    params: {
      nodeId: nodeId
    }
  })
}

export function insertNode(obj) {
  return request({
    url: '/api/center/organization/insertNode',
    method: 'post',
    data: obj
  })
}

export function getNodeById(orgId) {
  return request({
    url: '/api/center/organization/selectOrganization',
    method: 'get',
    params: {
      orgId: orgId
    }
  })
}

export function updateNode(obj) {
  return request({
    url: '/api/center/organization/updateNode',
    method: 'post',
    data: obj
  })
}

export function deleteNode(nodeId) {
  return request({
    url: '/api/center/organization/deleteNodeById',
    method: 'get',
    params: {
      nodeId: nodeId
    }
  })
}

export function getUserByTypeXM(type, xm) {
  return request({
    url: '/api/center/userGroup/selectUserByTypeXM',
    method: 'get',
    params: {
      type: type,
      xm: xm
    }
  })
}

export function adjustRelation(adjustType, type, targetType, targetId, userId, orgId) {
  return request({
    url: '/api/center/userGroup/adjustRelation',
    method: 'post',
    data: {
      adjustType: adjustType,
      type: type,
      targetType: targetType,
      targetId: targetId,
      userId: userId,
      orgId: orgId
    }
  })
}

export function insertPrivateNode(obj) {
  return request({
    url: '/api/center/userGroupPrivate/insertNode',
    method: 'post',
    data: obj
  })
}

export function updatePrivateNode(obj) {
  return request({
    url: '/api/center/userGroupPrivate/updateNode',
    method: 'post',
    data: obj
  })
}

export function deletePrivateNode(nodeId) {
  return request({
    url: '/api/center/userGroupPrivate/deleteNodeById',
    method: 'get',
    params: {
      nodeId: nodeId
    }
  })
}
