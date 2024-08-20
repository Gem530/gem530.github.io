export interface CustomerAddressVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  customerId?: string | number;

  supplierId?: string | number;
  /**
   * 联系人
   */
  name: string;

  /**
   * 联系电话
   */
  phone: string;

  /**
   * 联系地址
   */
  address: string;

  /**
   * 物流周期
   */
  logisticsCycle: number;

  /**
   * 是否默认1否 2是
   */
  isDefault: number;

  /**
   * 备注
   */
  remark: string;

  createTime: string;

  type: string;
}

export interface CustomerAddressForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  customerId?: string | number;

  supplierId?: string | number;
  /**
   * 联系人
   */
  name?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 联系地址
   */
  address?: string;

  /**
   * 物流周期
   */
  logisticsCycle?: number;

  /**
   * 是否默认1否 2是
   */
  isDefault?: number;

  /**
   * 备注
   */
  remark?: string;
  type?:string;
}

export interface CustomerAddressQuery extends PageQuery {

  /**
   * 联系人
   */
  name?: string;

  customerId?: string | number;

  supplierId?: string | number;
  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 联系地址
   */
  address?: string;

  /**
   * 物流周期
   */
  logisticsCycle?: number;

  /**
   * 是否默认1否 2是
   */
  isDefault?: number;

    /**
     * 日期范围参数
     */
    params?: any;

    type?:string;
}



