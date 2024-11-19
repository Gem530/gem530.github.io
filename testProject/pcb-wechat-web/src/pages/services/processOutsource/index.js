import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {processOutsource: {querySupplierPageListApp, supplierOrderDetail, confirmAppHalfProcess, confirmFinishHalfProcess, previewSignatureHalfProcess, batchConfirmFinish, sourceHalfProcessDeliveryList, sourceHalfProcessDeliveryDetail, sourceHalfProcessDeliveryEdit, sourceHalfProcessDeliveryPreview, sourceHalfProcessDeliverySign, sourceHalfProcessDeliverySignBatch}}} = config;

// 查询工序加工单
export const querySupplierPageListAppAPI = (params) => {
    return request.get(querySupplierPageListApp, params, true);
}

// 根据code/状态查询工序加工单明细
export const supplierOrderDetailAPI = (params) => {
    return request.get(supplierOrderDetail, params, true);
}

// 确定工序加工单
export const confirmAppHalfProcessAPI = (params) => {
    return request.postJson(confirmAppHalfProcess, params, false);
}

// 批量确认
export const batchConfirmFinishAPI = (params) => {
    return request.postJson(batchConfirmFinish, params, true);
}

// 预览工序加工单
export const previewSignatureHalfProcessAPI = (id) => {
    return request.get(previewSignatureHalfProcess + id, {}, true);
}

// 签名 工序加工单
export const confirmFinishHalfProcessAPI = (params) => {
    return request.postJson(confirmFinishHalfProcess, params, true);
}

// 查询送货单单据列表
export const sourceHalfProcessDeliveryListAPI = (params) => {
    return request.get(sourceHalfProcessDeliveryList, params, true);
}

// 根据id查询送货单明细
export const sourceHalfProcessDeliveryDetailAPI = (id) => {
    return request.get(sourceHalfProcessDeliveryDetail + id, { isApplet: true }, true);
}

// 确认送货单
export const sourceHalfProcessDeliveryEditAPI = (params) => {
    return request.postJson(sourceHalfProcessDeliveryEdit, params, true);
}

// 小程序预览签名附件
export const sourceHalfProcessDeliveryPreviewAPI = (id) => {
    return request.get(sourceHalfProcessDeliveryPreview + id, {}, true);
}

// 小程序签订完成
export const sourceHalfProcessDeliverySignAPI = (params) => {
    return request.postJson(sourceHalfProcessDeliverySign, params, true);
}

// 小程序签订完成 批量
export const sourceHalfProcessDeliverySignBatchAPI = (params) => {
    return request.postJson(sourceHalfProcessDeliverySignBatch, params, true);
}