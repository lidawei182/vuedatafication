import request from '@/utils/request'

export function dataIntegration(data) {
  return request({
    url: '/admin/Index/dataIntegration',
    method: 'get',
    params: {data: data}
  })
}

export function mapIntegration(code) {
  return request({
    url: '/admin/Index/mapIntegration',
    method: 'post',
    data: {code: code}
  })
}

export function mapPositioning(query) {
  return request({
    url: '/admin/Index/mapPositioning',
    method: 'post',
    data: query
  })
}

export function getMapPositioning(query) {
  return request({
    url: '/admin/Index/getMapPositioning',
    method: 'post',
    data: query
  })
}

export function updateMapPg(query) {
  return request({
    url: '/admin/Index/updateMapPg',
    method: 'post',
    data: query
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

export function havePeopleList(query) {
  return request({
    url: '/admin/Index/havePeopleList',
    method: 'post',
    data: query
  })
}


