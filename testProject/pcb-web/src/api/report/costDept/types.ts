export interface DeptVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 成本月份
   */
  costMonth: string;

  /**
   * 部门id
   */
  deptId: string | number;

  /**
   * 物料工序成本
   */
  materialCraftPrice: number;

  /**
   * 人工成本
   */
  artificialPrice: number;

}

export interface DeptForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 成本月份
   */
  costMonth?: string;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 物料工序成本
   */
  materialCraftPrice?: number;

  /**
   * 人工成本
   */
  artificialPrice?: number;

}

export interface DeptQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 成本月份
   */
  costMonth?: string;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 物料工序成本
   */
  materialCraftPrice?: number;

  /**
   * 人工成本
   */
  artificialPrice?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



