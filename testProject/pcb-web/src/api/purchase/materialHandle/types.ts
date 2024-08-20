import { MaterialOrderDetailVO } from '@/api/purchase/materialHandleDetail/types';
export interface MaterialOrderVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 采购单号
   */
  code: string;

  /**
   * 供应商ID
   */
  supplierId: string | number;
  /**
   * 供应商名称
   */
  supplierName: string;

  /**
   * 收货地址ID
   */
  addressId: string | number;

  /**
   * 审核人ID
   */
  auditUserId: string | number;

  /**
   * 审核人名称
   */
  auditUserName: string;

  /**
   * 提交人ID
   */
  submitUserId: string | number;

  /**
   * 提交人名称
   */
  submitUserName: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 状态（待提交、待审核、驳回、）
   */
  status: string;
  /**
   * 修改时间
   */
  updateTime: string;
  /**
   * 禁选
   */
  disabled: boolean;
  /**
   * 加载
   */
  loading: boolean;

  /**
   * 订单明细列表
   */
  orderDetailVoList: MaterialOrderDetailVO[];
}

export interface MaterialOrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 采购单号
   */
  code?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 收货地址ID
   */
  addressId?: string | number;

  /**
   * 审核人ID
   */
  auditUserId?: string | number;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 提交人ID
   */
  submitUserId?: string | number;

  /**
   * 提交人名称
   */
  submitUserName?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态（待提交、待审核、驳回、）
   */
  status?: string;
}

export interface MaterialOrderQuery extends PageQuery {
  /**
   * 采购单号
   */
  code?: string;

  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 收货地址ID
   */
  addressId?: string | number;

  /**
   * 审核人ID
   */
  auditUserId?: string | number;

  /**
   * 审核人名称
   */
  auditUserName?: string;

  /**
   * 提交人ID
   */
  submitUserId?: string | number;

  /**
   * 提交人名称
   */
  submitUserName?: string;

  /**
   * 状态（待提交、待审核、驳回、）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



/** * 状态枚举
 * 1待提交、2待审核、3审核通过、4驳回
 */
export enum StatusEnum {

 /**
  * 待提交
  */
  WAIT = 1,
  /**
   * 待审核
   */
  AUDIT = 2,
  /**
   * 审核通过
   */
  PASS = 3,
  /**
   * 驳回
   */
  REJECT = 4

}
export const StatusStrings = {
  [StatusEnum.WAIT]: '待提交',
  [StatusEnum.AUDIT]: '待审核',
  [StatusEnum.PASS]: '审核通过',
  [StatusEnum.REJECT]: '驳回'
};