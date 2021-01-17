import Request from '@/utils/request';

export function search(data) {
  return Request.post('/api/images/search', data);
}

export function add(data) {
  return Request.post('/api/images/add', data);
}

export function publish(data) {
  return Request.post('/api/images/switch', data);
}

export function del(data) {
  return Request.post('/api/images/del', data);
}

export function findImagesList(data) {
  return Request.post('/api/images/findImagesList', data);
}

export function upload(data) {
  return Request.post('/api/uploads/images', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }, timeout: 30000
  });
}
