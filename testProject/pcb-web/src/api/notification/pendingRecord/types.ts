export interface PendingRecordVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 所属代办ID
   */
  pendingId: string | number;

  /**
   * 处理结果
   */
  result: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 处理人员角色ID与所属代办允许的角色ID交集
   */
  roleId: string | number;

  /**
   * 来源单据编号
   */
  bizNo: string;

  /**
   * 归属分类
   */
  category: string;

  /**
   * 标题
   */
  title: string;
}

export interface PendingRecordForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 所属代办ID
   */
  pendingId?: string | number;

  /**
   * 处理结果
   */
  result?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 处理人员角色ID与所属代办允许的角色ID交集
   */
  roleId?: string | number;

  /**
   * 来源单据编号
   */
  bizNo?: string;

  /**
   * 归属分类
   */
  category?: string;

  /**
   * 标题
   */
  title: string;
}

export interface PendingRecordQuery extends PageQuery {

  /**
   * 所属代办ID
   */
  pendingId?: string | number;

  /**
   * 处理结果
   */
  result?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 处理人员角色ID与所属代办允许的角色ID交集
   */
  roleId?: string | number;

  /**
   * 来源单据编号
   */
  bizNo?: string;

  /**
   * 归属分类
   */
  category?: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



