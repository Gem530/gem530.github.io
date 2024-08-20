export interface RawMaterialDeliveryVO {
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
     * 发货时间
     */
    deliveryTime: string;

    /**
     * 数量
     */
    quantity: number;

    /**
     * 单位
     */
    unit: string;

    /**
     * 采购明细id
     */
    materialOrderDetailId: string | number;

    /**
     * 备注
     */
    remark: string;

    /**
     * 发货人ID
     */
    sendUserId: string | number;

    /**
     * 发货人名称
     */
    sendUserName: string;

    /**
     * 发货编号
     */
    code: string;

    /**
     * 客户名称
     */
    customerName: string;

    /**
     * 客户ID
     */
    customerId: string | number;

    /**
     * 客户地址id
     */
    customerAddressId: string | number;

    /**
     * 送货车辆
     */
    loaderCar: string;

    /**
     * 装运人员
     */
    loaderName: string;

    /**
     * 物流公司（字典）
     */
    logisticsCompany: string;

    /**
     * 物流单号
     */
    logisticsCode: string;


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
     * 品牌
     */
    manufacturer: string | number;

    /**
     * 颜色
     */
    color: string | number;

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
     * 板厚
     */
    boardThickness: string | number;


    /**
     * Desc:采购数量
     * @return {@link null}
     * @author lei
     * @date 2023/11/10 12:00
     */
    purchaseQuantity: string | number;

    /**
     * Desc:采购单号
     * @return {@link null}
     * @author lei
     * @date 2023/11/10 14:01
     */
    orderCode: string | number;

    /**
     * Desc:物料名称
     * @return {@link null}
     * @author lei
     * @date 2023/11/10 13:30
     */
    materialName: string | number;

    /**
     * Desc:要求交期
     * @return {@link null}
     * @author lei
     * @date 2023/11/10 14:07
     */
    deliveryDate: string | number;

    /**
     * Desc:差欠数量
     * @return {@link null}
     * @author lei
     * @date 2023/11/10 14:15
     */
    differenceQuantity: string | number;

    /**
     * 供应商名称
     */
    supplierName: string | number;

    /**
     * 供应商编码
     */
    supplierCode: string | number;

    /**
     * Desc:
     * @param 待收数
     * @return {@link null}
     * @author lei
     * @date 2023/11/10 16:34
     */
    waitQuantity: string | number;

    /**
     * 收货数
     */
    receiveQuantity: string | number;

    /**
     * 退货数量
     */
    backQuantity: string | number;

    /**
     * 退货重发数量
     */
    backResendQuantity: string | number;


}


/**
 * 发货数
 */
export interface DirectMaterialDeliver extends BaseEntity{
    otherDeliveryList: [];
    loaderCar:"",
    loaderName:"",
    logisticsCompany:"",
    logisticsCode:"",
    deliveryTime:"",
    customerName:"",
    customerId:"",
    customerAddressId:"",
}


export interface RawMaterialDeliveryForm extends BaseEntity {
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
     * 发货时间
     */
    deliveryTime?: string;

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
     * 备注
     */
    remark?: string;

    /**
     * 发货人ID
     */
    sendUserId?: string | number;

    /**
     * 发货人名称
     */
    sendUserName?: string;

    /**
     * 发货编号
     */
    code?: string;

    /**
     * 客户名称
     */
    customerName?: string;

    /**
     * 客户ID
     */
    customerId?: string | number;

    /**
     * 客户地址id
     */
    customerAddressId?: string | number;

    /**
     * 送货车辆
     */
    loaderCar?: string;

    /**
     * 装运人员
     */
    loaderName?: string;

    /**
     * 物流公司（字典）
     */
    logisticsCompany?: string;

    /**
     * 物流单号
     */
    logisticsCode?: string;

}

export interface RawMaterialDeliveryQuery extends PageQuery {

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
     * 发货时间
     */
    deliveryTime?: string;

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
     * 发货人ID
     */
    sendUserId?: string | number;

    /**
     * 发货人名称
     */
    sendUserName?: string;

    /**
     * 发货编号
     */
    code?: string;

    /**
     * 客户名称
     */
    customerName?: string;

    /**
     * 客户ID
     */
    customerId?: string | number;

    /**
     * 客户地址id
     */
    customerAddressId?: string | number;

    /**
     * 送货车辆
     */
    loaderCar?: string;

    /**
     * 装运人员
     */
    loaderName?: string;

    /**
     * 物流公司（字典）
     */
    logisticsCompany?: string;

    /**
     * 物流单号
     */
    logisticsCode?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



