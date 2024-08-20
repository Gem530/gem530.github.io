export interface OrderSaleDetailVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 编码
   */
  code: string;

  /**
   * 类型（借入对账单、借出对账单）
   */
  type: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status: string;

  /**
   * 是否含税
   */
  isTax: string;

  /**
   * 对账人id
   */
  accountUserId: string | number;

  /**
   * 对账人名称
   */
  accountUserName: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 币种
   */
  currency: string;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 单价
   */
  price: number;

  /**
   * 折扣金额
   */
  discountPrice: number;

  /**
   * 总金额
   */
  totalPrice: number;

  /**
   * 对账单id
   */
  accountOrderId: string | number;

  /**
   * 订单ID
   */
  saleOrderId: string | number;

  /**
   * 成品出入库记录ID
   */
  commosityInOutRecordId: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  customerId: string | number;
  saleOrderBackId:string | number;
  checkQuantity:number;
}

export interface OrderSaleDetailForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（借入对账单、借出对账单）
   */
  type?: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status?: string;

  /**
   * 是否含税
   */
  isTax?: string;

  /**
   * 对账人id
   */
  accountUserId?: string | number;

  /**
   * 对账人名称
   */
  accountUserName?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 币种
   */
  currency?: string;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 折扣金额
   */
  discountPrice?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 对账单id
   */
  accountOrderId?: string | number;

  /**
   * 订单ID
   */
  saleOrderId?: string | number;

  /**
   * 成品出入库记录ID
   */
  commodityInOutRecordId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;
  saleOrderBackId?: string | number;
}

export interface OrderSaleDetailQuery extends PageQuery {

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（借入对账单、借出对账单）
   */
  type?: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status?: string;

  /**
   * 是否含税
   */
  isTax?: string;

  /**
   * 对账人id
   */
  accountUserId?: string | number;

  /**
   * 对账人名称
   */
  accountUserName?: string;

  /**
   * 币种
   */
  currency?: string;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 折扣金额
   */
  discountPrice?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 对账单id
   */
  accountOrderId?: string | number;

  /**
   * 订单ID
   */
  saleOrderId?: string | number;

  /**
   * 成品出入库记录ID
   */
  commosityInOutRecordId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}


export enum SALETYPEENUM {
  /**
   * 送货
   */
  SALE_DELIVER = '2',
  /**
   * 退货
   */
  SALE_BACK = '1',
 
}