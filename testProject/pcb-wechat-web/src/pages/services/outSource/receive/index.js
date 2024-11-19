import request from '../../../util/request';
import config from "../../../config/commonConfig";

const {
  api: {
    outSource: {
      receiveList,
      receiveDetail,
      receiveCount,
      receivePreview,
      receiveSign,
      receiveFile,
      sourceOrderProcessRecord,
    }
}} = config;

// https://docs.qq.com/doc/DUHZlS3hkU3h4ZVRm
// 1.外协加工单列表
export const receiveListAPI = (params) => {
    return request.get(receiveList, params, true);
}
// 查询外协加工单详情
export const receiveDetailAPI = (id) => {
  return request.get(receiveDetail + id, {}, true);
}
// 查询外协加工单详情
export const receiveCountAPI = (params) => {
  return request.get(receiveCount, params, true);
}
// 预览
export const receivePreviewAPI = (id) => {
  return request.get(receivePreview + id, true);
}
//签名
export const receiveSignAPI = (params) => {
  return request.postJson(receiveSign, params, true);
}
// 凭证
export const receiveFileAPI = (params) => {
  return request.postJson(receiveFile, params, true);
}
// 加工记录
export const sourceOrderProcessRecordAPI = (params) => {
  return request.get(sourceOrderProcessRecord, params, true);
}
