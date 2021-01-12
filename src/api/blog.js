import Request from '@/utils/request';

export function list(data) {
  return Request.post('/api/articles/search', data);
}

export function del(data) {
  return Request.post('/api/articles/del', data);
}

export function publish(data) {
  return Request.post('/api/articles/publish', data);
}
