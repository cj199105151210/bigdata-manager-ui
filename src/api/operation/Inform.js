import request from '@/utils/request'

export function selectUsergroup() {
  return request({
    url: '/api/center/userGroup/getAll',
    method: 'get'
  })
}

export function selectRecord(currentPage, pageSize, lineForm) {
  return request({
    url: '/api/operation/notice/termsInquiry',
    method: 'get',
    params: {
      pageNum: currentPage,
      pageSize: pageSize,
      title: lineForm.title,
      startRate: lineForm.startRate,
      endRate: lineForm.endRate,
      startDate: lineForm.startDate,
      endDate: lineForm.endDate
    }
  })
}

export function insertRecord(addFrom) {
  return request({
    url: '/api/operation/notice/insert',
    method: 'post',
    data: addFrom
  })
}

export function updateRecord(addFrom) {
  return request({
    url: '/api/operation/notice/update',
    method: 'post',
    data: addFrom
  })
}

export function selectReader(currentPage, pageSize, noticeId, xm) {
  return request({
    url: '/api/operation/notice/getReader',
    method: 'get',
    params: {
      pageNum: currentPage,
      pageSize: pageSize,
      noticeId: noticeId,
      xm: xm
    }
  })
}

export function stick(guid) {
  return request({
    url: '/api/operation/notice/stick',
    method: 'get',
    params: {
      noticeId: guid
    }
  })
}


export function removeFile(file) {
  return request({
    url: '/api/operation/notice/removeFile',
    method: 'post',
    data: file
  })
}

export function uploadFile(fileData) {
  return request({
    url: '/api/operation/notice/upload',
    method: 'post',
    contentType: false,
    data: fileData,
    dataType: 'json'
  })
}

export function nameSplice(arr) {
  var str = ''
  for (var j = 0, len = arr.length; j < len; j++) {
    str = str + arr[j].name + ';'
  }
  return str
}

export function userIdSplice(arr) {
  var str = ''
  for (var j = 0, len = arr.length; j < len; j++) {
    str = str + arr[j].id + '-'
  }
  return str
}

export function traverse(list) {
  var arr = []
  for (var j = 0, len = list.length; j < len; j++) {
    if (list[j].nodeType == 0) {
      arr.push(list[j])
    }
  }
  return arr
}
