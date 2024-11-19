import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AccountOrderVO, AccountOrderForm, AccountOrderQuery, AccountMaterialInOutVo, InOrOutForm } from '@/api/financial/accountOrder/types';
import { SupplierVO } from '@/api/basedata/supplier/types';
import { RepaymentRecordVO } from '@/api/financial/repaymentRecord/types';
import { OrderWriteOffRecordVO } from '@/api/financial/orderWriteOffRecord/types';
import {SourceHalfProcessReceiveVO} from '@/api/outsource/sourceHalfProcessReceive/types';
import { ScrapVO } from '@/api/production/scrap/types';

/**
 * 查询供应商列表
 * @param query
 * @returns {*}
 */

export const listSupplier = (): AxiosPromise<SupplierVO[]> => {
  return request({
    url: '/financial/accountOrder/supplierList',
    method: 'get'
  });
};

/**
 * 查询客户列表
 * @param query
 * @returns {*}
 */

export const listCompany = (): AxiosPromise<any[]> => {
  return request({
    url: '/financial/accountOrder/companyList',
    method: 'get'
  });
};

/**
 * 查询对账单列表
 * @param query
 * @returns {*}
 */

export const listAccountOrder = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/list',
    method: 'get',
    params: query
  });
};
export const postListAccountOrder = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/list',
    method: 'post',
    data: query
  });
};
export const postListSupAccountOrder = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/listSupAccount',
    method: 'post',
    data: query
  });
};

export const listAccountOrderCount = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/listCount',
    method: 'post',
    data: query
  });
};

export const listSupAccountOrderCount = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/listSupCount',
    method: 'post',
    data: query
  });
};
/**
 * 查询出入库记录列表
 * @param query
 * @returns {*}
 */

export const listInOutRecord = (query?: AccountOrderQuery): AxiosPromise<AccountMaterialInOutVo[]> => {
  return request({
    url: '/financial/accountOrder/queryInOutRecord',
    method: 'get',
    params: query
  });
};

/**
 * 查询对账单详细
 * @param id
 */
export const getAccountOrder = (id: string | number): AxiosPromise<AccountOrderVO> => {
  return request({
    url: '/financial/accountOrder/getInfo/' + id,
    method: 'get'
  });
};
/**
 * 根据供应商id查询付款记录
 * @param id
 */
export const getPaymentListBySupplierId = (id: string | number): AxiosPromise<RepaymentRecordVO[]> => {
  return request({
    url: '/financial/accountOrder/payment/' + id,
    method: 'get'
  });
};
/**
 * 查询付款记录
 * @param id
 */
export const getPaymentList = (query?: any): AxiosPromise<RepaymentRecordVO[]> => {
  return request({
    url: '/financial/accountOrder/paymentRecord',
    method: 'get',
    params: query
  });
};
/**
 * 根据对账单id查询正常的冲销记录
 * @param id
 */
export const getWriteOffListByAccountOrderId = (id: string | number): AxiosPromise<OrderWriteOffRecordVO[]> => {
  return request({
    url: '/financial/accountOrder/writeOff/' + id,
    method: 'get'
  });
};
/**
 * 取消冲销
 * @param id
 */
export const cancelWriteOffRecordById = (id: string | number) => {
  return request({
    url: '/financial/accountOrder/cancelWriteOffRecord/' + id,
    method: 'get'
  });
};


/**
 * 校验取消冲销
 * @param id
 */
export const validateCancelWriteOffRecordById = (id: string | number) => {
  return request({
    url: '/financial/accountOrder/validateCancelWriteOffRecord/' + id,
    method: 'get'
  });
};

/**
 * 根据对账单id查询所有的冲销记录
 * @param id
 */
export const getWriteOffAllListByAccountOrderId = (id: string | number): AxiosPromise<OrderWriteOffRecordVO[]> => {
  return request({
    url: '/financial/accountOrder/writeOffAll/' + id,
    method: 'get'
  });
};
/**
 * 根据供应商id查询收款记录
 * @param id
 */
