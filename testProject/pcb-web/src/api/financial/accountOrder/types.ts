import { AccountOrderOtherVO } from '@/api/financial/accountOrderOther/types';
import { OrderFilinOutDetailVO } from '../orderFilinOutDetail/types';
import { OrderSaleDetailVO } from '@/api/financial/orderSaleDetail/types';
import { OrderFullProcessOutDetailVO } from '../orderFullProcessOutDetail/types';
import { OrderHalfProcessOutDetailVO } from '../orderHalfProcessOutDetail/types';

export interface AccountMaterialInOutVo {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;
  /**
   * 物料名称
   */
  rawMaterialName: string;

  /**
   * 物料类别
   */
  categoryId: string | number;

  /**
   * 物料类别名称
   */
  categoryName: string;

  /**
   * 出入库时间
   */
  intOutTime: string;

  /**
   * 生产日期
   */
  productionDate: string;

  /**
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 数量
   */
  quantity: string | number;
  /**
   * 出入库数量
   */
  inOutQuantity: string | number;
  /**
   * 总金额
   */
  totalPrice: string | number;
  /**
   * 折扣金额
   */
  discountPrice: string | number;

  /**
   * 类型（采购入库、库存退货、生产发料、生产退料、物料借出、借出归还、物料接入、借入归还、直接出库、盘点出库、盘点入库、转仓出库、转仓入库）
   */
  type: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 库存表ID
   */
  rawMaterialStorageId: string | number;

  /**
   * 业务ID
   */
  bizId: string | number;

  /**
   * 过期日期
   */
  expirationDate: string;

  /**
   * 保质期天数
   */
  expirationDays: string | number;

  /**
   * 单价
   */
  price: string | number;

  /**
   * 出入库单价
   */
  inOutPrice: string | number;

  /**
   * 是否已对账 1已对账 2未对账
   */
  isAccountOrde: string;

  /**
   * 借料厂家id
   */
  supplierId: string | number;
  /**
   * 供应商名称
   */
  supplierName: string;
  /**
   * 借料单号
   */
  code: string;

  /**
   * 物料编码
   */
  materialCode: string;

  /**
   * 物料名称
   */
  name: string;

  /**
   * 单位名称
   */
  unitName: string;

  /**
   * 材质牌号
   */
  materialQuality: string;

  /**
   * 单位
   */
  units: string;

  /**
   * 品牌
   */
  manufacturer: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 原料状态 0使用 1停用
   */
  status: string;

  /**
   * 颜色
   */
  color: string;

  /**
   * 级别
   */
  level: string;

  /**
   * 铜厚
   */
  copperThickness: string;

  /**
   * 长
   */
  length: string;

  /**
   * 宽
   */
  width: string;
  /**
   * 板厚
   */
  boardThickness: string;

  /**
   * 库位id
   */
  storageLocation: string;

  /**
   * 选中
   */
  selected: boolean;

  /**
   * 供应商价格
   */
  supplierPrice: string | number;
}
export interface AccountOrderVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 编码
   */
  code: string;

  /**
   * 类型（订单外协、采购、借入、外协加工、外协模具）
   */
  type: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status: string;

  /**
   * 是否已全部冲销
   */
  isAllWriteOff: string;

  /**
   * 是否含税
   */
  isTax: string;

  /**
   * 对账截止时间
   */
  endTime: string;

  /**
   * 厂商ID
   */
  supplierId: string | number;
  /**
   * 供应商名称
   */
  supplierName: string | number;
  /**
   * 供应商编码
   */
  supplierCode: string | number;

  /**
   * 对账月份
   */
  accountMonth: string;

  /**
   * 对账金额
   */
  accountPrice: number;

  /**
   * 折扣金额
   */
  accountDiscountPrice: number;

  /**
   * 已冲销金额
   */
  writeOffPrice: number;

  /**
   * 应付金额
   */
  payablePrice: number;
  /**
   * 应付金额
   */
  remainPayablePrice: number;

  /**
   * 其他金额
   */
  otherPrice: number;

  /**
   * 对账人id
   */
  accountUserId: string | number;

  /**
   * 对账人名称
   */
  accountUserName: string;

  /**
   * 备注
   */
  remark: string;
}

