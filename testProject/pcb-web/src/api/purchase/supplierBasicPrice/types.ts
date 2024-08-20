export interface SupplierBasicPriceVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 状态
   */
  status: string;
  /**
   * 物料编码
   */
  code: string;

  /**
   * 物料名称
   */
  name: string;

  /**
   * 供应商编码
   */
  supplierCode: string;

  /**
   * 供应商名称
   */
  supplierName: string;

  /**
   * 物料规格
   */
  specification: string;

  /**
   * 材质牌号
   */
  materialQuality: string;

  /**
   * 物料类别Id
   */
  categoryId: string;
  /**
   * 物料类别名称
   */
  categoryName: string;

  /**
   * 品牌
   */
  manufacturer: string;
  /**
   * 颜色
   */
  color: string;

  /**
   * 级别
   */
  level: string;

  /**
   * 铜厚
   */
  copperThickness: number | string;

  /**
   * 长
   */
  length: number;

  /**
   * 宽
   */
  width: string | number;

  /**
   * 板厚
   */
  boardThickness: number;

  /**
   * 单价 分
   */
  price: number;

  /**
   * 备注
   */
  remark: string;
  /**
   * 变更人
   */
  updateByName: string;
}

export interface SupplierBasicPriceForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 物料id
   */
  rawMaterialId?: string | number;

  /**
   * 物料编码
   */
  code?: string;

  /**
   * 物料名称
   */
  name?: string;

  /**
   * 供应商id
   */
  supplierId?: string | number;
  /**
   * 供应商编码
   */
  supplierCode?: string;

  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 材质牌号
   */
  materialQuality?: string;

  /**
   * 物料规格
   */
  specification?: string;

  /**
   * 物料类别
   */
  categoryId?: string | number;

  /**
   * 物料名称
   */
  categoryName?: string;

  /**
   * 品牌
   */
  manufacturer?: string;

  /**
   * 单价 分
   */
  price?: number;

  /**
   * 颜色
   */
  color?: string;

  /**
   * 级别
   */
  level?: string;

  /**
   * 铜厚
   */
  copperThickness?: string | number;

  /**
   * 长
   */
  length?: number | string;

  /**
   * 宽
   */
  width?: string | number;

  /**
   * 板厚
   */
  boardThickness?: number;


  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态
   */
  status?: string;

  /**
   * 基价历史记录
   */
  historyPriceList: SupplierBasicPriceVO[];
  /**
   * 其他供应商价格
   */
  otherSupplierPriceList: SupplierBasicPriceVO[];
}

export interface SupplierBasicPriceQuery extends PageQuery {
  /**
   * 物料编码
   */
  code?: string;

  /**
   * 物料名称
   */
  name?: string;

  /**
   * 物料类别
   */
  categoryId?: string | number;

  /**
   * 供应商编码
   */
  supplierCode?: string;

  /**
   * 供应商名称
   */
  supplierName?: string;

  /**
   * 物料规格
   */
  specification?: string;

  /**
   * 材质牌号
   */
  number?: string;

  /**
   * 物料类别
   */
  materialType?: string;

  /**
   * 品牌
   */
  manufacturer?: string;

  /**
   * 颜色
   */
  color?: string;

  /**
   * 级别
   */
  level?: string;

  /**
   * 铜厚
   */
  copperThickness?: string | number;

  /**
   * 长
   */
  length?: number | string;

  /**
   * 宽
   */
  width?: string | number;

  /**
   * 板厚
   */
  boardThickness?: number;


  /**
   * 单价 分
   */
  price?: number;

  /**
   * 备注
   */
  comment?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

/** * 供应商基价状态枚举
 * 1.待提交
 * 2.待审核
 * 3.已审核
 * 4.驳回 */
export enum SupplierBasicPriceStatusEnum {
  /**
   * 待提交
   */
  TO_BE_SUBMITTED = '1',
  /**
   * 待审核
   */
  TO_BE_AUDITED = '2',
  /**
   * 已审核
   */
  AUDITED = '3',
  /**
   * 驳回
   */
  REJECTED = '4'
}
export const statusStrings = {
  [SupplierBasicPriceStatusEnum.TO_BE_SUBMITTED]: '待提交',
  [SupplierBasicPriceStatusEnum.TO_BE_AUDITED]: '待审核',
  [SupplierBasicPriceStatusEnum.AUDITED]: '已审核',
  [SupplierBasicPriceStatusEnum.REJECTED]: '驳回'
};
