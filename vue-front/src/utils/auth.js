// 设置获取token工具,用于验证是否已登录
import Cookies from 'js-cookie'

const LoginKey = 'hasLogin'

export function getToken() {
  return Cookies.get(LoginKey);
}

export function setToken() {
  return Cookies.set(LoginKey, "1")
}

export function removeToken() {
  return Cookies.remove(LoginKey)
}