export interface AccountOrderForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（订单外协、采购、借入、外协加工、外协模具）
   */
  type?: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status?: string;

  /**
   * 是否已全部冲销
   */
  isAllWriteOff?: string;

  /**
   * 是否含税
   */
  isTax?: string;

  /**
   * 对账截止时间
   */
  endTime?: string;

  /**
   * 厂商ID
   */
  supplierId?: string | number;

  /**
   * 对账月份
   */
  accountMonth?: string;

  /**
   * 对账金额
   */
  accountPrice?: number;

  /**
   * 折扣金额
   */
  accountDiscountPrice?: number;

  /**
   * 已冲销金额
   */
  writeOffPrice?: number;

  /**
   * 应付金额
   */
  payablePrice?: number;

  /**
   * 其他金额
   */
  otherPrice?: number;

  /**
   * 对账人id
   */
  accountUserId?: string | number;

  /**
   * 对账人名称
   */
  accountUserName?: string;

  /**
   * 对账单id
   */
  accountOrderIds?: (string | number)[];
  /**
   * 付款单id
   */
  paymentIds?: (string | number)[];

  /**
   * 备注
   */
  remark?: string;
  orderFilinOutDetailList?: OrderFilinOutDetailVO[];
  orderFullProcessOutDetailList?: OrderFullProcessOutDetailVO[];
  orderHalfProcessOutDetailBoLis?:OrderHalfProcessOutDetailVO[];
  orderSaleDetailBoList?:OrderSaleDetailVO[];
  currency?: string | number;
}

export interface InOrOutForm extends BaseEntity {
  id?: string | number;
  /**
   * 状态
   */
  status?: string;
  /**
   * remark
   */
  remark?: string;
  /**
   * 类型
   */
  type?: string;
  /**
   * 对账月份
   */
  accountMonth?: string;
  /**
   * 对账单号
   */
  code?: string;
  /**
   * 币种
   */
  currency?: string;
  /**
   * 对账总金额
   */
  accountPrice?: number;
  /**
   * 折扣总金额
   */
  accountDiscountPrice?: number;
  /**
   * 冲销总金额
   */
  writeOffPrice?: number;
  /**
   * 借入总金额
   */
  borrowTotalPrice?: number;
  /**
   * 借入折扣总金额
   */
  borrowDiscountTotalPrice?: number;
  /**
   * 还回总金额
   */
  backTotalPrice?: number;
  /**
   * 还回折扣总金额
   */
  backDiscountTotalPrice?: number;

  /**
   * 对账截止时间
   */
  endTime?: string;

  /**
   * 厂商ID
   */
  supplierId?: string | number;

  /**
   * 出入库明细
   */
  borrowDetailBoList?: AccountMaterialInOutVo[];
  /**
   * 采购对账单明细
   */
  purchaseDetailBoList?: AccountMaterialInOutVo[];
  /**
   * 其他金额明细
   */
  otherOrderBoList?: AccountOrderOtherVO[];
  /**
   * 外协菲林明细
   */
  orderFilinOutDetailList?: OrderFilinOutDetailVO[];
}
export interface InOrOutQuery extends PageQuery {
  /**
   * 物料类别
   */
  categoryId?: string | number;
  /**
   * 对账月份
   */
  accountMonth?: string;
  /**
   * 对账截止时间
   */
  endTime?: string;
  /**
   * 查询类型 1详情
   */
  queryType?: string;

  /**
   * 厂商ID
   */
  supplierId?: string | number;
  /**
   * 类型
   */
  type?: string;
  /**
   * 出或入
   */
  inOrOut?: string;

  /**
   * 是否已对账 1已对账 2未对账
   */
  isAccountOrde?: string;
  /**
   * 币种
   */
  currency?: string;
  /**
   * 对账单号
   */
  code?: string;
  /**
   * id
   */
  id?: string | number;
  /**
   * 备注
   */
  remark?: string;

  status?: string;
  hasAccountOrder?: string;
}
export interface AccountOrderQuery extends PageQuery {
  /**
   * 编码
   */
  code?: string;

  /**
   * 类型（订单外协、采购、借入、外协加工、外协模具）
   */
  type?: string;
  /**
   * 出或入
   */
  inOrOut?: string;

  /**
   * 状态（未提交、待审核、驳回、审核通过）
   */
  status?: string;

  /**
   * 是否已全部冲销
   */
  isAllWriteOff?: string;

  /**
   * 是否含税
   */
  isTax?: string;

  /**
   * 对账截止时间
   */
  endTime?: string | Date;

  /**
   * 厂商ID
   */
  supplierId?: string | number;

  /**
   * 对账月份
   */
  accountMonth?: string;

  /**
   * 对账金额
   */
  accountPrice?: number;

  /**
   * 折扣金额
   */
  accountDiscountPrice?: number;

  /**
   * 已冲销金额
   */
  writeOffPrice?: number;

  /**
   * 应付金额
   */
  payablePrice?: number;

  /**
   * 其他金额
   */
  otherPrice?: number;

