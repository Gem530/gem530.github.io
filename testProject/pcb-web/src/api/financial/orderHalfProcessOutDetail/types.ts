export interface OrderHalfProcessOutDetailVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 编码
   */
  code: string;

  /**
   * 类型（外协收货、外协报废）
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
   * 外协加工记录ID
   */
  halfProcessOrderId: string | number;

  /**
   * 收货记录ID
   */
  halfProcessReceiveId: string | number;

  /**
   * 生产报废记录ID
   */
  productionScrapId: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

}

export interface OrderHalfProcessOutDetailForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（外协收货、外协报废）
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
   * 外协加工记录ID
   */
  halfProcessOrderId?: string | number;

  /**
   * 收货记录ID
   */
  halfProcessReceiveId?: string | number;

  /**
   * 生产报废记录ID
   */
  productionScrapId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

}

export interface OrderHalfProcessOutDetailQuery extends PageQuery {

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（外协收货、外协报废）
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
   * 外协加工记录ID
   */
  halfProcessOrderId?: string | number;

  /**
   * 收货记录ID
   */
  halfProcessReceiveId?: string | number;

  /**
   * 生产报废记录ID
   */
  productionScrapId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}

export enum HalfOutTypeEnum {
  /**
     * 报废
     */
  TYPE_BACK = '1',
  /**
     * 收货
     */
  TYPE_RECEIVE = '2'
}


