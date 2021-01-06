import Request from '@/utils/request';

export function list(data) {
  return Request.post('/api/role/search', data);
}

export function edit(data) {
  return Request.post('/api/role/edit', data);
}

export function del(data) {
  return Request.post('/api/role/del', data);
}

export function add(data) {
  return Request.post('/api/role/add', data);
}
