export interface ProductionPlanVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 创建部门名称
   */
  createDeptName: string;

  /**
   * 创建者名称
   */
  createByName: string;

  /**
   * 更新者名称
   */
  updateByName: string;

  /**
   * 工艺名称
   */
  name: string;

  /**
   * 工程备注
   */
  remark: string;

  /**
   * 审核人id
   */
  auditUserId: string | number;

  /**
   * 审核人名字
   */
  auditUserName: string;

  /**
   * 审核时间
   */
  auditTime: string;

  /**
   * MI编码
   */
  code: string;

  /**
   * MI类型（1=单品，2=合拼）
   */
  planType: string;

  /**
   * 状态（1=制作中，2=审核中，3=订单预投，4=预投审核，5=生产中，6=已完成，7=驳回）
   */
  status: string;

  /**
   * 提交时间
   */
  submitTime: string;

  /**
   * 预投时间
   */
  preFeedTime: string;

  /**
   * 预投人ID
   */
  preFeedUserId: string | number;

  /**
   * 预投人名字
   */
  preFeedUserName: string;

  /**
   * 预投审核人ID
   */
  preFeedAuditUserId: string | number;

  /**
   * 预投审核人名字
   */
  preFeedAuditUserName: string;

  saleOrderVoList: [];

}

export interface ProductionPlanForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 工艺名称
   */
  name?: string;

  /**
   * 工程备注
   */
  remark?: string;

  /**
   * 审核人id
   */
  auditUserId?: string | number;

  /**
   * 审核人名字
   */
  auditUserName?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * MI编码
   */
  code?: string;

  /**
   * MI类型（1=单品，2=合拼）
   */
  planType?: string;

  /**
   * 状态（1=制作中，2=审核中，3=订单预投，4=预投审核，5=生产中，6=已完成，7=驳回）
   */
  status?: string;

  /**
   * 提交时间
   */
  submitTime?: string;

  /**
   * 预投时间
   */
  preFeedTime?: string;

  /**
   * 预投人ID
   */
  preFeedUserId?: string | number;

  /**
   * 预投人名字
   */
  preFeedUserName?: string;

  /**
   * 预投审核人ID
   */
  preFeedAuditUserId?: string | number;

  /**
   * 预投审核人名字
   */
  preFeedAuditUserName?: string;

}

export interface ProductionPlanQuery extends PageQuery {

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 工艺名称
   */
  name?: string;

  /**
   * 审核人id
   */
  auditUserId?: string | number;

  /**
   * 审核人名字
   */
  auditUserName?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * MI编码
   */
  code?: string;

  /**
   * MI类型（1=单品，2=合拼）
   */
  planType?: string;

  /**
   * 状态（1=制作中，2=审核中，3=订单预投，4=预投审核，5=生产中，6=已完成，7=驳回）
   */
  status?: string;

  /**
   * 提交时间
   */
  submitTime?: string;

  /**
   * 预投时间
   */
  preFeedTime?: string;

  /**
   * 预投人ID
   */
  preFeedUserId?: string | number;

  /**
   * 预投人名字
   */
  preFeedUserName?: string;

  /**
   * 预投审核人ID
   */
  preFeedAuditUserId?: string | number;

  /**
   * 预投审核人名字
   */
  preFeedAuditUserName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}

// 是否连铜
export enum isLinkCopper {
  YES = '1',
  NO = '0',
}
export const linkCopperList = [
  { label: '是', value: isLinkCopper.YES },
  { label: '否', value: isLinkCopper.NO },
]

