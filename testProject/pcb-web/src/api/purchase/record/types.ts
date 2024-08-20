export interface RecordVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 所属单位名称
   */
  ownerName: string;

  /**
   * 操作类型：1-修改，2-确认，3-新增，4-删除
   */
  type: string;

  /**
   * 操作字段
   */
  field: string;

  /**
   * 旧值
   */
  oldValue: string;

  /**
   * 新值
   */
  newValue: string;

  /**
   * 操作内容
   */
  operateContent: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 业务id
   */
  bizId: string | number;

}

export interface RecordForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 操作类型：1-修改，2-确认，3-新增，4-删除
   */
  type?: string;

  /**
   * 操作字段
   */
  field?: string;

  /**
   * 旧值
   */
  oldValue?: string;

  /**
   * 新值
   */
  newValue?: string;

  /**
   * 操作内容
   */
  operateContent?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 业务id
   */
  bizId?: string | number;

}

export interface RecordQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 操作类型：1-修改，2-确认，3-新增，4-删除
   */
  type?: string;

  /**
   * 操作字段
   */
  field?: string;

  /**
   * 旧值
   */
  oldValue?: string;

  /**
   * 新值
   */
  newValue?: string;

  /**
   * 操作内容
   */
  operateContent?: string;

  /**
   * 业务id
   */
  bizId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



