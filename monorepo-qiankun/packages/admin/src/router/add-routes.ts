import layout from "@/layout/index.vue";
import { defineAsyncComponent } from "vue";
import router from "./index";
const modules = import.meta.glob("../views/**/**.vue");

// 公共路由表
const publicRoutes = [{
  path: '/admin/home',
  // component: () => import(/* webpackChunkName: "home" */ '@/views/index.vue'),
  component: 'index',
  name: 'home121',
  meta: { title: '首页', icon: 'House', affix: true }
}]

// 递归处理菜单
function filterAddRoutes(routes:any, parentName:any=null) {
  for (const route of routes) {
    if (!route["component"] || route["component"] === "Layout") {
      route["component"] = layout;
      router.addRoute(route);
    } else {
      // route["component"] = loadView(route.component)  会产生路由警告
      // 此方式解决vue-router警告
      route["component"] = modules[`../views/${route.component}.vue`];
      // route["path"] = (route.path.indexOf('/') === 0 ? route.path : "/" + route.path);
      route["path"] = route.path;
      router.addRoute(parentName, route);
    }

    if (!route.children || route.children.length === 0) continue;
    filterAddRoutes(route.children, route.name);
  }
  return routes;
}

const rootRouter = [{
  path: '/admin',
  name: 'Admin',
  children: []
}]

const handleFormat = (menu: any) => {
  menu.forEach((item: any) => {
    item.path = "/admin/" + item.path;
    if (item.children && item.children.length != 0) {
      handleFormat(item.children);
    }
  });
};

// 返回完整路由
export function getAddRoutes(routes:any) {
  handleFormat(routes)
  // rootRouter[0].children = routes
  rootRouter[0].children = [...publicRoutes, ...routes] as any
  // console.log('rootRouter',rootRouter)
  let addRouteData = filterAddRoutes(rootRouter);
  // addRouteData[0].children.unshift(...publicRoutes);
  // console.log(addRouteData)
  return addRouteData;
}

/**
 * 路由懒加载 拼接
 * @param view
 * @returns {function(): *}
 */
export const loadView = (view:string) => {
  // 这里需要注意一下 vite+vue3 要用 defineAsyncComponent 才能拼接成功 不然会一直报错找不到模块  加上/* @vite-ignore */ 可以不显示警告
  return () =>
    defineAsyncComponent(() =>
      import(/* @vite-ignore */ `/src/views/${view}.vue`)
    );
};
