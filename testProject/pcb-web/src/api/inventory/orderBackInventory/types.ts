export interface OrderBackInventoryVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 退货单号
   */
  originNo: string;

  /**
   * 退货来源id
   */
  originId: string | number;

  /**
   * 入库编码
   */
  inventoryNo: string;

  /**
   * 产品名称
   */
  dataName: string;

  /**
   * 产品编码
   */
  dataCode: string;

  /**
   * 产品id
   */
  dataId: string | number;

  /**
   * 下单数量
   */
  orderQuantity: number;

  /**
   * 入库数量
   */
  quantity: number;

  /**
   * 正常数量
   */
  generalOutQuantity: number;

  /**
   * 报废数量
   */
  scrapOutQuantity: number;

  /**
   * 返工数量
   */
  backRepairQuantity: number;

  /**
   * 报废数量
   */
  scrapoutQuantity: number;

  /**
   * 销售单号
   */
  saleOrderNo: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 状态
   */
  status: string;

  /**
   * 板材
   */
  board: string;

  /**
   * 订单ID
   */
  saleOrderId: string | number;

  /**
   * 责任人
   */
  responsible: string;

  /**
   *
   */
  process: string;
}

export interface OrderBackInventoryForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 退货单号
   */
  originNo?: string;

  /**
   * 退货来源id
   */
  originId?: string | number;

  /**
   * 入库编码
   */
  inventoryNo?: string;

  /**
   * 产品名称
   */
  dataName?: string;

  /**
   * 产品编码
   */
  dataCode?: string;

  /**
   * 产品id
   */
  dataId?: string | number;

  /**
   * 下单数量
   */
  orderQuantity?: number;

  /**
   * 入库数量
   */
  quantity?: number;

  /**
   * 正常数量
   */
  generalOutQuantity?: number;

  /**
   * 报废数量
   */
  scrapOutQuantity?: number;

  /**
   * 返工数量
   */
  backRepairQuantity?: number;

  /**
   * 销售单号
   */
  saleOrderNo?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态
   */
  status: string;

  /**
   * 板材
   */
  board: string;

  /**
   * 订单ID
   */
  saleOrderId: string | number;

  /**
   * 责任人
   */
  responsible: string;

  /**
   *
   */
  process: string;

}

export interface OrderBackInventoryQuery extends PageQuery {

  /**
   * 退货单号
   */
  originNo?: string;

  /**
   * 退货来源id
   */
  originId?: string | number;

  /**
   * 入库编码
   */
  inventoryNo?: string;

  /**
   * 产品名称
   */
  dataName?: string;

  /**
   * 产品编码
   */
  dataCode?: string;

  /**
   * 产品id
   */
  dataId?: string | number;

  /**
   * 下单数量
   */
  orderQuantity?: number;

  /**
   * 入库数量
   */
  quantity?: number;

  /**
   * 正常数量
   */
  generalOutQuantity?: number;

  /**
   * 报废数量
   */
  scrapOutQuantity?: number;

  /**
   * 返工数量
   */
  backRepairQuantity?: number;

  /**
   * 销售单号
   */
  saleOrderNo?: string;

  /**
   * 日期范围参数
   */
  params?: any;
  /**
   * 状态 未完成0 已完成1
   */
  status?: string;

  /**
   * 板材
   */
  board?: string;

  /**
   * 订单ID
   */
  saleOrderId?: string | number;
  /**
   * 责任人
   */
  responsible?: string;

  /**
   *
   */
  process?: string;

}



