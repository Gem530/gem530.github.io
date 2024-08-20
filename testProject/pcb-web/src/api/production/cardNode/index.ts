import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CardNodeVO, CardNodeForm, CardNodeQuery } from '@/api/production/cardNode/types';

/**
 * 查询流转卡过数节点列表
 * @param query
 * @returns {*}
 */

export const listCardNode = (query?: CardNodeQuery): AxiosPromise<CardNodeVO[]> => {
  return request({
    url: '/production/cardNode/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询流转卡过数节点详细
 * @param id
 */
export const getCardNode = (id: string | number): AxiosPromise<CardNodeVO> => {
  return request({
    url: '/production/cardNode/' + id,
    method: 'get'
  });
};

/**
 * 新增流转卡过数节点
 * @param data
 */
export const addCardNode = (data: CardNodeForm) => {
  return request({
    url: '/production/cardNode',
    method: 'post',
    data: data
  });
};

/**
 * 修改流转卡过数节点
 * @param data
 */
export const updateCardNode = (data: CardNodeForm) => {
  return request({
    url: '/production/cardNode',
    method: 'put',
    data: data
  });
};

/**
 * 删除流转卡过数节点
 * @param id
 */
export const delCardNode = (id: string | number | Array<string | number>) => {
  return request({
    url: '/production/cardNode/' + id,
    method: 'delete'
  });
};

export const getCraftsInProduction = () => {
  return request({
    url: '/production/cardNode/getCraftsInProduction',
    method: 'get',
  });
};

/**
 * 查询排产单过数节点
 * @param id
 */
export const getCardNodes = (id: string | number): AxiosPromise<CardNodeVO> => {
  return request({
    url: '/production/cardNode/getCardNodes/' + id,
    method: 'get'
  });
};
