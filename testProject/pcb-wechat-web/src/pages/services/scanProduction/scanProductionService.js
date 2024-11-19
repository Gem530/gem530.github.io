import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {scanProduction: {getCardType, getCardInfo, handleTask, getCanCountQuantity}, transition: {doRequest}}} = config;

export const getCardPnls = (params) => {
  return request.get(getCardType, params, true);
}

export const getCurrentNodeInfo = (params) => {
  return request.postJson(getCardInfo, params, true);
}

export const onHandleTask = (params) => {
  return request.postJson(handleTask, params, false);
}

export const getCanCountQuantityAPI = (params) => {
  return request.get(getCanCountQuantity, params, false);
}

export const getCardPnlsTran = (params) => {
  let query = {
    address: 'api/MiniAppPassCard/GetCardType',
    httpMethod: 'get',
    params: params
  }
  return request.postJson(doRequest, query, true);
}

export const getCurrentNodeInfoTran = (params) => {
  let query = {
    address: 'api/MiniAppPassCard/GetCardInfo',
    httpMethod: 'get',
    params: {
      cardId: pnlSelected,
    },
  };
  return request.postJson(doRequest, query, true);
}

export const onReceiveTaskTran = (params) => {
  let query = {
    address: 'api/MiniAppPassCard/ReceiveTask',
    httpMethod: 'post',
    params: {
      cardId: pnlSelected,
      currentNodeId: currentNodeInfo.currentNodeId,
    },
  };
  return request.postJson(doRequest, query, true);
}
