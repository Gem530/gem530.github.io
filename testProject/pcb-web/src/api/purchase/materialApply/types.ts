export interface MaterialApplyDetailsForm {
  /**
   * 申请数量
   */
  quantity?: number;
  /**
   * 物料id
   */
  rawMaterialId?: string | number;

  /**
   * 要求交期
   */
  deliverTime?: string;
}

export interface MaterialApplyVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 申请单号
   */
  code: string;

  /**
   * 申请类型
   */
  type: string;

  /**
   * 要求交期
   */
  deliverTime: string;

  /**
   * 收货地址
   */
  addressId: string;

  /**
   * 申请人id
   */
  applyUserId: string | number;
  /**
   * 申请人姓名
   */
  applyUserName: string;

  /**
   * 申请时间
   */
  applyTime: string;

  /**
   * 备注
   */
  comment: string;
  /**
   * loading
   */
  loading: boolean;
  /**
   * 申请明细
   */
  inventoryList: RawMaterialVO[];
}

export interface RawMaterialVO {
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
   * 实际库存
   */
  actualStock: number;
  /**
   * 可用库存
   */
  availableStock: number;
  /**
   * 在途数量
   */
  onWayStock: number;
  /**
   * 申请数量
   */
  quantity: number;
  /**
   * 要求交期
   */
  deliverTime: string;
}

export interface MaterialApplyForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 申请单号
   */
  code?: string;

  /**
   * 申请类型
   */
  applyType?: string;

  /**
   * 要求交期
   */
  deliverTime?: string;

  /**
   * 收货地址id
   */
  addressId?: string | number;

  /**
   * 申请人id
   */
  applyUserId?: string | number;

  /**
   * 申请时间
   */
  applyTime?: string;

  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态
   */
  status?: string;

  /**
   * 申请明细
   */
  materialApplyDetailsList?: MaterialApplyDetailsForm[];
  /**
   * 申请明细
   */
  inventoryList?: MaterialApplyDetailsForm[];
}

export interface MaterialApplyQuery extends PageQuery {
  /**
   * 申请单号
   */
  applyCode?: string;

  /**
   * 申请类型
   */
  applyType?: string;

  /**
   * 要求交期
   */
  deliverTime?: string;

  /**
   * 收货地址id
   */
  addressId?: string | number;

  /**
   * 申请人id
   */
  applyUserId?: string | number;

  /**
   * 申请时间
   */
  applyTime?: string;

  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface RawMaterialQuery extends PageQuery {
  /**
   * 主键id
   */
  id?: string | number;
  /**
   * 物料编码
   */
  materialCode?: string;
  /**
   * 物料类别
   */
  categoryId?: string | number;
  categoryIds?: string | number;

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
   * 实际库存
   */
  actualStock?: number;
  /**
   * 可用库存
   */
  availableStock?: number;
  /**
   * 在途数量
   */
  onWayStock?: number;
  /**
   * 申请数量
   */
  applyNum?: number;
}
