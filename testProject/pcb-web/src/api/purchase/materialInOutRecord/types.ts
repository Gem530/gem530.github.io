export interface MaterialInOutRecordVO {
    /**
     * $column.columnComment
     */
    id: string | number;

    /**
     * 物料ID
     */
    rawMaterialId: string | number;

    /**
     * 出入库时间
     */
    intOutTime: string;

    /**
     * 生产日期
     */
    productionDate: string;

    /**
     * 仓库ID
     */
    storageId: string | number;

    /**
     * 数量
     */
    quantity: number;

    /**
     * 类型（采购入库、库存退货、生产发料、生产退料、物料借出、借出归还、物料接入、借入归还、直接出库、盘点出库、盘点入库、转仓出库、转仓入库）
     */
    inOutRecordType: string | number;

    /**
     * 单位
     */
    unit: string;

    /**
     * 库存表ID
     */
    rawMaterialStorageId: string | number;

    /**
     * 业务ID
     */
    bizId: string | number;

    /**
     * 过期日期
     */
    expirationDate: string;

    /**
     * 保质期天数
     */
    expirationDays: number;

    /**
     * 单价
     */
    price: number;

    /**
     * 是否已对账 1已对账 2未对账
     */
    isAccountOrde: string;


    /**
     * 供应商名称
     */
    supplierName: string;

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
     * 物料名称
     */
    categoryName: string | number;

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

}

export interface MaterialInOutRecordForm extends BaseEntity {
    /**
     * $column.columnComment
     */
    id?: string | number;

    /**
     * 物料ID
     */
    rawMaterialId?: string | number;

    /**
     * 出入库时间
     */
    intOutTime?: string;

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
     * 类型（采购入库、库存退货、生产发料、生产退料、物料借出、借出归还、物料接入、借入归还、直接出库、盘点出库、盘点入库、转仓出库、转仓入库）
     */
    type?: string;

    /**
     * 单位
     */
    unit?: string;

    /**
     * 库存表ID
     */
    rawMaterialStorageId?: string | number;

    /**
     * 业务ID
     */
    bizId?: string | number;

    /**
     * 过期日期
     */
    expirationDate?: string;

    /**
     * 保质期天数
     */
    expirationDays?: number;

    /**
     * 单价
     */
    price?: number;

    /**
     * 是否已对账 1已对账 2未对账
     */
    isAccountOrde?: string;

}

export interface MaterialInOutRecordQuery extends PageQuery {

    /**
     * 物料ID
     */
    rawMaterialId?: string | number;

    /**
     * 出入库时间
     */
    intOutTime?: string;

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
     * 类型（采购入库、库存退货、生产发料、生产退料、物料借出、借出归还、物料接入、借入归还、直接出库、盘点出库、盘点入库、转仓出库、转仓入库）
     */
    type?: string;

    /**
     * 单位
     */
    unit?: string;

    /**
     * 库存表ID
     */
    rawMaterialStorageId?: string | number;

    /**
     * 业务ID
     */
    bizId?: string | number;

    /**
     * 过期日期
     */
    expirationDate?: string;

    /**
     * 保质期天数
     */
    expirationDays?: number;

    /**
     * 单价
     */
    price?: number;

    /**
     * 是否已对账 1已对账 2未对账
     */
    isAccountOrde?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



