import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProductionPlanVO, ProductionPlanForm, ProductionPlanQuery } from '@/api/project/productionPlan/types';
import { getCurrentInstance, ComponentInternalInstance } from 'vue';

/**
 * 查询工程-mi制作单列表
 * @param query
 * @returns {*}
 */

export const listProductionPlan = (query?: ProductionPlanQuery): AxiosPromise<ProductionPlanVO[]> => {
  return request({
    url: '/project/productionPlan/list',
    method: 'get',
    params: query
  });
};

/**
 * 检查订单是否发外协
 * @param query
 * @returns {*}
 */
export const checkSaleOrderByBo = (bo: any): any => {
  return request({
    url: '/production/production/checkSaleOrder',
    method: 'post',
    data: bo
  }).then(res => {
    return new Promise((resolve, reject) => {
      let outOrder:any = res;
      console.log("outOrder", outOrder);
      if (outOrder!=null && outOrder!='') {
        ElMessageBox.confirm(outOrder + "已发外协, 请务必向市场确认！")
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
 * 检查mi制作单的Test
 * @param query
 * @returns {*}
 */
export const checkMiTestCraftByBo = (bo: any): any => {
  return request({
    url: '/production/production/checkMiTestCraft',
    method: 'post',
    data: bo
  })
};
/**
 * 校验【MI工艺单管理】合拼增加限制条件及提醒
 * @param query
 * @returns {*}
 */
export const checkMergeSaleOrderByBo = (bo: any): any => {
  return request({
    url: '/production/production/checkMergeSaleOrder',
    method: 'post',
    data: bo
  })
};


/**
 * 查询工程-MI工艺单审核列表
 * @param query
 * @returns {*}
 */

export const listAudit = (query?: ProductionPlanQuery): AxiosPromise<ProductionPlanVO[]> => {
  return request({
    url: '/project/productionPlan/getAuditList',
    method: 'get',
    params: query
  });
};

/**
 * 查询工程-制作工艺单列表
 * @param query
 * @returns {*}
 */
export const getWaitProductionPlanList = (query?: ProductionPlanQuery): AxiosPromise<ProductionPlanVO[]> => {
  return request({
    url: '/project/productionPlan/getList',
    method: 'get',
    params: query
  });
};

/**
 * 查询工程-制作工艺单列表
 * @param query
 * @returns {*}
 */
export const getOutputReport = (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/project/productionPlan/getOutputReport',
    method: 'get',
    params: query
  });
};

/**
 * 查询工程-mi制作单详细
 * @param id
 */
export const getMiInfo = (id: string | number): AxiosPromise<any> => {
  return request({
    url: '/project/productionPlan/getMiVo/' + id,
    method: 'get'
  });
};

/**
 * 查询工程-mi制作单变更日志
 * @param id
 */
export const getMiInfoAlterLog = (id: string | number): AxiosPromise<any> => {
  return request({
    url: '/project/productionPlanAlterLog/queryByMiId/' + id,
    method: 'get'
  });
};

/**
 * 查询工程-mi制作单详细
 * @param id
 */
export const getProductionPlan = (id: string | number): AxiosPromise<ProductionPlanVO> => {
  return request({
    url: '/project/productionPlan/' + id,
    method: 'get'
  });
};

/**
 * 新增工程-mi制作单
 * @param data
 */
export const addProductionPlanAlterLog = (data: any) => {
  return request({
    url: '/project/productionPlanAlterLog/add',
    method: 'post',
    data: data
  });
};

/**
 * 新增工程-mi制作单
 * @param data
 */
export const addProductionPlan = (data: any) => {
  return request({
    url: '/project/productionPlan',
    method: 'post',
    data: data
  });
};

/**
 * 修改工程-mi制作单
 * @param data
 */
export const updateProductionPlan = (data: ProductionPlanForm) => {
  return request({
    url: '/project/productionPlan',
    method: 'put',
    data: data
  });
};

/**
 * 编辑-mi制作单
 * @param data
 */
export const saveMi = (data: any) => {
  return request({
    url: '/project/productionPlan/save',
    method: 'post',
    data: data
  });
};

/**
 * 删除工程-mi制作单
 * @param id
 */
export const delProductionPlan = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/productionPlan/' + id,
    method: 'delete'
  });
};

/**
 * 订单预投列表
 */

export const listOrderPrediction = (query?: any) => {
  return request({
    url: '/project/productionPlan/getPredictionList',
    method: 'get',
    params: query
  });
};

export const postListOrderPrediction = (query?: any) => {
  return request({
    url: '/project/productionPlan/getPredictionList',
    method: 'post',
    data: query
  });
};

/**
 * 预投提交
 */
export const savePrediction = (data: any) => {
  return request({
    url: '/project/productionPlan/update',
    method: 'post',
    data: data
  });
};

/**
 * MI单管理-修改(权限校验)
 */
export const updateCheckPer = (data: any) => {
  return request({
    url: '/project/productionPlan/updateCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 生产投料-驳回(权限校验)
 */
export const refusalCheckPer = (data: any) => {
  return request({
    url: '/project/productionPlan/refusalCheckPer',
    method: 'post',
    data: data
  });
};

/**
 * 获取模板
 */
export const getTemplateList = () => {
  return request({
    url: '/project/nodeInfo/getTemplateList',
    method: 'get',
  });
};

/**
 * 获取模板
 */
export const getCheckUpdate = (id: number) => {
  return request({
    url: '/production/production/checkUpdate',
    method: 'post',
    data: { id }
  });
};

/**
 * 高亮
 */
export const doHeightLightRow = (id:any) => {
  return request({
    url: '/project/productionPlan/addHighLight/'+id,
    method: 'get'
  });
};
/**
 * 取消高亮
 */
export const doRemoveHeightLightRow = (id:any) => {
  return request({
    url: '/project/productionPlan/removeHighLight/'+id,
    method: 'get'
  });
};

/**
 * 作废工程-mi制作单
 * @param id
 */
export const invalidProductionPlan = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/productionPlan/invalidMiProductionPlan/' + id,
    method: 'get'
  });
};

/**
 * 撤回预投订单-mi制作单
 * @param id
 */
export const revocationProductionPlan = (id: string | number | Array<string | number>) => {
  return request({
    url: '/project/productionPlan/revocation/' + id,
    method: 'get'
  });
};
