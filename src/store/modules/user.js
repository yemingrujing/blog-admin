import { login, logout, getInfo, changeThemeReq } from '@/api/user';
import { setToken, removeToken } from '@/utils/auth';
import router, { resetRouter } from '@/router';
import md5 from 'md5';
import { userInfo, dispathUserInfo } from '@/utils/storeControl';
import { Message } from 'element-ui';
import defaultSettings from '@/settings';

const state = {
  userName: '',
  avatar: '',
  theme: defaultSettings.theme,
  id: '',
  nickName: '',
  email: '',
  remark: '',
  roles: []
};

const mutations = {
  SET_ID: (state, id) => {
    state.id = id;
  },
  SET_NAME: (state, userName) => {
    state.userName = userName;
  },
  SET_THEME: (state, theme) => {
    state.theme = theme;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_NICKNAME: (state, nickName) => {
    state.nickName = nickName;
  },
  SET_EMAIL: (state, email) => {
    state.email = email;
  },
  SET_REMARK: (state, remark) => {
    state.remark = remark;
  }
};

const actions = {
  setRoles({ commit }, data) {
    commit('SET_ROLES', data);
  },
  setName({ commit }, data) {
    commit('SET_NAME', data);
  },

  login({ commit }, userInfo) {
    const { username, password, captcha } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username, password: md5(password), captcha }).then(response => {
        const { avatar, id, userName, theme, token, nickName, userEmail, remark } = response;
        setToken(token);
        commit('SET_ID', id);
        commit('SET_NAME', userName);
        commit('SET_AVATAR', avatar);
        commit('SET_THEME', theme);
        commit('SET_NICKNAME', nickName);
        commit('SET_EMAIL', userEmail);
        commit('SET_REMARK', remark);
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const response = userInfo();
      if (response) {
        dispathUserInfo(response.roles, commit, reject, resolve);
      } else {
        getInfo().then(res => {
          if (res.length > 0) {
            const children = [];
            const list = [];
            const hash = {};
            res.map(item => {
              const i = { ...item };
              if (i.type === 1) {
                children.push(i);
              } else {
                i.list = [];
                list.push(i);
                hash[i.id] = list.length - 1;
              }
            });
            children.map(i => {
              list[hash[i.parentId]].list.push(i);
            });
            dispathUserInfo(list, commit, reject, resolve);
            resolve(list);
          } else {
            resolve({ code: 0 });
            Message.error('您的账号暂无权限,请联系管理员');
          }
        });
      }
    });
  },

  clearUser({ commit }) {
    commit('SET_ID', '');
    commit('SET_THEME', defaultSettings.theme);
    commit('SET_ROLES', []);
    commit('SET_NAME', '');
    commit('SET_AVATAR', '');
    commit('SET_NICKNAME', '');
    commit('SET_EMAIL', '');
    commit('SET_REMARK', '');
    sessionStorage.clear();
  },
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken();
        resetRouter();
        dispatch('tagsView/delAllViews', null, { root: true });
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  changeTheme({ commit, state }, theme) {
    return new Promise((resolve, reject) => {
      changeThemeReq({ theme, id: state.id }).then(() => {
        commit('SET_THEME', theme);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const { roles } = await dispatch('getInfo');

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true });

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
