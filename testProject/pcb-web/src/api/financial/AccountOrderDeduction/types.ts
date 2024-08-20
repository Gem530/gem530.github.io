export interface AccountOrderDeductionVO {
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
   * 扣款时间
   */
  deductionTime: string;

  /**
   * 已分配金额
   */
  assignedPrice: number;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 供应商名称
   */
  supplierName: string;

  /**
   * 是否分配完成
   */
  isAssignFinish: string;

  /**
   * 类型（供应商、客户）
   */
  type: string;

  supplierCode: string;
  customerCode: string;
  no:string;
  hasAccountOrder: boolean;
}

export interface AccountOrderDeductionForm extends BaseEntity {
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
   * 扣款时间
   */
  deductionTime?: string;

  /**
   * 已分配金额
   */
  assignedPrice?: number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 供应商名称
   */
  supplierName?: string;

  /**
   * 是否分配完成
   */
  isAssignFinish?: string;

  /**
   * 类型（供应商、客户）
   */
  type?: string;
  supplierCode?: string;
  customerCode?: string;
  no?:string;
  hasAccountOrder?: boolean;
}

export interface AccountOrderDeductionQuery extends PageQuery {

  /**
   * 金额
   */
  price?: number;

  /**
   * 扣款时间
   */
  deductionTime?: string;

  /**
   * 已分配金额
   */
  assignedPrice?: number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 供应商名称
   */
  supplierName?: string;

  /**
   * 是否分配完成
   */
  isAssignFinish?: string;

  /**
   * 类型（供应商、客户）
   */
  type?: string;

  /**
   * 日期范围参数
   */
  params?: any;
  supplierCode?: string;
  customerCode?: string;
  no?:string;
  hasAccountOrder?: boolean;
}



