import request from '@/utils/request';

/**
 * @param query
 * @returns {*}
 * 月份	month ("yyyy-MM")
 */
export const getElectricList = (params: any): any => {
  return request({
    url: '/eqp/getElectricList',
    method: 'get',
    params
  });
};
/**
 * @param query
 * @returns {*}
 * 月份	month ("yyyy-MM")
 */
export const getEqpElectricMonthList = (params: any): any => {
  return request({
    url: '/eqp/getEqpElectricMonthList',
    method: 'get',
    params
  });
};
/**
 * @param query
 * @returns {*}
 * 月份	month ("yyyy-MM")
 */
export const getEqpWaterMonthList = (params: any): any => {
  return request({
    url: '/eqp/getEqpWaterMonthList',
    method: 'get',
    params
  });
};
/**
 * @param query
 * @returns {*}
 * 月份	month ("yyyy-MM")
 */
export const getWaterList = (params: any): any => {
  return request({
    url: '/eqp/getWaterList',
    method: 'get',
    params
  });
};

/**
 * @param query
 * @returns {*}
 * 月份	month ("yyyy-MM")
 */
export const getWaterAndElectricReport = (params: any): any => {
  return request({
    url: '/eqp/getWaterAndElectricReport',
    method: 'get',
    params
  });
};

/**
 * 插入或更新读数数据
 */
export const insertOrUpdateRead = (data: any): any => {
  return request({
    url: '/eqp/insertOrUpdateRead',
    method: 'POST',
    data: data
  });
};

