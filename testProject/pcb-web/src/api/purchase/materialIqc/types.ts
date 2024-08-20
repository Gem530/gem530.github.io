export interface MaterialIqcVO {
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
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 保质期天数
   */
  expirationDays: string | number;

  /**
   * 过期日期
   */
  expirationDate: string | number;

  /**
   * 仓库名称
   */
  storageName: string;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 单价
   */
  price: string | number;

  /**
   * 收货数量
   */
  quantity: string | number;

  /**
   * 待检数量
   */
  waitInspectionNumber: string | number;

  /**
   * 已检数量
   */
  alreadyInspectionNumber: string | number;
  /**
   * 退货重发数
   */
  backResendQuantity: string | number;

  /**
   * 退货数
   */
  backQuantity: string | number;

  /**
   * 通过数
   */
  passNumber: string | number;
  /**
   * 直接入库数
   */
  inventoryQuantity: string | number;
  /**
   * 单位
   */
  unit: string;

  /**
   * 采购明细id
   */
  materialOrderDetailId: string | number;

  /**
   * 检测时间
   */
  checkTime: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 处理方式（1正常、2退货、3退货重发、4直接入库）
   */
  handleType: string;

  /**
   * 检测单号
   */
  code: string;

  /**
   * 生产日期
   */
  productionDate: string;

  /**
   * 物料编码
   */
  baseRawMaterialCode: string;

  /**
   * 物料名称
   */
  name: string;

  /**
   * 材质牌号
   */
  materialQuality: string | number;



  /**
   * 检测人ID
   */
  checkUserId: string | number;

  /**
   * 检测人名称
   */
  checkUserName: string;

  /**
   * 收货记录id
   */
  materialReceiveId: string | number;

}

export interface MaterialIqcForm extends BaseEntity {
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
   * 检测时间
   */
  checkTime?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 处理方式（1正常、2退货、3退货重发、4直接入库）
   */
  handleType?: string;

  /**
   * 检测单号
   */
  code?: string;

  /**
   * 检测人ID
   */
  checkUserId?: string | number;

  /**
   * 检测人名称
   */
  checkUserName?: string;

  /**
   * 收货记录id
   */
  materialReceiveId?: string | number;

}

export interface MaterialIqcQuery extends PageQuery {

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
   * 检测时间
   */
  checkTime?: string;

  /**
   * 处理方式（1正常、2退货、3退货重发、4直接入库）
   */
  handleType?: string;

  /**
   * 检测单号
   */
  code?: string;

  /**
   * 检测人ID
   */
  checkUserId?: string | number;

  /**
   * 检测人名称
   */
  checkUserName?: string;

  /**
   * 收货记录id
   */
  materialReceiveId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}

/**
 * 保存按钮
 */
export interface MaterialIqcPurchase extends BaseEntity{
  otherReceiptList: [];
  id:undefined;
  waitInspectionNumber:undefined;
  rawMaterialId:undefined;
  supplierId:undefined;
  storageId:undefined;
  productionDate:undefined;
  expirationDays:undefined;
}


