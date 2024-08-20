export interface RawMaterialCategoryVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 编码
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 默认仓库id
   */
  defaultStorageId: string | number;

  /**
   * 默认保质期天数
   */
  defaultExpirationDays: number;

  /**
   * 是否需要IQC检测
   */
  isIqc: string;
}

export interface RawMaterialCategoryForm extends BaseEntity {
  /**
   * 角色id
   */
  roleIds?: [];
  /**
   *
   * 主键id
   */
  id?: string | number;

  /**
   * 编码
   */
  code?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 默认仓库id
   */
  defaultStorageId?: string | number;

  /**
   * 默认保质期天数
   */
  defaultExpirationDays?: number;

  /**
   * 是否需要IQC检测
   */
  isIqc?: string;
}

export interface RawMaterialCategoryQuery extends PageQuery {
  /**
   * 编码
   */
  code?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 默认仓库id
   */
  defaultStorageId?: string | number;

  /**
   * 默认保质期天数
   */
  defaultExpirationDays?: number;

  /**
   * 是否需要IQC检测
   */
  isIqc?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
