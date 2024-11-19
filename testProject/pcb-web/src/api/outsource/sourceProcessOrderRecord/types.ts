export interface SourceProcessOrderRecordVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 加工 报废或者发货数量
   */
  number: number;

  /**
   * 1.加工 2.报废 3.发货
   */
  recordType: number;

  /**
   * 外协加工接单id
   */
  processId?: number;

}

export interface SourceProcessOrderRecordForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 加工 报废或者发货数量
   */
  number?: number;

  /**
   * 1.加工 2.报废 3.发货
   */
  recordType?: number;

  /**
   * 外协加工接单id
   */
  costId?: string | number;
  costName?: string;
  orderQuantity?: string | number;
  shipSum?: string | number;
  scrapSum?: string | number;
  processSum?: string | number;

}

export interface SourceProcessOrderRecordQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 加工 报废或者发货数量
   */
  number?: number;

  /**
   * 1.加工 2.报废 3.发货
   */
  recordType?: number;

    /**
     * 日期范围参数
     */
    params?: any;

  /**
   * 外协加工接单id
   */
  processId?: number;
}



