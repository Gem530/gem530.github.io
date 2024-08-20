export interface OrderFullProcessOutDetailVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 编码
   */
  code: string;

  /**
   * 类型（外协收货、外协退货）
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
   * 订单外协记录ID
   */
  fullProcessOrderId: string | number;

  /**
   * 收货记录ID
   */
  fullProcessReceiveId: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 退货记录ID
   */
  fullProcessOrderBackId: string | number;

  checkQuantity: number;
  checkPrice: number;
  checkRemark: string;
  supplierId: string | number;
}

export interface OrderFullProcessOutDetailForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（外协收货、外协退货）
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
   * 订单外协记录ID
   */
  fullProcessOrderId?: string | number;

  /**
   * 收货记录ID
   */
  fullProcessReceiveId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 退货记录ID
   */
  fullProcessOrderBackId?: string | number;

}

export interface OrderFullProcessOutDetailQuery extends PageQuery {

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（外协收货、外协退货）
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
   * 订单外协记录ID
   */
  fullProcessOrderId?: string | number;

  /**
   * 收货记录ID
   */
  fullProcessReceiveId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 退货记录ID
   */
  fullProcessOrderBackId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}

export enum FULLOUTTypeEnum {
  /**
     * 退货
     */
  TYPE_BACK = '1',
  /**
     * 收货
     */
  TYPE_RECEIVE = '2'
}
