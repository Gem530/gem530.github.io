import { UserVO } from "../user/types";

export interface CustomerVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 客户编码
   */
  customerCode: string;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 客户级别
   */
  customerLevel: string;

  /**
   * 销售人
   */
  salesman: string;

  /**
   * 对账时间
   */
  reconciliationTime: string;

  /**
   * 付款方式1转账2支票3现金
   */
  paymentMethod?: string | number;

  /**
   * 营业执照号
   */
  businessLicenseNumber: string;

  /**
   * 币种 1:人民币 2:美元
   */
  currency: number;

  /**
   * 汇率(%)
   */
  exchangeRate: number;

  /**
   * 客户电话
   */
  customerPhone: string;

  /**
   * 公司地址
   */
  companyAddress: string;

  /**
   * 公司负责人
   */
  companyPrincipal: string;

  /**
   * 公司负责人电话
   */
  companyPrincipalPhone: string;

  /**
   * 月结方式 1：月结30天  2 ：月结45天 3：月结60天 4：月结90天  5：预付30% :6：货到付款
    7：预付款 8：当月结 9：现金 10：预付30%，尾款到发货 11：现金货到付款
    12：下单预付50%，发货付清
   */
  monthlyMethod?: string | number;

  /**
   * 天数限制
   */
  dayNumberLimit: number;

  /**
   * 运输方式 1自提 2送货 3其他
   */
  shippingType?: string | number;

  /**
   * 采购负责人
   */
  purchasingManager: string;

  /**
   * 采购联系电话
   */
  purchasingPhone: string;

  /**
   * 采购联系Email
   */
  purchasingEmail: string;

  /**
   * 财务联系人
   */
  financeManager: number;

  /**
   * 财务联系人电话
   */
  financePhone: string;

  /**
   * 财务联系Email
   */
  financeEmail: string;

  /**
   * 仓库联系人
   */
  warehouseKeeper: number;

  /**
   * 仓库联系电话
   */
  warehousePhone: string;

  /**
   * 仓库联系Email
   */
  warehouseEmail: string;

  /**
   * 工程联系人
   */
  projectManager: number;

  /**
   * 工程联系电话
   */
  projectPhone: string;

  /**
   * 工程联系Email
   */
  projectEmail: string;

  /**
   * 其他联系人
   */
  otherManager: number;

  /**
   * 其他联系电话
   */
  otherPhone: string;

  /**
   * 其他联系Email
   */
  otherEmail: string;

  /**
   * 联系人QQ
   */
  contactsQq: string;

  /**
   * 开户银行
   */
  depositBank: string;

  /**
   * 银行账户
   */
  bankAccount: string;

  /**
   * 检验标准 1客户标准2：IPCII级标准 3：企标
   */
  checkStandard?: string | number;

  /**
   * 客户资料 1菲林2：图纸 3：Email 4其他
   */
  customerData?: string | number;

  /**
   * 是否含税 1否 2是
   */
  isTax: number;

  /**
   * 邮箱
   */
  email: string;

  /**
   * 传真
   */
  faxes: string;

  /**
   * 客户要求
   */
  customerDemand: string;

  createTime: string;
  /**
   * 备注
   */
  remark: string;

  salerList?: [];
}

