export interface MaterialProductionInOutVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  inventoryQuantity: string | number;

  /**
   * 物料名称
   */
  materialName: string | number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 物料库存表ID
   */
  rawMaterialInvontoryId: string | number;

  /**
   * 发料退料单号
   */
  code: string;

  /**
   * 类型 （发料、退料）
   */
  type: string;

  /**
   * 发料/退料时间
   */
  inOutTime: string;

  /**
   * 发料/退料人
   */
  inOutUser: number;

  /**
   * 发料/退料人名称
   */
  inOutUserName: string;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 发料记录ID(退料一定有对应的发料记录)
   */
  outId: string | number;

  /**
   * 单价
   */
  price: number;

  /**
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

}


/**
 * 生产物料发料确定
 */
export interface DirectProductInout extends BaseEntity{
  tableDataProductionList: [];
  productionId:"";
}

export interface MaterialProductionInOutForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 退料数量
   */
  returnQuanTity?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 物料库存表ID
   */
  rawMaterialInvontoryId?: string | number;

  /**
   * 发料退料单号
   */
  code?: string;

  /**
   * 类型 （发料、退料）
   */
  type?: string;

  /**
   * 发料/退料时间
   */
  inOutTime?: string;

  /**
   * 发料/退料人
   */
  inOutUser?: number;

  /**
   * 发料/退料人名称
   */
  inOutUserName?: string;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 发料记录ID(退料一定有对应的发料记录)
   */
  outId?: string | number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

}

export interface MaterialProductionInOutQuery extends PageQuery {

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 物料库存表ID
   */
  rawMaterialInvontoryId?: string | number;

  /**
   * 发料退料单号
   */
  code?: string;

  /**
   * 类型 （发料、退料）
   */
  type?: string;

  /**
   * 发料/退料时间
   */
  inOutTime?: string;

  inOutTimeStart?: string;

  inOutTimeEnd?: string;

  /**
   * 发料/退料人
   */
  inOutUser?: number;

  /**
   * 发料/退料人名称
   */
  inOutUserName?: string;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 发料记录ID(退料一定有对应的发料记录)
   */
  outId?: string | number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



