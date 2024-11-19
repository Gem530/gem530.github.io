export interface PendingConfigVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 菜单ID
   */
  menuId: string | number;

  /**
   * 类型
   */
  type: string;

  /**
   * 代办角色权限字符串集合
   */
  verifyRole: string;

  /**
   * 页面跳转参数
   */
  param: string;

  /**
   * 代办处理人数
   */
  dealNum: number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 标题配置
   */
  titleConfig: string;

  /**
   * 微信菜单ID
   */
  wxMenuId: string | number;

}

export interface PendingConfigForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 菜单ID
   */
  menuId?: string | number;

  /**
   * 类型
   */
  type?: string;

  /**
   * 代办角色权限字符串集合
   */
  verifyRole?: string;

  /**
   * 页面跳转参数
   */
  param?: string;

  /**
   * 代办处理人数
   */
  dealNum?: number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 标题配置
   */
  titleConfig?: string;

  /**
   * 微信菜单ID
   */
  wxMenuId?: string | number;

}

export interface PendingConfigQuery extends PageQuery {

  /**
   * 菜单ID
   */
  menuId?: string | number;

  /**
   * 类型
   */
  type?: string;

  /**
   * 代办角色权限字符串集合
   */
  verifyRole?: string;

  /**
   * 页面跳转参数
   */
  param?: string;

  /**
   * 代办处理人数
   */
  dealNum?: number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 标题配置
   */
  titleConfig?: string;

  /**
   * 微信菜单ID
   */
  wxMenuId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



