export interface ProductionVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 计划开始时间
   */
  planStartTime: string;

  /**
   * 计划完成时间
   */
  planCompleteTime: string;

  /**
   * 开始时间
   */
  startTime: string;

  /**
   * 完成时间
   */
  completeTime: string;

  /**
   * 完成数量（pcs）
   */
  completeQuantity: number;

  /**
   * 确认人ID
   */
  confirmUserId: string | number;

  /**
   * 确认人名字
   */
  confirmUserName: string;

  /**
   * 排产状态(10=待开始，20=进行中，30=完成，40=暂停)
   */
  productionStatus: string;

  /**
   * MI工艺单ID
   */
  planId: string | number;

  /**
   * 是否暂停(默认为否)
   */
  isPause: string;

  /**
   * 排产单编码
   */
  code: string;

  /**
   * 是否已完成（默认为否）
   */
  isComplete: string;

  /**
   * 排产净面积
   */
  area: number;

  /**
   * 是否补料（默认为否）
   */
  isRemediation: string;

  /**
   * 补料关联的排产单ID
   */
  remediationProductionId: string | number;

  /**
   * 是否尾扎合并（默认为否）
   */
  isMerge: number;

  /**
   * MI类型
   */
  planType: string | number;

  /***
   * Desc:产品编码
   * @param null
   * @return {@link null}
   * @author lei
   * @date 2023/11/29 17:08
   */
  commodityCode: string | number;

  /***
   * Desc:产品名称
   * @param null
   * @return {@link null}
   * @author lei
   * @date 2023/11/29 17:08
   */
  commodityName: string | number;

  /**
   * MI单号
   */
  mICode: string | number;

}

export interface ProductionForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 计划开始时间
   */
  planStartTime?: string;

  /**
   * 计划完成时间
   */
  planCompleteTime?: string;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 完成时间
   */
  completeTime?: string;

  /**
   * 客户编码
   */
  customerCode?: string;

  /**
   * 排产单ID
   */
  productionId?: string;

  /**
   * 完成数量（pcs）
   */
  completeQuantity?: number;

  /**
   * 确认人ID
   */
  confirmUserId?: string | number;

  /**
   * 确认人名字
   */
  confirmUserName?: string;

  /**
   * 排产状态(10=待开始，20=进行中，30=完成，40=暂停)
   */
  productionStatus?: string;

  /**
   * MI工艺单ID
   */
  planId?: string | number;

  /**
   * 是否暂停(默认为否)
   */
  isPause?: string;

  /**
   * 排产单编码
   */
  code?: string;

  /**
   * 是否已完成（默认为否）
   */
  isComplete?: string;

  /**
   * 排产净面积
   */
  area?: number;

  /**
   * 是否补料（默认为否）
   */
  isRemediation?: string;

  /**
   * 补料关联的排产单ID
   */
  remediationProductionId?: string | number;

  /**
   * 是否尾扎合并（默认为否）
   */
  isMerge?: string;

  /**
   * 是否立即开始
   */
  isStart?: string;

}

export interface ProductionQuery extends PageQuery {

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 计划开始时间
   */
  planStartTime?: string;

  /**
   * 计划完成时间
   */
  planCompleteTime?: string;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 完成时间
   */
  completeTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 排产单编码
   */
  productionCode?: string;

  /**
   * 客户编码
   */
  customerCode?: string;

  /**
   * 产品编码
   */
  commodityCode?: string;

  /**
   * 产品名称
   */
  commodityName?: string;

  /**
   * 完成数量（pcs）
   */
  completeQuantity?: number;

  /**
   * 确认人ID
   */
  confirmUserId?: string | number;

  /**
   * 确认人名字
   */
  confirmUserName?: string;

  /**
   * 排产状态(10=待开始，20=进行中，30=完成，40=暂停)
   */
  productionStatus?: string;

  /**
   * MI工艺单ID
   */
  planId?: string | number;

  /**
   * 是否暂停(默认为否)
   */
  isPause?: string;

  /**
   * 排产单编码
   */
  code?: string;

  /**
   * 是否已完成（默认为否）
   */
  isComplete?: string;

  /**
   * 排产净面积
   */
  area?: number;

  /**
   * 是否补料（默认为否）
   */
  isRemediation?: string;

  /**
   * 补料关联的排产单ID
   */
  remediationProductionId?: string | number;

  /**
   * 是否尾扎合并（默认为否）
   */
  isMerge?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}



