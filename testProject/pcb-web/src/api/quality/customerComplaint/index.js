import request from "@/utils/request";


/**
 * 查询客诉单据列表
 * @param query
 * @returns {*}
 */
export const listCustomerComplaint = (query) => {
  return request({
    url: '/quality/customerComplaint/list',
    method: 'get',
    params: query
  });
};



/**
 * 预览单据详情
 */
export const getCustomerComplaint = (query) => {
  return request({
    url: '/quality/customerComplaint/' + query.id,
    method: 'get'
  });
};

/**
 * 删除未提交的单据
 */
export const delCustomerComplaint = (query) => {
  return request({
    url: '/quality/customerComplaint/' + query.id,
    method: 'delete'
  });
};

/**
 * 提交单据
 */
export const commitCustomerComplaint = (query) => {
  return request({
    url: '/quality/customerComplaint/commit/' + query.id,
    method: 'post'
  });
};


/**
 * 保存客诉单据
 */
export const addCustomerComplaint = (query) => {
  return request({
    url: '/quality/customerComplaint',
    method: 'post',
    data: query.data
  });
};


/**
 * 更新客诉单据
 */
export const updateCustomerComplaint = (query) => {
  return request({
    url: '/quality/customerComplaint',
    method: 'put',
    data: query.data
  });
};
