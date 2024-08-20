export interface ScrapVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 报废pcs数
   */
  pcsQuantity: number;

  /**
   * 报废数量
   */
  quantity: number;

  /**
   * 产品ID
   */
  commodityId: string | number;

  /**
   * 流转卡ID
   */
  productionCardId: string | number;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 报废编号
   */
  code: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 责任人ID
   */
  responsibleUserId: string | number;

  /**
   * 责任人名称
   */
  responsibleUserName: string;

  /**
   * 报废工序ID
   */
  craftId: string | number;

  /**
   * 报废单位
   */
  unit: string;

  /**
   * 原因ID
   */
  reasonId: string | number;

  /**
   * 责任类型（本厂、外协厂商）
   */
  type: string;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 供应商名称
   */
  supplierName: string;

}

export interface ScrapForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 报废pcs数
   */
  pcsQuantity?: number;

  /**
   * 报废数量
   */
  quantity?: number;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 流转卡ID
   */
  productionCardId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 报废编号
   */
  code?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 责任人ID
   */
  responsibleUserId?: string | number;

  /**
   * 责任人名称
   */
  responsibleUserName?: string;

  /**
   * 报废工序ID
   */
  craftId?: string | number;

  /**
   * 报废单位
   */
  unit?: string;

  /**
   * 原因ID
   */
  reasonId?: string | number;

  /**
   * 责任类型（本厂、外协厂商）
   */
  type?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 供应商名称
   */
  supplierName?: string;

}

export interface ScrapQuery extends PageQuery {

  /**
   * 报废pcs数
   */
  pcsQuantity?: number;

  /**
   * 报废数量
   */
  quantity?: number;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 流转卡ID
   */
  productionCardId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 报废编号
   */
  code?: string;

  /**
   * 责任人ID
   */
  responsibleUserId?: string | number;

  /**
   * 责任人名称
   */
  responsibleUserName?: string;

  /**
   * 报废工序ID
   */
  craftId?: string | number;

  /**
   * 报废单位
   */
  unit?: string;

  /**
   * 原因ID
   */
  reasonId?: string | number;

  /**
   * 责任类型（本厂、外协厂商）
   */
  type?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 供应商名称
   */
  supplierName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



