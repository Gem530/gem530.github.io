import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {materialRequisition: {queryMaterialInventory, getReceiveAddress, getSupplierList, addAppletPurchaseOrder, listAppletPurchaseOrder, getAppletPurchaseOrderDetail, updateAppletPurchaseOrder, listAppletPurchaseOrderAudit, auditPurchaseOrder, listPurchaseMaterialOrder, getMaterialOrderDetail, uploadMaterialFile, queryOperateRecordList, listMaterialFile, confirmOrderApp, previewSignature, confirmOrderFinish, materialOrderCompareList, cancelOrder, listByOrder, listByWait, deliveryDetail, addDelivery, getMaterialDeliveryDetail, editMaterialDelivery, previewDeliverySignature, materialDeliverySign, updateVerify, verifyIsClose, listMaterialBackApp, materialBackDeDetail, confirmBackDetail, previewSignatureBack, confirmMaterialBack, confirmMaterialBackFinish, materialBackDetailCompareList, createSignFile, confirmList, previewSignatureStatement, accountOrderSign, accountOrderSignV2, cancelAccount, supConfirm, verifyPermissionMaterial, verifyPermissionSourceFull, verifyPermissionSourceHalf, orderDataIsolationMaterial, orderDataIsolationOutsource, accountOrderCheck, applyList, applyListCount, confirmListV2, accountOrderCount, accountOrderDetial, adjustListApp, queryUseModule}}} = config;

// 获取物料规格列表
export const queryMaterialInventoryAPI = (params) => {
    return request.get(queryMaterialInventory, params, true);
}

// 获取收货地址
export const getReceiveAddressAPI = (params) => {
    return request.get(getReceiveAddress, params, true);
}

// 获取供应商
export const getSupplierListAPI = (params) => {
    return request.get(getSupplierList, params, true);
}

// 提交物料请购
export const addAppletPurchaseOrderAPI = (params) => {
    return request.postJson(addAppletPurchaseOrder, params, true);
}

// 获取采购申请记录
export const listAppletPurchaseOrderAPI = (params) => {
    return request.get(listAppletPurchaseOrder, params, true);
}

// 获取采购申请详情
export const getAppletPurchaseOrderDetailAPI = (id) => {
    return request.get(getAppletPurchaseOrderDetail + id, {}, true);
}

// 修改物料请购
export const updateAppletPurchaseOrderAPI = (params) => {
    return request.postJson(updateAppletPurchaseOrder, params, true);
}

// 获取采购审核记录
export const listAppletPurchaseOrderAuditAPI = (params) => {
    return request.get(listAppletPurchaseOrderAudit, params, true);
}

// 通过或驳回物料请购单
export const auditPurchaseOrderAPI = (params) => {
    return request.postJson(auditPurchaseOrder, params, true);
}

// 小程序查询采购合同
export const listPurchaseMaterialOrderAPI = (params) => {
    return request.get(listPurchaseMaterialOrder, params, true);
}

// 获取采购订单详细信息
export const getMaterialOrderDetailAPI = (params) => {
    return request.get(getMaterialOrderDetail, params, true);
}

// 上传附件
export const uploadMaterialFileAPI = (params) => {
    return request.postJson(uploadMaterialFile, params, true);
}

// 根据采购明细id查询操作记录
export const queryOperateRecordListAPI = (params) => {
    return request.get(queryOperateRecordList, params, true);
}

// 根据订单code查询附件
export const listMaterialFileAPI = (params) => {
    return request.get(listMaterialFile, params, true);
}

// 小程序采购订单确认
export const confirmOrderAppAPI = (params) => {
    return request.postJson(confirmOrderApp, params, true);
}

// 通过id预览pdf
export const previewSignatureAPI = (id) => {
    return request.get(previewSignature + id, {}, true);
}

// 签名
export const confirmOrderFinishAPI = (params) => {
    return request.postJson(confirmOrderFinish, params, true);
}

// 判断采购合同是否修改
export const materialOrderCompareListAPI = (params) => {
    return request.postJson(materialOrderCompareList, params, true);
}

// 采购合同取消/确认
export const cancelOrderAPI = (params) => {
    return request.postJson(cancelOrder, params, true);
}

// 查询送货单单据列表
export const listByOrderAPI = (params) => {
    return request.get(listByOrder, params, true);
}

// 查询待送货单列表
export const listByWaitAPI = (params) => {
  return request.get(listByWait, params, true);
}

// 查询待送货单详情
export const waitDetailAPI = (params) => {
  return request.get(deliveryDetail, params, true);
}

// 新增送货单
export const addDeliveryAPI = (params) => {
  return request.postJson(addDelivery, params, true);
}

