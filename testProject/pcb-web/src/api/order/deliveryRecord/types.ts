export interface DeliveryRecordVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 创建部门名称
   */
  createDeptName: string;

  /**
   * 创建者名称
   */
  createByName: string;

  /**
   * 更新者名称
   */
  updateByName: string;

  /**
   * 发货类型（退货重发、订单发货）
   */
  type: string;

  /**
   * 发货数量
   */
  quantity: number;

  /**
   * 业务ID
   */
  bizId: string | number;

  /**
   * 发货编号
   */
  code: string;
  /**
   * 地址id
   */
  addressId: string | number;
  isCallback:string;
  reserveQuantity: number;
  caseNum: number;
  remark: string;
  deliveryVehicle: string;
  deliveryPersonnel: string;
  logisticsCompany: string;
  logisticsNo: string;

}

export interface DeliveryRecordForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 发货类型（退货重发、订单发货）
   */
  type?: string;

  /**
   * 发货数量
   */
  quantity?: number;

  /**
   * 业务ID
   */
  bizId?: string | number;

  /**
   * 发货编号
   */
  code?: string;
  isCallback?:string;
  /**
   * 地址id
   */
  addressId?: number;
  customerCode?: string;
  customerName?: string;
  cusAddress?: string;
  tableOrderList: DeliveryRecordVO[];
  deliveryRecordBoList: DeliveryRecordVO[];
  logisticsNo?:string;
  commodityName?:string;
  saleOrderNo?:string;
  customerPo?:string;
  commodityCode?:string;
}

export interface DeliveryRecordQuery extends PageQuery {

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 发货类型（退货重发、订单发货）
   */
  type?: string;

  /**
   * 发货数量
   */
  quantity?: number;

  /**
   * 业务ID
   */
  bizid?: string | number;

  /**
   * 发货编号
   */
  code?: string;
  isCallback?:string;
  logisticsNo?:string;

  commodityName?:string;
  saleOrderNo?:string;
  customerPo?:string;
  commodityCode?:string;
  customerCode?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}

export enum DeliveryRecordTypeEnum {  // 发货类型
  RETURN = '1',
  ORDER = '0'
}


