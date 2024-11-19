import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {orderOutsource: {listSupplierOrder, getOrderDetail, confirmOrder, previewSignature, confirmOrderFinish, sourceFullProcessDeliveryList, sourceFullProcessDeliveryDetail, sourceFullProcessDeliveryEdit, sourceFullProcessDeliveryPreview, sourceFullProcessDeliverySign, listSupplierBackAppSource, supplierBackDetail, confirmBackApp, previewSignatureProcessBack, confirmOrderBackFinish}}} = config;

// 查询外协加工单
export const listSupplierOrderAPI = (params) => {
    return request.get(listSupplierOrder, params, true);
}

// 根据id查询外协加工单明细
export const getOrderDetailAPI = (id) => {
    return request.get(getOrderDetail + id, {}, true);
}

// 确定外协加工单
export const confirmOrderAPI = (params) => {
    return request.postJson(confirmOrder, params, true);
}

// 预览外协加工单
export const previewSignatureOutsourceAPI = (id) => {
    return request.get(previewSignature + id, {}, true);
}

// 签名 外协加工单
export const confirmOrderFinishOutsourceAPI = (params) => {
    return request.postJson(confirmOrderFinish, params, true);
}

// 查询送货单单据列表
export const sourceFullProcessDeliveryListAPI = (params) => {
    return request.get(sourceFullProcessDeliveryList, params, true);
}

// 根据id查询送货单明细
export const sourceFullProcessDeliveryDetailAPI = (id) => {
    return request.get(sourceFullProcessDeliveryDetail + id, { isApplet: true }, true);
}

// 确认送货单
export const sourceFullProcessDeliveryEditAPI = (params) => {
    return request.postJson(sourceFullProcessDeliveryEdit, params, true);
}

// 小程序预览签名附件
export const sourceFullProcessDeliveryPreviewAPI = (id) => {
    return request.get(sourceFullProcessDeliveryPreview + id, {}, true);
}

// 小程序签订完成
export const sourceFullProcessDeliverySignAPI = (params) => {
    return request.postJson(sourceFullProcessDeliverySign, params, true);
}

// 查询订单外协退货
export const listSupplierBackAppSourceAPI = (params) => {
    return request.get(listSupplierBackAppSource, params, true);
}

// 根据id查询明细 订单外协退货
export const supplierBackDetailAPI = (params) => {
    return request.get(supplierBackDetail, params, true);
}

// 确认 订单外协退货
export const confirmBackAppAPI = (params) => {
    return request.postJson(confirmBackApp, params, false);
}

// 预览合同 订单外协退货
export const previewSignatureProcessBackAPI = (id) => {
    return request.get(previewSignatureProcessBack + id, {}, true);
}

// 确认完成 订单外协退货
export const confirmOrderBackFinishAPI = (params) => {
    return request.postJson(confirmOrderBackFinish, params, true);
}
