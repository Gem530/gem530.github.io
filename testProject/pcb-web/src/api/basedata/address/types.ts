export interface AddressVO {
  /**
   * $column.columnComment
   */
  id: string | number;

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
  isDefault: number | string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 客户id
   */
  customerId: string | number;

  /**
   * 供应商id
   */
  supplierId: string | number;
  /**
   * 类型-1客户收获地址-2单位收货地址
   */
  type: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

}

export interface AddressForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

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
  isDefault?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 客户id
   */
  customerId?: string | number;

  /**
  * 供应商id
  */
  supplierId?: string | number;
  /**
   * 类型-1客户收获地址-2单位收货地址
   */
  type?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

}

export interface AddressQuery extends PageQuery {

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
   * 客户id
   */
  customerId?: string | number;
  /**
    * 供应商id
    */
  supplierId: string | number;
  /**
   * 类型-1客户收获地址-2单位收货地址
   */
  type?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}



