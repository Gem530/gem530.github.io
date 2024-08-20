import request from '@/utils/request';
// import { AxiosPromise } from 'axios';
import { StructureTemplate } from '@/api/basedata/structureTemplateLayer/types';

/**
 * 生成层压结构模板
 * @param params
 * @returns {*}
 */
export const saveStructureTemplate = (data?: StructureTemplate) => {
  return request({
    url: '/basedata/structureTemplateLayer/save',
    method: 'post',
    data
  });
};

/**
 * 获取层压结构模板列表
 * @param params
 * @returns {*}
 */
export const getStructureTemplateList = () => {
    return request({
      url: '/basedata/structureTemplateLayer/getList',
      method: 'get',
    });
  };
