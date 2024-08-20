export interface CraftTemplateCraftVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 工艺id
   */
  craftId: string | number;

  /**
   * 工艺模板id
   */
  craftTemplateId: string | number;

  /**
   * 工艺顺序
   */
  sort: number;

}

export interface CraftTemplateCraftForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 工艺id
   */
  craftId?: string | number;

  /**
   * 工艺模板id
   */
  craftTemplateId?: string | number;

  /**
   * 工艺顺序
   */
  sort?: number;

}

export interface CraftTemplateCraftQuery extends PageQuery {

  /**
   * 工艺id
   */
  craftId?: string | number;

  /**
   * 工艺模板id
   */
  craftTemplateId?: string | number;

  /**
   * 工艺顺序
   */
  sort?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



