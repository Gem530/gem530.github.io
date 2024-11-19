import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {productCapacity: {getCurrentCard, createCapacity, getCapacityList, getAuditList, getCapacityDetails, passCapacity, queryUserDeptNodeList, craftCapacityList, rejectCapacity, voidCapacity, passCapacityByCard}}} = config;

// 获取 上报的 卡信息
export const getCurrentCardAPI = (params) => {
    return request.postJson(getCurrentCard, params, true);
}

// 上报
export const createCapacityAPI = (params) => {
    return request.postJson(createCapacity, params, true);
}

// 获取上报记录
export const getCapacityListAPI = (params) => {
    return request.get(getCapacityList, params, true);
}

// 获取待审核列表
export const getAuditListAPI = (params) => {
    return request.get(getAuditList, params, true);
}

// 获取审核详情
export const getCapacityDetailsAPI = (params) => {
    return request.postJson(getCapacityDetails, params, true);
}

// 获取已审核列表
export const passCapacityAPI = (params) => {
    return request.postJson(passCapacity, params, true);
}

// 获取工序列表
export const queryUserDeptNodeListAPI = () => {
    return request.get(queryUserDeptNodeList, {}, true);
}

// 查询工艺审核列表
export const craftCapacityListAPI = () => {
    return request.get(craftCapacityList, {}, true);
}

// 小程序驳回上报
export const rejectCapacityAPI = (params) => {
    return request.postJson(rejectCapacity, params, true);
}

// 小程序作废上报
export const voidCapacityAPI = (params) => {
    return request.postJson(voidCapacity, params, true);
}

// 工艺审核批量审核
export const passCapacityByCardAPI = (params) => {
    return request.postJson(passCapacityByCard, params, true);
}