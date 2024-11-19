export interface NotifyRecordVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 所属通知ID
   */
  notifyId: string | number;

  /**
   * 归属类型
   */
  category: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 内容
   */
  contentConfig: string;

}

export interface NotifyRecordForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 所属通知ID
   */
  notifyId?: string | number;

  /**
   * 归属类型
   */
  category?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 内容
   */
  contentConfig?: string;

}

export interface NotifyRecordQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 所属通知ID
   */
  notifyId?: string | number;

  /**
   * 归属类型
   */
  category?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 内容
   */
  contentConfig?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



