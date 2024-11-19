<template>
	<!-- <div class="layout-search-dialog">1 -->
	  <!-- <el-dialog v-model="state.isShowSearch" destroy-on-close :show-close="false">
		<template #footer> -->
		  <el-autocomplete
			v-model="state.menuQuery"
			:fetch-suggestions="menuSearch"
			placeholder="搜索菜单"
			ref="layoutMenuAutocompleteRef"
			class="search-menu"
			:teleported="!props?.isCollapse"
			@select="onHandleSelect"
			>
			<!-- :fit-input-width="true" -->
			<template #prefix>
			  <svg-icon class-name="search-icon" icon-class="search" />
			</template>
			<template #default="{ item }">
			  <div>
				<svg-icon :icon-class="item.icon" class="mr5" />
				{{ item.title }}
			  </div>
			</template>
		  </el-autocomplete>
		<!-- </template>
	  </el-dialog> -->
	<!-- </div> -->
  </template>
  
  <script setup lang="ts" name="layoutBreadcrumbSearch">
  import { getNormalPath } from '@/utils/ruoyi';
  import { isHttp } from '@/utils/validate';
  import usePermissionStore from '@/store/modules/permission';
  import { RouteOption } from 'vue-router';
  type Router = Array<{
	  path: string;
	  icon: string;
	  title: string[];
  }>
  type SearchState<T = any> = {
	  isShowSearch: boolean;
	  menuQuery: string;
	  menuList: T[];
  };
  const emits = defineEmits(['closeMenuItem'])
  const props = defineProps({
	  isCollapse: {
		  type: Boolean
	  }
  })
  // 定义变量内容
  const layoutMenuAutocompleteRef = ref();
  const router = useRouter();
  const routes = computed(() => usePermissionStore().routes);
  const state = reactive<SearchState>({
	  isShowSearch: false,
	  menuQuery: '',
	  menuList: [],
  });
  
  onMounted(() => {
	  openSearch()
  })
  
  // 搜索弹窗打开
  const openSearch = () => {
	  state.menuQuery = '';
	  // state.isShowSearch = true;
	  state.menuList = generateRoutes(routes.value);
	  // nextTick(() => {
	  // 	setTimeout(() => {
	  // 		layoutMenuAutocompleteRef.value.focus();
	  // 	});
	  // });
  };
  // 搜索弹窗关闭
  const closeSearch = () => {
	  state.isShowSearch = false;
  };
  // 菜单搜索数据过滤
  const menuSearch = (queryString: string, cb: Function) => {
	  let options = state.menuList.filter((item) => {
		  return item.title.indexOf(queryString) > -1;
	  });
	  cb(options);
  };
  
  // Filter out the routes that can be displayed in the sidebar
  // And generate the internationalized title
  const generateRoutes = (routes: RouteOption[], basePath = '', prefixTitle: string[] = []) => {
	  let res: Router = []
	  routes.forEach(r => {
		  // skip hidden router
		  if (!r.hidden) {
			  const p = r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path;
				  const data: any = {
					  path: !isHttp(r.path) ? getNormalPath(basePath + p) : r.path,
					  icon: r.meta?.icon,
					  title: [...prefixTitle]
				  }
				  if (r.meta && r.meta.title) {
					  data.title = [...data.title, r.meta.title];
					  if (r.redirect !== 'noRedirect') {
						  // only push the routes with title
						  // special case: need to exclude parent router without redirect
			  res.push(data);
					  }
				  }
				  // recursive child routes
				  if (r.children) {
						  const tempRoutes = generateRoutes(r.children, data.path, data.title);
						  if (tempRoutes.length >= 1) {
								  res = [...res, ...tempRoutes];
						  }
				  }
		  }
	  })
	  res.forEach((item: any) => {
		  if (item.title instanceof Array) {
			  item.title = item.title.join('/');
		  }
	  });
	  return res;
  }
  // 当前菜单选中时
  const onHandleSelect = (val: any) => {
	  const paths = val.path;
	  if (isHttp(paths)) {
		  // http(s):// 路径新窗口打开
		  const pindex = paths.indexOf("http");
		  window.open(paths.substring(pindex, paths.length), "_blank");
	  } else {
		  router.push(paths);
	  }
	  state.menuQuery = ''
	  closeSearch();
	  emits('closeMenuItem')
  };
  
  // 暴露变量
  defineExpose({
	  openSearch
  });
  </script>
  
  <style lang="scss">
  // .layout-search-dialog {
  // 	position: relative;
  // 	:deep(.el-dialog) {
  // 		.el-dialog__header,
  // 		.el-dialog__body {
  // 			display: none;
  // 		}
  // 		.el-dialog__footer {
  // 			width: 100%;
  // 			position: absolute;
  // 			left: 50%;
  // 			transform: translateX(-50%);
  // 			top: -53vh;
  // 		}
  // 	}
  // 	:deep(.el-autocomplete) {
  // 		width: 560px;
  // 		position: absolute;
  // 		top: 150px;
  // 		left: 50%;
  // 		transform: translateX(-50%);
  // 	}
  // }
  .el-autocomplete {
	  &.search-menu {
		  background: transparent !important;
	  
		  .el-input {
			  .el-input__wrapper {
				  background: transparent !important;
  
				  .el-input__inner {
					  color: #fff;
				  }
			  }
		  }
	  }
  }
  </style>
  