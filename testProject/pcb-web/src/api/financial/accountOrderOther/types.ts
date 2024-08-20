export interface AccountOrderOtherVO {
  /**
   * index
   */
  index?: number;
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 类型（入账、出账）
   */
  type?: string;

  /**
   * 金额
   */
  price?: number | string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 对账单ID
   */
  accountOrderId?: string | number;

  /**
   * 入账/出账时间
   */
  recordTime?: string;
  /**
   * 创建名称
   */
  createByName?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * selected
   */
  selected?: boolean;
}

export interface AccountOrderOtherForm extends BaseEntity {
  /**
   * index
   */
  index?: number;
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 类型（入账、出账）
   */
  type?: string;

  /**
   * 金额
   */
  price?: number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 对账单ID
   */
  accountOrderId?: string | number;

  /**
   * 入账/出账时间
   */
  recordTime?: string;
  /**
   * 创建人
   */
  createByName?: string;
}

export interface AccountOrderOtherQuery extends PageQuery {
  /**
   * 类型（入账、出账）
   */
  type?: string;

  /**
   * 金额
   */
  price?: number;

  /**
   * 对账单ID
   */
  accountOrderId?: string | number;

  /**
   * 入账/出账时间
   */
  recordTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
