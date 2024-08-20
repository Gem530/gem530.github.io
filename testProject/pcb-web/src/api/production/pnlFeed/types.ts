export interface PnlFeedVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 开料方案ID
   */
  schemeId: string | number;

  /**
   * 制作单PNLID
   */
  pnlId: string | number;

  /**
   * PNL实投数量
   */
  feedQuantity: number;

  /**
   * 单位ID
   */
  ownerId: string | number;

}

export interface PnlFeedForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 开料方案ID
   */
  schemeId?: string | number;

  /**
   * 制作单PNLID
   */
  pnlId?: string | number;

  /**
   * PNL实投数量
   */
  feedQuantity?: number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

}

export interface PnlFeedQuery extends PageQuery {

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 开料方案ID
   */
  schemeId?: string | number;

  /**
   * 制作单PNLID
   */
  pnlId?: string | number;

  /**
   * PNL实投数量
   */
  feedQuantity?: number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