export interface CustomerForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 客户编码
   */
  customerCode?: string;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 客户级别
   */
  customerLevel?: string;

  /**
   * 销售人
   */
  salesman?: string;

  /**
   * 对账时间
   */
  reconciliationTime?: string;

  /**
   * 付款方式1转账2支票3现金
   */
  paymentMethod?: number;

  /**
   * 营业执照号
   */
  businessLicenseNumber?: string;

  /**
   * 币种 1:人民币 2:美元
   */
  currency?: number;

  /**
   * 汇率(%)
   */
  exchangeRate?: number;

  /**
   * 客户电话
   */
  customerPhone?: string;

  /**
   * 公司地址
   */
  companyAddress?: string;

  /**
   * 公司负责人
   */
  companyPrincipal?: string;

  /**
   * 公司负责人电话
   */
  companyPrincipalPhone?: string;

  /**
   * 月结方式 1：月结30天  2 ：月结45天 3：月结60天 4：月结90天  5：预付30% :6：货到付款
    7：预付款 8：当月结 9：现金 10：预付30%，尾款到发货 11：现金货到付款
    12：下单预付50%，发货付清
   */
  monthlyMethod?: number;

  /**
   * 天数限制
   */
  dayNumberLimit?: number;

  /**
   * 运输方式 1自提 2送货 3其他
   */
  shippingType?: number;

  /**
   * 采购负责人
   */
  purchasingManager?: string;

  /**
   * 采购联系电话
   */
  purchasingPhone?: string;

  /**
   * 采购联系Email
   */
  purchasingEmail?: string;

  /**
   * 财务联系人
   */
  financeManager?: number;

  /**
   * 财务联系人电话
   */
  financePhone?: string;

  /**
   * 财务联系Email
   */
  financeEmail?: string;

  /**
   * 仓库联系人
   */
  warehouseKeeper?: number;

  /**
   * 仓库联系电话
   */
  warehousePhone?: string;

  /**
   * 仓库联系Email
   */
  warehouseEmail?: string;

  /**
   * 工程联系人
   */
  projectManager?: number;

  /**
   * 工程联系电话
   */
  projectPhone?: string;

  /**
   * 工程联系Email
   */
  projectEmail?: string;

  /**
   * 其他联系人
   */
  otherManager?: number;

  /**
   * 其他联系电话
   */
  otherPhone?: string;

  /**
   * 其他联系Email
   */
  otherEmail?: string;

  /**
   * 联系人QQ
   */
  contactsQq?: string;

  /**
   * 开户银行
   */
  depositBank?: string;

  /**
   * 银行账户
   */
  bankAccount?: string;

  /**
   * 检验标准 1客户标准2：IPCII级标准 3：企标
   */
  checkStandard?: number;

  /**
   * 客户资料 1菲林2：图纸 3：Email 4其他
   */
  customerData?: number;

  /**
   * 是否含税 1否 2是
   */
  isTax?: number;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 传真
   */
  faxes?: string;

  /**
   * 客户要求
   */
  customerDemand?: string;

  /**
   * 备注
   */
  remark?: string;

  salerList?: [];

}

export interface CustomerQuery extends PageQuery {

  /**
   * 客户编码
   */
  customerCode?: string;

  /**
   * 客户名称
   */
  customerName?: string;

  /**
   * 客户级别
   */
  customerLevel?: string;

  /**
   * 销售人
   */
  salesman?: string;

  /**
   * 对账时间
   */
  reconciliationTime?: string;

  /**
   * 付款方式1转账2支票3现金
   */
  paymentMethod?: number;

  /**
   * 营业执照号
   */
  businessLicenseNumber?: string;

  /**
   * 币种 1:人民币 2:美元
   */
  currency?: number;

  /**
   * 汇率(%)
   */
  exchangeRate?: number;

  /**
   * 客户电话
   */
  customerPhone?: string;

  /**
   * 公司地址
   */
  companyAddress?: string;

  /**
   * 公司负责人
   */
  companyPrincipal?: string;

  /**
   * 公司负责人电话
   */
  companyPrincipalPhone?: string;

  /**
   * 月结方式 1：月结30天  2 ：月结45天 3：月结60天 4：月结90天  5：预付30% :6：货到付款
    7：预付款 8：当月结 9：现金 10：预付30%，尾款到发货 11：现金货到付款
    12：下单预付50%，发货付清
   */
  monthlyMethod?: number;

  /**
   * 天数限制
   */
  dayNumberLimit?: number;

  /**
   * 运输方式 1自提 2送货 3其他
   */
  shippingType?: number;

  /**
   * 采购负责人
   */
  purchasingManager?: string;

  /**
   * 采购联系电话
   */
  purchasingPhone?: string;

  /**
   * 采购联系Email
   */
  purchasingEmail?: string;

  /**
   * 财务联系人
   */
  financeManager?: number;

  /**
   * 财务联系人电话
   */
  financePhone?: string;

  /**
   * 财务联系Email
   */
  financeEmail?: string;

  /**
   * 仓库联系人
   */
  warehouseKeeper?: number;

  /**
   * 仓库联系电话
   */
  warehousePhone?: string;

  /**
   * 仓库联系Email
   */
  warehouseEmail?: string;

  /**
   * 工程联系人
   */
  projectManager?: number;

  /**
   * 工程联系电话
   */
  projectPhone?: string;

  /**
   * 工程联系Email
   */
  projectEmail?: string;

  /**
   * 其他联系人
   */
  otherManager?: number;

  /**
   * 其他联系电话
   */
  otherPhone?: string;

  /**
   * 其他联系Email
   */
  otherEmail?: string;

  /**
   * 联系人QQ
   */
  contactsQq?: string;

  /**
   * 开户银行
   */
  depositBank?: string;

  /**
   * 银行账户
   */
  bankAccount?: string;

  /**
   * 检验标准 1客户标准2：IPCII级标准 3：企标
   */
  checkStandard?: number;

  /**
   * 客户资料 1菲林2：图纸 3：Email 4其他
   */
  customerData?: number;

  /**
   * 是否含税 1否 2是
   */
  isTax?: number;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 传真
   */
  faxes?: string;

  /**
   * 客户要求
   */
  customerDemand?: string;

  /**
   * 备注
   */
  remark?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



