import Request from '@/utils/request';

export function list(data) {
  return Request.post('/api/users/search', data);
}

export function signup(data) {
  return Request.post('/api/users/add', data);
}

export function edit(data) {
  return Request.post('/api/users/edit', data);
}

export function onOff(data) {
  return Request.post('/api/users/onOff', data);
}

export function del(data) {
  return Request.post('/api/users/del', data);
}

export function getRoles(data) {
  return Request.post('/api/users/roles', data);
}

export function setAvator(data) {
  return Request.post('/api/users/set_avator', data);
}

export function changePassword(data) {
  return Request.post('/api/users/change_pwd', data);
}
