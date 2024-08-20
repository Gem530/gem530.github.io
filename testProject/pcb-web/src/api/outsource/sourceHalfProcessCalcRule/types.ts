export interface SourceHalfProcessCalcRuleVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 单位id
   */
  ownerId: string | number;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 工艺ID
   */
  craftId: string | number;

  /**
   * 类型（网板、菲林、工艺）
   */
  type: string;

  /**
   * 计价公式
   */
  formula: string;

  /**
   * 备注
   */
  remark: string;
}

export interface SourceHalfProcessCalcRuleForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 单位id
   */
  ownerId?: string | number;
  /**
   * 价格
   */
  price?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 类型（网板、菲林、工艺）
   */
  type?: string;

  /**
   * 计价公式
   */
  formula?: number | string;

  /**
   * 备注
   */
  remark?: string;
}

export interface SourceHalfProcessCalcRuleQuery extends PageQuery {
  /**
   * 单位id
   */
  ownerId?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 类型（网板、菲林、工艺）
   */
  type?: string;

  /**
   * 计价公式
   */
  formula?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

/**
 * 类型（1、网板、2、菲林、3、工艺） 枚举
 */
export enum SourceHalfProcessCalcRuleTypeEnum {
  /**
   * 网板
   */
  WANG_BAN = '1',

  /**
   * 菲林
   */
  FEI_LIN = '2',

  /**
   * 工艺
   */
  GONG_YI = '3'
}
export const typeStrings = {
  [SourceHalfProcessCalcRuleTypeEnum.WANG_BAN]: '网板',
  [SourceHalfProcessCalcRuleTypeEnum.FEI_LIN]: '菲林',
  [SourceHalfProcessCalcRuleTypeEnum.GONG_YI]: '工艺'
};
