import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/admin/user/index',
    method: 'post',
    data: query
  })
}

export function getinfo(id) {
  return request({
    url: '/admin/user/getinfo',
    method: 'get',
    params: { id }
  })
}

export function modify(data) {
  return request({
    url: '/admin/user/modify',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/admin/user/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/admin/user/del',
    method: 'get',
    params: { id }
  })
}

export function change(id, field, value) {
  const data = {
    val: id,
    field: field,
    value: value
  }
  return request({
    url: '/admin/user/change',
    method: 'post',
    data
  })
}

export function delAll(data) {
  return request({
    url: '/admin/user/delall',
    method: 'post',
    data
  })
}

export function changeAll(data) {
  return request({
    url: '/admin/user/changeall',
    method: 'post',
    data
  })
}