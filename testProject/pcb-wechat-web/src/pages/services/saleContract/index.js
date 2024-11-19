import request from '../../util/request';
import config from "../../config/commonConfig";


const {api: {saleContract: {getOrderProcess, getCustomerList, signList, backSignList, detailByCode, updateMaterialFlow, getListLogisticsCompany, wxOrderList, signListApp, detailByCodeApp, signApp, previewSignature, getDeliveryOrderNum,wxMaterialInTransitList,wxMaterialCategoryList,getMaterialProcessApplet,updateLogisticsNo}}} = config;


// 获取 开放进度查询
export const getOrderProcessAPI = (params) => {
    return request.postJson(getOrderProcess, params, true);
}

// 获取用户列表
export const getCustomerListAPI = (params) => {
    return request.get(getCustomerList, params, true);
}

// 获取送货单列表
export const signListAPI = (params) => {
    return request.postJson(signList, params, true);
}

// 获取 退货重发 送货单列表
export const backSignListAPI = (params) => {
    return request.postJson(backSignList, params, true);
}

// 根据code获取送货单详情
export const detailByCodeAPI = (code) => {
    return request.get(detailByCode + code, {}, true);
}

// 关联送货单与物流信息
export const updateMaterialFlowAPI = (params) => {
    return request.postJson(updateMaterialFlow, params, true);
}

// 获取物流公司列表
export const getListLogisticsCompanyAPI = (params) => {
    return request.get(getListLogisticsCompany, params, true);
}

// 获取订单进度列表
export const wxOrderListAPI = (params) => {
    return request.get(wxOrderList, params, true);
}

// 获取送货单进度列表
export const signListAppAPI = (params) => {
    return request.get(signListApp, params, true);
}

// 获取送货单详情
export const detailByCodeAppAPI = (code) => {
    return request.get(detailByCodeApp + code, {}, true);
}

// 回签 送货单
export const signAppAPI = (params) => {
    return request.postJson(signApp, params, true);
}

// 预览 送货单详情
export const previewSignaturePcbAPI = (id) => {
    return request.get(previewSignature + id, {}, true);
}

// 获取 送货单 数量
export const getDeliveryOrderNumAPI = (params) => {
    return request.postJson(getDeliveryOrderNum, params, true);
}
// 获取在途物流列表
export const wxMaterialInTransitListAPI = (params) => {
    return request.get(wxMaterialInTransitList, params, true);
}
// 获取在途物流分类列表
export const wxMaterialCategoryListAPI = (params) => {
    return request.get(wxMaterialCategoryList, params, true);
}
// 获取在途物流详情查询
export const getWxMaterialInTransitAPI = (params) => {
    return request.postJson(getMaterialProcessApplet, params, true);
}
// 更新在途物流关联的送货信息
export const updateLogisticsNoAPI = (params) => {
    return request.postJson(updateLogisticsNo, params, true);
}
