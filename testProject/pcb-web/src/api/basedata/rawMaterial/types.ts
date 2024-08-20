export interface RawMaterialVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 物料类别
   */
  categoryId: string | number;

  /**
   * 物料类别名称
   */
  categoryName: string;

  /**
   * 物料名称
   */
  name: string;

  /**
   * 物料编码
   */
  code: string;

  /**
   * 规格型号
   */
  specification: string;

  /**
   * 材质牌号
   */
  materialQuality: string;

  /**
   * 单位
   */
  units: string;

  /**
   * 单位名称
   */
  unitName: string;

  /**
   * 品牌
   */
  manufacturer: string;

  /**
   * 供应商
   */
  supplier: string;

  /**
   * 备注
   */
  remark: string;

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
   * 文件id
   */
  fileId: string | number;

  /**
   * 板厚
   */
  boardThickness: number;

  /**
   * 仓库
   */
  defaultStorageId : number
}

export interface RawMaterialForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 物料类别
   */
  categoryId?: string | number;

  /**
   * 物料名称
   */
  name?: string;

  /**
   * 规格型号
   */
  specification?: string;

  /**
   * 材质牌号
   */
  materialQuality?: string;

  /**
   * 单位
   */
  units?: string;

  /**
   * 品牌
   */
  manufacturer?: string;

  /**
   * 供应商
   */
  supplier?: string;

  /**
   * 备注
   */
  remark?: string;

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
   * 文件id
   */
  fileId?: string | number;

  /**
   * 板厚
   */
  boardThickness?: number;

  /**
   * 仓库
   */
  defaultStorageId?: String|number

  file?: any[]
}

export interface RawMaterialQuery extends PageQuery {
  /**
   * 物料类别
   */
  categoryId?: string | number;

  /**
   * 物料名称
   */
  name?: string;

  /**
   * 规格型号
   */
  specification?: string;
  status?: string;

  /**
   * 材质牌号
   */
  materialQuality?: string;

  /**
   * 单位
   */
  units?: string;

  /**
   * 品牌
   */
  manufacturer?: string;

  /**
   * 供应商
   */
  supplier?: string;

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
   * 文件id
   */
  fileId?: string | number;

  /**
   * 板厚
   */
  boardThickness?: number;

  /**
   * 日期范围参数
   */
  params?: any;

  /**
   * 仓库
   */
  defaultStorageId?: number
}

/** * 状态枚举
 * 0使用 1停用
 */
export enum StatusEnum {

  /**
   * 使用
   */
  USE = '0',

  /**
   * 停用
   */
  STOP = '1'
}
export const StatusStrings = {
  [StatusEnum.USE]: '使用',
  [StatusEnum.STOP]: '停用'
};

export enum InOutTypeEnum {
  /**
    * 采购入库
    */
  PURCHASE_IN = "1",
  /**
   * 库存退货
   */
  STOCK_RETURN = "2",
  /**
   * 生产发料
   */
  PRODUCTION_ISSUE = "3",
  /**
   * 生产退料
   */
  PRODUCTION_RETURN = "4",
  /**
   * 物料借出
   */
  MATERIAL_BORROW = "5",
  /**
   * 借出归还
   */
  BORROW_RETURN = "6",
  /**
   * 物料借入
   */
  MATERIAL_IN = "7",
  /**
   * 借入归还
   */
  BORROW_IN = "8",
  /**
   * 直接出库
   */
  DIRECT_OUT = "9",
  /**
   * 盘点出库
   */
  CHECK_OUT = "10",
  /**
   * 盘点入库
   */
  CHECK_IN = "11",
  /**
   * 转仓出库
   */
  TRANSFER_OUT = "12",
  /**
   * 转仓入库
   */
  TRANSFER_IN = "13",
  /**
   * 小程序入库
   */
  APPLET_IN = "14",
  /**
   * 小程序出库
   */
  APPLET_OUT = "15",
  /**
   * 领料出库
   */
  MATERIAL_OUT = "16",
  /**
   * 领料还回
   */
  MATERIAL_RETURN = "17",
}

export const typeStrings = {
  [InOutTypeEnum.PURCHASE_IN]: '采购入库',
  [InOutTypeEnum.STOCK_RETURN]: '库存退货',
  [InOutTypeEnum.PRODUCTION_ISSUE]: '生产发料',
  [InOutTypeEnum.PRODUCTION_RETURN]: '生产退料',
  [InOutTypeEnum.MATERIAL_BORROW]: '物料借出',
  [InOutTypeEnum.BORROW_RETURN]: '借出归还',
  [InOutTypeEnum.MATERIAL_IN]: '物料借入',
  [InOutTypeEnum.BORROW_IN]: '借入归还',
  [InOutTypeEnum.DIRECT_OUT]: '直接出库',
  [InOutTypeEnum.CHECK_OUT]: '盘点出库',
  [InOutTypeEnum.CHECK_IN]: '盘点入库',
  [InOutTypeEnum.TRANSFER_OUT]: '转仓出库',
  [InOutTypeEnum.TRANSFER_IN]: '转仓入库',
  [InOutTypeEnum.APPLET_IN]: '小程序入库',
  [InOutTypeEnum.APPLET_OUT]: '小程序出库',
  [InOutTypeEnum.MATERIAL_OUT]: '领料出库',
  [InOutTypeEnum.MATERIAL_RETURN]: '领料还回',
};

export enum FeiLinTypeEnum {
  FEI_LIN = "1",
  WANGBAN = "2",
}
export const feiLinTypeStrings = {
  [FeiLinTypeEnum.FEI_LIN]: '菲林',
  [FeiLinTypeEnum.WANGBAN]: '网板'
};

//菲林是否压模
export enum CompressionEnum {
  Y = "1",
  N = "2",
}
export const CompressionStrings = {
  [CompressionEnum.Y]: '是',
  [CompressionEnum.N]: '否'
};
