export interface MaterialOrderDetailVO {
  /**
   * $主键id
   */
  id: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 采购数量
   */
  quantity: number;
  /**
   * 申请数量
   */
  applyQuantity: number;

  /**
   * 申请明细ID
   */
  applyDetailId: string | number;

  /**
   * 供应商ID
   */
  supplierId: string | number;
  /**
   * 供应商基价
   */
  supplierPrice: number;

  /**
   * 要求交期
   */
  deliverTime: string;

  /**
   * 受理人ID
   */
  handleUserId: string | number;

  /**
   * 受理人名称
   */
  handleUserName: string;

  /**
   * 采购单价
   */
  price: number;

  /**
   * 采购总价
   */
  totalPrice: number;

  /**
   * 入库数量
   */
  inventoryQuantity: number;

  /**
   * 状态（未结单、已结单）
   */
  status: string;

  /**
   * 确认备注
   */
  confirmRemark: string;

  /**
   * 物料编码
   */
  materialCode?: string;
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
   * 供应商名称
   */
  supplierName?: string;

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
   * 禁选
   */
  disabled: boolean;
}

export interface MaterialOrderDetailForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 采购数量
   */
  quantity?: number;

  /**
   * 申请明细ID
   */
  applyDetailId?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 要求交期
   */
  deliverTime?: string;

  /**
   * 受理人ID
   */
  handleUserId?: string | number;

  /**
   * 受理人名称
   */
  handleUserName?: string;

  /**
   * 采购单价
   */
  price?: number;

  /**
   * 采购总价
   */
  totalPrice?: number;

  /**
   * 入库数量
   */
  inventoryQuantity?: number;

  /**
   * 状态（未结单、已结单）
   */
  status?: string;
}

export interface MaterialOrderDetailQuery extends PageQuery {
  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 采购数量
   */
  quantity?: number;

  /**
   * 申请明细ID
   */
  applyDetailId?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 要求交期
   */
  deliverTime?: string;

  /**
   * 受理人ID
   */
  handleUserId?: string | number;

  /**
   * 受理人名称
   */
  handleUserName?: string;

  /**
   * 采购单价
   */
  price?: number;

  /**
   * 采购总价
   */
  totalPrice?: number;

  /**
   * 入库数量
   */
  inventoryQuantity?: number;

  /**
   * 状态（未结单、已结单）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
