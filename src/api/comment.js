import Request from '@/utils/request';

export function comments(data) {
  return Request.post('/api/comments/search', data);
}

export function add(data) {
  return Request.post('/api/comments/add', data);
}

export function status(data) {
  return Request.post('/comment/edit', data);
}

export function del(data) {
  return Request.post('/api/comments/del', data);
}
