export interface UserFeedbackVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 反馈意见
   */
  feedback: string;

}

export interface UserFeedbackForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 反馈意见
   */
  feedback?: string;

}

export interface UserFeedbackQuery extends PageQuery {

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 反馈意见
   */
  feedback?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