// 根据id查询送货单明细
export const getMaterialDeliveryDetailAPI = (id) => {
    return request.get(getMaterialDeliveryDetail + id, { isApplet: true }, true);
}

// 确认送货单
export const editMaterialDeliveryAPI = (params) => {
    return request.postJson(editMaterialDelivery, params, true);
}

// 小程序预览签名附件
export const previewDeliverySignatureAPI = (id) => {
    return request.get(previewDeliverySignature + id, {}, true);
}

// 小程序签订完成
export const materialDeliverySignAPI = (params) => {
    return request.postJson(materialDeliverySign, params, true);
}

// 判断送货单是否修改
export const updateVerifyAPI = (params) => {
    return request.postJson(updateVerify, params, true);
}

// 小程序-查询退货单 (code可以不传)
export const listMaterialBackAppAPI = (params) => {
    return request.get(listMaterialBackApp, params, true);
}

// 查询详情 （表头参数和列表相同）
export const materialBackDeDetailAPI = (params) => {
    return request.get(materialBackDeDetail, params, true);
}
// 查询详情 确认记录（表头参数和列表相同）
export const confirmBackDetailAPI = (params) => {
    return request.get(confirmBackDetail, params, true);
}

// 预览合同 id传详情返回的List的第一个id
export const previewSignatureBackAPI = (id) => {
    return request.get(previewSignatureBack + id, {}, true);
}

// 确认（post）返回true可以跳转到签名
export const confirmMaterialBackAPI = (params) => {
    return request.postJson(confirmMaterialBack, params, true);
}

// 签名后确认操作
export const confirmMaterialBackFinishAPI = (params) => {
    return request.postJson(confirmMaterialBackFinish, params, true);
}

// 退货单判断是否修改
export const materialBackDetailCompareListAPI = (params) => {
    return request.postJson(materialBackDetailCompareList, params, true);
}

// 退货已确认单据下载文件调整
export const createSignFileAPI = (params) => {
    return request.postJson(createSignFile, params, true);
}

// 查询对账单列表-小程序与erp通用
export const confirmListAPI = (params) => {
    return request.get(confirmList, params, true);
}

// 小程序预览签名附件
export const previewSignatureStatementAPI = (id) => {
    return request.get(previewSignatureStatement + id, {}, true);
}

// 小程序预览签名附件
export const accountOrderSignAPI = (params) => {
    return request.postJson(accountOrderSign, params, true);
}

// 小程序预览签名附件
export const accountOrderSignV2API = (params) => {
    return request.postJson(accountOrderSignV2, params, true);
}

// 对账单取消/确认
export const cancelAccountAPI = (params) => {
    return request.postJson(cancelAccount, params, true);
}

// 对账单取消/确认
export const supConfirmAPI = (params) => {
    return request.postJson(supConfirm, params, true);
}

// 采购送货 扫码校验
export const verifyPermissionMaterialAPI = (id) => {
    return request.get(verifyPermissionMaterial + id, {}, true);
}

// 订单外协送货 扫码校验
export const verifyPermissionSourceFullAPI = (id) => {
    return request.get(verifyPermissionSourceFull + id, {}, true);
}

// 工序外协送货 扫码校验
export const verifyPermissionSourceHalfAPI = (id) => {
    return request.get(verifyPermissionSourceHalf + id, {}, true);
}

// 采购合同、退货
export const orderDataIsolationMaterialAPI = (params) => {
    return request.postJson(orderDataIsolationMaterial, params, true);
}

// 外协合同、退货
export const orderDataIsolationOutsourceAPI = (params) => {
    return request.postJson(orderDataIsolationOutsource, params, true);
}

// 工序外协送货 扫码校验
export const accountOrderCheckAPI = (params) => {
    return request.postJson(accountOrderCheck, params, true);
}

// 供应商自动出账，修改记录
export const applyListAPI = (params) => {
    return request.get(applyList, params, true);
}

// 供应商自动出账，修改记录数量
export const applyListCountAPI = (params) => {
    return request.get(applyListCount, params, true);
}
// 采购对账 新列表
export const confirmListV2API = (params) => {
    return request.get(confirmListV2, params, true);
}

// 采购对账 列表状态数量
export const accountOrderCountAPI = (params) => {
    return request.get(accountOrderCount, params, true);
}

// 采购对账 新详情
export const accountOrderDetialAPI = (id) => {
    return request.get(accountOrderDetial + id, {}, true);
}

// 采购对账 新详情
export const adjustListAppAPI = (params) => {
    return request.get(adjustListApp, params, true);
}

// 采购对账 查看是否有设置默认签章
export const queryUseModuleAPI = (params) => {
    return request.get(queryUseModule, params, true);
}
