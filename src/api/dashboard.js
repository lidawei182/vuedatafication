import request from '@/utils/request'

export function dataIntegration(data) {
  return request({
    url: '/admin/Index/dataIntegration',
    method: 'get',
    params: {data: data}
  })
}

export function mapIntegration(jdno) {
  return request({
    url: '/admin/Index/mapIntegration',
    method: 'post',
    data: {jdno: jdno}
  })
}

export function dateCallsList(query) {
  return request({
    url: '/admin/Index/dateCallsList',
    method: 'post',
    data: query
  })
}

export function historyCallsList(query) {
  return request({
    url: '/admin/Index/historyCallsList',
    method: 'post',
    data: query
  })
}

export function getPeopleList(query) {
  return request({
    url: '/admin/Index/getPeopleList',
    method: 'post',
    data: query
  })
}



