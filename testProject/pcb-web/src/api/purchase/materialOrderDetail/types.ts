export interface MaterialOrderDetailVO {
    /**
     * $主键id
     */
    id: string | number;

    /**
     * 物料ID
     */
    rawMaterialId: string | number;

    orderId: string | number;

    defaultExpirationDays: string | number;

    /**
     * 保质期
     */
    expirationDays: string | number;

    /**
     * 生产日期
     */
    productionDate: string | number;

    purchaseTime: string | number;

    /**
     * 仓库ID
     */
    storageId: string | number;

    /**
     * 采购明细id
     */
    materialOrderDetailId: string | number;

    /**
     * 退货数
     */
    returnOfGoodsQuantity: string | number;

    /**
     * 收货数量
     */
    recQuantity: string | number;

    /**
     * 采购单号
     */
    code: string | number;

    /**
     * 是否需要IQc检测
     */
    isIqc: string | number;

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
     * 待收数量
     */
    waitQuantity: string | number;

    /**
     * 受理人名称
     */
    handleUserName: string;

    /**
     * 详情明细状态
     */
    detailStatus: string;

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
    inventoryQuantity?: string | number;

    /**
     * 退货数量
     */
    returnsQuantityIqc: number;

    /**
     * 退货重发数量
     */
    returnAndResendQuantityIqc: number;

    /**
     * 状态（未结单、已结单）
     */
    status: string;

    /**
     * 物料编码
     */
    materialCode?: string;
    /**
     * 物料类别id
     */
    categoryId?: string | number;

    /**
     * 物料类别名称
     */
    categoryName?: string | number;
    /**
     * 物料名称
     */
    name?: string;

    /**
     * 物料名称
     */
    materialName?: string | number;
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
     * 供应商编码
     */
    supplierCode?: string;
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
     * 收货数量
     */
    receiveQuantity?: number | string;

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
     * 收件数量
     */
    quantitypmr?: string | number;


    /**
     * 送货数量
     */
    deliveryQuantity?: string | number;

    /**
     * 差欠数量
     */
    differenceQuantity?: string | number;

    /**
     * 领用数量
     */
    appliedQuantity: number;

    /***
     * Desc:客户编码
     * @param null
     * @return {@link null}
     * @author lei
     * @date 2023/11/18 13:50
     */
     customerCode?: string | number;

    /***
     * Desc:客户名称
     * @param null
     * @return {@link null}
     * @author lei
     * @date 2023/11/18 13:53
     */
     customerName?: string | number;

    /***
     * Desc:客户ID
     * @param null
     * @return {@link null}
     * @author lei
     * @date 2023/11/18 13:53
     */
    customerId?: string | number;
    /***
     * Desc:地址名称
     * @param null
     * @return {@link null}
     * @author lei
     * @date 2023/11/18 13:53
     */
     addressName?: string | number;

    /***
     * Desc:地址Id
     * @param null
     * @return {@link null}
     * @author lei
     * @date 2023/11/18 13:53
     */
     addressId: number;

    /**
     * 送货数量
     */
    editDeliveryQuantity?: string | number;

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
