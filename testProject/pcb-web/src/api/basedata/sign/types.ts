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



