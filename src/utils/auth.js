import Cookies from 'js-cookie'

const Access_Token = 'access_token' //存储toke  
const Refresh_Token = 'refresh_token' //刷新 toke 

/** 获取token */
export function getToken(token) {
  return Cookies.get(token)
}
/** 设置token */
export function setToken(name,token) {
  return Cookies.set(name, token)
}

/** 移除token */
export function removeToken() {
  return Cookies.remove(Access_Token,Refresh_Token)
}
