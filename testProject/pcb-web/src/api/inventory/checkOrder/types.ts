export interface CheckOrderVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 盘点单类型（1盘盈，2盘亏）
   */
  code: string;

  /**
   * $column.columnComment
   */
  type: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 盘点计划表id
   */
  inventoryCheckPlanId: string | number;

  planType?: string;

  /**
   * 盘点计划名称
   */
  planName?: string;

  /**
   * 负责人名称
   */
  headUserName?: string;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 创建人名称
   */
  createUserName?: string;

  /**
   * 创建时间
   */
  createTime?: string;

}

export interface CheckOrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 盘点单类型（1盘盈，2盘亏）
   */
  code?: string;

  /**
   * $column.columnComment
   */
  type?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 盘点计划表id
   */
  inventoryCheckPlanId?: string | number;

  planType?: string;

  /**
   * 盘点计划名称
   */
  planName?: string;

  /**
   * 负责人名称
   */
  headUserName?: string;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 创建人名称
   */
  createUserName?: string;

  /**
   * 创建时间
   */
  createTime?: string;

}

export interface CheckOrderQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 盘点单号
   */
  code?: string;

  /**
   * $column.columnComment
   */
  type?: string;

  planType?: string;

  /**
   * 盘点计划表id
   */
  inventoryCheckPlanId?: string | number;

  /**
   * 盘点计划名称
   */
  planName?: string;

  /**
   * 负责人名称
   */
  headUserName?: string;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 创建人名称
   */
  createUserName?: string;

  /**
   * 创建时间
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



