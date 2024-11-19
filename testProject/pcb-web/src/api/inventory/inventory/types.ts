export interface InventoryVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 产品ID
   */
  commodityId: string | number;

  /**
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;
}

export interface InventoryForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;
}

export interface InventoryQuery extends PageQuery {
  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  yearMonth?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export const enum InventoryTypeEnum {
  /**
   * 订单外协收货入库
   */
  OUTSOURCE_RECEIVE = '1',
  /**
   * 订单外协退货出库
   */
  OUTSOURCE_RETURN = '2',
  /**
   * 生产入库
   */
  PRODUCTION_IN = '3',
  /**
   * 订单出库
   */
  ORDER_OUT = '4',
  /**
   * 退货入库
   */
  RETURN_IN = '5',
  /**
   * 盘点入库
   */
  CHECK_IN = '6',
  /**
   * 盘点出库
   */
  CHECK_OUT = '7',
  /**
   * 成品报废
   */
  SCRAP = '8',
  /**
   * 使用历史库存
   */
  PRODUCTION_OUT = '9',
  /**
   * 备品出库
   */
  RESERVE_OUT = '10',
  /**
   * 退货重发
   */
  RETURN_OUT = '11',
  /**
   * 订单外协备品收货入库
   */
  OUTSOURCE_RESERVE_RECEIVE = '12',
  /**
   * 历史库存解锁入库
   */
  PRODUCTION_RELA_IN = '13',
  /**
   * 投料驳回入库
   */
  PRODUCTION_REJECT_IN = '14'
}

export const inventoryTypeStrings = {
  [InventoryTypeEnum.OUTSOURCE_RECEIVE]: '订单外协收货',
  [InventoryTypeEnum.OUTSOURCE_RETURN]: '订单外协退货',
  [InventoryTypeEnum.PRODUCTION_IN]: '生产入库',
  [InventoryTypeEnum.ORDER_OUT]: '销售出库',
  [InventoryTypeEnum.RETURN_IN]: '销售退货',
  [InventoryTypeEnum.CHECK_IN]: '盘盈入库',
  [InventoryTypeEnum.CHECK_OUT]: '盘亏出库',
  [InventoryTypeEnum.SCRAP]: '成品报废',
  [InventoryTypeEnum.PRODUCTION_OUT]: '投料占用库存',
  [InventoryTypeEnum.RESERVE_OUT]: '备品出库',
  [InventoryTypeEnum.RETURN_OUT]: '销售退货重发',
  [InventoryTypeEnum.OUTSOURCE_RESERVE_RECEIVE]: '订单外协备品收货',
  [InventoryTypeEnum.PRODUCTION_RELA_IN]: '投料占用解锁',
  [InventoryTypeEnum.PRODUCTION_REJECT_IN]: '投料驳回'
};

export const inventoryTypeList =
    [
      {value: InventoryTypeEnum.ORDER_OUT, label: "销售出库"},
      {value: InventoryTypeEnum.RESERVE_OUT, label: "备品出库"},
      {value: InventoryTypeEnum.RETURN_IN, label: "销售退货"},
      {value: InventoryTypeEnum.RETURN_OUT, label: "销售退货重发"},
      {value: InventoryTypeEnum.OUTSOURCE_RECEIVE, label: "订单外协收货"},
      {value: InventoryTypeEnum.OUTSOURCE_RETURN, label: "订单外协退货"},
      {value: InventoryTypeEnum.OUTSOURCE_RESERVE_RECEIVE, label: "订单外协备品收货"},
      {value: InventoryTypeEnum.PRODUCTION_OUT, label: "投料占用库存"},
      {value: InventoryTypeEnum.PRODUCTION_RELA_IN, label: "投料占用解锁"},
      {value: InventoryTypeEnum.PRODUCTION_REJECT_IN, label: "投料驳回"},
      {value: InventoryTypeEnum.PRODUCTION_IN, label: "生产入库"},
      {value: InventoryTypeEnum.SCRAP, label: "成品报废"},
      {value: InventoryTypeEnum.CHECK_IN, label: "盘盈入库"},
      {value: InventoryTypeEnum.CHECK_OUT, label: "盘亏出库"},
    ]