export const getRepaymentListBySupplierId = (id: string | number): AxiosPromise<RepaymentRecordVO[]> => {
  return request({
    url: '/financial/accountOrder/repayment/' + id,
    method: 'get'
  });
};

/**
 * 新增对账单
 * @param data
 */
export const addAccountOrder = (data: InOrOutForm) => {
  return request({
    url: '/financial/accountOrder/add',
    method: 'post',
    data: data
  });
};
/**
 * 新增对账单-供应商对账
 * @param data
 */
export const addSupplierAccountOrder = (data: InOrOutForm) => {
  return request({
    url: '/financial/accountOrder/addSupplierAccount',
    method: 'post',
    data: data
  });
};
/**
 * 修改对账单
 * @param data
 */
export const updateAccountOrder = (data: InOrOutForm) => {
  return request({
    url: '/financial/accountOrder/edit',
    method: 'post',
    data: data
  });
};
/**
 * 修改对账单-供应商对账
 * @param data
 */
export const updateSupplierAccountOrder = (data: InOrOutForm) => {
  return request({
    url: '/financial/accountOrder/editSupplierAccount',
    method: 'post',
    data: data
  });
};
/**
 * 供应商对账-对账单验证是否修改
 * @param data
 */
export const compareList = (data: any) => {
  return request({
    url: '/financial/accountOrder/compareList',
    method: 'post',
    data: data
  });
};
/**
 * 供应商对账-根据操作类型校验对账单状态是否变更
 * @param data
 */
export const verifyStatus = (data: InOrOutForm) => {
  return request({
    url: '/financial/accountOrder/verifyStatus',
    method: 'post',
    data: data
  });
};
/**
 * 对账单冲销
 * @param data
 */
export const writeOffAccountOrder = (data: AccountOrderForm) => {
  return request({
    url: '/financial/accountOrder/writeOff',
    method: 'post',
    data: data
  });
};
/**
 * 修改对账单状态
 * @param data
 */
export const updateAccountOrderStatus = (data: AccountOrderForm) => {
  return request({
    url: '/financial/accountOrder/updateStatus',
    method: 'put',
    data: data
  });
};

/**
 * 删除对账单
 * @param id
 */
export const delAccountOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/accountOrder/' + id,
    method: 'delete'
  });
};

/**
 * 删除对账单
 * @param id
 */
export const delAccountOrderNew = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/accountOrder/delete/' + id,
    method: 'post'
  });
};
/**
 * 删除对账单-供应商对账
 * @param id
 */
export const delAccountOrderSupplier= (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/accountOrder/deleteSup/' + id,
    method: 'post'
  });
};


/**
 * 提交审核
 * @param data
 */
export const submitAuditOrderSale = (data: any) => {
  return request({
    url: '/financial/accountOrder/submitAuditOrderSale',
    method: 'post',
    data: data
  });
};

/**
 * 借料对账明细查询
 */
export const listRawBorrowInOutRecord = (query?: AccountOrderQuery): AxiosPromise<AccountMaterialInOutVo[]> => {
  return request({
    url: '/financial/accountOrder/queryRawInOutRecord',
    method: 'get',
    params: query
  });
};

/**
 * 钻咀对账明细查询
 */
export const listDrillerAbradeRecord = (query?: AccountOrderQuery): AxiosPromise<AccountMaterialInOutVo[]> => {
  return request({
    url: '/financial/accountOrder/queryDrillerAbradeRecord',
    method: 'get',
    params: query
  });
};

/**
 * feilin对账明细查询
 */
export const listAccountFilinOrder = (query?: AccountOrderQuery): AxiosPromise<AccountMaterialInOutVo[]> => {
  return request({
    url: '/financial/accountOrder/queryFeiLinRecord',
    method: 'get',
    params: query
  });
};

/**
 * 采购送货单对账明细查询
 */
export const listSupplierDeliveryRecord = (query?: AccountOrderQuery): AxiosPromise<any[]> => {
  return request({
    url: '/financial/accountOrder/querySupplierDeliveryRecord',
    method: 'get',
    params: query
  });
};
/**
 * 物料退货单对账明细查询
 */
