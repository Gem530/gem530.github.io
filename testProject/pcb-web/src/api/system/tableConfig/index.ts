import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { tableConfigData, tableConfigList } from '@/api/system/tableConfig/types';

/**
 * 保存表格宽度，排序，显隐配置
 * @param params
 * @returns {*}
 */
export const saveTableConfig = (data?: tableConfigData): AxiosPromise<any> => {
  return request({
    url: '/system/tableConfig/addOrUpdate',
    method: 'post',
    data
  });
};

/**
 * 获取 表格宽度，排序，显隐配置 列表
 * @param name 表格名称
 * @returns {*}
 */
export const getTableConfig = (name: string): AxiosPromise<tableConfigList> => {
    return request({
      url: '/system/tableConfig/queryByName',
      method: 'get',
      params: { name }
    });
  };
