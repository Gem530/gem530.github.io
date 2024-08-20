export interface OutSourceFilinOrderVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 外发时间
   */
  outSourceTime: string;

  /**
   * 外发单号
   */
  no: string;

  /**
   * 产品ID
   */
  commodityId: string | number;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 收货地址ID
   */
  addressId: string | number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 菲林原因
   */
  reason: string;

  /**
   * 其他要求
   */
  otherRequirement: string;

  /**
   * 类型（网板、菲林）
   */
  type: string;

  /**
   * 是否压膜
   */
  isCompression: string;

  /**
   * 完成时间
   */
  completeTime: string;

  /**
   * 状态(未完成、已完成)
   */
  status: string;

  /**
   * 下单人
   */
  createByName: string;
  /**
   * 排产编号
   */
  productionNo: string;
  /**
   * 供应商名称
   */
  supplierName: string;
  /**
   * 供应商编号
   */
  supplierNo: string;
  /**
   * 产品名称
   */
  commodityName: string;
  /**
   * 产品编号
   */
  commodityNo: string;

  price: number | string;

  checkQuantity: number;
  checkPrice: number;
  checkRemark: string;
  /**
   * 折扣金额
   */
  discountPrice: number;
  /**
   * 总金额
   */
  totalPrice: number;
}

export interface OutSourceFilinOrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 外发时间
   */
  outSourceTime?: string;

  /**
   * 外发单号
   */
  no?: string;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 收货地址ID
   */
  addressId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 菲林原因
   */
  reason?: string;

  /**
   * 其他要求
   */
  otherRequirement?: string;

  /**
   * 类型（网板、菲林）
   */
  type?: string;

  /**
   * 是否压膜
   */
  isCompression?: string;

  /**
   * 完成时间
   */
  completeTime?: string;

  /**
   * 状态(未完成、已完成)
   */
  status?: string;


  /**
   * 下单人
   */
  createByName?: string;
  /**
   * 排产编号
   */
  productionNo?: string;
  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 供应商编号
   */
  supplierNo?: string;
  /**
   * 产品名称
   */
  commodityName?: string;
  /**
   * 产品编号
   */
  commodityNo?: string;
  /**
   * 收货地址
   */
  address?: string;

  addList?: OutSourceFilinOrderVO[];
  deliveryTime?:string;
}

export interface OutSourceFilinOrderQuery extends PageQuery {

  /**
   * 外发时间
   */
  outSourceTime?: string;

  /**
   * 外发单号
   */
  no?: string;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 收货地址ID
   */
  addressId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 菲林原因
   */
  reason?: string;

  /**
   * 其他要求
   */
  otherRequirement?: string;

  /**
   * 类型（网板、菲林）
   */
  type?: string;

  /**
   * 是否压膜
   */
  isCompression?: string;

  /**
   * 完成时间
   */
  completeTime?: string;

  /**
   * 状态(未完成、已完成)
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;

  /**
   * 下单人
   */
  createByName?: string;
  /**
   * 排产编号
   */
  productionNo?: string;
  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 供应商编号
   */
  supplierCode?: string;
  /**
   * 产品名称
   */
  commodityName?: string;
  /**
   * 产品编号
   */
  commodityNo?: string;





  /**
   * 对账月份
   */
  accountMonth?: string;
  /**
   * 对账截止时间
   */
  endTime?: string;
  /**
   * 币种
   */
  currency?: string;
  /**
   * 备注
   */
  remark?: string;

  hasAccountOrder?: string;
  idList?: (string | number)[];
}

export interface FileList {
  key: string;
  url: string;
  name: string;
  size: number;
}


export enum FinlinTypeEnum {
  FINLIN = '1',
  WANGBAN = '2'
}
export enum FinlinStatusEnum {
  COMPLETE = '1',
  UNCOMPLETE = '2'
}