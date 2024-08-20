export interface ProductionPlanPnlVO {
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
   * pnl名称
   */
  name: string;

  /**
   * MI制作单ID
   */
  planId: string | number;

  /**
   * 预投pnl数
   */
  preFeedQuantity: number;

  /**
   * pnl长
   */
  pnlLength: number;

  /**
   * pnl宽
   */
  pnlWidth: string | number;

}

export interface ProductionPlanPnlForm extends BaseEntity {
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
   * pnl名称
   */
  name?: string;

  /**
   * MI制作单ID
   */
  planId?: string | number;

  /**
   * 预投pnl数
   */
  preFeedQuantity?: number;

  /**
   * pnl长
   */
  pnlLength?: number;

  /**
   * pnl宽
   */
  pnlWidth?: string | number;

}

export interface ProductionPlanPnlQuery extends PageQuery {

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
   * pnl名称
   */
  name?: string;

  /**
   * MI制作单ID
   */
  planId?: string | number;

  /**
   * 预投pnl数
   */
  preFeedQuantity?: number;

  /**
   * pnl长
   */
  pnlLength?: number;

  /**
   * pnl宽
   */
  pnlWidth?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



