export interface CapacityVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 状态
   */
  status: string;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 流转卡ID
   */
  cardId: string | number;

  /**
   * 工艺ID
   */
  craftId: string | number;

  /**
   * 流转卡节点id
   */
  productionCardNodeId: string | number;

  /**
   * 上报数量
   */
  reportedQuantity: number;

  /**
   * 审核数量
   */
  auditQuantity: number;

  /**
   * 修改原因
   */
  reason: string;

  /**
   * 数量单位
   */
  unit: number;

  /**
   * 修改原因
   */
  flowId: string | number;

  /**
   * 工艺名称
   */
  craftName: string;

  /**
   * 产能面积
   */
  area: string | number;

  /**
   * 用户名
   */
  userName: string;
}

export interface CraftPersonalCapacityVo {
  day: string;

  capacityVoList: CapacityVO[]
}

export interface CapacityForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 流转卡ID
   */
  cardId?: string | number;

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 流转卡节点id
   */
  productionCardNodeId?: string | number;

  /**
   * 上报数量
   */
  reportedQuantity?: number;

  /**
   * 审核数量
   */
  auditQuantity?: number;

  /**
   * 修改原因
   */
  reason?: string;

  /**
   * 数量单位
   */
  unit?: number;

  /**
   * 修改原因
   */
  flowId?: string | number;

}

export interface CapacityQuery extends PageQuery {

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 流转卡ID
   */
  cardId?: string | number;

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 流转卡节点id
   */
  productionCardNodeId?: string | number;

  /**
   * 上报数量
   */
  reportedQuantity?: number;

  /**
   * 审核数量
   */
  auditQuantity?: number;

  /**
   * 修改原因
   */
  reason?: string;

  /**
   * 数量单位
   */
  unit?: number;

  /**
   * 修改原因
   */
  flowId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



