import request from '@/utils/request';
import {download} from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProductionVO, ProductionForm, ProductionQuery } from '@/api/production/production/types';
import {DirectMaterialReject} from "@/api/purchase/materialBorrow/types";
import {DirectProductInout} from "@/api/purchase/materialProductionInOut/types";

/**
 * 查询生产-排产单列表
 * @param query
 * @returns {*}
 */
export const listProduction = (query?: ProductionQuery): AxiosPromise<ProductionVO[]> => {
  return request({
    url: '/production/production/getFeedList',
    method: 'get',
    params: query
  });
};

/**
 * 查询生产-排产单列表
 * @param query
 * @returns {*}
 */
export const queryMiByProductionIds = (id: string | number): AxiosPromise<ProductionVO[]> => {
  return request({
    url: '/production/production/getMiByProductionIds?ids=' +  [id],
    method: 'get'
  });
};

/**
 * 查询生产工序统计
 * @param query
 */
export const listProductionStatistics = (query?: ProductionQuery): AxiosPromise<ProductionVO[]> => {
  return request({
    url: '/production/production/listProductionStatistics',
    method: 'get',
    params: query
  });
};

/**
 * 查询生产物料发料-排产单列表
 * @param query
 * @returns {*}
 */
export const getProductionList = (query?: ProductionQuery): AxiosPromise<ProductionVO[]> => {
  return request({
    url: '/production/production/getProductionList',
    method: 'get',
    params: query
  });
};

/**
 * 查询生产-待审核列表
 * @param query
 * @returns {*}
 */

export const listAuditProduction = (query?: ProductionQuery): AxiosPromise<ProductionVO[]> => {
  return request({
    url: '/production/production/getWaitAuditList',
    method: 'get',
    params: query
  });
};

/**
 * 查询生产-排产单详细
 * @param id
 */
export const getProduction = (id: string | number): AxiosPromise<ProductionVO> => {
  return request({
    url: '/production/production/' + id,
    method: 'get'
  });
};

/**
 * 查询详情 产品库存数，历史使用库存数  待审核pnl数
 */
export const getDetails = (data?: any) => {
  return request({
    url: '/production/production/getDetails',
    method: 'post',
    data: data
  });
};

/**
 * 获取投料详情
 */
export const getProductionDetail = (query?: any) => {
  return request({
    url: '/production/production/getProductionDetail',
    method: 'get',
    params: query
  });
};

/**
 * 新增生产-排产单
 * @param data
 */
export const addProduction = (data: ProductionForm) => {
  return request({
    url: '/production/production',
    method: 'post',
    data: data
  });
};

/**
 * 新增生产-排产单
 * @param data
 */
export const saveProduction = (data: any) => {
  return request({
    url: '/production/production/saveProduction',
    method: 'post',
    data: data
  });
};

/**
 * 修改生产-排产单
 * @param data
 */
export const updateProduction = (data: ProductionForm) => {
  return request({
    url: '/production/production',
    method: 'put',
    data: data
  });
};

/**
 * 排产进度管理-修改(权限校验)
 * @param data
 */
