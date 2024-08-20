export interface InventoryCommodityRecordVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 创建部门名称
   */
  createDeptName: string;

  /**
   * 创建者名称
   */
  createByName: string;

  /**
   * 更新者名称
   */
  updateByName: string;

  /**
   * 入库类型（退货入库、生产入库、外协入库）
   */
  type: string;

  /**
   * 入库数量
   */
  quantity: number;

  /**
   * 业务ID
   */
  bizId: string | number;

  /**
   * 入库编号
   */
  code: string;

  /**
   * 仓库id
   */
  storageId: string | number;

}

export interface InventoryCommodityRecordForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 入库类型（退货入库、生产入库、外协入库）
   */
  type?: string;

  /**
   * 入库数量
   */
  quantity?: number;

  /**
   * 业务ID
   */
  bizId?: string | number;

  /**
   * 入库编号
   */
  code?: string;
  /**
   * 库位id
   */
  storageId?: number;

}

export interface InventoryCommodityRecordQuery extends PageQuery {

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 入库类型（退货入库、生产入库、外协入库）
   */
  type?: string;

  /**
   * 入库数量
   */
  quantity?: number;

  /**
   * 业务ID
   */
  bizId?: string | number;

  /**
   * 入库编号
   */
  code?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



