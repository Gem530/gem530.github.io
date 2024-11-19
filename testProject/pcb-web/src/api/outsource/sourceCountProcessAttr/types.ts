export interface SourceCountProcessAttrVO {
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
   * key
   */
  key: string;

  /**
   * 类型
   */
  type: string;

  /**
   * 状态
   */
  status: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 值类型 1数组 2字符串
   */
  valueType: string;

}

export interface SourceCountProcessAttrForm extends BaseEntity {
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
   * key
   */
  key?: string;

  /**
   * 类型
   */
  type?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 值类型 1数组 2字符串
   */
  valueType?: string;

}

export interface SourceCountProcessAttrQuery extends PageQuery {

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * key
   */
  key?: string;

  /**
   * 类型
   */
  type?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 值类型 1数组 2字符串
   */
  valueType?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



