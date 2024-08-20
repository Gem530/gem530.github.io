import { to as tos } from 'await-to-js';
import axios from 'axios'// 路由拦截
import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';
import { isHttp } from '@/utils/validate';
import { isRelogin } from '@/utils/request';
// import modal from '@/plugins/modal';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import usePermissionStore from '@/store/modules/permission';

NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/register', '/social-callback'];

async function checkAppNewVersion(fn: Function) {
  let flag = true
  try {
    if (import.meta.env.VITE_APP_ENV == 'development') return
    const url = `/version.json?t=${Date.now()}`
    let res = null
    try {
      res = await axios.get(url)
    } catch (err) {
      console.error('checkAppNewVersion error: ', err)
    }
    if (!res) return
    const version = res.data.version
    const localVersion = localStorage.getItem('APP_VERSION')
    if (localVersion && localVersion !== version) {
      flag = false
      //  监测到系统更新，请点击确定刷新页面，如需保存数据，请点击取消，并保存数据
      const hNode = []
      ElMessageBox.confirm(h('p', null, [
        h('span', null, '监测到系统更新，请点击'),
        h('span', {style:'color:var(--el-color-primary);font-weight:600;'}, '确定'),
        h('span', null, '刷新页面，如需'),
        h('span', {style:'color:red;font-weight:600;'}, '保存'),
        h('span', null, '数据，请点击'),
        h('span', {style:'color:red;font-weight:600;'}, '取消'),
        h('span', null, '，并'),
        h('span', {style:'color:red;font-weight:600;'}, '保存'),
        h('span', null, '数据'),
      ]), '系统提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        fn && fn(version)
      }).catch(() => {})
    } else {
      localStorage.setItem('APP_VERSION', version)
    }
  } finally {
    return flag
  }
}

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const flag = await checkAppNewVersion((version: any) => {
    localStorage.setItem('APP_VERSION', version)
    window.location.href = to.fullPath
  })
  if (!flag) {
    next(false)
    NProgress.done();
    // return
  }
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title as string);
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else if (to.path.includes('/xcxEnter/')) {
      // 由于有后缀，所以从白名单拿出来单独放行
      next()
      NProgress.done();
    } else {
      if (useUserStore().roles.length === 0) {
        isRelogin.show = true;
        // 判断当前用户是否已拉取完user_info信息
        const [err] = await tos(useUserStore().getInfo());
        if (err) {
          await useUserStore().logout();
          ElMessage.error(err);
          next({ path: '/' });
        } else {
          isRelogin.show = false;
          const accessRoutes = await usePermissionStore().generateRoutes();
          // 根据roles权限生成可访问的路由表
          accessRoutes.forEach((route) => {
            if (!isHttp(route.path)) {
              router.addRoute(route); // 动态添加可访问路由表
            }
          }); 
          if (!useUserStore().roles.includes('superadmin')) {
            // 超级管理员允许所有菜单访问
            const isHasRoute = router.getRoutes().findIndex((v: any) => {
              v.path = v.path && v.path.includes('/:') ? v.path.split('/:')[0] : v.path
              return (v.path.includes('/system/user-auth/role') || v.path.includes('/system/role-auth/user') || v.path.includes('/tool/gen-edit/index')) && (to.path.includes('/system/user-auth/role') || to.path.includes('/system/role-auth/user') || to.path.includes('/tool/gen-edit/index')) && v.path && to.path.includes(v.path) ? true : (v.path == to.path)
            })
            if (isHasRoute == -1) {
              next({ path: '/' });
            }
          }
          next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
        }
      } else {
        if (!to.path.includes('/redirect')) {
          if (!useUserStore().roles.includes('superadmin')) {
            // 超级管理员允许所有菜单访问
            const isHasRoute = router.getRoutes().findIndex((v: any) => {
             v.path = v.path && v.path.includes('/:') ? v.path.split('/:')[0] : v.path
              return (v.path.includes('/system/user-auth/role') || v.path.includes('/system/role-auth/user') || v.path.includes('/tool/gen-edit/index')) && (to.path.includes('/system/user-auth/role') || to.path.includes('/system/role-auth/user') || to.path.includes('/tool/gen-edit/index')) && v.path && to.path.includes(v.path) ? true : (v.path == to.path)
        })
            if (isHasRoute == -1) {
              next({ path: '/' });
            }
          }
        }
        next();
      }
    }
  } else {
    console.log(to.path)
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else if (to.path.includes('/xcxEnter/')) {
      // 由于有后缀，所以从白名单拿出来单独放行
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
