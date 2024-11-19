export interface SourceOrderScrapVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 外协接单加工单详情ID
   */
  outSourceOrderDetailId: string | number;

  /**
   * 报废数量
   */
  quantity: number;

  /**
   * 报废原因
   */
  reason: string;

  /**
   * 责任类型(1本厂，2客户，3供应商)
   */
  type: string;

  /**
   * 单位责任人id
   */
  dutyUserId: string | number;

  /**
   * 责任人名称
   */
  dutyUserName: string;

  /**
   * 备注
   */
  remark: string;

}

export interface SourceOrderScrapForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 外协接单加工单详情ID
   */
  outSourceOrderDetailId?: string | number;

  /**
   * 报废数量
   */
  quantity?: number;

  /**
   * 报废原因
   */
  reason?: string;

  /**
   * 责任类型(1本厂，2客户，3供应商)
   */
  type?: string;

  /**
   * 单位责任人id
   */
  dutyUserId?: string | number;

  /**
   * 责任人名称
   */
  dutyUserName?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface SourceOrderScrapQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 外协接单加工单详情ID
   */
  outSourceOrderDetailId?: string | number;

  /**
   * 报废数量
   */
  quantity?: number;

  /**
   * 报废原因
   */
  reason?: string;

  /**
   * 责任类型(1本厂，2客户，3供应商)
   */
  type?: string;

  /**
   * 单位责任人id
   */
  dutyUserId?: string | number;

  /**
   * 责任人名称
   */
  dutyUserName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



