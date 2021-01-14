import Request from '@/utils/request';

export function list(data) {
  return Request.post('/api/gallery/search', data);
}

export function add(data) {
  return Request.post('/api/gallery/add', data);
}

export function edit(data) {
  return Request.post('/api/gallery/edit', data);
}

export function publish(data) {
  return Request.post('/api/gallery/switch', data);
}

export function del(data) {
  return Request.post('/api/gallery/del', data);
}
