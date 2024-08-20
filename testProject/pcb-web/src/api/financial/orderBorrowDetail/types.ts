export interface OrderBorrowDetailVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 编码
   */
  code: string;

  /**
   * 类型（借入对账单、借出对账单）
   */
  type: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status: string;

  /**
   * 是否含税
   */
  isTax: string;

  /**
   * 对账人id
   */
  accountUserId: string | number;

  /**
   * 对账人名称
   */
  accountUserName: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 借料记录ID
   */
  rawMaterialBorrowId: string | number;

  /**
   * 币种
   */
  currency: string;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 单价
   */
  price: number;

  /**
   * 折扣金额
   */
  discountPrice: number;

  /**
   * 总金额
   */
  totalPrice: number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 对账单id
   */
  accountOrderId: string | number;

  /**
   * 出入库记录ID
   */
  rawMaterialInOutRecordId: string | number;

}

export interface OrderBorrowDetailForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（借入对账单、借出对账单）
   */
  type?: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status?: string;

  /**
   * 是否含税
   */
  isTax?: string;

  /**
   * 对账人id
   */
  accountUserId?: string | number;

  /**
   * 对账人名称
   */
  accountUserName?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 借料记录ID
   */
  rawMaterialBorrowId?: string | number;

  /**
   * 币种
   */
  currency?: string;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 折扣金额
   */
  discountPrice?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 对账单id
   */
  accountOrderId?: string | number;

  /**
   * 出入库记录ID
   */
  rawMaterialInOutRecordId?: string | number;

}

export interface OrderBorrowDetailQuery extends PageQuery {

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（借入对账单、借出对账单）
   */
  type?: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status?: string;

  /**
   * 是否含税
   */
  isTax?: string;

  /**
   * 对账人id
   */
  accountUserId?: string | number;

  /**
   * 对账人名称
   */
  accountUserName?: string;

  /**
   * 借料记录ID
   */
  rawMaterialBorrowId?: string | number;

  /**
   * 币种
   */
  currency?: string;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 折扣金额
   */
  discountPrice?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 对账单id
   */
  accountOrderId?: string | number;

  /**
   * 出入库记录ID
   */
  rawMaterialInOutRecordId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