  /**
   * 对账人id
   */
  accountUserId?: string | number;

  /**
   * 对账人名称
   */
  accountUserName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
  remark?: string;
  currency?: string | number,
  id?: string | number,
  queryType?: string,
}
/** * 对账单状态枚举
 * 1.待提交
 * 2.待审核
 * 3.驳回
 * 4.已审核 */
export enum StatusEnum {
  /**
   * 待提交
   */
  BE_SUBMITTED = '1',
  /**
   * 待审核
   */
  BE_AUDITED = '2',
  /**
   * 驳回
   */
  REJECTED = '3',
  /**
   * 已审核
   */
  AUDITED = '4',
  /**
   * 取消
   */
  CANCEL = '5'
}
/** * 合同流转状态枚举
 * 1.待我方确认
 * 2.待对方确认
 * 3.已完成 */
export enum ConfirmEnum {
  /**
   * 待我方确认
   */
  WAIT_ONE_CONFIRM = '1',
  /**
   * 待对方确认
   */
  WAIT_TWO_CONFIRM = '2',
  /**
   * 已完成
   */
  CONFIRMED = '3',
}
export const statusStrings = {
  [StatusEnum.BE_SUBMITTED]: '待提交',
  [StatusEnum.BE_AUDITED]: '待审核',
  [StatusEnum.AUDITED]: '审核通过',
  [StatusEnum.REJECTED]: '驳回',
  [StatusEnum.CANCEL]: '取消',
};

/** * 对账单类型枚举
 * 1订单外协、2采购、3借入、4借出、5外协加工、6外协模具 */
export enum TypeEnum {
  /**
   * 订单外协
   */
  ALL_PROCESSING_OUTSOURCING = '1',
  /**
   * 采购
   */
  PURCHASE = '2',
  /**
   * 借入
   */
  BORROW_IN = '3',
  /**
   * 借出
   */
  BORROW_OUT = '4',
  /**
   * 外协加工
   */
  SEMI_PROCESSING_OUTSOURCING = '5',
  /**
   * 外协模具
   */
  OUTSOURCING_MOLD = '6',
  /**
   * 外协菲林
   */
  OUTSOURCING_FEILIN = '7',
  /**
   * 销售
   */
  SALE = "8"
}
export const typeStrings = {
  [TypeEnum.ALL_PROCESSING_OUTSOURCING]: '订单外协',
  [TypeEnum.PURCHASE]: '采购',
  [TypeEnum.BORROW_IN]: '借入',
  [TypeEnum.BORROW_OUT]: '借出',
  [TypeEnum.SEMI_PROCESSING_OUTSOURCING]: '外协加工',
  [TypeEnum.OUTSOURCING_MOLD]: '外协模具'
};


/** * 对账单操作按钮枚举 */
export enum HandleEnum {
  /**
   * 新增
   */
  ADD = 'add',
  /**
   * 修改
   */
  EDIT = 'edit',
  /**
   * 删除
   */
  DEL = 'del',
  /**
   * 详情
   */
  INFO= 'info',
  /**
   * 审核
   */
  EXAMINE= 'examine',
  /**
   * 确认
   */
  CONFIRM = 'confirm',
  /**
   * 取消
   */
  CANCEL = 'cancel',
  /**
   * 确认取消
   */
  CONFIRM_CANCEL = 'confirmCancel',
  /**
   * 驳回
   */
  REJECT = 'reject',
}
/** 物料对账单明细类型 */
export enum rawInOutTypeEnum {
    PURCHASE_IN ="1",//"采购入库"
    STOCK_RETURN = "2",//"库存退货"),
    PRODUCTION_ISSUE = "3",// "生产发料"),
    PRODUCTION_RETURN="4", //"生产退料"),
    MATERIAL_BORROW="5", //"物料借出"),
    BORROW_RETURN="6", //"借出归还"),
    MATERIAL_IN="7", //"物料借入"),
    BORROW_IN="8", //"借入归还"),
    DIRECT_OUT="9", //"直接出库"),
    CHECK_OUT="10", //"盘点出库"),
    CHECK_IN="11", //"盘点入库"),
    TRANSFER_OUT="12",// "转仓出库"),
    TRANSFER_IN="13", //"转仓入库");
}
/** 物料对账单明细类型 */
export enum filmOrderTypeEnum {
  FEI_LIN="1",// "菲林"),
  WANG_BAN="2", //"网板");
}

/** 半制程对账明细类型 */
export enum HalfOrderTypeEnum {
  HALF_RECEIVE="2",// "收货"),
  HALF_SCRAP="1", //"报废");
}
