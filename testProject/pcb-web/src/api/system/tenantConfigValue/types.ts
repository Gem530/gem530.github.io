export interface TenantConfigValueVO {
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
   * 配置ID
   */
  tenantConfigId: string | number;

  /**
   * 值
   */
  value: string;

}

export interface TenantConfigValueForm extends BaseEntity {
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
   * 配置ID
   */
  tenantConfigId?: string | number;

  /**
   * 值
   */
  value?: string;

}

export interface TenantConfigValueQuery extends PageQuery {

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
   * 配置ID
   */
  tenantConfigId?: string | number;

  /**
   * 值
   */
  value?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



