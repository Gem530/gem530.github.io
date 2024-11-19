import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {orderUpload: {getSignedUrl, getUrlByKeys, saveEmail, getEmail, businessCardList, getEmailByKeyList,sendBatchEmailAndAddData}}} = config;

// 获取上传图片的地址
export const getSignedUrlAPI = (params) => {
    return request.customAPI(getSignedUrl, params, true);
}

// 通过key获取url
export const getUrlByKeysAPI = (params) => {
    return request.customAPI(getUrlByKeys, params, true);
}

// 自定义api接口
export const customUrl = (url, params) => {
    return request.customAPI(url, params, true);
}

// 保存并发送邮件
export const saveEmailAPI = (params) => {
    return request.customAPI(saveEmail, params, true);
}

// 图片识别获取邮箱
export const getEmailAPI = (params) => {
    return request.customAPI(getEmail, params, true);
}

// 查看邮箱发送记录接口
export const businessCardListAPI = (params) => {
    return request.customAPI(businessCardList, params, true);
}

// 批量识别邮箱 根据文件keyList 批量调用腾讯云识别内容
export const getEmailByKeyListAPI = (params) => {
    return request.customAPI(getEmailByKeyList, params, true);
}

// 批量发送邮件和保存名片文件信息
export const sendBatchEmailAndAddDataAPI = (params) => {
    return request.customAPI(sendBatchEmailAndAddData, params, true);
}