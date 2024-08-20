export interface MaterialBackDetailVO {
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
     * 物料ID
     */
    rawMaterialId: string | number;

    /**
     * 库存ID
     */
    storageId: string | number;

    /**
     * 数量
     */
    quantity: number;

    /**
     * 单位
     */
    unit: string;

    /**
     * 单价
     */
    price: number;

    /**
     * 供应商ID
     */
    supplierId: string | number;

    /**
     * 采购明细ID
     */
    materialOrderDetailId: string | number;

    /**
     * 类型（1.IQC退货、2.IQC退货重发、3.库存退货）
     */
    type: string;

    /**
     * 退货人ID
     */
    backUserId: string | number;

    /**
     * 退货人名称
     */
    backUserName: string;

    /**
     * 退货时间
     */
    backTime: string;

    /**
     * 备注
     */
    remark: string;

    /**
     * 审核人ID
     */
    auditUserId: string | number;

    /**
     * 审核人名称
     */
    auditUserName: string;

    /**
     * 审核时间
     */
    ausitTime: string;

    /**
     * 退货单号
     */
    code: string;

    /**
     * 退货状态
     */
    backStatus: string | number;

    /**
     * 颜色
     */
    color: string | number;

    /**
     * 板厚
     */
    boardThickness: string | number;

    /**
     * 级别
     */
    level: string | number;

    /**
     * 铜厚
     */
    copperThickness: string | number;

    /**
     * 长
     */
    length: string | number;

    /**
     * 宽
     */
    width: string | number;

    /**
     * 品牌
     */
    manufacturer: string | number;

    /**
     * 物料编码
     */
    materialCode: string | number;

    /**
     * 物料名称
     */
    name: string | number;

    /**
     * 材质牌号
     */
   materialQuality: string | number;

  /**
   * 总价
   */
  totalPrice: string | number;

    /**
    * 过期日期
    */
    expirationDate: string | number;

    /**
     * 生产日期
     */
    productionDate: string | number;
    /**
     * 保质期天数
     */
    expirationDays: string | number;

    /**
     * 供应商名称
     */
    supplierName: string | number;

}

export interface DirectPurchase extends BaseEntity{
    purchaseList: [];
    supplierId: "";
    addressId: "";
}

export interface MaterialBackDetailForm extends BaseEntity {
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
     * 库存ID
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
     * 单价
     */
    price?: number;

    /**
     * 供应商ID
     */
    supplierId?: string | number;

    /**
     * 采购明细ID
     */
    materialOrderDetailId?: string | number;

    /**
     * 类型（1.IQC退货、2.IQC退货重发、3.库存退货）
     */
    type?: string;

    /**
     * 退货人ID
     */
    backUserId?: string | number;

    /**
     * 退货人名称
     */
    backUserName?: string;

    /**
     * 退货时间
     */
    backTime?: string;

    /**
     * 备注
     */
    remark?: string;

    /**
     * 审核人ID
     */
    auditUserId?: string | number;

    /**
     * 审核人名称
     */
    auditUserName?: string;

    /**
     * 审核时间
     */
    ausitTime?: string;

    /**
     * 退货单号
     */
    code?: string;

}

export interface MaterialBackDetailQuery extends PageQuery {

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
     * 库存ID
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
     * 单价
     */
    price?: number;

    /**
     * 供应商ID
     */
    supplierId?: string | number;

    /**
     * 采购明细ID
     */
    materialOrderDetailId?: string | number;

    /**
     * 类型（1.IQC退货、2.IQC退货重发、3.库存退货）
     */
    type?: string;

    /**
     * 退货人ID
     */
    backUserId?: string | number;

    /**
     * 退货人名称
     */
    backUserName?: string;

    /**
     * 退货时间
     */
    backTime?: string;

    /**
     * 审核人ID
     */
    auditUserId?: string | number;

    /**
     * 审核人名称
     */
    auditUserName?: string;

    /**
     * 审核时间
     */
    ausitTime?: string;

    /**
     * 退货单号
     */
    code?: string;

    /**
     * 日期范围参数
     */
    params?: any;

}



