export interface SourceProcessOrderVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 编码
   */
  code: string;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 工序id
   */
  costId: string | number;

  /**
   * 交货日期
   */
  deliveryDate: string;

  /**
   * 接单数量
   */
  orderQuantity: number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 接单日期
   */
  orderDate: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 加工数量
   */
  processSum?: string | number;
  /**
   * 报废
   */
  scrapSum?: string | number;
  /**
   * 发货
   */
  shipSum?: string | number;

}

export interface SourceProcessOrderForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 编码
   */
  code?: string;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 工序id
   */
  costId?: string | number;

  /**
   * 交货日期
   */
  deliveryDate?: string;

  /**
   * 接单数量
   */
  orderQuantity?: number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 接单日期
   */
  orderDate?: string;

  /**
   * 备注
   */
  remark?: string;
  /**
   * 加工数量
   */
  processSum?: string | number;
  /**
   * 报废
   */
  scrapSum?: string | number;
  /**
   * 发货
   */
  shipSum?: string | number;

}

export interface SourceProcessOrderQuery extends PageQuery {

  /**
   * 编码
   */
  code?: string;

  /**
   * 客户id
   */
  customerName?: string | number;

  /**
   * 工序id
   */
  costId?: string | number;

  /**
   * 交货日期
   */
  deliveryDate?: string;

  /**
   * 接单数量
   */
  orderQuantity?: number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 接单日期
   */
  orderDate?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



