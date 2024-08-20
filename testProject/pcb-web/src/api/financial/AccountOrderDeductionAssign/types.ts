export interface AccountOrderDeductionAssignVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 金额
   */
  price: number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 财务扣款记录表ID
   */
  accountOrderDeductionId: string | number;

  /**
   * 分配时间
   */
  assignTime: string;

  /**
   * 用户名
   */
  userName: string;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 供应商名称
   */
  supplierName: string;

  /**
   * 类型(责任人、供应商)
   */
  type: string;
  accountOrderAssignId: string | number;
  accountOrderDeductionNo: string;
  hasAccountOrder: boolean;
}

export interface AccountOrderDeductionAssignForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 金额
   */
  price?: number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 财务扣款记录表ID
   */
  accountOrderDeductionId?: string | number;

  /**
   * 分配时间
   */
  assignTime?: string;

  /**
   * 用户名
   */
  userName?: string;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 供应商名称
   */
  supplierName?: string;

  /**
   * 类型(责任人、供应商)
   */
  type?: string;
  accountOrderAssignId?: string | number;
  accountOrderDeductionNo?: string;
  hasAccountOrder?: boolean;
}

export interface AccountOrderDeductionAssignQuery extends PageQuery {

  /**
   * 金额
   */
  price?: number;

  /**
   * 财务扣款记录表ID
   */
  accountOrderDeductionId?: string | number;

  /**
   * 分配时间
   */
  assignTime?: string;

  /**
   * 用户名
   */
  userName?: string;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 供应商名称
   */
  supplierName?: string;

  /**
   * 类型(责任人、供应商)
   */
  type?: string;

  /**
   * 日期范围参数
   */
  params?: any;
  accountOrderAssignId?: string | number;
  accountOrderDeductionNo?: string;
  hasAccountOrder?: boolean;
}



