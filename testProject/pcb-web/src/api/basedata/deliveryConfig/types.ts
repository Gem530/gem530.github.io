export interface DeliveryConfigVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * $column.columnComment
   */
  remark: string;

  /**
   * $column.columnComment
   */
  customerId: string | number;

  /**
   * $column.columnComment
   */
  deliveryConfig: string;

  /**
   * $column.columnComment
   */
  seq: number;

  /**
   * $column.columnComment
   */
  type: string;

  /**
   * $column.columnComment
   */
  ownerId: string | number;

}

export interface DeliveryConfigForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * $column.columnComment
   */
  remark?: string;

  /**
   * $column.columnComment
   */
  customerId?: string | number;

  /**
   * $column.columnComment
   */
  deliveryConfig?: string;

  /**
   * $column.columnComment
   */
  seq?: number;

  /**
   * $column.columnComment
   */
  type?: string;

  /**
   * $column.columnComment
   */
  ownerId?: string | number;

  customerAddress?: string;

  waitCheck?:[]
  showType?:string
}

export interface DeliveryConfigQuery extends PageQuery {

  /**
   * $column.columnComment
   */
  customerId?: string | number;

  /**
   * $column.columnComment
   */
  deliveryConfig?: string;

  /**
   * $column.columnComment
   */
  seq?: number;

  /**
   * $column.columnComment
   */
  type?: string;

  /**
   * $column.columnComment
   */
  ownerId?: string | number;
  customerAddress: string;
    /**
     * 日期范围参数
     */
    params?: any;
}


export enum ConfigTypeEnum {
  /**
   * 送货通用格式
   */
  COMMON = '1',
  /**
   * 客户格式
   */
  CUSTOMER = '2',
  /**
   * 退货格式
   */
  BACK = '3',
  /**
   * 客户退货格式
   */
  CUSTOMER_BACK = '4',
  /**
   * 打印展示code
   */
  CUSTOMER_SHOW_CODE = '11',
  /**
   * 客户打印展示
   */
  CUSTOMER_SHOW_NAME = '12'
}
export const configTypeStrings = {
  [ConfigTypeEnum.COMMON]: '通用送货格式',
  [ConfigTypeEnum.CUSTOMER]: '客户送货格式',
  [ConfigTypeEnum.BACK]: '通用退货格式',
  [ConfigTypeEnum.CUSTOMER_BACK]: '客户退货格式'
};