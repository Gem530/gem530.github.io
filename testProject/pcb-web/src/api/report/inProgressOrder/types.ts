export interface InProgressOrderVO {
  /**
   * $column.columnComment
   */
  id: string | number;
  /**
   * 排产单号
   */
  productionNo: string;
  /**
   * 产品ID
   */
  commodityId: string | number;
  /**
   * 排产单ID
   */
  productionId: string | number;
  commodityName: string ;
  quantity: string | number;
  area: string | number;
  placeOrderTime: string | number;
  miCompleteTime: string | number;
  feedTime: string | number;
  dispatchTime: string | number;
  materialLayer: string | number;
  commoditySolder: string | number;
  surfaceTreatment: string | number;
  characterColor: string | number;
  commodityForm: string | number;
  commodityTestWay: string | number;

}

export interface InProgressOrderForm extends BaseEntity {
  productionNo: string;
  /**
   * 产品ID
   */
  commodityId: string | number;
  productionId: string | number;
  commodityName: string ;
  quantity: string | number;
  area: string | number;
  placeOrderTime: string | number;
  miCompleteTime: string | number;
  feedTime: string | number;
  dispatchTime: string | number;
  materialLayer: string | number;
  commoditySolder: string | number;
  surfaceTreatment: string | number;
  characterColor: string | number;
  commodityForm: string | number;
  commodityTestWay: string | number;
}

export interface InProgressOrderQuery extends PageQuery {
  /**
   * 
   */
  productionNo: string;
}

export enum DemoEnum {
  COMPLETE = '1',
  UNCOMPLETE = '2'
}