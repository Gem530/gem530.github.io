export interface MaterialInventoryVO {
    /**
     * $column.columnComment
     */
    id: string | number;

    /**
     * 采购订单明细id
     */
    materialOrderDetailId: string | number;

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
     * 物料类别名称
     */
    categoryName: string | number;

    purchaseDialog: string | number;
    diameter: string | number;
    thickness: string | number;

    /**
     * 仓库ID
     */
    storageId: string | number;

    /**
     * 仓库名称
     */
    storageName: string | number;

    /**
     * 生产日期
     */
    productionDate: string;

    /**
     * 数量
     */
    quantity: number;

    /**
     * 单位
     */
    unit: string | number;

    inventoryQuantity: number;

    producedQuantity: number;

    /**
     * 保质期天数
     */
    expirationDays: number;

    /**
     * 过期日期
     */
    expirationDate: string;

    /**
     * 供应商ID
     */
    supplierId: string | number;

    /**
     * 供应商名称
     */
    supplierName: string | number;

    /**
     * 供应商编码
     */
    supplierCode: string | number;

    /**
     * 物料类别
     */
    materialType: string | number;

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
     * 状态
     */
    status: string | number;

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
     * 备注
     */
    remark: string | number;

    /**
     * 在途数
     */
    inTransitNumber: string | number;

    /**
     * 借入数
     */
    returnBorrowQuantity: string | number;

    /**
     * 单价
     */
    price: string | number;

    existSignHistory: boolean;
}

export interface MaterialInventoryForm extends BaseEntity {
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
     * 仓库ID
     */
    storageId?: string | number;

    /**
     * 生产日期
     */
    productionDate?: string;

    /**
     * 数量
     */
    quantity?: number;

    /**
     * 单位
     */
    unit?: string;

    /**
     * 保质期天数
     */
    expirationDays?: number;

    /**
     * 过期日期
     */
    expirationDate?: string;

    /**
     * 供应商ID
     */
    supplierId?: string | number;

    salerList?: [];

    rollStoragList?: [];


}

export interface MaterialInventoryQuery extends PageQuery {

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
     * 仓库ID
     */
    storageId?: string | number;

    /**
     * 生产日期
     */
    productionDate?: string;

    /**
     * 数量
     */
    quantity?: number;

    /**
     * 单位
     */
    unit?: string;

    /**
     * 保质期天数
     */
    expirationDays?: number;

    /**
     * 过期日期
     */
    expirationDate?: string;

    /**
     * 供应商ID
     */
    supplierId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



