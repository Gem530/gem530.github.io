export interface CraftRoleVO {
  /**
   * id
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
   * 工艺ID
   */
  craftId: string | number;

  /**
   * 角色ID
   */
  roleId: string | number;

}

export interface CraftRoleForm extends BaseEntity {
  /**
   * id
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
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 角色ID
   */
  roleId?: string | number;

}

export interface CraftRoleQuery extends PageQuery {

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
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 角色ID
   */
  roleId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



