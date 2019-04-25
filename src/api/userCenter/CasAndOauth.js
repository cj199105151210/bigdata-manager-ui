import request from '@/utils/request'

export function selectOauth(page, rows) {
  return request({
    url: '/api/center/OauthClient/PageSelect',
    method: 'get',
    params: {
      page: page,
      rows: rows
    }
  })
}

export function selectCas(page, rows) {
  return request({
    url: '/api/center/CasClient/PageSelect',
    method: 'get',
    params: {
      page: page,
      rows: rows
    }
  })
}

export function selectCasMessage(row) {
  return request({
    url: '/api/center/CasClient/SelectById',
    method: 'get',
    params: {
      id: row.id
    }
  })
}

export function selectOauthMessage(clientId) {
  return request({
    url: '/api/center/OauthClient/SelectById',
    method: 'get',
    params: {
      clientId: clientId
    }
  })
}

export function deleteCas(row) {
  return request({
    url: '/api/center/CasClient/delete',
    method: 'get',
    params: {
      id: row.id
    }
  })
}

export function deleteOauth(row) {
  return request({
    url: '/api/center/OauthClient/delete',
    method: 'get',
    params: {
      clientId: row.clientId
    }
  })
}

export function updateCas(id, name, serviceid) {
  return request({
    url: '/api/center/CasClient/update',
    method: 'post',
    params: {
      id: id,
      name: name,
      serviceid: serviceid
    }
  })
}

export function updateOauth(clientId, clientSecret, oldClientId) {
  return request({
    url: '/api/center/OauthClient/update',
    method: 'post',
    params: {
      clientId: clientId,
      clientSecret: clientSecret,
      oldClientId: oldClientId
    }
  })
}

export function insertCas(formData) {
  return request({
    url: '/api/center/CasClient/insertRecord',
    method: 'post',
    data: formData
  })
}

export function insertOauth(formData) {
  return request({
    url: '/api/center/OauthClient/insertRecord',
    method: 'post',
    data: formData
  })
}
