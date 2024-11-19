export interface SourceOrderDeliveryVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 外协接单加工单ID
   */
  outSourceOrderDetailId: string | number;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 发货时间
   */
  deliveryTime: string;

  /**
   * 收货人手机号
   */
  phoneNumber: string;

  /**
   * 发货车辆
   */
  deliveryVehicle: string;

  /**
   * 物流公司
   */
  logisticsCompany: string;

  /**
   * 物料单号
   */
  logisticsNumber: string;

  /**
   * 收货地址
   */
  deliveryAddress: string;

  /**
   * 发货数量
   */
  quantity: number;

  /**
   * 备注
   */
  remark: string;

}

export interface SourceOrderDeliveryForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 外协接单加工单ID
   */
  outSourceOrderDetailId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 发货时间
   */
  deliveryTime?: string;

  /**
   * 收货人手机号
   */
  phoneNumber?: string;

  /**
   * 发货车辆
   */
  deliveryVehicle?: string;

  /**
   * 物流公司
   */
  logisticsCompany?: string;

  /**
   * 物料单号
   */
  logisticsNumber?: string;

  /**
   * 收货地址
   */
  deliveryAddress?: string;

  /**
   * 发货数量
   */
  quantity?: number;

  /**
   * 备注
   */
  remark?: string;

  deliveryBoList?: [];

  fileList?: [];

}

export interface SourceOrderDeliveryQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 外协接单加工单ID
   */
  outSourceOrderDetailId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 发货时间
   */
  deliveryTime?: string;

  /**
   * 收货人手机号
   */
  phoneNumber?: string;

  /**
   * 发货车辆
   */
  deliveryVehicle?: string;

  /**
   * 物流公司
   */
  logisticsCompany?: string;

  /**
   * 物料单号
   */
  logisticsNumber?: string;

  /**
   * 收货地址
   */
  deliveryAddress?: string;

  /**
   * 发货数量
   */
  quantity?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



