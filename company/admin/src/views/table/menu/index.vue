<template>
  <div>
    <h2>菜单管理</h2>
    <el-button @click="state.show = true">新增</el-button>
    <el-button @click="toggle">{{isExpandAll ? '展开' : '折叠'}}</el-button>
    <g-table
      hidePage
      v-if="expand"
      row-key="menuId"
      :data="tableData"
      :columns="columns"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <template #column-status="scope">{{scope.row.status == 0 ? '正常' : '停用'}}</template>
      <template #column-icon="scope">{{scope.row.icon === '#' ? '' : scope.row.icon}}</template>
      <template #table-column-make>
        <el-table-column fixed="right" label="操作" align="center">
          <template #="scope"><el-button @click="editData(scope.row)">编辑</el-button></template>
        </el-table-column>
      </template>
    </g-table>

    <g-modal-form
      title="菜单"
      v-model:show="state.show"
      :rules="state.dialogRules"
      :formList="state.dialogFormList"
      @confirm="confirm">
    </g-modal-form>
  </div>
</template>

<script lang="ts" setup name="menu-admin">
import { ref, reactive, nextTick } from 'vue'
import { handleTree } from '@/utils'
import { listMenu } from '@/api/other'

const expand = ref(true)
const isExpandAll = ref(false)
const tableData = ref<any[]>([])
const columns: any[] = [
  { sort: 2, attrs: {align:'left',width: ''}, type: 'menuName', label: `菜单名称` },
  { sort: 3, attrs: {align:'center',width: ''}, type: 'icon', label: `图标` },
  { sort: 4, attrs: {align:'center',width: ''}, type: 'orderNum', label: `排序` },
  { sort: 5, attrs: {align:'center',width: ''}, type: 'perms', label: `权限标识` },
  { sort: 6, attrs: {align:'center',width: ''}, type: 'component', label: `组件路径` },
  { sort: 6, attrs: {align:'center',width: ''}, type: 'status', label: `状态` },
  { sort: 9, attrs: {align:'center',width: ''}, type: 'createTime', label: `创建时间` },
  { sort: 8, slot: 'make' },
]
const state = reactive({
  show: false,
  dialogRules: {
    menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
    orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
    path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
  },
  dialogFormList: [
    {
      type: 'select',
      prop: 'parentId',
      label: '上级菜单',
      attrs: {
        clearable: true,
      },
      data: []
    },
    {
      type: 'radio',
      prop: 'menuType',
      label: '菜单类型',
      data: [
        { label: '目录', value: 'M' },
        { label: '菜单', value: 'C' },
        { label: '按钮', value: 'F' },
      ]
    },
    {
      type: 'slot',
      prop: 'icon',
      label: '菜单图标'
    },
    {
      type: 'input',
      prop: 'menuName',
      label: '菜单名称',
      attrs: {
        type: 'text'
      }
    },
    {
      type: 'number',
      prop: 'orderNum',
      label: '显示排序',
    },
    {
      type: 'radio',
      prop: 'isFrame',
      label: '是否外链',
      data: [
        { label: '是', value: 0 },
        { label: '否', value: 1 },
      ]
    },
    {
      type: 'input',
      prop: 'path',
      label: '路由地址',
      attrs: {
        type: 'text'
      }
    },
    {
      type: 'radio',
      prop: 'visible',
      label: '显示状态',
      data: [
        { label: '显示', value: 0 },
        { label: '隐藏', value: 1 },
      ]
    },
    {
      type: 'radio',
      prop: 'status',
      label: '菜单状态',
      data: [
        { label: '正常', value: 0 },
        { label: '停用', value: 1 },
      ]
    },
  ]
})

const listMenuAPI = () => {
  const params = {
    status: '',
    menuName: ''
  }
  listMenu(params).then((res: any) => {
    // console.log(res)
    const treeData = handleTree(res.data, 'menuId')
    // console.log(treeData)
    tableData.value = treeData
  }).catch((err: Error) => {
    console.log(err.message)
  })
}
listMenuAPI()

const toggle = () => {
  expand.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    expand.value = true
  })
}

const editData = (item: any) => {
  console.log(item)
}

const confirm = (item: any) => {
  console.log(item)
}
</script>