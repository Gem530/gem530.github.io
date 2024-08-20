export interface SchemeVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 开料方案ID
   */
  schemeId: string | number;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 实投大料数
   */
  feedQuantity: number;

  /**
   * 单位ID
   */
  ownerId: string | number;

}

export interface SchemeForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 开料方案ID
   */
  schemeId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 实投大料数
   */
  feedQuantity?: number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

}

export interface SchemeQuery extends PageQuery {

  /**
   * 开料方案ID
   */
  schemeId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 实投大料数
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



