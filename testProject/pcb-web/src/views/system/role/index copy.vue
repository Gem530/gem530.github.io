<template>
  <div class="p-2 xtable-page">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="mb-[10px]" v-show="showSearch">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="queryParams.roleName" placeholder="请输入角色名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="权限字符" prop="roleKey">
              <el-input v-model="queryParams.roleKey" placeholder="请输入权限字符" clearable style="width: 240px" @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="角色状态" clearable style="width: 240px">
                <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                v-model="dateRange"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery" icon="Search">搜索</el-button>
              <el-button @click="resetQuery" icon="Refresh">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="hover" class="xtable-card">
      <template #header>
        <el-row :gutter="10" class="global-flex flex-end">
          <el-col :span="1.5">
            <el-button type="primary" plain @click="handleAdd()" icon="Plus" >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain @click="handleUpdate()" :disabled="single" icon="Edit" >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain :disabled="ids.length === 0" @click="handleDelete()" >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" >导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table ref="roleTableRef" v-loading="loading" :data="roleList" @selection-change="handleSelectionChange" height="100%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="roleId" width="120" v-if="false" />
        <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
        <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="200" />
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="260">
          <template #default="scope">
              <el-button link type="primary"  @click="handleUpdate(scope.row)" >修改</el-button>
              <el-button link type="primary"  @click="handleDelete(scope.row)" >删除</el-button>
              <el-button link type="primary"  @click="handleDataScope(scope.row)" >数据权限</el-button>
              <el-button link type="primary" @click="handleAuthUser(scope.row)" >分配用户</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="60%" >
      <el-form ref="roleFormRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <template #label>
            <span>
              <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-row>
          <el-col :span="12">
         
        <el-form-item label="PC端菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="小程序端菜单权限">
          <el-checkbox v-model="menuExpandXcx" @change="handleCheckedTreeExpandXcx($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAllXcx" @change="handleCheckedTreeNodeAllXcx($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictlyXcx" @change="handleCheckedTreeConnectXcx($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptionsXcx"
            show-checkbox
            ref="menuRefXcx"
            node-key="id"
            :check-strictly="!form.menuCheckStrictlyXcx"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        </el-col>
          </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="dialog.title" v-model="openDataScope" width="500px" >
      <el-form :model="form" label-width="80px" ref="dataScopeRef">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope === '2'">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="deptRef"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitDataScope">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Role" lang="ts">
import { addRole, changeRoleStatus, dataScope, delRole, getRole, listRole, updateRole, deptTreeSelect } from "@/api/system/role";
import { roleMenuTreeselect, treeselect as menuTreeselect ,treeselectXcx as xcxMenuTreeselect} from '@/api/system/menu/index';
import { RoleVO, RoleForm, RoleQuery, DeptTreeOption } from '@/api/system/role/types';
import { MenuTreeOption, RoleMenuTree } from '@/api/system/menu/types';

