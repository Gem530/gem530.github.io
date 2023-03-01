import { baseAPI, baseAPIType } from '@/api'
import {
  ref,
  reactive,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

export default function () {
  interface baseDataType {
    [k: string]: string
  }
  /* ---------------- 基础 start ---------------- */
  const baseData = ref<baseDataType>({
    tableUrl: '',
    tableMethod: 'get',

    getUrl: '',
    getMethod: 'get',

    addUrl: '',
    addMethod: 'post',

    editUrl: '',
    editMethod: 'put',

    delUrl: '',
    delMethod: 'delete',

    delMultiplepUrl: '',
    delMultiplepMethod: 'delete',

    dataStr: 'data'
  })

  const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
  const loadingTip = () => proxy.$modal.loading()
  const clossLoadingTip = () => proxy.$modal.closeLoading()
  const confirmTip = (val: string) => proxy.$modal.confirm(val)
  const errorTip = (val: string) => proxy.$modal.message({ type: 'error', message: val })
  const succesTip = (val: string) => proxy.$modal.message({ type: 'success', message: val })
  /* ---------------- 基础 start ---------------- */


  /* ---------------- 搜索表单 start ---------------- */
  const GFormRef = ref()
  const dealSearch = ref()

  // 搜索表单change搜索
  const changeSearch = () => {
    GFormRef.value.searchHandle()
  }

  // 搜索表单input-Enter键搜索
  const keyUpEnterSearch = (event: KeyboardEvent) => {
    if (event.keyCode === 13) changeSearch()
  }

  // 搜索事件
  const search = (val: any) => {
    formData.value = dealSearch.value ? dealSearch.value(val) : val
    tableData.pageIndex = 1
    getList()
  }
  /* ---------------- 搜索表单 end ---------------- */


  /* ---------------- 表格 start ---------------- */
  const tableRef = ref()
  const dealTable = ref()
  const formData = ref({}) // 搜索条件
  const tableData = reactive({ // 分页 以及 表格数据
    total: 0,
    pageSize: 10,
    pageIndex: 1,
    dataSource: [],
  })

  const initTable = (obj: Partial<baseDataType>) => {
    baseData.value = Object.assign(baseData.value, obj)
    getList()
  }

  const getList = () => {
    const req: baseAPIType<any> = {
      url: baseData.value.tableUrl,
      method: baseData.value.tableMethod
    }

    const tempData = {
      ...formData.value,
      pageSize: tableData.pageSize,
      pageIndex: tableData.pageIndex
    }
    baseData.value.tableMethod === 'get' ?
      (req.params = tempData) : (req.data = tempData)
    apiHandle(req, '', false, (res: any) => {
      dealTable.value && dealTable.value(res.data.rows)
      tableData.dataSource = res.data[baseData.value.dataStr] || []
      tableData.total = res.data.total || 0
    })
  }
  /* ---------------- 表格 end ---------------- */


  /* ---------------- 弹框表单 start ---------------- */
  const dealDialog = ref()
  const modalFormRef = ref()
  const typeDialog = ref('add') // add添加 edit创建
  const showDialog = ref(false)

  // 新增 显示弹框
  const addDialogOpen = (title: string = '新增') => {
    modalFormRef.value.initModalData('', title)
    showDialog.value = true
    typeDialog.value = 'add'
  }

  // 编辑 显示弹框
  const editDialogOpen = (id: number, title: string = '编辑') => {
    const req: baseAPIType<any> = {
      url: baseData.value.getUrl + id,
      method: baseData.value.getMethod
    }
    apiHandle(req, '', false, (res: any) => {
      modalFormRef.value.initModalData(res.data, title)
      showDialog.value = true
      typeDialog.value = 'edit'
    })
  }

  // 弹框确认事件
  const confirmDialog = (item: any) => {
    const confrimData = dealDialog.value ? dealDialog.value(item) : item
    addOrEditHandle(confrimData)
  }

  // 新增/编辑事件
  const addOrEditHandle = (val: any) => {
    const dialogUrl = typeDialog.value === 'add' ? baseData.value.addUrl : baseData.value.editUrl
    const dialogMethod = typeDialog.value === 'add' ? baseData.value.addMethod : baseData.value.editMethod
    
    const req: baseAPIType<any> = {
      url: dialogUrl,
      method: dialogMethod
    }

    dialogMethod === 'get' ? (req.params = val) : (req.data = val)
    apiHandle(req, (typeDialog.value === 'add' ? '新增' : '编辑') + '成功', true, () => {
      showDialog.value = false
    })
  }

  // 删除事件
  const delHandle = (id: number, text: string = 'id为') => {
    confirmTip(`确定删除${text}${id}的数据吗?`).then(() => {
      const req: baseAPIType<any> = {
        url: baseData.value.delUrl + id,
        method: baseData.value.delMethod
      }
      apiHandle(req, '删除成功', true)
    }).catch(() => {})
  }

  // 删除事件
  const delMultiplepHandle = (ids: number[], text: string = '') => {
    if (!ids?.length) {
      errorTip('请选择需要删除的数据')
      return
    }
    confirmTip(`确定删除${text}${ids}的数据吗?`).then(() => {
      const req: baseAPIType<any> = {
        url: baseData.value.delMultiplepUrl + ids,
        method: baseData.value.delMultiplepMethod
      }
      console.error('还没有接口:')
      console.error(req)
      // apiHandle(req, '删除成功', true)
    }).catch(() => {})
  }

  // 接口函数封装
  const apiHandle = (req: baseAPIType<any>, tips: string, get: boolean, callback?: Function) => {
    loadingTip()
    baseAPI(req).then((res: any) => {
      if (res.code === 200) {
        tips && succesTip(tips)
        get && getList()
        callback && callback(res)
      } else {
        errorTip(res.msg)
      }
    }).catch((err: Error) => {
      errorTip(err.message)
    }).finally(() => {
      clossLoadingTip()
    })
  }
  /* ---------------- 弹框表单 end ---------------- */

  return {
    baseData,
    GFormRef,
    tableRef,
    formData,
    dealTable,
    tableData,
    dealSearch,
    dealDialog,
    typeDialog,
    showDialog,
    modalFormRef,

    search,
    getList,
    errorTip,
    initTable,
    succesTip,
    apiHandle,
    delHandle,
    loadingTip,
    confirmTip,
    changeSearch,
    addDialogOpen,
    confirmDialog,
    editDialogOpen,
    addOrEditHandle,
    clossLoadingTip,
    keyUpEnterSearch,
    delMultiplepHandle,
  }
}