export interface LogisticsCompanyVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * $column.columnComment
   */
  ownerId: string | number;

  /**
   * 物流公司名简称
   */
  name: string;

  /**
   * 物流公司名全称
   */
  fullName: string;

  /**
   * 物流公司编码
   */
  code: string;

  /**
   * 电话
   */
  phone: string;

}

export interface LogisticsCompanyForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * $column.columnComment
   */
  ownerId?: string | number;

  /**
   * 物流公司名简称
   */
  name?: string;

  /**
   * 物流公司名全称
   */
  fullName?: string;

  /**
   * 物流公司编码
   */
  code?: string;

  /**
   * 电话
   */
  phone?: string;

}

export interface LogisticsCompanyQuery extends PageQuery {

  /**
   * $column.columnComment
   */
  ownerId?: string | number;

  /**
   * 物流公司名简称
   */
  name?: string;

  /**
   * 物流公司名全称
   */
  fullName?: string;

  /**
   * 物流公司编码
   */
  code?: string;

  /**
   * 电话
   */
  phone?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



