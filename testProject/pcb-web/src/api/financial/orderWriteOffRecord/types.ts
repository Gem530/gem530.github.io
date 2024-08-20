export interface OrderWriteOffRecordVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 对账单ID
   */
  accountOrderId: string | number;

  /**
   * 付款/回款单ID
   */
  paymentRepaymentRecordId: string | number;

  /**
   * 冲销金额
   */
  writeOffPrice: number;

  /**
   * 状态（正常、已取消）
   */
  status: string;

}

export interface OrderWriteOffRecordForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 对账单ID
   */
  accountOrderId?: string | number;

  /**
   * 付款/回款单ID
   */
  paymentRepaymentRecordId?: string | number;

  /**
   * 冲销金额
   */
  writeOffPrice?: number;

  /**
   * 状态（正常、已取消）
   */
  status?: string;

}

export interface OrderWriteOffRecordQuery extends PageQuery {

  /**
   * 对账单ID
   */
  accountOrderId?: string | number;

  /**
   * 付款/回款单ID
   */
  paymentRepaymentRecordId?: string | number;

  /**
   * 冲销金额
   */
  writeOffPrice?: number;

  /**
   * 状态（正常、已取消）
   */
  status?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



