export interface AdjustOrderDetailVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 成本调整ID
   */
  costAdjustOrderId: string | number;

  /**
   * 关联的业务id
   */
  bizId: string | number;

  /**
   * 业务类型(1收货，2送货)
   */
  type: string;

  /**
   * 调整金额
   */
  price: number;

  /**
   * 调整后金额
   */
  adjustPrice: number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 对账单id
   */
  accountDetailId: string | number;
}

export interface AdjustOrderDetailForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 成本调整ID
   */
  costAdjustOrderId?: string | number;

  /**
   * 关联的业务id
   */
  bizId?: string | number;

  /**
   * 业务类型(1收货，2送货)
   */
  type?: string;

  /**
   * 调整金额
   */
  price?: number;

}

export interface AdjustOrderDetailQuery extends PageQuery {

  /**
   * 成本调整ID
   */
  costAdjustOrderId?: string | number;

  /**
   * 关联的业务id
   */
  bizId?: string | number;

  /**
   * 业务类型(1收货，2送货)
   */
  type?: string;

  /**
   * 调整金额
   */
  price?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



