export interface MaterialBorrowVO {
    /**
     * $column.columnComment
     */
    id: string | number;

    /**
     * 借料单号
     */
    code: string;

    /**
     * 类型 （借入、借出）
     */
    type: string;

    /**
     * 借料厂家id
     */
    supplierId: string | number;

    /**
     * 提交人
     */
    submitUserId: string | number;

    /**
     * 提交人名称
     */
    submitUserName: string;

    /**
     * 审核人
     */
    auditUserId: string | number;

    /**
     * 审核人名称
     */
    auditUserName: string;

    /**
     * 借料地址id
     */
    addressId: string | number;

    /**
     * 借料时间
     */
    borrowTime: string;

    /**
     * 库存单位
     */
    unit?: string | number;

}

export interface DirectMaterialReject extends BaseEntity{
    tableDataBorrowList: [];
}

/**
 * 物料借入保存
 */
export interface DirectMaterialBorrow extends BaseEntity{
    tableDataBorrowMaterial: [];
    tableDataBorrowMaterialList:[];
    borrowUserName: "";
    rawMaterialInvontoryId:"";
    borrowUserPhone: "";
    storageName: "";
    addressName: "";
    addressId: "";
    suppId: "";
    status:"";
    type:"";
    id:"";
}


export interface MaterialBorrowForm extends BaseEntity {
    /**
     * $column.columnComment
     */
    id?: string | number;

    /**
     * 借料单号
     */
    code?: string;

    /**
     * 类型 （借入、借出）
     */
    type?: string;

    /**
     * 借料厂家id
     */
    supplierId?: string | number;

    /**
     * 提交人
     */
    submitUserId?: string | number;

    /**
     * 提交人名称
     */
    submitUserName?: string;

    /**
     * 审核人
     */
    auditUserId?: string | number;

    /**
     * 审核人名称
     */
    auditUserName?: string;

    /**
     * 借料地址id
     */
    addressId?: string | number;

    /**
     * 借料时间
     */
    borrowTime?: string;

}

export interface MaterialBorrowQuery extends PageQuery {

    /**
     * 借料单号
     */
    code?: string;

    /**
     * 类型 （借入、借出）
     */
    type?: string;

    /**
     * 借料厂家id
     */
    supplierId?: string | number;

    /**
     * 提交人
     */
    submitUserId?: string | number;

    /**
     * 提交人名称
     */
    submitUserName?: string;

    /**
     * 审核人
     */
    auditUserId?: string | number;

    /**
     * 审核人名称
     */
    auditUserName?: string;

    /**
     * 借料地址id
     */
    addressId?: string | number;

    /**
     * 借料时间
     */
    borrowTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;

    /**
     * 列表tab名称
     */
    statusType?: string | number;
}



