export interface SupplierMaterialVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 供应商id
   */
  toolType: number;

  /**
   * 物料id
   */
  materialId: string | number;

  /**
   * 单价
   */
  price: number;

  /**
   * 备注
   */
  remark: string;

}

export interface SupplierMaterialForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 供应商id
   */
  toolType?: number;

  /**
   * 物料id
   */
  materialId?: string | number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 备注
   */
  remark?: string;

}

export interface SupplierMaterialQuery extends PageQuery {

  /**
   * 供应商id
   */
  toolType?: number;

  /**
   * 物料id
   */
  materialId?: string | number;

  /**
   * 单价
   */
  price?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



