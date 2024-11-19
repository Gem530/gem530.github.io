import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {checkPlan: {
    checkPlanList,
    checkPlan,
    checkPlanDetailList,
    invalidList,
    checkPlanStart,
    delCheckPlanDetail,
    temporarySave,
    checkPlanCancel,
    checkPlanDetail,
    submitAudit,
    auditPost,
    checkPlanListCount,
    checkPlanDetailCount,
    listCategory,
    materialInventory,
}
}} = config;

// https://docs.qq.com/doc/DUHZlS3hkU3h4ZVRm
// 1.列表查询盘点单
export const checkPlanListAPI = (params) => {
    return request.get(checkPlanList, params, true);
}
// 查询盘点单详情
export const checkPlanAPI = (id) => {
    return request.get(checkPlan + id, {}, true);
}
// 查询明细列表
export const checkPlanDetailListAPI = (params) => {
    return request.postJson(checkPlanDetailList, params, true);
}
// 查询失效数据
export const invalidListAPI = (id) => {
    return request.get(invalidList + id, {}, true);
}
// 开始盘点
export const checkPlanStartAPI = (params) => {
    return request.postJson(checkPlanStart, params, true);
}
// 一键移除失效产品
export const delCheckPlanDetailAPI = (ids) => {
    return request.deleteJson(delCheckPlanDetail + ids, {}, true);
}
// 暂存接口
export const temporarySaveAPI = (params) => {
    return request.postJson(temporarySave, params, true);
}
// 盘点计划作废接口
export const checkPlanCancelAPI = (params) => {
    return request.postJson(checkPlanCancel, params, true);
}
// 扫描获取盘点明细
export const checkPlanDetailAPI = (params) => {
    return request.get(checkPlanDetail, params, true);
}
// 提交审核
export const submitAuditAPI = (params) => {
    return request.postJson(submitAudit, params, true);
}
// 审核驳回/审核通过
export const auditPostAPI = (params) => {
    return request.postJson(auditPost, params, true);
}
// 盘点列表数量
export const checkPlanListCountAPI = (params) => {
    return request.get(checkPlanListCount, params, true);
}
// 盘点明细数量
export const checkPlanDetailCountAPI = (params) => {
    return request.get(checkPlanDetailCount, params, true);
}
// 查询物料类别
export const listCategoryAPI = (params) => {
    return request.get(listCategory, params, true);
}
// 查询物料 是否在盘点中
export const materialInventoryAPI = (params) => {
    return request.get(materialInventory, params, true);
}