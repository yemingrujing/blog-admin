import Request from '@/utils/request';

export function search(data) {
  return Request.post('/api/tag/search', data);
}

export function add(data) {
  return Request.post('/api/tag/add', data);
}

export function edit(data) {
  return Request.post('/api/tag/edit', data);
}

export function del(data) {
  return Request.post('/api/tag/del', data);
}

export function belong(data) {
  return Request.post('/tags/belong', data);
}