const router = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const buttonLoading = ref(false);
const roleList = ref<RoleVO[]>();
const loading = ref(true)
const showSearch = ref(true)
const ids = ref<Array<string | number>>([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const dateRange = ref<[DateModelType, DateModelType]>(['', ''])
const menuOptions = ref<MenuTreeOption[]>([])
const menuOptionsXcx = ref<MenuTreeOption[]>([])
const menuExpand = ref(false)
const menuExpandXcx = ref(false)
const menuNodeAll = ref(false)
const menuNodeAllXcx = ref(false)
const deptExpand = ref(true)
const deptNodeAll = ref(false)
const deptOptions = ref<DeptTreeOption[]>([])
const openDataScope = ref(false)

/** 数据范围选项*/
const dataScopeOptions = ref([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" }
])

const queryFormRef = ref<ElFormInstance>();
const roleFormRef = ref<ElFormInstance>();
const dataScopeRef = ref<ElFormInstance>();
const deptRef = ref<ElTreeInstance>();
const menuRef = ref<ElTreeInstance>();
const menuRefXcx = ref<ElTreeInstance>();

const initForm: RoleForm = {
  roleId: undefined,
  roleSort: 1,
  status: '0',
  roleName: '',
  roleKey: '',
  menuCheckStrictly: true,
  menuCheckStrictlyXcx: true,
  deptCheckStrictly: true,
  remark: '',
  dataScope: '1',
  menuIds: [],
  deptIds: [],
}

const data = reactive<PageData<RoleForm, RoleQuery>>({
  form: { ...initForm },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    roleName: '',
    roleKey: '',
    status: '',
  },
  rules: {
    roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
    roleKey: [{ required: true, message: "权限字符不能为空", trigger: "blur" }],
    roleSort: [{ required: true, message: "角色顺序不能为空", trigger: "blur" }]
  }
})
const { form, queryParams, rules } = toRefs(data)

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

/**
 * 查询角色列表
 */
const getList = () => {
  loading.value = true
  listRole(proxy?.addDateRange(queryParams.value, dateRange.value)).then(res => {
    roleList.value = res.rows
    total.value = res.total
    loading.value = false
  })
}

/**
 * 搜索按钮操作
 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置 */
const resetQuery = () => {
  dateRange.value = ['', '']
  queryFormRef.value?.resetFields();
  handleQuery();
}
/**删除按钮操作 */
const handleDelete = async (row?: RoleVO) => {
  const roleids = row?.roleId || ids.value;
  let names=roleList.value?.filter((item) => roleids.includes(item.roleId)).map((item) => item.roleName).join(",");
  
  await proxy?.$modal.confirm('是否确认删除角色名称为 "' + names + '" 的角色');
  proxy?.$modal.loading('加载中...');
  await delRole(roleids).finally(() => proxy?.$modal.closeLoading());
  getList();
  proxy?.$modal.msgSuccess('删除成功');
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download("system/role/export", {
    ...queryParams.value,
  }, `role_${new Date().getTime()}.xlsx`)
}
/** 多选框选中数据 */
const handleSelectionChange = (selection: RoleVO[]) => {
  ids.value = selection.map((item: RoleVO) => item.roleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 角色状态修改 */
const handleStatusChange = async (row: RoleVO) => {
  let text = row.status === "0" ? "启用" : "停用";
  try {
    await proxy?.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?');
    await changeRoleStatus(row.roleId, row.status);
    proxy?.$modal.msgSuccess(text + "成功");
  } catch {
    row.status = row.status === "0" ? "1" : "0";
  }
}

/** 分配用户 */
const handleAuthUser = (row: RoleVO) => {
  console.log(row);
  router.push(`/system/role-auth/user/${row.roleId}?name=${row.roleName}`);
}

/** 查询菜单树结构 */
const getMenuTreeselect = async () => {
  xcxMenuTreeselect().then((res) => {
    menuOptionsXcx.value = res.data;
  })
  const res = await menuTreeselect();
  menuOptions.value = res.data;
}
/** 所有部门节点数据 */
const getDeptAllCheckedKeys = (): any => {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value?.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value?.getHalfCheckedKeys();
  if (halfCheckedKeys) {
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  }
  return checkedKeys
}
/** 重置新增的表单以及其他数据  */
const reset = () => {
  menuRef.value?.setCheckedKeys([]);
  menuRefXcx.value?.setCheckedKeys([]);
  menuExpand.value = false
  menuNodeAll.value = false
  menuExpandXcx.value = false
  menuNodeAllXcx.value = false
  deptExpand.value = true
  deptNodeAll.value = false
  form.value = { ...initForm };
  roleFormRef.value?.resetFields();

}

/** 添加角色 */
const handleAdd = () => {
  reset();
  getMenuTreeselect();
  dialog.visible = true;
  dialog.title = "添加角色";
}
/** 修改角色 */
const handleUpdate = async (row?: RoleVO) => {
  reset();
  const roleId = row?.roleId || ids.value[0]
  const { data } = await getRole(roleId);
  Object.assign(form.value, data);
  // form.value.menuCheckStrictlyXcx = false;
  form.value.roleSort = Number(form.value.roleSort);
  const res = await getRoleMenuTreeselect(roleId);
  dialog.title = "修改角色";
  dialog.visible = true;
  res.checkedKeys.forEach((v) => {
    nextTick(() => {
      menuRef.value?.setChecked(v, true, false);
      menuRefXcx.value?.setChecked(v, true, false);
    })
  })

}
/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = (roleId: string | number) => {
  return roleMenuTreeselect(roleId).then((res): RoleMenuTree => {
    menuOptions.value = res.data.menus;
    menuOptionsXcx.value = res.data.menusXcx;
    return res.data;
  })
}
/** 根据角色ID查询部门树结构 */
const getRoleDeptTreeSelect = async (roleId: string | number) => {
  const res = await deptTreeSelect(roleId);
  deptOptions.value = res.data.depts;
  return res.data;
}
/** 树权限（展开/折叠）*/
const handleCheckedTreeExpand = (value: boolean, type: string) => {
  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (menuRef.value) {
        menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (deptRef.value) {
        deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  }
}
/** 树权限（展开/折叠）-小程序*/
const handleCheckedTreeExpandXcx = (value: boolean, type: string) => {
  if (type == "menu") {
    let treeList = menuOptionsXcx.value;
    for (let i = 0; i < treeList.length; i++) {
      if (menuRefXcx.value) {
        menuRefXcx.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (menuRefXcx.value) {
        menuRefXcx.value.store.nodesMap[treeList[i].id].expanded = value;
      }
    }
  }
}
/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value: any, type: string) => {
  if (type == "menu") {
    menuRef.value?.setCheckedNodes(value ? menuOptions.value as any : []);
  } else if (type == "dept") {
    deptRef.value?.setCheckedNodes(value ? deptOptions.value as any : []);
  }
}
/** 树权限（全选/全不选）-小程序 */
const handleCheckedTreeNodeAllXcx = (value: any, type: string) => {
  if (type == "menu") {
    menuRefXcx.value?.setCheckedNodes(value ? menuOptionsXcx.value as any : []);
  } else if (type == "dept") {
    deptRef.value?.setCheckedNodes(value ? deptOptions.value as any : []);
  }
}
/** 树权限（父子联动） */
const handleCheckedTreeConnect = (value: any, type: string) => {
  if (type == "menu") {
    form.value.menuCheckStrictly = value;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value;
  }
}
/** 树权限（父子联动）小程序 */
const handleCheckedTreeConnectXcx = (value: any, type: string) => {
  if (type == "menu") {
    form.value.menuCheckStrictlyXcx = value;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value;
  }
}
/** 所有菜单节点数据 */
const getMenuAllCheckedKeys = (): any => {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value?.getCheckedKeys();
  let checkedKeysXcx = menuRefXcx.value?.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value?.getHalfCheckedKeys();
  let halfCheckedKeysXcx = menuRefXcx.value?.getHalfCheckedKeys();
  if (halfCheckedKeys) {
    checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys);
  }
  if (halfCheckedKeysXcx) {
    checkedKeysXcx?.unshift.apply(checkedKeysXcx, halfCheckedKeysXcx);
  }
  checkedKeys?.push.apply(checkedKeys, checkedKeysXcx);
  return checkedKeys;
}
/** 提交按钮 */
const submitForm = () => {
  roleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      form.value.menuIds = getMenuAllCheckedKeys()
      buttonLoading.value = true;
      form.value.roleId ? await updateRole(form.value).finally(() => { buttonLoading.value = false; }) : await addRole(form.value).finally(() => { buttonLoading.value = false; });
      proxy?.$modal.msgSuccess("操作成功")
      dialog.visible = false
      getList()
    }
  })
}
/** 取消按钮 */
const cancel = () => {
  reset()
  dialog.visible = false;
}
/** 选择角色权限范围触发 */
const dataScopeSelectChange = (value: string) => {
  if (value !== "2") {
    deptRef.value?.setCheckedKeys([])
  }
}
/** 分配数据权限操作 */
const handleDataScope = async (row: RoleVO) => {
  const response = await getRole(row.roleId);
  Object.assign(form.value, response.data);
  const res = await getRoleDeptTreeSelect(row.roleId);
  openDataScope.value = true;
  dialog.title = "分配数据权限";
  await nextTick(() => {
    deptRef.value?.setCheckedKeys(res.checkedKeys);
  })
}
/** 提交按钮（数据权限） */
const submitDataScope = async () => {
  if (form.value.roleId) {
    form.value.deptIds = getDeptAllCheckedKeys();
    buttonLoading.value = true;
    await dataScope(form.value).finally(() => { buttonLoading.value = false; });
    proxy?.$modal.msgSuccess("修改成功");
    openDataScope.value = false;
    getList();
  }
}
/** 取消按钮（数据权限）*/
const cancelDataScope = () => {
  dataScopeRef.value?.resetFields();
  form.value = { ...initForm };
  openDataScope.value = false;
}

onMounted(() => {
  getList();
});
</script>
