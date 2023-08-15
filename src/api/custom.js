import request from '@/utils/request'

export function getbanner() {
  return request({
    url: '/admin/Banner/getbanner',
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/admin/Banner/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/admin/Banner/del',
    method: 'get',
    params: { id }
  })
}