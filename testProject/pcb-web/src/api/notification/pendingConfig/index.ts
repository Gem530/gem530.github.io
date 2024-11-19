import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PendingConfigVO, PendingConfigForm, PendingConfigQuery } from '@/api/notification/pendingConfig/types';


/**
 * 校验是否满足跳转条件
 *
 * @param data
 */
export const verifyJumpCondition = (data: PendingConfigForm) => {
  return request({
    url: '/notification/pendingConfig/verifyJumpCondition',
    method: 'post',
    data: data
  });
};
