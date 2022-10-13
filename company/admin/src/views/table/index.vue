<template>
  <div>
    <h2>表格</h2>
    <g-form
      ref="GFormRef"
      label-width="100px"
      :rules="state.rules"
      :formList="state.formList"
      @search="search">
      <template #make-btn>
        <el-button @click="delLog" type="primary">删除</el-button>
      </template>
    </g-form>

    <g-table
      :total="total"
      :data="tableData"
      :columns="columns"
      v-model:page="state.formData.pageIndex"
      v-model:pageSize="state.formData.pageSize"
      @pagination="getList"
      @selectionChange="selectionChange">
      <template #column-status="scope">{{scope.row.status == 0 ? '正常' : '异常'}}</template>
      <template #table-column-make>
        <el-table-column fixed="right" label="操作" align="center">
          <template #="scope"><el-button @click="editData(scope.row)">编辑</el-button></template>
        </el-table-column>
      </template>
    </g-table>

    <g-modal-form
      title="编辑"
      ref="modalFormRef"
      v-model:show="state.show"
      :rules="state.dialogRules"
      :formList="state.dialogFormList"
      @confirm="confirm"
    ></g-modal-form>
  </div>
</template>

<script lang="ts" setup name="table-vue">
import { sysLogAPI, delSysLogAPI } from '@/api/other'
import {
  ref,
  watch,
  reactive,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

const GFormRef = ref()
const modalFormRef = ref()
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any

const tableData = ref([])
const columns: any[] = [
  { sort: 1, attrs: {align:'center',type: 'selection'} },
  { sort: 2, attrs: {align:'center',width: ''}, type: 'operId', label: `日志编号` },
  { sort: 3, attrs: {align:'center',width: ''}, type: 'title', label: `系统模块` },
  { sort: 4, attrs: {align:'center',width: ''}, type: 'businessType', label: `操作类型` },
  { sort: 5, attrs: {align:'center',width: ''}, type: 'requestMethod', label: `请求方式` },
  { sort: 6, attrs: {align:'center',width: ''}, type: 'operName', label: `操作人员` },
  { sort: 6, attrs: {align:'center',width: ''}, type: 'operIp', label: `操作地址` },
  { sort: 9, attrs: {align:'center',width: ''}, type: 'status', label: `操作状态` },
  { sort: 8, attrs: {align:'center',width: '',sortable:true}, type: 'operTime', label: `操作日期` },
  { sort: 8, slot: 'make' },
]

const total = ref(0)
const state = reactive({
  rules: {},
  show: false,
  formList: [
    {
      col: 8,
      value: '',
      type: 'input',
      prop: 'title',
      label: '系统模块',
      attrs: {
        type: 'text',
        clearable: true,
        placeholder: '请输入系统模块',
        'onkeyup': (event: KeyboardEvent) => keyUpSearch(event)
      }
    },
    {
      col: 8,
      value: '',
      type: 'input',
      prop: 'operName',
      label: '操作人员',
      attrs: {
        type: 'text',
        clearable: true,
        placeholder: '请输入操作人员',
        'onkeyup': (event: KeyboardEvent) => keyUpSearch(event)
      }
    },
    // {
    //   col: 8,
    //   type: 'select',
    //   value: undefined,
    //   label: '类型',
    //   prop: 'businessType',
    //   attrs: {
    //     clearable: true,
    //     placeholder: '操作类型',
    //     'onChange': () => changeSearch()
    //   },
    //   data: [{}]
    // },
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
      data: [{ label: '正常', value: 0 }, { label: '异常', value: 1 }]
    },
    {
      col: 8,
      type: 'date',
      label: '操作时间',
      prop: 'datetime',
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
      col: 8,
      type: 'btn',
      btn: {
        search: true,
        searchName: '搜索',
        reset: true,
        resetName: '重置'
      }
    }
  ],
  formData: {
    pageSize: 10,
    pageIndex: 1,
    title: undefined, // 模块标题
    status: undefined, // 操作状态（0正常 1异常）
    endTime: undefined, // 结束时间
    operName: undefined, // 操作人员名称
    startTime: undefined, // 开始时间
  },
  oprtIdList: [],
  dialogRules: {
    operId: [{ required: true, message: '请输入日志编号', trigger: 'blur' }]
  },
  dialogFormList: [
    {
      value: '11',
      type: 'input',
      prop: 'operId',
      label: '日志编号',
      attrs: {
        type: 'text',
        clearable: true,
      }
    },
    {
      value: '22',
      type: 'input',
      prop: 'title',
      label: '系统模块',
      attrs: {
        type: 'text',
        clearable: true,
      }
    },
  ]
})

const keyUpSearch = (event: KeyboardEvent) => {
  if (event.keyCode === 13) changeSearch()
}
const changeSearch = () => {
  GFormRef.value.searchHandle()
}

const search = (item: any) => {
  state.formData = {
    pageSize: 10,
    pageIndex: 1,
    title: item.title, // 模块标题
    status: item.status, // 操作状态（0正常 1异常）
    operName: item.operName, // 操作人员名称
    endTime: item.endDateRange, // 结束时间
    startTime: item.startDateRange // 开始时间
  }
  getList()
}

const getList = () => {
  // console.log('getList', val)
  proxy.$modal.loading()
  sysLogAPI(state.formData).then((res: any) => {
    proxy.$modal.closeLoading()
    if (res.code === 200) {
      total.value = res.data.total
      tableData.value = res.data.rows || []
    } else {
      proxy.$modal.message({ type: 'error', message: res.msg })
    }
  }).catch((err: Error) => {
    proxy.$modal.closeLoading()
    proxy.$modal.message({ type: 'error', message: err.message })
  })
}
getList()

const delLog = () => {
  if (!state.oprtIdList.length) {
    proxy.$modal.message({ type: 'error', message: '请选择删除的日志' })
    return
  }
  proxy.$modal.loading()
  delSysLogAPI(state.oprtIdList.join(',') as string).then((res: any) => {
    proxy.$modal.closeLoading()
    if (res.code === 200) {
      proxy.$modal.message({ type: 'success', message: '删除成功' })
      getList()
    } else {
      proxy.$modal.message({ type: 'error', message: res.msg })
    }
  }).catch((err: Error) => {
    proxy.$modal.closeLoading()
    proxy.$modal.message({ type: 'error', message: err.message })
  })
}

const selectionChange = (val: any) => {
  state.oprtIdList = val.map((v: any) => v.operId)
}

const editData = (v: any) => {
  // for (let k in v) {
  //   state.dialogFormList.forEach((item: any) => {
  //     if (item['prop'] === k) item['value'] = v[k]
  //   })
  // }
  modalFormRef.value.initModalData(v, '编辑')
  state.show = true
}

const confirm = (item: any) => {
  console.log(item)
  state.show = false
}
</script>