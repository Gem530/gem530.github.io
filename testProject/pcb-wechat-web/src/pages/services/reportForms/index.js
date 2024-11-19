import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {reportForms: {projectReportHeard, getProjectReportThirtyExcel, projectDailyReportLine, capacityAuditStatistics,handleStatistics, getProductionReportTop, productionArea, scrapArea, productionException, deptCapacity, getProductionReportBottom, detailStatistics,craftStatistics,supplierStatistics, capacityCount, capacityCountByDept, capacityCountByPersonal, capacityCountByCraft, capacityReportByDept}}} = config;

// 工程报表-头部 开始时间 queryDayStart  结束时间 queryDayEnd
export const projectReportHeardAPI = (params) => {
    return request.get(projectReportHeard, params, true);
}

// 工程报表--MI异常数据统计--默认统计近30天的数据(今天加前29天)
export const getProjectReportThirtyExcelAPI = (params) => {
    return request.get(getProjectReportThirtyExcel, params, true);
}

// 工程报表日周月趋势----同工程日报
// queryDay(Date),会查询当天的日报数据,不填则默认查今天
// type : 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
// layer : 查询板数,不填默认 1(单层板)
// dateType: 数据类型,不填默认3绩效 ASSIGN("1","分配"),
// FINISHED("2","完成"),
// ACHIEVEMENT("3","绩效"),
export const projectDailyReportLineAPI = (params) => {
    return request.get(projectDailyReportLine, params, true);
}

// 待处理业务统计-个人产能上报审核统计
export const getCapacityAuditStatisticsAPI = (params) => {
  return request.get(capacityAuditStatistics, params, true);
}

// 待处理业务统计-物料采购受理统计
export const getHandleStatisticsAPI = (params) => {
  return request.get(handleStatistics, params, true);
}

// 生产报表-头部-时间筛选影响 queryDayStart queryDayEnd (格式: yyyy-MM-dd HH:mm:ss)
export const getProductionReportTopAPI = (params) => {
  return request.get(getProductionReportTop, params, true);
}

// 生产面积
export const productionAreaAPI = (params) => {
  return request.get(productionArea, params, true);
}

// 报废面积
export const scrapAreaAPI = (params) => {
  return request.get(scrapArea, params, true);
}

// 排产过数异常统计
export const productionExceptionAPI = (params) => {
  return request.get(productionException, params, true);
}

// 部门产能上报数据统计
export const deptCapacityAPI = (params) => {
  return request.get(deptCapacity, params, true);
}

// 生产报表-底部-不受时间筛选影响
export const getProductionReportBottomAPI = (params) => {
  return request.get(getProductionReportBottom, params, true);
}

// 采购报表-物料物料明细统计
export const getDetailStatisticsAPI = (params) => {
  return request.get(detailStatistics, params, true);
}

// 工序外协报表-工艺统计
export const getCraftStatisticsAPI = (params) => {
  return request.get(craftStatistics, params, true);
}

// 工序外协报表-按供应商统计
export const getSupplierStatisticsAPI = (params) => {
  return request.get(supplierStatistics, params, true);
}

// 审核未审核汇总接口
export const capacityCountAPI = (params) => {
  return request.postJson(capacityCount, params, true);
}

// 按照部门查询接口
export const capacityCountByDeptAPI = (params) => {
  return request.postJson(capacityCountByDept, params, true);
}

// 按照个人
export const capacityCountByPersonalAPI = (params) => {
  return request.postJson(capacityCountByPersonal, params, true);
}

// 按照工艺
export const capacityCountByCraftAPI = (params) => {
  return request.postJson(capacityCountByCraft, params, true);
}

// 图表统计接口
export const capacityReportByDeptAPI = (params) => {
  return request.postJson(capacityReportByDept, params, true);
}