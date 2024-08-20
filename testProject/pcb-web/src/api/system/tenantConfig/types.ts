export interface TenantConfigVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 创建部门名称
   */
  createDeptName: string;

  /**
   * 创建者名称
   */
  createByName: string;

  /**
   * 更新者名称
   */
  updateByName: string;

  /**
   * 配置项名称
   */
  name: string;

  /**
   * 配置项编码
   */
  code: string;

  /**
   * 配置项类型(单选、多选、下拉、输入框、文本框、开关、编码生成组件)
   */
  type: string;

  /**
   * 配置项备选项（供单选、多选、下拉、编码生成组件使用）
   */
  options: Array<string> | any;

  /**
   * 默认值
   */
  defaultValue: any;

  optionNames: Array<string> | any;

  /**
   * 描述
   */
  remark: string;

  value: string;

  values: Array<string> | any;

  tagChecked: boolean;

}

export interface TenantConfigForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 配置项名称
   */
  name?: string;

  /**
   * 配置项编码
   */
  code?: string;

  /**
   * 配置项类型(单选、多选、下拉、输入框、文本框、开关、编码生成组件)
   */
  type?: string;

  /**
   * 配置项备选项（供单选、多选、下拉、编码生成组件使用）
   */
  options?: any;

  optionNames?: any;

  /**
   * 默认值
   */
  defaultValue?: any;

  /**
   * 描述
   */
  remark?: string;

  value?: string;

  values?: [];
  
  /**
   * 租户配置列表
   */
  tenantConfigBoList: Array<TenantConfigVO>;
}

export interface TenantConfigQuery extends PageQuery {

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 配置项名称
   */
  name?: string;

  /**
   * 配置项编码
   */
  code?: string;

  /**
   * 配置项类型(单选、多选、下拉、输入框、文本框、开关、编码生成组件)
   */
  type?: string;

  /**
   * 配置项备选项（供单选、多选、下拉、编码生成组件使用）
   */
  options?: string;

  /**
   * 默认值
   */
  defaultValue?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



