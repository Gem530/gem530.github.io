<template>
  <div class="p-2 app-main-content xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="mb-[10px]" v-show="showSearch">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="queryParams.menuName" placeholder="请输入菜单名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="hover" class="xtable-card">
    <el-tabs type="border-card" class="xtable-tab" style="width: 100%;">
        <el-tab-pane label="PC端">
      <!-- <template #header> -->
        <el-row :gutter="10" class="global-flex flex-end" >
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd(MenuSourceTypeEnum.PC)" >新增 </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="handleToggleExpandAll">展开/折叠</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      <!-- </template> -->

      <el-table height="100%"
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="menuTableRef"
        :default-expand-all="isExpandAll"
      >
        <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>




        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
              <el-button link type="primary"  @click="handleUpdate(scope.row,MenuSourceTypeEnum.PC)"  >修改</el-button>
              <el-button link type="primary"  @click="handleAdd(MenuSourceTypeEnum.PC,scope.row)"  >新增</el-button>
              <el-button link type="primary"  @click="handleDelete(scope.row)"  >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
   </el-tab-pane>
        <el-tab-pane label="小程序端">
            <el-row :gutter="10" class="global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd(MenuSourceTypeEnum.XCX)" >新增 </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="handleXcxToggleExpandAll">展开/折叠</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getXcxList"></right-toolbar>
        </el-row>
         <el-table height="100%"
        v-loading="loading"
        :data="xcxMenuList"
        row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        ref="xcxMenuTableRef"
        :default-expand-all="isXcxExpandAll"
      >
        <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template #default="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>




        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
              <el-button link type="primary"  @click="handleUpdate(scope.row,MenuSourceTypeEnum.XCX)"  >修改</el-button>
              <el-button link type="primary"  @click="handleAdd(MenuSourceTypeEnum.XCX,scope.row)"  >新增</el-button>
              <el-button link type="primary"  @click="handleDelete(scope.row)"  >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
 </el-tab-pane>
      </el-tabs>

    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" destroy-on-close width="750px">
      <el-form ref="menuFormRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <el-tree-select
                v-model="form.parentId"
                :data="menuOptions"
                :props="{ value: 'menuId', label: 'menuName', children: 'children' }"
                value-key="menuId"
                placeholder="选择上级菜单"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType !== 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <!-- 图标选择器 -->
              <icon-select v-if="dialog.title?.includes('PC端')" v-model="form.icon" />
              <el-input v-else v-model="form.icon" clearable placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon> </el-tooltip
                  >是否外链
                </span>
              </template>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType === 'C'">
            <el-form-item prop="component">
              <template #label>
                <span>
                  <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'M'">
            <el-form-item>
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <template #label>
                <span>
                  <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                  权限字符
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType === 'C'">
            <el-form-item>
              <el-input v-model="form.queryParam" placeholder="请输入路由参数" maxlength="255" />
              <template #label>
                <span>
                  <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType === 'C'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType !== 'F'">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="form.visible">
                <el-radio v-for="dict in sys_show_hide" :key="dict.value" :label="dict.value">{{ dict.label }} </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <template #label>
                <span>
                  <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                    <el-icon>
                      <question-filled />
                    </el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Menu" lang="ts">
import { addMenu, delMenu, getMenu, listMenu, updateMenu, xcxListMenu } from '@/api/system/menu';
import { MenuForm, MenuQuery, MenuVO } from '@/api/system/menu/types';
import { MenuTypeEnum } from '@/enums/MenuTypeEnum';
//菜单类型枚举 1pc 2小程序
import { MenuSourceTypeEnum } from '@/enums/MenuSourceTypeEnum';