export const listSupplierBackRecord = (query?: AccountOrderQuery): AxiosPromise<any[]> => {
  return request({
    url: '/financial/accountOrder/querySupplierBackRecord',
    method: 'get',
    params: query
  });
};
/**
 * 半制程对账明细查询
 */
export const listHalfOutRecord = (query?: AccountOrderQuery): AxiosPromise<SourceHalfProcessReceiveVO[]> => {
  return request({
    url: '/financial/accountOrder/queryHalfOutRecord',
    method: 'get',
    params: query
  });
};
/**
 * 半制程对账明细查询-供应商对账
 */
export const listHalfOutRecordV2 = (query?: AccountOrderQuery): AxiosPromise<SourceHalfProcessReceiveVO[]> => {
  return request({
    url: '/financial/accountOrder/querySupHalfOutRecord',
    method: 'get',
    params: query
  });
};


/**
 * 报废对账明细查询
 */
export const listScrapRecord = (query?: AccountOrderQuery): AxiosPromise<ScrapVO[]> => {
  return request({
    url: '/financial/accountOrder/queryScrapRecord',
    method: 'get',
    params: query
  });
};
/**
 * 报废对账明细查询-供应商对账
 */
export const listScrapRecordV2 = (query?: AccountOrderQuery): AxiosPromise<ScrapVO[]> => {
  return request({
    url: '/financial/accountOrder/querySupScrapRecord',
    method: 'get',
    params: query
  });
};

/**
 * 全制程对账明细查询
 */
export const listFullProcessOutRecord = (query?: AccountOrderQuery): AxiosPromise<AccountMaterialInOutVo[]> => {
  return request({
    url: '/financial/accountOrder/queryFullProcessOutRecord',
    method: 'get',
    params: query
  });
};
/**
 * 全制程对账明细查询-供应商对账
 */
export const querySupFullOutRecord = (query?: AccountOrderQuery): AxiosPromise<AccountMaterialInOutVo[]> => {
  return request({
    url: '/financial/accountOrder/querySupFullOutRecord',
    method: 'get',
    params: query
  });
};



/**
 * 查询对账单列表待确认列表-供应商对账
 * @param query
 * @returns {*}
 */
export const listAccountConfirmList = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/confirmListWeb',
    method: 'get',
    params: query
  });
};

/**
 * 待冲销列表
 * @param query
 * @returns
 */
export const waitWriteOffList = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/waitWriteOffList',
    method: 'post',
    data: query
  });
};
/**
 * 冲销列表
 * @param query
 * @returns
 */
export const auditedWriteOffList = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/auditedWriteOffList',
    method: 'post',
    data: query
  });
};

/**
 * 付款对账单冲销
 * @param data
 */
export const payWriteOffAccountOrder = (data: AccountOrderForm) => {
  return request({
    url: '/financial/accountOrder/doPayWriteOff',
    method: 'post',
    data: data
  });
};

export const repayWriteOffAccountOrder = (data: AccountOrderForm) => {
  return request({
    url: '/financial/accountOrder/doRepayWriteOff',
    method: 'post',
    data: data
  });
};
/**
 * 无纸化-取消冲销
 * @param id
 */
export const cancelPayWriteOffRecordById = (id: string | number) => {
  return request({
    url: '/financial/accountOrder/cancelPayWriteOffRecord/' + id,
    method: 'get'
  });
};
/**
 * 根据对账单id查询正常的收付款冲销记录
 * @param id
 */
export const getPayWriteOffListByAccountOrderId = (query?:any): AxiosPromise<OrderWriteOffRecordVO[]> => {
  return request({
    url: '/financial/accountOrder/payWriteOffList',
    method: 'get',
    params: query
  });
};

/**
 * 根据对账单id查询正常的收付款冲销记录
 * @param id
 */
