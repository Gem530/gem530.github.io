import request from '@/request'
import * as tsType from '../type'

const baseUrl = '/huobi-api'
/**
 * @author hjj
 * @description 获取火币系统时间戳
 */
export function getTimestamp(): Promise<unknown> {
  return request({
      baseUrl,
      method: 'get',
      url: '/v1/common/timestamp'
  })
}

/**
 * @author hjj
 * @description 获取k线数据
 * https://huobiapi.github.io/docs/spot/v1/cn/#k
 * @param symbol string 必填,交易对,btcusdt, ethbtc等（如需获取杠杆ETP净值K线，净值symbol = 杠杆ETP交易对symbol + 后缀‘nav’，例如：btc3lusdtnav）
 * @param period string 必填,返回数据时间粒度，也就是每根蜡烛的时间区间,1min, 5min, 15min, 30min, 60min, 4hour, 1day, 1mon, 1week, 1year
 * @param size number 非必填,返回 K 线数据条数,[1-2000]
 */
export function getKline(params: tsType.klineParams): Promise<unknown> {
  return request({
      baseUrl,
      method: 'get',
      url: '/market/history/kline',
      params
  })
}

/**
 * @author hjj
 * @description 获取所有交易对(V2)
 * https://huobiapi.github.io/docs/spot/v1/cn/#v2
 * @param ts 增量时间戳 非必填
 */
export function getSymbolList(ts?: number): Promise<unknown> {
  return request({
      baseUrl,
      method: 'get',
      url: '/v2/settings/common/symbols',
      params: { ts }
  })
}