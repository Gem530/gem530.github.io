export interface SourceFullProcessOrderVO {
  /**
   * 主键id
   */
  id: string | number;
  /**
   * 客户id
   */
  cusId: string | number;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 数量
   */
  quantity: number;
  /**
   * 收货数量
   */
  receiveQuantity?: number;

  /**
   * 退货数量数量
   */
  backQuantity?: number;

  /**
   * 单价
   */
  price: number;

  /**
   * 平米价
   */
  areaPrice: number;

  /**
   * 总金额
   */
  totalPrice: number;

  /**
   * 地址ID（如果是发回本厂，地址为本厂地址ID，如果是发给客户，地址为客户地址ID）
   */
  addressId: string | number;

  /**
   * 发货类型（发回本厂、发给客户）
   */
  addressType: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 工程费
   */
  engineeringCost: number;

  /**
   * 测试架费
   */
  testFrameCost: number;

  /**
   * 飞针费
   */
  flyProbeCost: number;

  /**
   * 模具费
   */
  mouldCost: number;

  /**
   * 加急费
   */
  expeditedCost: number;

  /**
   * 其他费
   */
  otherCost: number;

  /**
   * 样板费
   */
  sampleCost: number;

  /**
   * 编号
   */
  code: string;

  /**
   * 状态（待审核、已审核、已完成）
   */
  status: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 销售订单id
   */
  saleOrderId: string | number;

  otherCostList: any[];
}

export interface SourceFullProcessOrderForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 取消数量
   */
  cancelQuantity?: number;
  /**
   * 外协数量
   */
  outSourceQuantity?: number;
  /**
   * 数量
   */
  quantity?: number;

  /**
   * 收货数量
   */
  receiveQuantity?: number;

  /**
   * 退货数量数量
   */
  backQuantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 平米价
   */
  areaPrice?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 地址ID（如果是发回本厂，地址为本厂地址ID，如果是发给客户，地址为客户地址ID）
   */
  addressId?: string | number;

  /**
   * 发货类型（发回本厂、发给客户）
   */
  addressType?: string;

  /**
   * 备注
   */
  remark?: string;
  confirmRemark?: string;

  /**
   * 工程费
   */
  engineeringCost?: number;

  /**
   * 测试架费
   */
  testFrameCost?: number;

  /**
   * 飞针费
   */
  flyProbeCost?: number;

  /**
   * 模具费
   */
  mouldCost?: number;

  /**
   * 加急费
   */
  expeditedCost?: number;

  /**
   * 其他费
   */
  otherCost?: number;

  /**
   * 样板费
   */
  sampleCost?: number;

  /**
   * 编号
   */
  code?: string;

  /**
   * 状态（待审核、已审核、已完成）
   */
  status?: string;

  /**
   * 结单状态
   */
  detailStatus?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 销售订单id
   */
  saleOrderId?: string | number;
  otherCostList: any[];
}

export interface SourceFullProcessOrderQuery extends PageQuery {
  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 平米价
   */
  areaPrice?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 地址ID（如果是发回本厂，地址为本厂地址ID，如果是发给客户，地址为客户地址ID）
   */
  addressId?: string | number;

  /**
   * 发货类型（发回本厂、发给客户）
   */
  addressType?: string;

  /**
   * 工程费
   */
  engineeringCost?: number;

  /**
   * 测试架费
   */
  testFrameCost?: number;

  /**
   * 飞针费
   */
  flyProbeCost?: number;

  /**
   * 模具费
   */
  mouldCost?: number;

  /**
   * 加急费
   */
  expeditedCost?: number;

  /**
   * 其他费
   */
  otherCost?: number;

  /**
   * 样板费
   */
  sampleCost?: number;

  /**
   * 编号
   */
  no?: string;

  /**
   * 状态（待审核、已审核、已完成）
   */
  status?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 销售订单id
   */
  saleOrderId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;

  /**
   * 确认状态（1待甲方确认、2待已方确认、3已完成）
   */
  confirmStatus?: string;
}
/** * 对账单状态枚举
 * 1.待提交
 * 2.待收货
 * 3.已完成
 */
export enum StatusEnum {
  /**
   * 待提交
   */
  BE_SUBMITTED = '1',
  /**
   * 已提交
   */
  WAIT_RECEIVE = '2',
  /**
   * 已完成
   */
  FINISHED = '3',
  /**
   * 已取消
   */
  CANCELLED = '4'
}
export const statusStrings = {
  [StatusEnum.BE_SUBMITTED]: '待提交',
  [StatusEnum.WAIT_RECEIVE]: '待收货',
  [StatusEnum.FINISHED]: '已完成',
  [StatusEnum.CANCELLED]: '已取消'
};
