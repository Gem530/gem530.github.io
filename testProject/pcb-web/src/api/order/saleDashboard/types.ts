export interface SaleDashboardVO {
  id: string | number;

  type: string | number;
  dateType: string | number;
  area: string | number;
  totalAmount: string | number;
  squareMetersAmount: string | number;
}

export interface SaleDashboardForm extends BaseEntity {
  id?: string | number;
  queryTime?: string;
  type?: string | number;
  area?: string | number;
  totalAmount?: string | number;
  squareMetersAmount?: string | number;
}

export interface SaleDashboardQuery extends PageQuery {
  /**
   * 日期查询
   */
  queryTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
export enum OrderTypeEnum { 
  ORDER='1',
  OWN_ORDER='2',
  OUT_ORDER='3',
  DELIVER_ORDER='4',
  DELIVER_OWN_ORDER='5',
  DELIVER_OUT_ORDER='6',

  DAY='1',
  MONTH='2',
  WEEK='3'
}


