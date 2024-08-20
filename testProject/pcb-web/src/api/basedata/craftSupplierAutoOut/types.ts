export interface CraftSupplierAutoOutVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 工艺名称
   */
  craftName: string;

  /**
   * 工艺id
   */
  craftId: string | number;

  /**
   * 自动外发供应商id
   */
  supplierId: string | number;

  /**
   * 自动外发单位
   */
  unit: string;

  /**
   * 备注
   */
  remark: string;

}

export interface CraftSupplierAutoOutForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 工艺名称
   */
  craftName?: string;

  /**
   * 工艺id
   */
  craftId?: string | number;

  /**
   * 自动外发供应商id
   */
  supplierId?: string | number;

  /**
   * 自动外发单位
   */
  unit?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface CraftSupplierAutoOutQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 工艺名称
   */
  craftName?: string;

  /**
   * 工艺id
   */
  craftId?: string | number;

  /**
   * 自动外发供应商id
   */
  supplierId?: string | number;

  /**
   * 自动外发单位
   */
  unit?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



