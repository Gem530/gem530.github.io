import { to } from 'await-to-js';
import defAva from '@/assets/images/profile.jpg';
import store from '@/store';
import { getToken, removeToken, setToken } from '@/utils/auth';
import {login as loginApi, logout as logoutApi, getInfo as getUserInfo, scanCodeLogin as codeLogin} from '@/api/login';
import { LoginData } from '@/api/types';

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken());
  const name = ref('');
  const nickname = ref('');
  const userId = ref<string | number>('');
  const avatar = ref('');
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const permissions = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  const deptName = ref('');
  const deptId = ref('');
  const ownerId = ref<string | number>('');
  // 对账单供应商对象
  const supplier = ref<any>();

  /**
   * 登录
   * @param userInfo
   * @returns
   */
  const login = async (userInfo: LoginData): Promise<void> => {
    const [err, res] = await to(loginApi(userInfo));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  /**
   * 登录
   * @param userInfo
   * @returns
   */
  const scanCodeLogin = async (userInfo: LoginData): Promise<void> => {
    const [err, res] = await to(codeLogin(userInfo));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 更新token
  const setUserToken = async (token: any): Promise<void> => {
    token.value = getToken();
  };
  // 获取用户信息
  const getInfo = async (): Promise<void> => {
    const [err, res] = await to(getUserInfo());
    if (res) {
      const data = res.data;
      const user = data.user;
      const profile = user.avatar == '' || user.avatar == null ? defAva : user.avatar;

      if (data.roles && data.roles.length > 0) {
        // 验证返回的roles是否是一个非空数组
        roles.value = data.roles;
        permissions.value = data.permissions;
      } else {
        roles.value = ['ROLE_DEFAULT'];
      }
      name.value = user.userName;
      nickname.value = user.nickName;
      avatar.value = profile;
      userId.value = user.userId;
      deptName.value = user.dept?.deptName;
      deptId.value = user.deptId;
      ownerId.value = user.ownerId;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 注销
  const logout = async (): Promise<void> => {
    await logoutApi();
    token.value = '';
    roles.value = [];
    permissions.value = [];
    removeToken();
  };
  //设置供应商
  const setSupplier=async(obj:any)=>{
    supplier.value=obj;
  }


  return {
    name,
    userId,
    token,
    nickname,
    deptName,
    deptId,
    avatar,
    roles,
    permissions,
    ownerId,
    supplier,
    scanCodeLogin,
    login,
    getInfo,
    logout,
    setSupplier,
    setUserToken
  };
});

export default useUserStore;
// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
