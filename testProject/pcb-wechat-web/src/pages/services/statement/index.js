import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {statement: {listOrderStatement, statementDetail, listOrderStatementSourceFull, statementDetailSourceFull, listOrderStatementSourceHalf, statementDetailSourceHalf}}} = config;

// 采购合同查询结单列表
// 查询参数: code(单号)
//   detailStatus : 2（只有已确认列表需要传2）
//   可传分页参数
export const listOrderStatementAPI = (params) => {
    return request.get(listOrderStatement, params, true);
}

// 采购合同申请结单
// {
//     "idList": [1802934826736652291], （详情id集合）
//     "status": "2",（2-确认结单，1-取消结单）
//     "confirmRemark": "确认备注"  
// }
export const statementDetailAPI = (params) => {
    return request.postJson(statementDetail, params, true);
}

// 外协订单查询结单列表
export const listOrderStatementSourceFullAPI = (params) => {
    return request.get(listOrderStatementSourceFull, params, true);
}

// 外协订单申请结单
export const statementDetailSourceFullAPI = (params) => {
    return request.postJson(statementDetailSourceFull, params, true);
}

// 工序外协查询结单列表
export const listOrderStatementSourceHalfAPI = (params) => {
    return request.get(listOrderStatementSourceHalf, params, true);
}

// 工序外协申请结单
export const statementDetailSourceHalfAPI = (params) => {
    return request.postJson(statementDetailSourceHalf, params, true);
}