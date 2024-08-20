export interface CraftParameterConfigVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 参数名称
   */
  parameterName: string;

  /**
   * 数据类型  1数字
    2多行文本
    3时间
    4文本
    5单选
    6多选
    7开/关
    8下拉选择
    9仅显示
   */
  dataType: number;

  /**
   * 单位
   */
 // unitName: string;


  /**
   * 工艺信息id
   */
  craftId: string | number;


  craftparameter: [];

  /**
   * 是否按pnl区分
   */
  isDifferentiatePnl: string;

  /**
   * 是否加粗
   */
  isBold: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 参数类型（输入框、文本框、单选、多选、时间、开关、数字、下拉、仅显示）
   */
  type: string;

  /**
   * 参数名称
   */
  name: string;

  /**
   * 备选项（单选、多选、下拉）
   */
  options: string;

  /**
   * 编码
   */
  code: string;

  /**
   * 默认值(可输入条件表达式)
   */
  defaultValue: string;

  defaultValueList: [];
  optionsValueList: [];
  inputHiddenValue: [];
}

export interface CraftParameterConfigForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 参数名称
   */
  parameterName?: string;

  /**
   * 数据类型  1数字2多行文本3时间4文本5单选6多选7开/关8下拉选择9仅显示
   */
  dataType?: number;


  /**
   * 工艺信息id
   */
  craftId?: string | number;



  /**
   * 是否按pnl区分（否就是公共参数）
   */
  isDifferentiatePnl?: string;

  /**
   * 是否加粗
   */
  isBold?: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 参数类型（输入框、文本框、单选、多选、时间、开关、数字、下拉、仅显示）
   */
  type?: string;

  /**
   * 参数名称
   */
  name?: string;

  /**
   * 备选项（单选、多选、下拉）
   */
  options?: string;

  /**
   * 编码
   */
  code?: string;

  /**
   * 默认值(可输入条件表达式)
   */
 defaultValue?: any;


}

export interface CraftParameterConfigQuery extends PageQuery {

  /**
   * 参数名称
   */
  parameterName?: string;

  /**
   * 数据类型  1数字2多行文本3时间4文本5单选6多选7开/关8下拉选择9仅显示
   */
  dataType?: number;




  /**
   * 工艺信息id
   */
  craftId?: any;


    /**
     * 日期范围参数
     */
    params?: any;
}



