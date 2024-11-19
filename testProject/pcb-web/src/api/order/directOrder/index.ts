import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderVO, OrderForm, OrderQuery ,DirectOrder} from '@/api/order/directOrder/types';

/**
 * 查询订单列表
 * @param query
 * @returns {*}
 */

export const listOrder = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/list',
    method: 'get',
    params: query
  });
};
export const listPostOrder = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/list',
    method: 'post',
    data: query
  });
};
/**
 * 发外协前校验
 */
export const checkBeforeOutSource = (query : any) => {
  return request({
    url: '/project/assignTask/checkBeforeOutSource',
    method: 'post',
    data: query
  });
};
export const listOrderCust = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/getListCust',
    method: 'get',
    params: query
  });
};

export const listOrderByComplaint = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/listComplaint',
    method: 'get',
    params: query
  });
};

export const totalAmount = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/totalAmount',
    method: 'post',
    data: query
  });
};

/**
 * 查询带有退货数据的订单列表
 * @param query
 * @returns {*}
 */
export const listOrderContainsBackData = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/pageContainsBackOrderData',
    method: 'post',
    params: query
  });
};

/**
 * 导出订单列表
 * @param query
 * @returns {*}
 */

export const exportListOrder = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/export',
    method: 'post',
    params: query
  });
};

/**
 * 查询订单列表无分页
 * @param query
 * @returns {*}
 */

export const getOrderList = (query?: OrderQuery) => {
  return request({
    url: '/order/saleOrder/getList',
    method: 'get',
    params: query
  });
};

/**
 * 查询订单详细
 * @param id
 */
export const getOrder = (id: string | number): AxiosPromise<OrderVO> => {
  return request({
    url: '/order/saleOrder/' + id,
    method: 'get'
  });
};

/**
 * 新增订单
 * @param data
 */
export const addOrder = (data: OrderForm) => {
  return request({
    url: '/order/saleOrder',
    method: 'post',
    data: data
  });
};

/**
 * 生成订单
 * @param data
 */
export const saveOrder = (data: DirectOrder) => {

  return request({
    url: '/order/saleOrder/saveOrder',
    method: 'post',
    data: data
  });
};

/**
 * 销售合同模块删除订单
 * @param data
 */
export const queryOrderStatus = (id: string | number) => {
  return request({
    url: '/order/saleOrder/checkHasAccount',
    method: 'post',
    data: {id}
  });
};


/**
 * 修改订单
 * @param data
 */
export const updateOrder = (data: OrderForm) => {

  //屏蔽多选字段保存
  if(data.cusNameIdList){
    data.cusNameIdList=undefined
  }
  if(data.customerCodeList){
    data.customerCodeList=undefined
  }
  return request({
    url: '/order/saleOrder',
    method: 'put',
    data: data
  });
};
/**
 * 完结订单
 * @param data
 */
export const finishedOrder = (orderId, finishRemark) => {
  return request({
    url: '/order/saleOrder/finishedOrder',
    method: 'post',
    params: {
      orderId, finishRemark
    }
  });
};

/**
 * 标记撤回
 * @param data
 */
export const setRecall = (orderId) => {
  return request({
    url: '/order/saleOrder/setRecall?orderId=' + orderId,
    method: 'get',
  });
};


/**
 * 修改订单
 * @param data
 */
export const updateOrderAndUpload = (data: OrderForm) => {
  //屏蔽多选字段保存
  if(data.cusNameIdList){
    data.cusNameIdList=undefined
  }
  if(data.customerCodeList){
    data.customerCodeList=undefined
  }

  return request({
    url: '/order/saleOrder/updateOrderAndUpload',
    method: 'put',
    data: data
  });
};


/**
 * 修改已完成订单
 * @param data
 */
export const updateOrderComplete = (data: OrderForm) => {
  //屏蔽多选字段保存
  if(data.cusNameIdList){
    data.cusNameIdList=undefined
  }
  if(data.customerCodeList){
    data.customerCodeList=undefined
  }

  return request({
    url: '/order/saleOrder/updateOrderComplete',
    method: 'put',
    data: data
  });
};


/**
 * 删除订单
 * @param id
 */
export const delOrder = (id: string | number | Array<string | number>) => {
  return request({
    url: '/order/saleOrder/' + id,
    method: 'delete'
  });
};

/**
 * 生成外协订单
 * @param data
 */
export const saveOutSourceOrder = (data: any) => {
  //屏蔽多选字段保存
  if(data.cusNameIdList){
    data.cusNameIdList=undefined
  }
  if(data.customerCodeList){
    data.customerCodeList=undefined
  }

  return request({
    url: '/order/saleOrder/sendOutSourceOrder',
    method: 'post',
    data: data
  });
};

/**
 * 获取流水号
 */
export const getSerialNumber = () => {
  return request({
    url: '/order/saleOrder/getSerialNumber',
    method: 'get'
  });
};

/**
 * 获取订单操作记录
 */
export const getLoggerById = (id: number|string) => {
  return request({
    url: '/objectLogger/getLoggerById',
    method: 'get',
    params: { id }
  });
};

// 获取 开放进度查询
export const getOrderProcess = (saleOrderId: number|string) => {
  return request({
    url: '/production/orderProcess/getOrderProcessErp',
    method: 'post',
    data: { saleOrderId, isApplet: '0' } // isApplet : 小程序1 ，erp 0
  });
};

// 确定 开放进度
export const openProcess = (data: any) => {
  return request({
    url: '/production/orderProcess/openProcess',
    method: 'post',
    data
  });
};

// 取消 开放进度
export const closeProcess = (data: any) => {
  return request({
    url: '/production/orderProcess/closeProcess',
    method: 'post',
    data
  });
};

/**
 * 标记库存发货
 * @param data
 */
export const setInventoryShipped = (orderId: any) => {
  return request({
    url: '/order/saleOrder/setInventoryShipped?orderId=' + orderId,
    method: 'get',
  });
};

/**
 * 取消标记库存发货
 * @param data
 */
export const setInventoryShippedBack = (orderId: any) => {
  return request({
    url: '/order/saleOrder/setInventoryShippedBack?orderId=' + orderId,
    method: 'get',
  });
};

/**
 * 提交完结订单
 * @param data
 */
export const submitFinishedOrder = (orderId, finishRemark) => {
  return request({
    url: '/order/saleOrder/submitFinishedOrder',
    method: 'post',
    params: {
      orderId, finishRemark
    }
  });
};

/**
 * 取消完结订单
 * @param data
 */
export const cancelFinishedOrder = (orderId) => {
  return request({
    url: '/order/saleOrder/cancelFinishedOrder',
    method: 'post',
    params: {
      orderId
    }
  });
};
/**
 * 驳回审核完结订单
 * @param data
 */
export const rejectFinishedOrder = (orderId, finishRemark) => {
  return request({
    url: '/order/saleOrder/rejectFinishedOrder',
    method: 'post',
    params: {
      orderId, finishRemark
    }
  });
};
/**
 *
 * @param query 历史订单已完成列表
 * @returns
 */
export const listCompletePostOrder = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
  return request({
    url: '/order/saleOrder/completeList',
    method: 'post',
    data: query
  });
};
