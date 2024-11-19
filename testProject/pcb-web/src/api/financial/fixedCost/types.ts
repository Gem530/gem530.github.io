export interface FixedCostVO {
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
   * 固定成本类型 1：水费、2：电费、3：房租、4：人工、5：运费、6：设备折旧、7：其他
   */
  type: string;

  /**
   * 所属部门
   */
  bearDeptId: string | number;

  /**
   * 成本
   */
  price: number;

  /**
   * 客户id
   */
  customerId: string | number;

}

export interface FixedCostForm extends BaseEntity {
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
   * 固定成本类型 1：水费、2：电费、3：房租、4：人工、5：运费、6：设备折旧、7：其他
   */
  type?: string;

  /**
   * 所属部门
   */
  bearDeptId?: string | number;

  /**
   * 成本
   */
  price?: number;

  /**
   * 客户id
   */
  customerId?: string | number;

}

export interface FixedCostQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 成本月份
   */
  costMonth?: string;

  /**
   * 固定成本类型 1：水费、2：电费、3：房租、4：人工、5：运费、6：设备折旧、7：其他
   */
  type?: string;

  /**
   * 所属部门
   */
  bearDeptId?: string | number;

  /**
   * 成本
   */
  price?: number;

  /**
   * 客户id
   */
  customerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



