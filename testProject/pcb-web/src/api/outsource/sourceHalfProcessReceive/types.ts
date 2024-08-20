export interface SourceHalfProcessReceiveVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 半外协订单id
   */
  halfProcessOrderId: string | number;

  /**
   * 收货数量
   */
  quantity: number;

  /**
   * 收货时间
   */
  receiveTime: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 收货单位（大料、PNL、SET）
   */
  unit: string;

  /**
   * 收货编号
   */
  code: string;
}

export interface SourceHalfProcessReceiveForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;
  /**
   * 创建人
   */
  createByName?: string;
  /**
   * orderUnitName
   */
  orderUnitName?: string;
  /**
   * 半外协订单id
   */
  halfProcessOrderId?: string | number;

  /**
   * 收货数量
   */
  quantity?: number;

  /**
   * 收货时间
   */
  receiveTime?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 收货单位（大料、PNL、SET）
   */
  unit?: string;

  /**
   * 收货编号
   */
  code?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;
  /**
   * 产品编码
   */
  commodityCode?: string;
  /**
   * 工艺单id
   */
  planId?: string | number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 地址ID
   */
  addressId?: string | number;

  /**
   * 收货数量
   */
  receiveQuantity?: number;

  length?: number;
  width?: number;

  /**
   * 下单时间
   */
  placeOrderTime?: string;

  /**
   * 完成时间
   */
  completeTime?: string;

  /**
   * 排产单ID
   */
  productionId?: string | number;
  productionCode?: string;

  /**
   * 工艺ID
   */
  craftId?: string | number;
  craftName?: string;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 外发类型id
   */
  type?: string | number;
  typeList: any[];

  /**
   * 加工要求
   */
  requirement?: string;

  /**
   * 大料数量
   */
  schemeQuantity?: number;

  /**
   * 大料长
   */
  schemeLength?: number;

  /**
   * 大料宽
   */
  schemeWidth?: string | number;

  /**
   * PNL数量
   */
  pnlQuantity?: number;

  /**
   * PNL长
   */
  pnlLength?: number;

  /**
   * PNL宽
   */
  pnlWidth?: string | number;

  /**
   * SET数量
   */
  setQuantity?: number;

  /**
   * SET长
   */
  setLength?: number;

  /**
   * SET宽
   */
  setWidth?: string | number;

  typeList?: any[];
  checkedTypeList?: any[];

  /**
   * 外发类型名称
   */
  typeName?: string;

  /**
   * 单位名称
   */
  orderUnit?: string;

  /**
   * 订单数量
   */
  orderQuantity?: number;
  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 外协编码
   */
  halfProcessOrderCode?: string;
}

export interface SourceHalfProcessReceiveQuery extends PageQuery {
  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 半外协订单id
   */
  halfProcessOrderId?: string | number;

  /**
   * 收货数量
   */
  quantity?: number;

  /**
   * 收货时间
   */
  receiveTime?: string;

  /**
   * 收货单位（大料、PNL、SET）
   */
  unit?: string;

  /**
   * 收货编号
   */
  code?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
