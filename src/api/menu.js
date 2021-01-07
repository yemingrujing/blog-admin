import Request from '@/utils/request';

export function menu(type, data) {
  return Request.post('/api/menu/' + type, data);
}

export function types(data) {
  return Request.post('/menu/search/types', data);
}

export function del(id, data) {
  return Request.post('/api/menu/del', data);
}
