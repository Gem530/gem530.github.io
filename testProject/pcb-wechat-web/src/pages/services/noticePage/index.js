import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {noticePage: {getWxPendingNum, getNotifyList, getNotifyNum, getNotifyRecord, getRecordNum, readNotify, readAllNotify, getUserRemindConfig, remindConfig}}} = config;

// 小程序获取各个菜单待办数量
export const getWxPendingNumAPI = (params) => {
    return request.get(getWxPendingNum, params, true);
}

// 获取未读通知集合
export const getNotifyListAPI = (params) => {
    return request.get(getNotifyList, params, true);
}

// 获取未读通知数量
export const getNotifyNumAPI = (params) => {
    return request.get(getNotifyNum, params, true);
}

// 查询已读通知列表
export const getNotifyRecordAPI = (params) => {
    return request.get(getNotifyRecord, params, true);
}

// 获取已读通知数量
export const getRecordNumAPI = (params) => {
    return request.get(getRecordNum, params, true);
}

// 已读指定通知
export const readNotifyAPI = (params) => {
    return request.postJson(readNotify, params, true);
}

// 已读所有通知
export const readAllNotifyAPI = (params) => {
    return request.get(readAllNotify, params, true);
}

// 获取用户待办通知提醒设置
export const getUserRemindConfigAPI = (params) => {
    return request.get(getUserRemindConfig, params, true);
}

// 修改待办通知提醒设置
export const remindConfigAPI = (params) => {
    return request.putJson(remindConfig, params, true);
}