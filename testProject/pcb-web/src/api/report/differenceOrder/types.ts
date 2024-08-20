export interface DifferenceOrderVO {
  saleOrderNo: string;
  commodityCode: string;
  commodityName: string;
  orderQuantity: string | number;
  backQuantity: string | number;
  deliveryQuantity: string | number;
  differenceQuantity: string | number;
  deliveryTime: string;
  placeOrderTime: string;
  customerOrderTime: string;
  dispatchTime: string;
}

export interface DifferenceOrderForm extends BaseEntity {
  saleOrderNo?: string;
  commodityCode?: string;
}

export interface DifferenceOrderQuery extends PageQuery {
  /**
   * 
   */
  saleOrderNo: string;
  commodityCode: string;
}