interface MenuOptionsType {
  menuId: number;
  menuName: string;
  children: MenuOptionsType[] | undefined;
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { sys_show_hide, sys_normal_disable } = toRefs<any>(proxy?.useDict("sys_show_hide", "sys_normal_disable"));

const menuList = ref<MenuVO[]>([])
const xcxMenuList = ref<MenuVO[]>([])
const loading = ref(true)
const showSearch = ref(true)
const menuOptions = ref<MenuOptionsType[]>([])
const isExpandAll = ref(false)
const isXcxExpandAll = ref(false)
const buttonLoading = ref(false)

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const queryFormRef = ref<ElFormInstance>();
const menuFormRef = ref<ElFormInstance>();
const initFormData = {
  path: '',
  menuId: undefined,
  parentId: 0,
  menuName: '',
  icon: '',
  menuType: MenuTypeEnum.M,
  orderNum: 1,
  isFrame: "1",
  isCache: "0",
  visible: "0",
  status: "0"
}
const data = reactive<PageData<MenuForm, MenuQuery>>({
  form: { ...initFormData },
  queryParams: {
    menuName: undefined,
    status: undefined
  },
  rules: {
    menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
    path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
  },
})

const menuTableRef = ref<ElTableInstance>();
const xcxMenuTableRef = ref<ElTableInstance>();

const { queryParams, form, rules } = toRefs<PageData<MenuForm, MenuQuery>>(data)
/** 查询菜单列表 */
const getList = async () => {
  loading.value = true
  const res = await listMenu(queryParams.value);
  const data = proxy?.handleTree<MenuVO>(res.data, "menuId")
  if (data) {
    menuList.value = data
  }
  loading.value = false
}
const getXcxList = async () => {
  loading.value = true
  const res = await xcxListMenu(queryParams.value);
  const data = proxy?.handleTree<MenuVO>(res.data, "menuId")
  if (data) {
    xcxMenuList.value = data
  }
  loading.value = false
}
/** 查询菜单下拉树结构 */
const getTreeselect = async (type?:MenuSourceTypeEnum) => {

  //判断选择的是PC端还是小程序端
  menuOptions.value = []
  const response = ref<any>();
  if(MenuSourceTypeEnum.XCX===type){
    await xcxListMenu().then((res) => {
      response.value = res.data;
    });
  }else{
    await listMenu().then((res) => {
      response.value = res.data;
    });
}

  const menu: MenuOptionsType = { menuId: 0, menuName: "主类目", children: [] }
  menu.children = proxy?.handleTree<MenuOptionsType>(response.value, "menuId")
  menuOptions.value.push(menu)
}
/** 取消按钮 */
const cancel = () => {
  reset()
  dialog.visible = false
}
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  menuFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
  getXcxList();
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}
/** 新增按钮操作 */
const handleAdd = (type:MenuSourceTypeEnum,row?: MenuVO) => {
  reset();
  getTreeselect(type);
  row && row.menuId ? form.value.parentId = row.menuId : form.value.parentId = 0;
  row ? form.value.sourceType = row.sourceType : form.value.sourceType = type;
  if(type===MenuSourceTypeEnum.XCX){
    dialog.title = "添加小程序端菜单";
  }else{
    dialog.title = "添加PC端菜单";
  }
  
  dialog.visible = true;
  
}
/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(menuList.value, isExpandAll.value)
}
/** 展开/折叠操作-小程序 */
const handleXcxToggleExpandAll = () => {
  isXcxExpandAll.value = !isXcxExpandAll.value;
  xcxToggleExpandAll(xcxMenuList.value, isXcxExpandAll.value)
}
/** 展开/折叠所有 */
const toggleExpandAll = (data: MenuVO[], status: boolean) => {
  data.forEach((item: MenuVO) => {
    menuTableRef.value?.toggleRowExpansion(item, status)
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status)
  })
}
/** 展开/折叠所有-小程序 */
const xcxToggleExpandAll = (data: MenuVO[], status: boolean) => {
  data.forEach((item: MenuVO) => {
    xcxMenuTableRef.value?.toggleRowExpansion(item, status)
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status)
  })
}
/** 修改按钮操作 */
const handleUpdate = async (row: MenuVO,type:MenuSourceTypeEnum) => {
  reset();
  await getTreeselect(type);
  if (row.menuId) {
    const { data } = await getMenu(row.menuId);
    form.value = data;
  }
  dialog.visible = true;
  dialog.title = (type===MenuSourceTypeEnum.XCX?"小程序端":"PC端")+"修改菜单";
}
/** 提交按钮 */
const submitForm = () => {
  menuFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;

      form.value.menuId ? await updateMenu(form.value).finally(() => { buttonLoading.value = false; }) : await addMenu(form.value).finally(() => { buttonLoading.value = false; });
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      getXcxList();
      await getList();
    }
  })
}
/** 删除按钮操作 */
const handleDelete = async (row: MenuVO) => {
  await proxy?.$modal.confirm('是否确认删除名称为"' + row.menuName + '"的数据项?');
  proxy?.$modal.loading('加载中...');
  await delMenu(row.menuId).finally(() => proxy?.$modal.closeLoading());
  getXcxList();
  await getList();
  proxy?.$modal.msgSuccess("删除成功");
}

onMounted(() => {
  getList();
  getXcxList();
});
</script>
