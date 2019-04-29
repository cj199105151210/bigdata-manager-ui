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

export function setStick(addFrom) {
  return request({
    url: '/api/operation/notice/setStick',
    method: 'post',
    data: addFrom
  })
}

export function selectReader(readerCurrentPage, readerPageSize, noticeId, xm) {
  return request({
    url: '/api/operation/notice/getReader',
    method: 'get',
    params: {
      pageNum: readerCurrentPage,
      pageSize: readerPageSize,
      noticeId: noticeId,
      xm: xm
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

export function selectDetail(guid) {
  return request({
    url: '/api/operation/notice/selectDetail',
    method: 'get',
    params: {
      noticeId: guid
    }
  })
}

export function downLoad(file) {
  return request({
    url: '/api/operation/notice/downLoad',
    method: 'get',
    params:{
      name: file.name,
      fileName: file.fileName
    }
  })
}

// export function nameSplice(arr) {
//   var str = ''
//   for (var j = 0, len = arr.length; j < len; j++) {
//     str = str + arr[j].name + ';'
//   }
//   return str
// }

export function IdAndNameSplice(arr) {
  var str = ''
  for (var j = 0, len = arr.length; j < len; j++) {
    str = str + arr[j].id + ':' +arr[j].name+';'
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
