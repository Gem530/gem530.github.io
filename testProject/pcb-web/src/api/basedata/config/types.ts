export interface FormConfigVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 表单编号
   */
  formCode: string;

  /**
   * 字段编号
   */
  fieldCode: string;

  /**
   * 是否隐藏(1=隐藏，0=不隐藏)
   */
  isHidden: string | number;

}

export interface FormConfigForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 表单编号
   */
  formCode?: string;

  /**
   * 字段编号
   */
  fieldCode?: string;

  /**
   * 是否隐藏(1=隐藏，0=不隐藏)
   */
  isHidden?: string | number;

}

export interface FormConfigQuery extends PageQuery {

  /**
   * 表单编号
   */
  formCode?: string;

  /**
   * 字段编号
   */
  fieldCode?: string;

  /**
   * 是否隐藏(1=隐藏，0=不隐藏)
   */
  isHidden?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



