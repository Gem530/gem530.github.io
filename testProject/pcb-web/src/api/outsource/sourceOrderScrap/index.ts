import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SourceOrderScrapVO, SourceOrderScrapForm, SourceOrderScrapQuery } from '@/api/outsource/sourceOrderScrap/types';

/**
 * 查询外协接单报废列表
 * @param query
 * @returns {*}
 */

export const listSourceOrderScrap = (query?: SourceOrderScrapQuery): AxiosPromise<SourceOrderScrapVO[]> => {
  return request({
    url: '/outsource/sourceOrderScrap/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协接单报废详细
 * @param id
 */
export const getSourceOrderScrap = (id: string | number): AxiosPromise<SourceOrderScrapVO> => {
  return request({
    url: '/outsource/sourceOrderScrap/' + id,
    method: 'get'
  });
};

/**
 * 新增外协接单报废
 * @param data
 */
export const addSourceOrderScrap = (data: SourceOrderScrapForm) => {
  return request({
    url: '/outsource/sourceOrderScrap',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协接单报废
 * @param data
 */
export const updateSourceOrderScrap = (data: SourceOrderScrapForm) => {
  return request({
    url: '/outsource/sourceOrderScrap',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协接单报废
 * @param id
 */
export const delSourceOrderScrap = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceOrderScrap/' + id,
    method: 'delete'
  });
};

/**
 * 查询最大可报废数量
 * @param id
 */
export const getMaxScrapQuantity = (id: string | number) => {
  return request({
    url: '/outsource/sourceOrderScrap/maxQuantity/' + id,
    method: 'get'
  });
};
