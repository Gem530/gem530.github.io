export interface SignVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 业务主键
   */
  bizStr: string;

  /**
   * 文件名
   */
  signName: string;

  /**
   * 类型 1pdf 2用户签字
   */
  signType: string;

  /**
   * 使用情况
   */
  state: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  key: string;

}

export interface SignForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 业务主键
   */
  bizStr?: string;

  /**
   * 文件名
   */
  signName?: string;

  /**
   * 类型 1pdf 2用户签字
   */
  signType?: string;

  /**
   * 使用情况
   */
  state?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 默认使用模块(1采购合同，2采购送货，3采购退货，4采购对账)
   */
  useModule?: string;

  /**
   * 是否取消之前的使用模块
   */
  cancelUseModule?: string;
}

export interface SignQuery extends PageQuery {

  /**
   * 业务主键
   */
  bizStr?: string;

  /**
   * 文件名
   */
  signName?: string;

  /**
   * 类型 1pdf 2用户签字
   */
  signType?: string;

  /**
   * 使用情况
   */
  state?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



