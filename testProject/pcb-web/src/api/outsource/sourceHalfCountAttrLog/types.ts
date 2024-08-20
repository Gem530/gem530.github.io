export interface SourceHalfCountAttrLogVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 公式id
   */
  ruleId: string | number;

  /**
   * 公式值
   */
  ruleValue: string;

  /**
   * 公式参数
   */
  ruleParam: string;

  /**
   * 公式参数值
   */
  ruleParamValue: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

}

export interface SourceHalfCountAttrLogForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 公式id
   */
  ruleId?: string | number;

  /**
   * 公式值
   */
  ruleValue?: string;

  /**
   * 公式参数
   */
  ruleParam?: string;

  /**
   * 公式参数值
   */
  ruleParamValue?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

}

export interface SourceHalfCountAttrLogQuery extends PageQuery {

  /**
   * 公式id
   */
  ruleId?: string | number;

  /**
   * 公式值
   */
  ruleValue?: string;

  /**
   * 公式参数
   */
  ruleParam?: string;

  /**
   * 公式参数值
   */
  ruleParamValue?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



