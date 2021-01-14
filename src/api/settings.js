import Request from '@/utils/request';

export function list(data) {
  return Request.post('/api/system_config/search', data);
}

export function add(data) {
  return Request.post('/api/system_config/add', data);
}

export function edit(data) {
  return Request.post('/api/system_config/edit', data);
}
