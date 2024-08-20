import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  SourceHalfProcessCalcRuleVO,
  SourceHalfProcessCalcRuleForm,
  SourceHalfProcessCalcRuleQuery
} from '@/api/outsource/sourceHalfProcessCalcRule/types';

/**
 * 查询外协加工计价规则列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfProcessCalcRule = (query?: SourceHalfProcessCalcRuleQuery): AxiosPromise<SourceHalfProcessCalcRuleVO[]> => {
  return request({
    url: '/outsource/sourceHalfProcessCalcRule/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工计价规则详细
 * @param id
 */
export const getSourceHalfProcessCalcRule = (id: string | number): AxiosPromise<SourceHalfProcessCalcRuleVO> => {
  return request({
    url: '/outsource/sourceHalfProcessCalcRule/getInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增外协加工计价规则
 * @param data
 */
export const addSourceHalfProcessCalcRule = (data: SourceHalfProcessCalcRuleForm) => {
  return request({
    url: '/outsource/sourceHalfProcessCalcRule/add',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协加工计价规则
 * @param data
 */
export const updateSourceHalfProcessCalcRule = (data: SourceHalfProcessCalcRuleForm) => {
  return request({
    url: '/outsource/sourceHalfProcessCalcRule/edit',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协加工计价规则
 * @param id
 */
export const delSourceHalfProcessCalcRule = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceHalfProcessCalcRule/' + id,
    method: 'delete'
  });
};
/**
 * 根据供应商id和物料id查询供应商基价
 * @param data
 */
export const getSupplierMaterialPrice = (supplierId: number | string, type: string) => {
  return request({
    url: '/outsource/sourceHalfProcessCalcRule/getSupplierPrice',
    method: 'post',
    data: { supplierId, type }
  });
};

/**
 * 根据工序id查询规格
 * @param data
 */
export const getRuleByCraftId = (craftId: number | string) => {
  return request({
    url: '/outsource/sourceHalfProcessCalcRule/getRuleByCraftId/' + craftId,
    method: 'get',
   
  });
};
