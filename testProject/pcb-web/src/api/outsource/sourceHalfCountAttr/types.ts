export interface SourceHalfCountAttrVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 工艺ID
   */
  craftId: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 工艺配置ID
   */
  paramId: string | number;

  /**
   * 类型
   */
  type: string;

  /**
   * 状态
   */
  status: string;

  /**
   * 姓名
   */
  name: string;

}

export interface SourceHalfCountAttrForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 工艺配置ID
   */
  paramId?: string | number;

  /**
   * 类型
   */
  type?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 姓名
   */
  name?: string;

}

export interface SourceHalfCountAttrQuery extends PageQuery {

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 工艺配置ID
   */
  paramId?: string | number;

  /**
   * 类型
   */
  type?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 姓名
   */
  name?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



