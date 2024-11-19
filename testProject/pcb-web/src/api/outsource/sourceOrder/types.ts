export interface SourceOrderVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 客户订单号
   */
  orderCode: string;

  /**
   * 状态(1待加工，2部分加工，3待发货，4部分发货，5已发货)
   */
  status: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 外协加工主id
   */
  outSourceHalfBizId: string | number;

}

export interface SourceOrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  code?: string;

  /**
   * 客户订单号
   */
  orderCode?: string;

  /**
   * 状态(1待加工，2部分加工，3待发货，4部分发货，5已发货)
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 外协加工主id
   */
  outSourceHalfBizId?: string | number;

  orderTime?: string;

  orderByName?: string;

  orderBy?: string | number;
}

export interface SourceOrderQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 订单号
   */
  code?: string;

  /**
   * 客户订单号
   */
  orderCode?: string;

  /**
   * 状态(1待加工，2部分加工，3待发货，4部分发货，5已发货)
   */
  status?: string;

  /**
   * 外协加工主id
   */
  outSourceHalfBizId?: string | number;

  customerName?: string;

  customerCode?: string;

  quantity?: string | number;

  createByName?: string;

  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



