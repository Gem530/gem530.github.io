export interface NotifyVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 所属配置ID
   */
  configId: string | number;

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

  /**
   * 通知类型（0发送全部 1根据角色发送 2根据用户发送）
   */
  notifyType: string;

  /**
   * 通知人员（通知类型为全部时为空，根据角色发送则为角色字符串集合，根据用户发送则为用户ID集合）
   */
  notifyUser: string;

}

export interface NotifyForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 所属配置ID
   */
  configId?: string | number;

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
   * 通知类型（0发送全部 1根据角色发送 2根据用户发送）
   */
  notifyType?: string;

  /**
   * 通知人员（通知类型为全部时为空，根据角色发送则为角色字符串集合，根据用户发送则为用户ID集合）
   */
  notifyUser?: string;

}

export interface NotifyQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 所属配置ID
   */
  configId?: string | number;

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
   * 通知类型（0发送全部 1根据角色发送 2根据用户发送）
   */
  notifyType?: string;

  /**
   * 通知人员（通知类型为全部时为空，根据角色发送则为角色字符串集合，根据用户发送则为用户ID集合）
   */
  notifyUser?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



