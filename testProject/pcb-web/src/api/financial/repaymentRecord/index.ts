import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RepaymentRecordVO, RepaymentRecordForm, RepaymentRecordQuery } from '@/api/financial/repaymentRecord/types';

/**
 * 查询付款/回款记录列表
 * @param query
 * @returns {*}
 */

export const listRepaymentRecord = (query?: RepaymentRecordQuery): AxiosPromise<RepaymentRecordVO[]> => {
  return request({
    url: '/financial/repaymentRecord/list',
    method: 'get',
    params: query
  });
};
export const postListRepaymentRecord = (query?: RepaymentRecordQuery): AxiosPromise<RepaymentRecordVO[]> => {
  return request({
    url: '/financial/repaymentRecord/list',
    method: 'post',
    data: query
  });
};
/**
 * 查询付款/回款的冲销记录列表
 * @param query
 * @returns {*}
 */
export const getWriteOffAllListByPayId = (query?: RepaymentRecordQuery): AxiosPromise<RepaymentRecordVO[]> => {
  return request({
    url: '/financial/repaymentRecord/payRecordList',
    method: 'get',
    params: query
  });
};

export const queryPayRecordListByCustSup = (query?: RepaymentRecordQuery): AxiosPromise<RepaymentRecordVO[]> => {
  return request({
    url: '/financial/repaymentRecord/queryPayRecordListByCustSup',
    method: 'get',
    params: query
  });
};

/**
 * 查询付款/回款记录详细
 * @param id
 */
export const getRepaymentRecord = (id: string | number): AxiosPromise<RepaymentRecordVO> => {
  return request({
    url: '/financial/repaymentRecord/getInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增付款记录
 * @param data
 */
export const addPaymentRecord = (data: RepaymentRecordForm) => {
  return request({
    url: '/financial/repaymentRecord/addPayment',
    method: 'post',
    data: data
  });
};
/**
 * 新回付款记录
 * @param data
 */
export const addRepaymentRecord = (data: RepaymentRecordForm) => {
  return request({
    url: '/financial/repaymentRecord/addRepayment',
    method: 'post',
    data: data
  });
};

/**
 * 修改付款/回款记录
 * @param data
 */
export const updateRepaymentRecord = (data: RepaymentRecordForm) => {
  return request({
    url: '/financial/repaymentRecord',
    method: 'put',
    data: data
  });
};
/**
 * 修改状态
 * @param data
 */
export const updatePaymentStatus = (data: any) => {
  return request({
    url: '/financial/repaymentRecord/updateStatus',
    method: 'put',
    data: data
  });
};
/**
 * 上传回执
 * @param data
 */
export const uploadReceipt = (data: any) => {
  return request({
    url: '/financial/repaymentRecord/uploadReceipt',
    method: 'put',
    data: data
  });
};
/**
 * 删除付款/回款记录
 * @param id
 */
export const delRepaymentRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/financial/repaymentRecord/' + id,
    method: 'delete'
  });
};

/**
 * 保存收款记录
 * @param query
 * @returns {*}
 */

export const addPaymentWriteOff = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/addPaymentWriteOff',
    method: 'post',
    data: data
  });
};

/**
 * 保存预收款记录
 * @param query
 * @returns {*}
 */
export const addPrePaymentWriteOff = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/addPrePaymentWriteOff',
    method: 'post',
    data: data
  });
};


/**
 * 修改收款记录
 * @param query
 * @returns {*}
 */

export const updatePaymentWriteOff = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/updatePaymentWriteOff',
    method: 'post',
    data: data
  });
};

/**
 * 修改预收款记录
 * @param query
 * @returns {*}
 */

export const updatePrePaymentWriteOff = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/updatePrePaymentWriteOff',
    method: 'post',
    data: data
  });
};

/**
 * 提交审核
 * @param query
 * @returns {*}
 */

export const addSubmitPaymentWriteOff = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/addSubmitPaymentWriteOff',
    method: 'post',
    data: data
  });
};

/**
 * 提交审核预收款
 * @param query
 * @returns {*}
 */

export const addSubmitPrePaymentWriteOff = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/addSubmitPrePaymentWriteOff',
    method: 'post',
    data: data
  });
};

/**
 * 提交收款记录
 * @param query
 * @returns {*}
 */

export const submitPaymentAccount = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/submitPaymentAccount',
    method: 'post',
    data: data
  });
};

/**
 * 审核通过
 * @param query
 * @returns {*}
 */

export const approvePaymentAccount = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/approvePaymentAccount',
    method: 'post',
    data: data
  });
};

/**
 * 付款单审核通过(权限校验)
 * @param query
 * @returns {*}
 */
export const approvePaymentCheckPer = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/approvePaymentCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 收款单审核通过(权限校验)
 * @param query
 * @returns {*}
 */
export const approveRepaymentCheckPer = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/approveRepaymentCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 审核通过预收
 * @param query
 * @returns {*}
 */

export const approvePrePaymentAccount = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/approvePrePaymentAccount',
    method: 'post',
    data: data
  });
};

/**
 * 预付款单审核通过(权限校验)
 * @param query
 * @returns {*}
 */
export const approvePrePaymentCheckPer = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/approvePrePaymentCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 预收款单审核通过(权限校验)
 * @param query
 * @returns {*}
 */
export const approvePreRepaymentCheckPer = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/approvePreRepaymentCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 审核驳回
 * @param query
 * @returns {*}
 */

export const rejectPaymentAccount = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/rejectPaymentAccount',
    method: 'post',
    data: data
  });
};

/**
 * 付款单驳回(权限校验)
 * @param query
 * @returns {*}
 */
export const rejectPaymentCheckPer = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/rejectPaymentCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 收款单驳回(权限校验)
 * @param query
 * @returns {*}
 */
export const rejectRepaymentCheckPer = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/rejectRepaymentCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 获取选中账单信息
 * @param query
 * @returns {*}
 */

export const getPaymentAccountList = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/getPaymentAccountList',
    method: 'post',
    data: data
  });
};

/**
 * 重新修改
 * @param query
 * @returns {*}
 */

export const reUpdatePaymentAccount = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/reUpdatePaymentAccount',
    method: 'get',
    params: data
  });
};

/**
 * 删除收付款单
 * @param query
 * @returns {*}
 */

export const deletePaymentAccount = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/deletePaymentAccount',
    method: 'get',
    params: data
  });
};

/**
 * 校验选中数据
 * @param query
 * @returns {*}
 */
export const validatePaymentAccount = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/validatePaymentAccount',
    method: 'post',
    data: data
  });
};

/**
 * 追加附件
 * @param query
 * @returns {*}
 */
export const addPaymentAccountFile = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/addPaymentAccountFile',
    method: 'post',
    data: data
  });
};

/**
 * 列表校验内部数据已经变更
 * @param query
 * @returns {*}
 */
export const validatePaymentAccountDetail = (data:any) => {
  return request({
    url: '/financial/repaymentRecord/validatePaymentAccountDetail',
    method: 'post',
    data: data
  });
};

