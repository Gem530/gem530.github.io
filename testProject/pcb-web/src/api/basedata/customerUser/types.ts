export interface CustomerUserVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 客户id
   */
  customerId: string | number;

  /**
   * 销售员id
   */
  userId: string | number;

  /**
   * 备注
   */
  remark: string;

}

export interface CustomerUserForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 销售员id
   */
  userId?: string | number;

  /**
   * 备注
   */
  备注?: string;

}

export interface CustomerUserQuery extends PageQuery {

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
   * 销售员id
   */
  userId?: string | number;

  /**
   * 备注
   */
  备注?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



