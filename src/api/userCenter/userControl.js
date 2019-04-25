import request from '@/utils/request'

export function checkUserName(value) {
  return request({
    url: '/api/center/login/checkUserName',
    method: 'get',
    params: {
      userName: value
    }
  })
}

export function getTreeNode(type, isShowCrew) {
  return request({
    url: '/api/center/userGroup/selectTreeList',
    method: 'get',
    params: {
      type: type,
      isShowCrew: isShowCrew
    }
  })
}

export function insertFlowRelation(orgId, userId) {
  return request({
    url: '/api/center/flowPosition/insertToRelation',
    method: 'post',
    params: {
      orgId: orgId,
      userId: userId
    }
  })
}

export function insertGroupRelation(orgId, userId) {
  return request({
    url: '/api/center/userGroup/insertToRelation',
    method: 'post',
    params: {
      orgId: orgId,
      userId: userId
    }
  })
}

export function insertOrgRelation(orgId, userId, isDirect) {
  return request({
    url: '/api/center/organization/insertToRelation',
    method: 'post',
    params: {
      orgId: orgId,
      userId: userId,
      isDirectly: isDirect
    }
  })
}

export function removeOrgRelation(orgId, userId) {
  return request({
    url: '/api/center/organization/deleteFromRelation',
    method: 'post',
    params: {
      orgId: orgId,
      userId: userId
    }
  })
}

export function updateDirect(orgId, userId) {
  return request({
    url: '/api/center/organization/updateDirectly',
    method: 'post',
    params: {
      orgId: orgId,
      userId: userId
    }
  })
}

export function removeGroupRelation(orgId, userId) {
  return request({
    url: '/api/center/userGroup/deleteFromRelation',
    method: 'post',
    params: {
      orgId: orgId,
      userId: userId
    }
  })
}

export function removeFlowRelation(orgId, userId) {
  return request({
    url: '/api/center/flowPosition/deleteFromRelation',
    method: 'post',
    params: {
      orgId: orgId,
      userId: userId
    }
  })
}

export function addUser(formData) {
  return request({
    url: '/api/center/user/register',
    method: 'post',
    data: formData
  })
}

export function findUser(loginName) {
  return request({
    url: '/api/center/user/selectByLoginName',
    method: 'get',
    params: {
      loginName: loginName
    }
  })
}

export function updateUser(formData) {
  return request({
    url: '/api/center/user/update',
    method: 'post',
    data: formData
  })
}

export function uploadAvator(fd) {
  return request({
    url: '/api/center/user/upload',
    method: 'post',
    data: fd
  })
}

export function selectUserByNode(nodeId) {
  return request({
    url: '/api/center/organization/selectUserByNodeId',
    method: 'get',
    params: {
      nodeId: nodeId
    }
  })
}

export function updatePassword(userName, password) {
  return request({
    url: '/api/center/login/updatePassword',
    method: 'post',
    params: {
      userName: userName,
      password: password
    }
  })
}

export function selectUserOrg(id) {
  return request({
    url: '/api/center/organization/selectUserOrg',
    method: 'get',
    params: {
      userId: id
    }
  })
}

export function orgFuzzSearch(userId, keyWord) {
  return request({
    url: '/api/center/organization/fuzzSearch',
    method: 'get',
    params: {
      userId: userId,
      keyWord: keyWord
    }
  })
}

export function GroupFuzzSearch(userId, keyWord) {
  return request({
    url: '/api/center/userGroup/fuzzSearch',
    method: 'get',
    params: {
      userId: userId,
      keyWord: keyWord
    }
  })
}

export function FlowFuzzSearch(userId, keyWord) {
  return request({
    url: '/api/center/flowPosition/fuzzSearch',
    method: 'get',
    params: {
      userId: userId,
      keyWord: keyWord
    }
  })
}

export function selectUserGroup(id) {
  return request({
    url: '/api/center/userGroup/selectUserGroup',
    method: 'get',
    params: {
      userId: id
    }
  })
}

export function selectUserFlow(id) {
  return request({
    url: '/api/center/flowPosition/selectFlowByUserId',
    method: 'get',
    params: {
      userId: id
    }
  })
}

export function selectUseMessage(userId) {
  return request({
    url: '/api/center/user/selectUserMessage',
    method: 'get',
    params: {
      userId: userId
    }
  })
}

export function restart(guid) {
  return request({
    url: '/api/center/user/restart',
    method: 'get',
    params: {
      guid: guid
    }
  })
}

export function deleteUser(guids) {
  return request({
    url: '/api/center/user/delete',
    method: 'get',
    params: {
      guids: guids
    }
  })
}

export function searchUser(xm) {
  return request({
    url: '/api/center/user/selectUserByName',
    method: 'get',
    params: {
      xm: xm
    }
  })
}
