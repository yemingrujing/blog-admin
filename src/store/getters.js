const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  id: state => state.user.id,
  avatar: state => state.user.avatar,
  userName: state => state.user.userName,
  nickName: state => state.user.nickName,
  remark: state => state.user.remark,
  email: state => state.user.email,
  roles: state => state.user.roles,
  theme: state => state.user.theme,
  permission_routes: state => state.permission.routes
};
export default getters;
