export interface CardNodeVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

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
   * 工艺要求
   */
  requirement: string;

  /**
   * 工艺备注
   */
  remark: string;

  /**
   * 是否过数
   */
  isCount: string;

  /**
   * 接单时间
   */
  beginTime: string;

  /**
   * 完成时间
   */
  finishTime: string;

  /**
   * 接单PNL数量
   */
  pnlQuantity: number;

  /**
   * 接单SET数量
   */
  setQuantity: number;

  /**
   * 接单PCS数量
   */
  pcsQuantity: number;

  /**
   * 排序号
   */
  sort: number;

}

export interface CardNodeForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

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
   * 工艺要求
   */
  requirement?: string;

  /**
   * 工艺备注
   */
  remark?: string;

  /**
   * 是否过数
   */
  isCount?: string;

  /**
   * 接单时间
   */
  beginTime?: string;

  /**
   * 完成时间
   */
  finishTime?: string;

  /**
   * 接单PNL数量
   */
  pnlQuantity?: number;

  /**
   * 接单SET数量
   */
  setQuantity?: number;

  /**
   * 接单PCS数量
   */
  pcsQuantity?: number;

  /**
   * 排序号
   */
  sort?: number;

}

export interface CardNodeQuery extends PageQuery {

  /**
   * 单位ID
   */
  ownerId?: string | number;

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
   * 工艺要求
   */
  requirement?: string;

  /**
   * 是否过数
   */
  isCount?: string;

  /**
   * 接单时间
   */
  beginTime?: string;

  /**
   * 完成时间
   */
  finishTime?: string;

  /**
   * 接单PNL数量
   */
  pnlQuantity?: number;

  /**
   * 接单SET数量
   */
  setQuantity?: number;

  /**
   * 接单PCS数量
   */
  pcsQuantity?: number;

  /**
   * 排序号
   */
  sort?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



