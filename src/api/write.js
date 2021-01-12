import Request from '@/utils/request';

export function tags() {
  return Request.post('/api/tag/artSearch');
}

export function category(data) {
  return Request.post('/api/category/artSearch', data);
}

export function detail(data) {
  return Request.post('/api/articles/detail', data);
}

export function add(data) {
  return Request.post('/api/articles/add', data);
}

export function edit(data) {
  return Request.post('/article/edit', data);
}
