export interface SourceFullProcessOrderBackVO {
  /**
   * 主键id
   */
  id: string | number;
  /**
   * 创建人名称
   */
  createByName: string;

  /**
   * 订单外协订单ID
   */
  fullProcessOrderId: string | number;
  supplierId: string | number;
  /**
   * 退货数量
   */
  quantity: number;

  /**
   * 退货时间
   */
  backTime: string;

  /**
   * 退货原因
   */
  reason: string;

  /**
   * 退货单号
   */
  no: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;
  checkPrice: number;
  checkQuantity: number;
}

export interface SourceFullProcessOrderBackForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;
  /**
   * 创建人名称
   */
  createByName?: string;
  /**
   * 供应商id
   */
  supplierId?: string | number;

  /**
   * 订单外协订单ID
   */
  fullProcessOrderId?: string | number;

  /**
   * 退货数量
   */
  quantity?: number;

  /**
   * 退货时间
   */
  backTime?: string;

  /**
   * 退货原因
   */
  reason?: string;

  /**
   * 退货单号
   */
  no?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  inventoryIdList?: number[];
  /**
   * 退货记录
   */
  backList: SourceFullProcessOrderBackVO[];
}

export interface SourceFullProcessOrderBackQuery extends PageQuery {
  /**
   * 订单外协订单ID
   */
  fullProcessOrderId?: string | number;
  /**
   * 状态（待提交，待审核、驳回、已审核）
   */
  status?: string;

  /**
   * 供应商id
   */
  supplierId: undefined;
  /**
   * 退货数量
   */
  quantity?: number;

  /**
   * 退货时间
   */
  backTime?: string;

  /**
   * 退货原因
   */
  reason?: string;

  /**
   * 退货单号
   */
  no?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
  hasAccountOrder?:string;
}
export enum FULLBACKSTATUSENUMS {
  /**
     * 待提交
     */
  WAIT_SUBMIT = '1',
  /**
     * 待审核
     */
  WAIT_AUDIT = '2',
  /**
     * 待审核
     */
  REJECT = '3',
  /**
     * 待审核
     */
  AUDITED = '4',
  /**
   * 取消
   */
  CANCEL = '5'
}
export const inventoryTypeStrings = {
  [FULLBACKSTATUSENUMS.WAIT_SUBMIT]: '待提交',
  [FULLBACKSTATUSENUMS.WAIT_AUDIT]: '待审核',
  [FULLBACKSTATUSENUMS.REJECT]: '驳回',
  [FULLBACKSTATUSENUMS.AUDITED]: '已审核',
  [FULLBACKSTATUSENUMS.CANCEL]: '取消',
};
