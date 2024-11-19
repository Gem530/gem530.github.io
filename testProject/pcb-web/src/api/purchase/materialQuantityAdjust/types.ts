export interface MaterialQuantityAdjustVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 关联业务id
   */
  bizId: string | number;

  /**
   * 类型(1收货，2退货)
   */
  type: string;

  /**
   * 调整前数量
   */
  beforeQuantity: number;

  /**
   * 调整后数量
   */
  quantity: number;

  /**
   * 状态(1待审核，2审核通过，3审核驳回)
   */
  status: string;

  /**
   * 物料id
   */
  rawMaterialId: string | number;

  /**
   * 审核人ID
   */
  auditUserId: string | number;

  /**
   * 审核人名称
   */
  auditUserName: string;

  /**
   * 审核时间
   */
  auditTime: string;

  /**
   * 备注
   */
  remark: string;

}

export interface MaterialQuantityAdjustForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 关联业务id
   */
  bizId?: string | number;

  /**
   * 类型(1收货，2退货)
   */
  type?: string;

  /**
   * 调整后数量
   */
  quantity?: number;

  /**
   * 状态(1待审核，2审核通过，3审核驳回)
   */
  status?: string;

  /**
   * 物料id
   */
  rawMaterialId?: string | number;

  /**
   * 审核人ID
   */
  auditUserId?: string | number;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface MaterialQuantityAdjustQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 关联业务id
   */
  bizId?: string | number;

  /**
   * 类型(1收货，2退货)
   */
  type?: string;

  /**
   * 调整后数量
   */
  quantity?: number;

  /**
   * 状态(1待审核，2审核通过，3审核驳回)
   */
  status?: string;

  /**
   * 物料id
   */
  rawMaterialId?: string | number;

  /**
   * 审核人ID
   */
  auditUserId?: string | number;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



