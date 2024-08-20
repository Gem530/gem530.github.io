export interface MaterialMonthInventoryVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 单价
   */
  price: number;

  /**
   * 年月
   */
  yearMonth: string;

  /**
   * 出库数量
   */
  outQuantity: number;

  /**
   * 入库数量
   */
  inQuantity: number;

  /**
   * 出库金额
   */
  outTotal: number;

  /**
   * 入库金额
   */
  inTotalPrice: number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

}

export interface MaterialMonthInventoryForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  version?: string | number;

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 年月
   */
  yearMonth?: string;

  /**
   * 出库数量
   */
  outQuantity?: number;

  /**
   * 入库数量
   */
  inQuantity?: number;

  /**
   * 出库金额
   */
  outTotal?: number;

  /**
   * 入库金额
   */
  inTotalPrice?: number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

}

export interface MaterialMonthInventoryQuery extends PageQuery {

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  version?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 年月
   */
  yearMonth?: string;

  /**
   * 出库数量
   */
  outQuantity?: number;

  /**
   * 入库数量
   */
  inQuantity?: number;

  /**
   * 出库金额
   */
  outTotal?: number;

  /**
   * 入库金额
   */
  inTotalPrice?: number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



