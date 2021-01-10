import Request from '@/utils/request';

export function search(data) {
  return Request.post('/api/category/search', data);
}

export function add(data) {
  return Request.post('/api/category/add', data);
}

export function edit(data) {
  return Request.post('/api/category/edit', data);
}

export function del(data) {
  return Request.post('/api/category/del', data);
}

export function belong(data) {
  return Request.post('/api/category/belong', data);
}
