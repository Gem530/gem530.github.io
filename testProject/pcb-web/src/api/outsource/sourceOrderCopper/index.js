import request from "@/utils/request";


export const listSourceOrderCopper = (query) =>{
  return request({
    url: '/outsource/sourceOrderCopper/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询外协接单铜价配置详细
 * @param id
 */
export const getSourceOrderCopper = (id)=> {
  return request({
    url: '/outsource/sourceOrderCopper/' + id,
    method: 'get'
  });
};


/**
 * 新增外协接单铜价配置
 * @param data
 */
export const addSourceOrderCopper = (data) => {
  return request({
    url: '/outsource/sourceOrderCopper',
    method: 'post',
    data: data
  });
};

/**
 * 修改外协接单铜价配置
 * @param data
 */
export const updateSourceOrderCopper = (data) => {
  return request({
    url: '/outsource/sourceOrderCopper',
    method: 'put',
    data: data
  });
};

/**
 * 删除外协接单铜价配置
 * @param id
 */
export const delSourceOrderCopper = (id) => {
  return request({
    url: '/outsource/sourceOrderCopper/' + id,
    method: 'delete'
  });
};
