import request from "@/utils/request";

/**
 * 查询服务器日志列表
 * @param query
 * @returns {*}
 */
export const queryList = () => {
  return request({
    url: '/monitor/log/list',
    method: 'get',
  });
};
