export interface DiscardReasonVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 工艺名
   */
  craftId: number;

  /**
   * 报废原因
   */
  discardReason: string;

  /**
   * 备注
   */
  remark: string;

}

export interface DiscardReasonForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 工艺名
   */
  craftId?: number;

  /**
   * 报废原因
   */
  discardReason?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface DiscardReasonQuery extends PageQuery {

  /**
   * 工艺名
   */
  craftId?: number;
  
  /**
   * 工艺名
   */
  craftName?: string;

  /**
   * 报废原因
   */
  discardReason?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



