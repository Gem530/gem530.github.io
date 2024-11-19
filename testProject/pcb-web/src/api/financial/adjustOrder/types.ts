export interface AdjustOrderVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 调整单号
   */
  code: string;

  /**
   * 状态（1待提交、2待审核、3审核通过、4审核驳回）
   */
  status: string;

  /**
   * 调整类型
   */
  type: string;

  /**
   * 对账单ID
   */
  accountOrderId: string | number;

  /**
   * 关联单据类型(1采购对账，2工序外协对账，3订单外协对账，4借入借出对账)
   */
  accountType: string;

  /**
   * 调整金额
   */
  price: number;

  /**
   * 审核人ID
   */
  auditUserId: string | number;

  /**
   * 审核人名称
   */
  auditUserName: string;

  /**
   * 驳回原因
   */
  reason: string;

  /**
   * 审核时间
   */
  auditTime: string;

  /**
   * 备注
   */
  remark: string;

}

export interface AdjustOrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 调整单号
   */
  code?: string;

  /**
   * 状态（1待提交、2待审核、3审核通过、4审核驳回）
   */
  status?: string;

  /**
   * 调整类型
   */
  type?: string;

  /**
   * 对账单ID
   */
  accountOrderId?: string | number;

  /**
   * 对账金额
   */
  accountPrice?: number;

  /**
   * 调整金额
   */
  price?: number;

  /**
   * 调整后金额
   */
  adjustPrice?: number;

  /**
   * 审核人ID
   */
  auditUserId?: string | number;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 驳回原因
   */
  reason?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 对账单单号
   */
  accountOrderCode?: string;

  /**
   * 关联单据类型
   */
  accountOrderType?: string;

  createTime?: string;

  createByName?: string;

  /**
   * 供应商名称
   */
  supplierName?: string | number;

  /**
   * 明细信息
   */
  detailList?: [];

  isAdjust?: string;

  queryType?: string;
}

export interface AdjustOrderQuery extends PageQuery {

  /**
   * 调整单号
   */
  code?: string;

  /**
   * 状态（1待提交、2待审核、3审核通过、4审核驳回）
   */
  status?: string;

  statusList?: [];

  /**
   * 对账单单号
   */
  accountOrderCode?: string;

  /**
   * 关联单据类型
   */
  accountOrderType?: string;

  createTime?: string;

  createByName?: string;

  remark?: string;

  /**
   * 调整类型
   */
  type?: string;

  /**
   * 对账单ID
   */
  accountOrderId?: string | number;

  /**
   * 调整金额
   */
  price?: number;

  /**
   * 审核人ID
   */
  auditUserId?: string | number;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 驳回原因
   */
  reason?: string;

  /**
   * 审核时间
   */
  auditTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;


}



