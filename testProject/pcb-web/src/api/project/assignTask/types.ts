export interface AssignTaskVO {
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
   * 订单ID
   */
  saleOrderId: string | number;

  /**
   * cam工程师ID
   */
  camUserId: string | number;

  /**
   * mi工程师ID
   */
  miUserId: string | number;

  /**
   * 状态
   */
  status: string;

  /**
   * 是否在EQ确认中(0: 不在EQ中， 1：在EQ中)
   */
  isEqConfirm: string;

  /**
   * cam工程师名字
   */
  camUserName: string;

  /**
   * mi工程师名字
   */
  miUserName: string;

}

export interface AssignTaskForm extends BaseEntity {
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
   * 订单ID
   */
  saleOrderId?: string | number;

  /**
   * cam工程师ID
   */
  camUserId?: string | number;

  /**
   * mi工程师ID
   */
  miUserId?: string | number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 是否在EQ确认中(0: 不在EQ中， 1：在EQ中)
   */
  isEqConfirm?: string;

  /**
   * cam工程师名字
   */
  camUserName?: string;

  /**
   * mi工程师名字
   */
  miUserName?: string;

}

export interface AssignTaskQuery extends PageQuery {

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
   * 订单ID
   */
  saleOrderId?: string | number;

  /**
   * cam工程师ID
   */
  camUserId?: string | number;

  /**
   * mi工程师ID
   */
  miUserId?: string | number;

  /**
   * 状态
   */
  status?: string;

  /**
   * 是否在EQ确认中(0: 不在EQ中， 1：在EQ中)
   */
  isEqConfirm?: string;

  /**
   * cam工程师名字
   */
  camUserName?: string;

  /**
   * mi工程师名字
   */
  miUserName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



