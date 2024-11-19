// 运营日报初始
// type 1:小卡片 2:表格 3:图表
export const initOperate = [
    { type: 1, id: 1, title: '接单', field: 'field1', show: true },
    { type: 1, id: 2, title: '送货', field: 'field2', show: true },
    { type: 1, id: 3, title: '投料', field: 'field3', show: true },
    { type: 1, id: 4, title: '入库', field: 'field4', show: true },
    { type: 1, id: 9, title: '仅报价', field: 'field9', show: true },
    { type: 1, id: 11, title: '水电', field: 'field11', show: true },
    // { type: 3, id: 5, title: '接单图表', field: 'field5', show: true },
    { type: 3, id: 10, title: '客户下单前10', field: 'field10', show: true },
    { type: 2, id: 6, title: '订单数据', field: 'field6', show: true },
    // { type: 2, id: 7, title: '业务员数据', field: 'field7', show: true },
    { type: 3, id: 8, title: '接单图表', field: 'field8', show: true },
]

// 工程日报初始
// type 1:小卡片 2:表格 3:图表
export const initEngineerDaily = [
    { type: 1, id: 1, title: '待分配/待审核', field: 'field1', show: true },
    { type: 1, id: 2, title: '制作中/结存面积', field: 'field2', show: true },
    { type: 2, id: 3, title: '统计表', field: 'field3', show: true },
    { type: 3, id: 4, title: '趋势', field: 'field4', show: true },
]

// 市场日报初始
// type 1:小卡片 2:表格 3:图表 4:报表小卡片
export const initMarktDaily = [
    { type: 1, id: 1, title: '下单', field: 'field1', show: true },
    { type: 1, id: 2, title: '预投', field: 'field2', show: true },
    { type: 2, id: 3, title: '统计表', field: 'field3', show: true },
    // { type: 3, id: 4, title: '统计图', field: 'field4', show: true },
    { type: 3, id: 5, title: '下单图表', field: 'field5', show: true },
]

// 工程报表初始
// type 1:小卡片 2:表格 3:图表
export const initEngineerReport = [
    { type: 1, id: 1, title: '工程报表卡片', field: 'field1', show: true },
    { type: 3, id: 2, title: 'MI单异常数据统计', field: 'field2', show: true },
    { type: 3, id: 3, title: '工程绩效趋势', field: 'field3', show: true },
]

// 生产报表初始
// type 1:小卡片 2:表格 3:图表
export const initProdcutReport = [
    { type: 1, id: 1, title: '生产报表卡片', field: 'field1', show: true },
    { type: 3, id: 2, title: '排产过数异常统计', field: 'field2', show: true },
    { type: 3, id: 3, title: '部门产能上报数据统计', field: 'field3', show: true },
    { type: 1, id: 4, title: '工序结存总览', field: 'field4', show: true },
    { type: 3, id: 5, title: '工序结存分布', field: 'field5', show: true },
    { type: 3, id: 6, title: '工序交期情况分布', field: 'field6', show: true },
]

// 采购报表初始
// type 1:小卡片 2:表格 3:图表
export const initPurchaseReport = [
    { type: 1, id: 1, title: '采购报表卡片', field: 'field1', show: true },
    { type: 3, id: 2, title: '采购物料明细统计', field: 'field2', show: true },
]

// 工序外协报表初始
// type 1:小卡片 2:表格 3:图表
export const initOutSourceReport = [
    { type: 1, id: 1, title: '工序外协报表卡片', field: 'field1', show: true },
    { type: 3, id: 2, title: '工序外协总览', field: 'field2', show: true },
    { type: 3, id: 3, title: '供应商外协加工统计', field: 'field3', show: true },
]

// 待处理业务报表初始
// type 1:小卡片 2:表格 3:图表
export const initPedingReport = [
    { type: 1, id: 1, title: '待处理业务卡片', field: 'field1', show: true },
    { type: 3, id: 2, title: '个人产能上报审核统计', field: 'field2', show: true },
    { type: 3, id: 3, title: '物料采购受理统计', field: 'field3', show: true },
]

// 待处理业务报表初始
// type 1:小卡片 2:表格 3:图表
export const initCapacityReport = [
    { type: 1, id: 1, title: '已审', field: 'field1', show: true },
    { type: 1, id: 2, title: '未审', field: 'field2', show: true },
    { type: 2, id: 3, title: '部门产能上报统计', field: 'field3', show: true },
    { type: 2, id: 4, title: '个人上报统计', field: 'field4', show: true },
    { type: 2, id: 5, title: '工序上报统计', field: 'field5', show: true },
]