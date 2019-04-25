const NotHanzi = function(value) {
  if (value.match(/[\u4e00-\u9fa5]/)) {
    return false
  } else if (value.match(/[^\x00-\xff]/)) {
    return false
  } else if (value.indexOf('') > 0) {
    return false
  } else if (value.match(/\s/)) {
    return false
  } else {
    return true
  }
}

const PrcId = function(value) {
  if ((/(^\d{15}$)|(^\d{17}([0-9])|X)$/).test(value)) {
    return true
  } else {
    return false
  }
}

const HKId = function(value) {
  if ((/^([A-Z]\d{6,10}(\(\w{1}\))?)$/).test(value)) {
    return true
  } else {
    return false
  }
}

const TWId = function(value) {
  if ((/^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/).test(value)) {
    return true
  } else {
    return false
  }
}

export { NotHanzi, PrcId, HKId, TWId }
