export interface MaterialCheckDetailVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 单价
   */
  price: number;

  /**
   * 保质期天数
   */
  expirationDays: number;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 确认备注
   */
  confirmRemark: string;

  /**
   * 物料库存表ID
   */
  rawMaterialInvontoryId: string | number;

  /**
   * 盘点单号
   */
  code: string;

  /**
   * 类型 （盘入、盘出）
   */
  type: string;

  /**
   * 盘点时间
   */
  checkTime: string;

  /**
   * 盘点人
   */
  checkUser: number;

  /**
   * 盘点人名称
   */
  checkUserName: string;

  /**
   * 到期日期
   */
  expirationDate: string;

  /**
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

}

export interface MaterialCheckDetailForm extends BaseEntity {
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
   * 单价
   */
  price?: number;

  /**
   * 保质期天数
   */
  expirationDays?: number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 物料库存表ID
   */
  rawMaterialInvontoryId?: string | number;

  /**
   * 盘点单号
   */
  code?: string;

  /**
   * 类型 （盘入、盘出）
   */
  type?: string;

  /**
   * 盘点时间
   */
  checkTime?: string;

  /**
   * 盘点人
   */
  checkUser?: number;

  /**
   * 盘点人名称
   */
  checkUserName?: string;

  /**
   * 到期日期
   */
  expirationDate?: string;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

}

export interface MaterialCheckDetailQuery extends PageQuery {

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  checkTimeStart?: string | number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 保质期天数
   */
  expirationDays?: number;

  createTime?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 物料库存表ID
   */
  rawMaterialInvontoryId?: string | number;

  /**
   * 盘点单号
   */
  code?: string;

  /**
   * 类型 （盘入、盘出）
   */
  type?: string;

  /**
   * 盘点时间
   */
  checkTime?: string;

  /**
   * 盘点人
   */
  checkUser?: number;

  /**
   * 盘点人名称
   */
  checkUserName?: string;

  /**
   * 到期日期
   */
  expirationDate?: string;

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



