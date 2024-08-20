export interface SaleOrderDetailVO {
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

export interface SaleOrderDetailForm extends BaseEntity {
  saleOrderNo?: string;
  commodityCode?: string;
}

export interface SaleOrderDetailQuery extends PageQuery {
  /**
   * 
   */
  saleOrderNo: string;
  commodityCode: string;
}