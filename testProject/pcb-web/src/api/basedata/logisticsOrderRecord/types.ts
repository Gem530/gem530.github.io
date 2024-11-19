export interface LogisticsOrderRecordVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * $column.columnComment
   */
  ownerId: string | number;

  /**
   * 快递单号
   */
  waybillNo: string;

  /**
   * 订单ID
   */
  orderId: string | number;

  /**
   * 支付方式
   */
  payMethod: string;

  /**
   * 寄件人姓名
   */
  senderName: string;

  /**
   * 寄件人电话
   */
  senderPhone: string;

  /**
   * 寄件人地址
   */
  senderAddress: string;

  /**
   * 收件人姓名
   */
  receiverName: string;

  /**
   * 收件人电话
   */
  receiverPhone: string;

  /**
   * 收件人地址
   */
  receiverAddress: string;

  /**
   * 物流类型
   */
  expressType: string;

  /**
   * 发货单号
   */
  deliveryCode: string;

}

export interface LogisticsOrderRecordForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * $column.columnComment
   */
  ownerId?: string | number;

  /**
   * 快递单号
   */
  waybillNo?: string;

  /**
   * 订单ID
   */
  orderId?: string | number;

  /**
   * 支付方式
   */
  payMethod?: string;

  /**
   * 寄件人姓名
   */
  senderName?: string;

  /**
   * 寄件人电话
   */
  senderPhone?: string;

  /**
   * 寄件人地址
   */
  senderAddress?: string;

  /**
   * 收件人姓名
   */
  receiverName?: string;

  /**
   * 收件人电话
   */
  receiverPhone?: string;

  /**
   * 收件人地址
   */
  receiverAddress?: string;

  /**
   * 物流类型
   */
  expressType?: string;

  /**
   * 发货单号
   */
  deliveryCode?: string;

}

export interface LogisticsOrderRecordQuery extends PageQuery {

  /**
   * $column.columnComment
   */
  ownerId?: string | number;

  /**
   * 快递单号
   */
  waybillNo?: string;

  /**
   * 订单ID
   */
  orderId?: string | number;

  /**
   * 支付方式
   */
  payMethod?: string;

  /**
   * 寄件人姓名
   */
  senderName?: string;

  /**
   * 寄件人电话
   */
  senderPhone?: string;

  /**
   * 寄件人地址
   */
  senderAddress?: string;

  /**
   * 收件人姓名
   */
  receiverName?: string;

  /**
   * 收件人电话
   */
  receiverPhone?: string;

  /**
   * 收件人地址
   */
  receiverAddress?: string;

  /**
   * 物流类型
   */
  expressType?: string;

  /**
   * 发货单号
   */
  deliveryCode?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



