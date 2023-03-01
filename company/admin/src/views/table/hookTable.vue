<template>
  <div>
    <h2>表格</h2>
    <g-form
      ref="GFormRef"
      label-width="100px"
      :formList="state.formList"
      @search="search">
      <!-- :rules="state.rules" -->
      <template #make-btn>
        <el-button @click="delMultiplepHandle(state.oprtIdList)" type="primary">删除</el-button>
        <el-button @click="addDialogOpen('新增字典')" type="primary">新增</el-button>
      </template>
    </g-form>

    <g-table
      ref="tableRef"
      :total="tableData.total"
      :data="tableData.dataSource"
      :columns="columns"
      v-model:page="tableData.pageIndex"
      v-model:pageSize="tableData.pageSize"
      @pagination="getList"
      @selectionChange="selectionChange">
      <template #column-status="scope">{{scope.row.status == 0 ? '正常' : '异常'}}</template>
      <template #table-column-make>
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button
              @click="editDialogOpen(scope.row.dictId, '编辑字典')"
            >编辑</el-button>
            <el-button
              @click="delHandle(scope.row.dictId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </template>
    </g-table>

    <g-modal-form
      title="编辑"
      ref="modalFormRef"
      v-model:show="showDialog"
      :rules="state.dialogRules"
      :formList="state.dialogFormList"
      @confirm="confirmDialog"
    ></g-modal-form>
  </div>
</template>

<script lang="ts" setup name="hook-table">
import {
  reactive,
} from 'vue'
import tableHook from '@/hooks/table'

const {
  GFormRef,
  tableRef,
  dealTable,
  tableData,
  dealSearch,
  dealDialog,
  showDialog,
  modalFormRef,

  search,
  getList,
  initTable,
  delHandle,
  changeSearch,
  addDialogOpen,
  confirmDialog,
  editDialogOpen,
  keyUpEnterSearch,
  delMultiplepHandle
} = tableHook()

const columns: any[] = [
  { visible: true, sort: 1, attrs: {align:'center',type: 'selection'} },
  { visible: true, sort: 2, attrs: {align:'center',width: ''}, type: 'dictId', label: `字典编号` },
  { visible: true, sort: 3, attrs: {align:'center',width: ''}, type: 'dictName', label: `字典名称` },
  { visible: true, sort: 4, attrs: {align:'center',width: ''}, type: 'dictType', label: `字典类型` },
  { visible: true, sort: 4, attrs: {align:'center',width: ''}, type: 'status', label: `状态` },
  { visible: true, sort: 5, attrs: {align:'center',width: ''}, type: 'remark', label: `备注` },
  { visible: true, sort: 6, attrs: {align:'center',width: ''}, type: 'createTime', label: `创建时间` },
  { visible: true, sort: 8, slot: 'make' },
]

const state = reactive({
  formList: [
    {
      col: 8,
      value: '',
      type: 'input',
      prop: 'dictName',
      label: '字典名称',
      attrs: {
        type: 'text',
        clearable: true,
        placeholder: '请输入字典名称',
        'onkeyup': (event: KeyboardEvent) => keyUpEnterSearch(event)
      }
    },
    {
      col: 8,
      value: '',
      type: 'input',
      prop: 'dictType',
      label: '字典类型',
      attrs: {
        type: 'text',
        clearable: true,
        placeholder: '请输入字典类型',
        'onkeyup': (event: KeyboardEvent) => keyUpEnterSearch(event)
      }
    },
    {
      col: 8,
      label: '状态',
      type: 'select',
      prop: 'status',
      value: undefined,
      attrs: {
        clearable: true,
        placeholder: '操作状态',
        'onChange': () => changeSearch()
      },
      data: [{ label: '正常', value: 0 }, { label: '停用', value: 1 }]
    },
    {
      col: 8,
      type: 'date',
      label: '创建时间',
      prop: 'dateRange',
      attrs: {
        type: 'daterange',
        clearable: true,
        rangeSeparator: "-",
        endPlaceholder: "结束时间",
        startPlaceholder: "开始时间",
        'onChange': () => changeSearch()
      }
    },
    {
      col: 12,
      type: 'btn',
      btn: {
        search: true,
        searchName: '搜索',
        reset: true,
        resetName: '重置'
      }
    }
  ], 
  oprtIdList: [],
  dialogRules: {
    dictName: [{ required: true, message: "字典名称不能为空", trigger: "blur" }],
    dictType: [{ required: true, message: "字典类型不能为空", trigger: "blur" }]
  },
  dialogFormList: [
    {
      type: 'input',
      prop: 'dictName',
      label: '字典名称',
      attrs: {
        type: 'text',
        clearable: true,
      }
    },
    {
      type: 'input',
      prop: 'dictType',
      label: '字典类型',
      attrs: {
        type: 'text',
        clearable: true,
      }
    },
    {
      value: '1',
      type: 'radio',
      prop: 'status',
      label: '状态',
      data: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }]
    },
    {
      type: 'input',
      prop: 'remark',
      label: '备注',
      attrs: {
        type: 'textarea',
      }
    },
  ]
})

const selectionChange = (val: any) => {
  state.oprtIdList = val.map((v: any) => v.dictId)
}

initTable({
  dataStr: 'rows',
  addUrl: '/system/dict/type',
  getUrl: '/system/dict/type/',
  editUrl: '/system/dict/type',
  delUrl: '/system/dict/type/',
  tableUrl: '/system/dict/type/page',
})

dealSearch.value = (v: any) => {
  // console.log(v)
  if (v.dateRange) {
    v.beginTime = v.dateRange[0]
    v.endTime = v.dateRange[1]
    v.dateRange = undefined
  }
  return v
}
</script>