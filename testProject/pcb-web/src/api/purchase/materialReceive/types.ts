export interface MaterialReceiveVO {
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
   * 地址名称
   */
  addressName: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 生产日期
   */
  productionDate: string;

  /**
   * 收货编码
   */
  receiveCode: string | number;

  /**
   * 采购单号
   */
  orderCode: string | number;

  /**
   * 采购时间
   */
  orderCreateTime: string | number;

  /**
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 收货数量
   */
  quantity: number;

  /**
   * 采购数量
   */
  materialQuantity: number;

  /**
   * 待收数
   */
  receiveQuantity: number;

  /**
   * 单位
   */
  unit: string;

  /**
   * 采购明细id
   */
  materialOrderDetailId: string | number;

  /**
   * 收货时间
   */
  receiveTime: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 待检数量
   */
  waitInspectionNumber: string | number;

  /**
   * 收货人ID
   */
  receiveUserId: string | number;

  /**
   * 收货人名称
   */
  receiveUserName: string;

  /**
   * 保质期天数
   */
  expirationDays: number;

  /**
   * 过期日期
   */
  expirationDate: string;

  /**
   * 收货编号
   */
  code: string;

  /**
   * IQC处理数量
   */
  iqcQuantity: number;



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
  baseRawMaterialCode: string;

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
  baseRawMaterialRemark: string;

  /**
   * 颜色
   */
  color?: string | number;

  /**
   * 级别
   */
  level: string;

  /**
   * 铜厚
   */
  copperThickness?: string | number;

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
  boardThickness?: string | number;

}

export interface DirectMaterialReceive extends BaseEntity{
  otherOutBoundList: [];
  checkUser:"";
  supplierId: "";
}

/**
 * 退货数
 */
export interface DirectMaterialReceipt extends BaseEntity{
  otherReceiptList: [];
  type:"";
}

export interface MaterialReceiveForm extends BaseEntity {
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
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 生产日期
   */
  productionDate?: string;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 采购明细id
   */
  materialOrderDetailId?: string | number;

  /**
   * 收货时间
   */
  receiveTime?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 收货人ID
   */
  receiveUserId?: string | number;

  /**
   * 收货人名称
   */
  receiveUserName?: string;

  /**
   * 保质期天数
   */
  expirationDays?: number;

  /**
   * 过期日期
   */
  expirationDate?: string;

  /**
   * 收货编号
   */
  code?: string;

  /**
   * IQC处理数量
   */
  iqcQuantity?: number;

}

export interface MaterialReceiveQuery extends PageQuery {

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
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 生产日期
   */
  productionDate?: string;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 采购明细id
   */
  materialOrderDetailId?: string | number;

  /**
   * 收货时间
   */
  receiveTime?: string;

  /**
   * 收货人ID
   */
  receiveUserId?: string | number;

  /**
   * 收货人名称
   */
  receiveUserName?: string;

  /**
   * 保质期天数
   */
  expirationDays?: number;

  /**
   * 过期日期
   */
  expirationDate?: string;

  /**
   * 收货编号
   */
  code?: string;

  /**
   * IQC处理数量
   */
  iqcQuantity?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