export const updateProductionCheckPer = (data: ProductionForm) => {
  return request({
    url: '/production/production/updateCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 完成过数-排产单
 * @param data
 */
export const updateAllNode = (cardId) => {
  return request({
    url: '/production/card/completeAllNode/' + cardId,
    method: 'post',
  });
};

/**
 * 删除生产-排产单
 * @param id
 */
export const delProduction = (id: string | number | Array<string | number>) => {
  return request({
    url: '/production/production/' + id,
    method: 'delete'
  });
};

/**
 * 过数
 * @param data
 */
export const saveCardNode = (data: any) => {
  return request({
    url: '/production/production/saveCardNodeWeb',
    method: 'post',
    data: data
  });
};

/**
 * 获取节点list
 */
export const listCardNode = (cardId: number) => {
  return request({
    url: '/production/production/getCardNodeDetails?cardId='+cardId,
    method: 'get'
  });
};

/**
 * 过数回退
 */
export const returnCardNode = (data: any) => {
  return request({
    url: '/production/production/returnCardNode',
    method: 'post',
    data: data
  });
};

/**
 * 流转卡 开始
 */
export const startCardNode = (data: any) => {
  return request({
    url: '/production/production/startCardNode',
    method: 'post',
    data: data
  });
};

/**
 * 校验是否有未审核通过数据
 */
export const checkFeed = (planId: number) => {
  return request({
    url: '/production/production/checkFeed?planId='+planId,
    method: 'get'
  });
};

/**
 * 获取补投列表
 * @param query
 * @returns {*}
 */
export const getProductionRemediationList = (query?: any) => {
  return request({
    url: '/production/production/getProductionRemediationList',
    method: 'get',
    params: query
  });
};

/**
 * 排产记录
 */
export const getProductionListByPlanId = (data?: any) => {
  return request({
    url: '/production/production/getProductionListByPlanId',
    method: 'post',
    data: data
  });
};

/**
 * 入库记录
 */
export const getInInventoryListByPlanId = (data?: any) => {
  return request({
    url: '/production/production/getInInventoryListByPlanId',
    method: 'post',
    data: data
  });
};

/**
 * 投料记录
 */
export const getPnlDetail = (data?: any) => {
  return request({
    url: '/production/production/getPnlDetails',
    method: 'post',
    data: data
  });
};

/**
 * 生产WIP
 */
export const getProductionWIP = (data?: any) => {
  return request({
    url: '/production/production/getProductionWIP',
    method: 'post',
    data: data
  });
};
/**
 * 生产WIP_V2
 */
export const getProductionWIPV2 = (data?: any) => {
  return request({
    url: '/production/production/getProductionWIPV2',
    method: 'post',
    data: data
  });
};
/**
 * 生产WIP_V2
 */
export const getProductionWIPV3 = (data?: any) => {
  return request({
    url: '/production/production/getProductionWIPV3',
    method: 'post',
    data: data
  });
};
/**
 * 销售WIP
 */
export const getOrderWIP = (data?: any) => {
  return request({
    url: '/production/production/getOrderWIP',
    method: 'post',
    data: data
  });
};

/**
 * 计划拖期汇总
 */
export const getProductionCardTotal = (data?: any) => {
  return request({
    url: '/production/production/getProductionCardTotal',
    method: 'post',
    data: data
  });
};

/**
 * 工序产能分析
 * @param query
 */
export const getCraftProductivityAnalysis = (data?:any) => {
  return request({
    url: '/production/production/getCraftProductivityAnalysis',
    method: 'post',
    data: data
  });
};

export const getPlanPrintInfo = (id: string | number) => {
  return request({
    url: '/production/production/getPrintInfo/' + id,
    method: 'get'
  });
};

export const exportDailyProduction = (data?:any) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const currentDate = `${year}-${month}-${day}`;
  return download('/production/production/exportDailyProduction', data, `${currentDate}-计划排单表.xlsx`, true);
};

/**
 * 排产进度查询
 * @param query
 * @returns {*}
 */

export const listProductionDetails = (query?: ProductionQuery): AxiosPromise<ProductionVO[]> => {
  return request({
    url: '/production/production/getProductionDetails',
    method: 'get',
    params: query
  });
};

export const getProductionSum = (data?: any) => {
  return request({
    url: '/production/production/getProductionSum',
    method: 'post',
    data: data
  });
};

/**
 * 删除排产投料记录
 * @param query
 */
export const deleteProductionFeed = (data?:any) => {
  return request({
    url: '/production/production/deleteProductionFeed',
    method: 'post',
    data: data
  });
};

/**
 * 查询完工情况
 * @param id
 */
export const getPercentateValue = (id: string | number) => {
  return request({
    url: '/production/card/getPercentate/' + id,
    method: 'get'
  });
};

/**
 * 检查工艺单是否使用历史库存
 * @param query
 * @returns {*}
 */
export const checkCommodityRelation = (bo: any): any => {
  return request({
    url: '/production/production/checkCommodityRelation',
    method: 'post',
    data: bo
  }).then(res => {
    return new Promise((resolve, reject) => {
      let outOrder:any = res;
      if (outOrder!=null && outOrder!='') {
        ElMessageBox.confirm(outOrder + "存在库存未使用，是否确认继续操作？")
          .then(() => {
            resolve(true)
          })
          .catch(() => {
            resolve(false)
          });
      } else {
        resolve(true)
      }
    })
  }).catch((e) => {
    console.log(e);
    return true
  });
};

/**
 * 检查订单是否完成
 * @param query
 * @returns {*}
 */
export const checkOrderFinish = (bo: any): any => {
  return request({
    url: '/production/production/checkOrderFinish',
    method: 'post',
    data: bo
  }).then(res => {
    return new Promise((resolve, reject) => {
      let outOrder:any = res;
      if (outOrder!=null && outOrder!='') {
        ElMessageBox.confirm(outOrder + "订单已完成，是否确认继续操作？")
          .then(() => {
            resolve(true)
          })
          .catch(() => {
            resolve(false)
          });
      } else {
        resolve(true)
      }
    })
  }).catch((e) => {
    console.log(e);
    return true
  });
};
