export interface SourceFullProcessReceiveVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 外协订单id
   */
  fullProcessOrderId: string | number;
  /**
   * 客户id
   */
  cusId: string | number;
  /**
   * 销售订单id
   */
  saleOrderId: string | number;

  /**
   * 收货数量
   */
  quantity: number;
  /**
   * 待收货数量
   */
  waitReceiveNum: number;

  /**
   * 收货时间
   */
  receiveTime: string;

  /**
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;
}

export interface SourceFullProcessReceiveForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 外协订单id
   */
  fullProcessOrderId?: string | number;

  /**
   * 收货数量
   */
  quantity?: number;
  /**
   * 待收货数量
   */
  waitReceiveNum?: number;

  /**
   * 收货时间
   */
  receiveTime?: string;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;
}

export interface SourceFullProcessReceiveQuery extends PageQuery {
  /**
   * 外协订单id
   */
  fullProcessOrderId?: string | number;

  /**
   * 收货数量
   */
  quantity?: number;

  /**
   * 收货时间
   */
  receiveTime?: string;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
  supplierId?: string | number;
}
