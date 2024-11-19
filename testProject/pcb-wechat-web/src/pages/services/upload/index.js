import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {upload: {getSignedUrl, getUrlByKeys, test, addBatchVoucher, listVoucher, sendMessageWithAttachmentByKey, queryEmailRecord, getSystemTime, uploadDelivery}}} = config;

// 获取上传图片的地址
export const getSignedUrlErpAPI = (params) => {
    return request.get(getSignedUrl, params, true);
}

// 通过key获取url
export const getUrlByKeysErpAPI = (params) => {
    return request.get(getUrlByKeys, params, true);
}

// 通过key获取url
export const testAPI = (params) => {
    return request.get(test, params, true);
}

// 凭证上传
/**
 * 
 * @param {*} 
 * fileList.forEach((item) => {
	item.bizId = 单id
    item.moduleCode = 每个小程序页面不同,照样用之前的, 
    item.bizType = 可固定为  "20"   , 
    item.bizCode = 单号});
 * @returns 
 */
export const addBatchVoucherAPI = (params) => {
    return request.postJson(addBatchVoucher, params, true);
}

// 历史凭证查询 code:单号  fileBizType:文件业务类型 可固定为"20"
export const listVoucherAPI = (code) => {
    return request.get(listVoucher + code  +'/20', {}, true);
}

// 发送邮箱
export const sendMessageWithAttachmentByKeyAPI = (params) => {
    return request.get(sendMessageWithAttachmentByKey, params, true);
}

// 已发送邮箱记录
export const queryEmailRecordAPI = (params) => {
    return request.get(queryEmailRecord, params, true);
}

// 上传图片时，获取系统时间，绘制水印
export const getSystemTimeAPI = (params) => {
    return request.get(getSystemTime, params, true);
}

// 凭证查询 code:单号  fileBizType:文件业务类型
export const listVoucherCommonAPI = (code,type) => {
    return request.get(listVoucher + code  +'/'+type, {}, true);
}
// 1.上传物流凭证信息
export const uploadDeliveryAPI = (params) => {
    return request.postJson(uploadDelivery, params, true);
}