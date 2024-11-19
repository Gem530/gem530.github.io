import request from '@/utils/request';
/**
 * 查询外协加工计价规则列表
 * @param query
 * @returns {*}
 */

export const listSourceHalfProcessCalcRule = (query?: any) => {
  return request({
    url: '/outsource/sourceOrderCalcRule/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协加工计价规则详细
 * @param id
 */
export const getSourceHalfProcessCalcRule = (id: string | number) => {
  return request({
    url: '/outsource/sourceOrderCalcRule/getInfo/' + id,
    method: 'get'
  });
};

/**
 * 新增外协加工计价规则
 * @param data
 */
export const addSourceHalfProcessCalcRule = (data: any) => {
  return request({
    url: '/outsource/sourceOrderCalcRule/add',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协加工计价规则
 * @param data
 */
export const updateSourceHalfProcessCalcRule = (data: any) => {
  return request({
    url: '/outsource/sourceOrderCalcRule/edit',
    method: 'post',
    data: data
  });
};

/**
 * 删除外协加工计价规则
 * @param id
 */
export const delSourceHalfProcessCalcRule = (id: string | number | Array<string | number>) => {
  return request({
    url: '/outsource/sourceOrderCalcRule/' + id,
    method: 'delete'
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

/**
 * 查询外协加工计价规则详情信息
 * @param id
 */
export const getCalcRuleDetail = (id: string | number) => {
  return request({
    url: '/outsource/sourceOrderCalcRule/getCalcRuleDetail/' + id,
    method: 'get'
  });
};
