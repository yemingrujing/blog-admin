import Request from '@/utils/request';

export function search(data) {
  return Request.post('/api/poem/search', data);
}

export function add(data) {
  return Request.post('/api/poem/add', data);
}

export function edit(data) {
  return Request.post('/api/poem/edit', data);
}

export function del(data) {
  return Request.post('/api/poem/del', data);
}
