import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 物料出入库明细查询
 * @param query
 * @returns {*}
 */
export const listMaterial= (query?: any): AxiosPromise<any[]> => {
  return request({
    url: '/report/materialDetail/list',
    method: 'get',
    params: query
  });
};
