import Request from '@/utils/request';

export function search() {
  return Request.post('/api/report/search');
}

export function searchItem(data) {
  return Request.post('/api/report/item', data);
}

export function searchBlog() {
  return Request.post('/api/report/category');
}

export function searchCity() {
  return Request.post('/api/report/city');
}

