import { InvoiceVO } from '@/api/financial/invoice/types';
export interface RepaymentRecordVO {
  /**
   * $column.columnComment
   */
  id: string | number;
  /**
   * 编码
   */
  code: string;
  /**
   * 总金额
   */
  totalPrice: number;

  /**
   * 已冲销金额
   */
  writeOffPrice: number;

  /**
   * 剩余金额
   */
  balance: number;

  /**
   * 类型（付款单、回款单）
   */
  type: string;

  /**
   * 厂商ID
   */
  supplierId: string | number;

  /**
   * 打款日期
   */
  payDate: string;

  /**
   * 收据号/发票号
   */
  payCode: string;
  /**
   * 申请人
   */
  createByName: string;

  /**
   * 票款到期日期
   */
  payExpireDate: string;

  /**
   * 打款方式（数据字典）
   */
  payWay: string;

  /**
   * 打款账户
   */
  accountNumber: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 是否已上传回执
   */
  isUploadedReceipt: string;
  /**
   * 回执id
   */
  ossId: number | string;
  /**
   * 回执名称
   */
  ossName: string;

  /**
   * 发票列表
   */
  invoiceVoList: InvoiceVO[];
}

export interface RepaymentRecordForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 已冲销金额
   */
  writeOffPrice?: number;

  /**
   * 剩余金额
   */
  balance?: number;

  /**
   * 类型（付款单、回款单）
   */
  type?: string;

  /**
   * 厂商ID
   */
  supplierId?: string | number;

  /**
   * 打款日期
   */
  payDate?: string;

  /**
   * 收据号/发票号
   */
  payCode?: string;

  /**
   * 票款到期日期
   */
  payExpireDate?: string;

  /**
   * 打款方式（数据字典）
   */
  payWay?: string;

  /**
   * 打款账户
   */
  accountNumber?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 是否已上传回执
   */
  isUploadedReceipt?: string;
  /**
   * 发票列表
   */
  invoiceIdList?: (string | number)[];
  /**
   * 状态
   */
  status?: string;
  fileList?:any[]
}

export interface InvoiceForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 发票代码
   */
  code?: string;

  /**
   * 发票号码
   */
  number?: string;

  /**
   * 数电票号码
   */
  digitalNumber?: string;

  /**
   * 销方识别号
   */
  sellerIdentifier?: string | number;

  /**
   * 销方名称
   */
  sellerName?: string;

  /**
   * 购方识别号
   */
  buyerIdentifier?: string | number;

  /**
   * 购买方名称
   */
  buyerName?: string;

  /**
   * 开票日期
   */
  invoiceTime?: any;

  /**
   * 金额
   */
  amount?: number;

  /**
   * 税额
   */
  tax?: number;

  /**
   * 价税合计
   */
  amountTax?: number;

  /**
   * 发票来源
   */
  source?: string;

  /**
   * 发票票种
   */
  type?: string;

  /**
   * 发票状态
   */
  status?: string;

  /**
   * 发票风险等级
   */
  riskLevel?: string;

  /**
   * 开票人
   */
  issuerName?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 是否为红冲票据
   */
  isRed?: string;

  /**
   * 红冲对应发票代码
   */
  redCode?: string;

  /**
   * 红冲对应发票号码
   */
  redNumber?: string;

  /**
   * 红冲对应数电票号码
   */
  redDigitalNumber?: string;

  /**
   * 导入时间
   */
  importTime?: string;

  /**
   * 发票类型（0应付发票 1应收发票）
   */
  invoiceType?: string;
}

export interface InvoiceQuery extends PageQuery {
  /**
   * 创建部门名称
   */
  createDeptName?: string;

  /**
   * 创建者名称
   */
  createByName?: string;

  /**
   * 更新者名称
   */
  updateByName?: string;

  /**
   * 发票代码
   */
  code?: string;

  /**
   * 发票号码
   */
  number?: string;

  /**
   * 数电票号码
   */
  digitalNumber?: string;

  /**
   * 销方识别号
   */
  sellerIdentifier?: string | number;

  /**
   * 销方名称
   */
  sellerName?: string;

  /**
   * 购方识别号
   */
  buyerIdentifier?: string | number;

  /**
   * 购买方名称
   */
  buyerName?: string;

  /**
   * 开票日期
   */
  invoiceTime?: string;

  /**
   * 金额
   */
  amount?: number;

  /**
   * 税额
   */
  tax?: number;

  /**
   * 价税合计
   */
  amountTax?: number;

  /**
   * 发票来源
   */
  source?: string;

  /**
   * 发票票种
   */
  type?: string;

  /**
   * 发票状态
   */
  status?: string;

  /**
   * 发票风险等级
   */
  riskLevel?: string;

  /**
   * 开票人
   */
  issuerName?: string;

  /**
   * 是否为红冲票据
   */
  isRed?: string;

  /**
   * 红冲对应发票代码
   */
  redCode?: string;

  /**
   * 红冲对应发票号码
   */
  redNumber?: string;

  /**
   * 红冲对应数电票号码
   */
  redDigitalNumber?: string;

  /**
   * 导入时间
   */
  importTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;

  /**
   * 发票类型（0应付发票 1应收发票）
   */
  invoiceType?: string;
}

export interface RepaymentRecordQuery extends PageQuery {
  /**
   * 状态
   */
  status?: string;
  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 已冲销金额
   */
  writeOffPrice?: number;

  /**
   * 剩余金额
   */
  balance?: number;

  /**
   * 类型（付款单、回款单）
   */
  type?: string;

  /**
   * 厂商ID
   */
  supplierId?: string | number;

  /**
   * 打款日期
   */
  payDate?: string;

  /**
   * 收据号/发票号
   */
  payCode?: string;

  /**
   * 票款到期日期
   */
  payExpireDate?: string;

  /**
   * 打款方式（数据字典）
   */
  payWay?: string;

  /**
   * 打款账户
   */
  accountNumber?: string;

  /**
   * 是否已上传回执
   */
  isUploadedReceipt?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
