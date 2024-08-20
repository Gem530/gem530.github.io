export interface OrderBackInventoryRecordVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 出库编码
   */
  inventoryNo: string;

  /**
   * 出库类型
   */
  sourceType: string;

  /**
   * 处理数量
   */
  handleQuantity: number;

  /**
   * 操作人
   */
  operatorId: string | number;

  /**
   * 订单详情id
   */
  saleOrderDetailId: string | number;

  /**
   * 库位信息
   */
  positionMes: string;

  /**
   * 报废工序名
   */
  scrapNodeName: string;

  /**
   * 报废责任人
   */
  scrapUser: number;

  /**
   * 报废数量
   */
  scrapOutQuantity: number;

  /**
   * 0正常品 1报废 2重新发货
   */
  status: string;

  /**
   * 退货单id
   */
  returnOrderId: string | number;

  /**
   * 备注
   */
  remark: string;


  /**
   * 操作时间
   */
  operatorTime?: string;
  /**
   * 退货单id
   */
  returnNoId?: string | number;

  /**
   * 产品名称
   */
  dataName?: string;

  /**
   * 产品编码
   */
  dataCode?: string;

  /**
   * 下单数量
   */
  orderQuantity?: string | number;

  /**
   * 入库数量
   */
  quantity?: string | number;

  /**
   * 正常数量
   */
  generalOutQuantity?: string | number;

  /**
   * 返工数量
   */
  backRepairQuantity?: string | number;

  /**
   * 销售单号
   */
  saleOrderNo?: string | number;

}

export interface OrderBackInventoryRecordForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 出库编码
   */
  inventoryNo?: string;

  /**
   * 出库类型
   */
  sourceType?: string;

  /**
   * 处理数量
   */
  handleQuantity?: number;

  /**
   * 操作人
   */
  operatorId?: string | number;

  /**
   * 订单详情id
   */
  saleOrderDetailId?: string | number;

  /**
   * 库位信息
   */
  positionMes?: string;

  /**
   * 报废工序名
   */
  scrapNodeName?: string;

  /**
   * 报废责任人
   */
  scrapUser?: number;

  /**
   * 报废数量
   */
  scrapOutQuantity?: number;

  /**
   * 0正常品 1报废 2重新发货
   */
  status?: string;

  /**
   * 退货单id
   */
  returnOrderId?: string | number;

  /**
   * 备注
   */
  remark?: string;
  /**
   * 正常品数量
   */
  generalOutQuantity?: string | number;

  /**
   * 数组 (数量,库位信息)
   */
  normalInfos?: any;

}

export interface OrderBackInventoryRecordQuery extends PageQuery {

  /**
   * 出库编码
   */
  inventoryNo?: string;

  /**
   * 出库类型
   */
  sourceType?: string;

  /**
   * 处理数量
   */
  handleQuantity?: number;

  /**
   * 操作人
   */
  operatorId?: string | number;

  /**
   * 订单详情id
   */
  saleOrderDetailId?: string | number;

  /**
   * 库位信息
   */
  positionMes?: string;

  /**
   * 报废工序名
   */
  scrapNodeName?: string;

  /**
   * 报废责任人
   */
  scrapUser?: number;

  /**
   * 报废数量
   */
  scrapOutQuantity?: number;

  /**
   * 0正常品 1报废 2重新发货
   */
  status?: string;

  /**
   * 退货单id
   */
  returnOrderId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
  /**
   * 正常品数量
   */
  generalOutQuantity?: string | number;
}



