export interface CraftTemplateVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 工艺模板名
   */
  templateName: string;

  /**
   * 备注
   */
  remark: string;

/**
 *工艺list
 */
  craftList?:[];
}

export interface CraftTemplateForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 工艺模板名
   */
  templateName?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 工艺list
   */
  craftIdList?:[]
}

export interface CraftTemplateQuery extends PageQuery {

  /**
   * 工艺模板名
   */
  templateName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



