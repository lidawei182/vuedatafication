import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    userName: username,
    password: password
  }
  return request({
    url: '/admin/login/index',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/admin/getuser',
    method: 'post'
  })
}

export function save(data) {
  return request({
    url: '/admin/login/save',
    method: 'post',
    data
  })
}

export function saveLogin(data) {
  return request({
    url: '/admin/login/saveLogin',
    method: 'post',
    data
  })
}

export function delfile(data) {
  return request({
    url: '/admin/login/delfile',
    method: 'post',
    data
  })
}