export const getPayWriteOffAllListByAccountOrderId = (query?:any): AxiosPromise<OrderWriteOffRecordVO[]> => {
  return request({
    url: '/financial/accountOrder/payWriteOffAllList',
    method: 'get',
    params: query
  });

};

/**
 * 查询已签字的pdf
 * @param query
 * @returns {*}
 */
export const getSignPdf = (query?: any): AxiosPromise<any> => {
  return request({
    url: '/pdf/sign/pdf',
    method: 'get',
    params: query
  });
};

/**
 * 取消对账单
 * @param data
 */
export const cancelAccount = (data: any) => {
  return request({
    url: '/financial/accountOrder/cancelAccount',
    method: 'post',
    data: data
  });
};
/**
 * 关联扣款
 * @param data
 */
export const accountRelatedDeduction = (data: any) => {
  return request({
    url: '/financial/accountOrder/relatedDeduction',
    method: 'post',
    data: data
  });
};

/**
 * 批量提交审核
 * @param data
 */
export const batchSubmit = (data: any) => {
  return request({
    url: '/financial/accountOrder/batchSubmit',
    method: 'post',
    data: data
  });
};
/**
 * 批量通过审核
 * @param data
 */
export const batchAudit = (data: any) => {
  return request({
    url: '/financial/accountOrder/batchAudit',
    method: 'post',
    data: data
  });
};
/**
 * 批量驳回
 * @param data
 */
export const batchAuditReject = (data: any) => {
  return request({
    url: '/financial/accountOrder/batchAuditReject',
    method: 'post',
    data: data
  });
};
/**
 * 已审核记录驳回
 * @param data
 */
export const approvedReject = (data: any) => {
  return request({
    url: '/financial/accountOrder/approvedReject',
    method: 'post',
    data: data
  });
};

/**
 * 供应商-最终签名确认
 */
export const confirmAccountFinish = (data: any) => {
  return request({
    url: '/financial/accountOrder/sign',
    method: 'post',
    data: data
  });
};

/**
 * 成本调整-选择对账单
 */
export const constAdjustList = (query?: AccountOrderQuery): AxiosPromise<AccountOrderVO[]> => {
  return request({
    url: '/financial/accountOrder/constAdjustList',
    method: 'get',
    params: query
  });
};



/**
 * 关联扣款
 * @param data
 */
export const getAdjustList = (data: any) => {
  return request({
    url: '/financial/accountOrder/adjustList',
    method: 'post',
    data: data
  });
};

/**
 * 修改对账单-供应商自动对账
 * @param data
 */
export const updateAutoSupplierAccount = (data: InOrOutForm) => {
  return request({
    url: '/financial/accountOrder/updateAutoSupplierAccount',
    method: 'post',
    data: data
  });
};

//反审核
export const doReverseAudit = (data: any) => {
  return request({
    url: '/financial/accountOrder/doReverseAudit',
    method: 'post',
    data: data
  });
};
/**
 * 申请修改-供应商自动对账
 * @param data
 */
export const updateApplyAutoSupplierAccount = (data: InOrOutForm) => {
  return request({
    url: '/financial/accountOrder/updateApplyAutoSupplierAccount',
    method: 'post',
    data: data
  });
};


/**
 * 查询对账单列表
 * @param query
 * @returns {*}
 */

export const listApplyList = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/financial/accountOrder/applyList',
    method: 'get',
    params: query
  });
};

/**
 * 自动对账确认对账单修改对账单状态
 * @param data
 */
export const autoAccountSign = (data: AccountOrderForm) => {
  return request({
    url: '/financial/accountOrder/autoAccountSign',
    method: 'put',
    data: data
  });
};
/**
 * 自动对账供应商签名
 * @param data
 */
export const autoAccountSignSupplier = (data: AccountOrderForm) => {
  return request({
    url: '/financial/accountOrder/signV2',
    method: 'post',
    data: data
  });
};

export const accountPayList = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/financial/repaymentRecord/accountPayList',
    method: 'post',
    data: query
  });
};

export const accountInvoiceList = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/financial/invoice/accountInvoiceList',
    method: 'post',
    data: query
  });
};
