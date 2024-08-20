export interface ProductionPlanSchemePnlVO {
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
   * 工艺单PNLID
   */
  pnlId: string | number;

  /**
   * 开料方案ID
   */
  schemeId: string | number;

  /**
   * 开料方案对应的PNL数量
   */
  pnlQuantity: number;

}

export interface ProductionPlanSchemePnlForm extends BaseEntity {
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
   * 工艺单PNLID
   */
  pnlId?: string | number;

  /**
   * 开料方案ID
   */
  schemeId?: string | number;

  /**
   * 开料方案对应的PNL数量
   */
  pnlQuantity?: number;

}

export interface ProductionPlanSchemePnlQuery extends PageQuery {

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
   * 工艺单PNLID
   */
  pnlId?: string | number;

  /**
   * 开料方案ID
   */
  schemeId?: string | number;

  /**
   * 开料方案对应的PNL数量
   */
  pnlQuantity?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



