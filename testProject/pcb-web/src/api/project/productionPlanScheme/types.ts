export interface ProductionPlanSchemeVO {
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
   * 开料方案名称
   */
  name: string;

  /**
   * MI制作单ID
   */
  planId: string | number;

  /**
   * 预投大料数
   */
  preFeedQuantity: number;

  /**
   * 开料率
   */
  cuttingRate: number;

  /**
   * 板材ID
   */
  rawMaterialId: string | number;

  /**
   * 板材长
   */
  boardLength: number;

  /**
   * 板材宽
   */
  boardWidth: string | number;

}

export interface ProductionPlanSchemeForm extends BaseEntity {
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
   * 开料方案名称
   */
  name?: string;

  /**
   * MI制作单ID
   */
  planId?: string | number;

  /**
   * 预投大料数
   */
  preFeedQuantity?: number;

  /**
   * 开料率
   */
  cuttingRate?: number;

  /**
   * 板材ID
   */
  rawMaterialId?: string | number;

  /**
   * 板材长
   */
  boardLength?: number;

  /**
   * 板材宽
   */
  boardWidth?: string | number;

}

export interface ProductionPlanSchemeQuery extends PageQuery {

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
   * 开料方案名称
   */
  name?: string;

  /**
   * MI制作单ID
   */
  planId?: string | number;

  /**
   * 预投大料数
   */
  preFeedQuantity?: number;

  /**
   * 开料率
   */
  cuttingRate?: number;

  /**
   * 板材ID
   */
  rawMaterialId?: string | number;

  /**
   * 板材长
   */
  boardLength?: number;

  /**
   * 板材宽
   */
  boardWidth?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



