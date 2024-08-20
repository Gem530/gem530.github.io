import { MaterialOrderDetailVO } from '@/api/purchase/materialOrderDetail/types';
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
   * 收货地址
   */
  address: string | number;


  /**
   * 百分比
   */
  percentageOrder: string | number;

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
   * 确认状态（1待甲方确认、2待已方确认、3已完成）
   */
  confirmStatus: string;

  /**
   * 取消状态（1未取消、2已取消、3待对方确认取消、4待我方确认取消）
   */
  cancelStatus: string;

  /**
   * 修改时间
   */
  updateTime: string;
  /**
   * 禁选
   */
  disabled: boolean;

  /**
   * 订单明细列表
   */
  orderDetailVoList: MaterialOrderDetailVO[];

  /**
   * 是否确认
   */
  isConfirmed: string | number;
}

export interface DirectMaterialOrderDetail extends BaseEntity{
  orderDetailList: [];
  supplierId: "";
}

export interface MaterialOrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  createTime?: string;

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
  fileList?:any[];
  confirmRemark?: string;

  /**
   * 取消状态（1未取消、2已取消、3待对方确认取消、4待我方确认取消）
   */
  cancelStatus?: string;
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

  createTimeStart?: string;
  createTimeEnd?: string;

  deliverTimeStart?: string;
  deliverTimeEnd?: string;

  checked:undefined,

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
   * 确认状态
   */
  confirmStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
