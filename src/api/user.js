import Request from '@/utils/request';

export function getCaptcha(data) {
  return Request.get('/api/user/captcha', data);
}

export function login(data) {
  return Request.post('/api/user/login', data);
}

export function changeThemeReq(data) {
  return Request.post('/user/theme', data);
}

export function getInfo() {
  return Request.post('/api/user/userInfo');
}

export function logout() {
  return Request.post('/api/user/logout');
}

export function setAvator(data) {
  return Request.post('/api/user/setAvator', data);
}

export function changePassword(data) {
  return Request.post('/api/user/changePassword', data);
}
