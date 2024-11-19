export interface CheckPlanVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 盘点类型（1成品，2物料）
   */
  type: string;

  /**
   * 状态（1待提交，2盘点中，3复盘中，4审核中，5已完成，6已作废）
   */
  status: string;

  /**
   * 是否作废（0未作废，1已作废）
   */
  isCancel: string;

  /**
   * 盘点计划名称
   */
  planName: string;

  /**
   * 盘点时间
   */
  planTime: string;

  /**
   * 负责人id
   */
  headUserId: string | number;

  /**
   * 负责人名称
   */
  headUserName: string;

  /**
   * 审核人id
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
   * 驳回理由
   */
  rejectReason: string;

  /**
   * 作废理由
   */
  cancelReason: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 明细列表
   */
  detailVoList: [];
}

export interface CheckPlanForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 盘点类型（1成品，2物料）
   */
  type?: string;

  /**
   * 状态（1待提交，2盘点中，3复盘中，4审核中，5已完成，6已作废）
   */
  status?: string;

  /**
   * 是否作废（0未作废，1已作废）
   */
  isCancel?: string;

  /**
   * 盘点计划名称
   */
  planName?: string;

  /**
   * 盘点时间
   */
  planTime?: string;

  /**
   * 负责人id
   */
  headUserId?: string | number;

  /**
   * 负责人名称
   */
  headUserName?: string;

  /**
   * 审核人id
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
   * 驳回理由
   */
  rejectReason?: string;

  /**
   * 作废理由
   */
  cancelReason?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 盘点详情
   */
  detailBoList?: [];

  isCoverData?: string;
}

export interface CheckPlanQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 盘点类型（1成品，2物料）
   */
  type?: string;

  /**
   * 状态（1待提交，2盘点中，3复盘中，4审核中，5已完成，6已作废）
   */
  status?: string;

  /**
   * 是否作废（0未作废，1已作废）
   */
  isCancel?: string;

  /**
   * 盘点计划名称
   */
  planName?: string;

  /**
   * 盘点时间
   */
  planTime?: string;

  /**
   * 负责人id
   */
  headUserId?: string | number;

  /**
   * 负责人名称
   */
  headUserName?: string;

  /**
   * 审核人id
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
   * 驳回理由
   */
  rejectReason?: string;

  /**
   * 作废理由
   */
  cancelReason?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



