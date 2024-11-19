import request from '../../util/request';
import config from "../../config/commonConfig";

const {api: {dailyReport: {marketDailyReport, marketDailyReportLine, projectDailyReportHeard, projectDailyReportExcel, projectDailyReportLine, productionDailyReport, productionDailyReportLine, operationDailyReport, onlyOnLineAndOffLineData, operationDailyReportNotChange, factoryDailyReport, factoryDailyReportLine, dailySwitch, dailySwitchReset, queryOperateReportPrice, updateOperateReportPrice, operationProductionReport, tenantConfigReport, getOperationDailyReportOnlyQuotation, getOperationDailyReportOnlyRanking, getSumEQP}}} = config;

// 获取市场日报
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
export const marketDailyReportAPI = (params) => {
    return request.get(marketDailyReport, params, true);
}

// 获取市场周趋势
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
export const marketDailyReportLineAPI = (params) => {
    return request.get(marketDailyReportLine, params, true);
}

// 获取工程日报 头部数据
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
export const projectDailyReportHeardAPI = (params) => {
    return request.get(projectDailyReportHeard, params, true);
}

// 获取工程日报 表格数据
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
// layer : 查询板数,不填默认 1(单层板)
// dateType: 数据类型,不填默认3绩效 ASSIGN("1","分配") FINISHED("2","完成") ACHIEVEMENT("3","绩效"),
export const projectDailyReportExcelAPI = (params) => {
    return request.get(projectDailyReportExcel, params, true);
}

// 获取工程日报 周趋势
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
// layer : 查询板数,不填默认 1(单层板)
// dateType: 数据类型,不填默认3绩效 ASSIGN("1","分配") FINISHED("2","完成") ACHIEVEMENT("3","绩效"),
export const projectDailyReportLineAPI = (params) => {
    return request.get(projectDailyReportLine, params, true);
}

// 获取生产日报
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
export const productionDailyReportAPI = (params) => {
    return request.get(productionDailyReport, params, true);
}

// 获取生产日报 周趋势
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
export const productionDailyReportLineAPI = (params) => {
    return request.get(productionDailyReportLine, params, true);
}

// 获取运营日报
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
export const operationDailyReportAPI = (params) => {
    return request.get(operationDailyReport, params, true);
}

// 获取运营日报
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
export const onlyOnLineAndOffLineDataAPI = (params) => {
    return request.get(onlyOnLineAndOffLineData, params, true);
}

// 获取运营日报
// queryDay(Date) 会查询当天的日报数据,不填则默认查今天
// type 查询类型,必填,查询queryDay对应的1当日,2本周,3当月
export const operationDailyReportNotChangeAPI = (params) => {
    return request.get(operationDailyReportNotChange, params, true);
}

// 获取工厂日报
export const factoryDailyReportAPI = (params) => {
    return request.get(factoryDailyReport, params, true);
}

// 获取工厂日报 周趋势
export const factoryDailyReportLineAPI = (params) => {
    return request.get(factoryDailyReportLine, params, true);
}

// 查询运营日报显隐配置
export const dailySwitchAPI = (type) => {
    return request.get(dailySwitch + type, {}, true);
}

// 修改运营日报显隐配置 type   ,paramValue ：json
export const dailySwitchResetAPI = (params) => {
    return request.postJson(dailySwitchReset, params, true);
}

// 查询目标金额目标面积
export const queryOperateReportPriceAPI = (params) => {
    return request.get(queryOperateReportPrice, params, true);
}

// 修改目标金额与目标面积 targetArea targetAmount
export const updateOperateReportPriceAPI = (params) => {
    return request.postJson(updateOperateReportPrice, params, true);
}

// 查询生产入库数据
export const operationProductionReportAPI = (params) => {
    return request.get(operationProductionReport, params, true);
}

// 查询春节所在月配置
export const tenantConfigReportAPI = (params) => {
    return request.get(tenantConfigReport, params, true);
}

// 增加报价未下单数据，数据统计
export const getOperationDailyReportOnlyQuotationAPI = (params) => {
    return request.get(getOperationDailyReportOnlyQuotation, params, true);
}

// 增加客户下单排名图表、取前10
export const getOperationDailyReportOnlyRankingAPI = (params) => {
    return request.get(getOperationDailyReportOnlyRanking, params, true);
}

// 获取水电报表
export const getSumEQPAPI = (params) => {
    return request.get(getSumEQP, params, true);
}