import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {signManage: {signList, getSignDetail, addSign, editSign, delSign, confirmDefault, queryIsAuth, authorize}}} = config;

// 个人签名列表
export const signListAPI = (params) => {
    return request.get(signList, params, true);
}

// 获取pdf签名详细信息
export const getSignDetailAPI = (id) => {
    return request.get(getSignDetail + id, {}, true);
}

// 新增签名
export const addSignAPI = (params) => {
    return request.postJson(addSign, params, true);
}

// 修改pdf签名
export const editSignAPI = (params) => {
    return request.postJson(editSign, params, true);
}

// 删除pdf签名
export const delSignAPI = (ids) => {
    return request.postJson(delSign + ids, {}, true);
}

// 设置默认签名
export const confirmDefaultAPI = (params) => {
    return request.postJson(confirmDefault, params, true);
}

// 判断是否授权签名
export const queryIsAuthAPI = (params) => {
    return request.get(queryIsAuth, params, true);
}

// 判断是否授权签名
export const authorizeAPI = (params) => {
    return request.postJson(authorize, params, true);
}