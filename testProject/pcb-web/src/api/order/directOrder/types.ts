import {CustomerForm} from "@/api/basedata/customer/types";

export interface OrderVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 订单编号
   */
  code: string;

  /**
   * 下单时间
   */
  placeOrderTime: string;

  appearanceRequirements: string;

  /**
   * 报价表id
   */
  saleQuotationId: string | number;

  /**
   * 客户ID
   */
  cusId: string | number;

  /**
   * 负责人
   */
  cusPrincipal: string;

  /**
   * 负责人电话
   */
  cusPrincipalPhone: string;

  /**
   * 传真
   */
  cusFax: string;

  /**
   * 付款方式（需配置字典）
   */
  cusPaymentMethod: string;

  /**
   * 月结方式（需配置字典）
   */
  cusMonthlyStatementWay: string;

  /**
   * 币种（需配置字典）
   */
  cusCurrency: string;

  otherCostQuotationList:[];

  /**
   * 汇率
   */
  cusExchangeRate: number;

  /**
   * 运输方式（需配置字典）
   */
  cusTransStyle: string;

  /**
   * 收货地址
   */
  cusAddress: string;

  /**
   * 客户检验标准（需配置字典）
   */
  cusQualityStand: string;

  /**
   * 收货地址id
   */
  cusAddressId: string | number;

  /**
   * 邮件
   */
  cusEmail: string;

  /**
   * 客户资料（需配置字典）
   */
  cusCustomerData: string;

  /**
   * 业务员id
   */
  cusSaleUserId: string | number;

  /**
   * 客户是否含税(0-不含，1-含)
   */
  cusIsTaxRate: string;

  /**
   * 客户备注
   */
  cusRemark: string;

  /**
   * 产品名称
   */
  commodityName: string;

  /**
   * 产品类型（需配置字典）
   */
  commodityType: string;

  /**
   * 产品id
   */
  commodityId: string | number;

  /**
   * 产品编码
   */
  commodityCode: string;

  /**
   * 表面处理（需配置字典）
   */
  surfaceTreatment: string;

  /**
   * 批量/样品（需配置字典）
   */
  model: string;

  /**
   * 板层
   */
  materialLayer: string;

  /**
   * 流水号
   */
  serialNumber: string;

  /**
   * 客户物料编码
   */
  materialNumber: string;

  /**
   * 客户物料名称
   */
  materialName: string;

  /**
   * 特殊要求
   */
  specialRequirement: string;

  /**
   * 包装要求（需配置字典）
   */
  packRequirement: string;

  /**
   * 板材（需配置字典）
   */
  materialQuality: string;

  /**
   * 板材品牌（需配置字典）
   */
  materialBrand: string;

  /**
   * 板材级别（需配置字典）
   */
  materialLevel: string;

  /**
   * 外层铜厚（需配置字典）
   */
  materialCopperOutside: string | number;

  /**
   * 内层铜厚（需配置字典）
   */
  materialCopperInside: string | number;

  /**
   * 订单备注
   */
  remark: string;

  /**
   * 是否库存发货0否1是
   */
  isInventoryShipped: string | number;

  /**
   * 产品备注
   */
  commodityRemark: string;

  /**
   * 单片宽
   */
  singleWidth: string | number;

  /**
   * 单片长
   */
  singleLength: number;

  /**
   * 联片宽
   */
  unitedWidth: number;

  /**
   * 联片长
   */
  unitedLength: number;

  /**
   * 联片数量
   */
  unitedNumber: number;

  /**
   * 联片方式长
   */
  unitedWayLength: number;

  /**
   * 联片方式宽
   */
  unitedWayWidth: number;

  /**
   * 阻焊颜色（需配置字典）
   */
  commoditySolder: string;

  /**
   * 阻焊面数（需配置字典）
   */
  commoditySolderCount: string;

  /**
   * 金厚
   */
  goldenThickness: string;

  /**
   * 阻焊光泽（需配置字典）
   */
  commoditySolderGloss: string;

  /**
   * 阻焊要求
   */
  commoditySolderRequirement: string;

  /**
   * 孔铜厚
   */
  poreCopper: string;

  /**
   * 字符颜色（需配置字典）
   */
  characterColor: string;

  /**
   * 字符面数（需配置字典）
   */
  characterCount: string;

  /**
   * 成形方式（需配置字典）
   */
  commodityForm: string;

  /**
   * 字符要求
   */
  characterRequirement: string;

  /**
   * SET打叉
   */
  setCross: string;

  /**
   * 板翘曲度
   */
  warpagePlate: string;

  /**
   * 测试方式（需配置字典）
   */
  commodityTestWay: string;

  /**
   * 测试点
   */
  testPoint: number;

  /**
   * 备品数量
   */
  spareQuantity: number;

  /**
   * 铜箔
   */
  copperFoil: string;

  /**
   * vcut
   */
  vCut: string;

  /**
   * 过孔要求（需配置字典）
   */
  holeRequirement: string;

  /**
   * 检验标准（需配置字典）
   */
  inspectionStandard: string;

  /**
   * 金面积
   */
  goldArea: number;

  /**
   * PP
   */
  pp: string;

  /**
   * 镍厚
   */
  nickelThickness: number;

  /**
   * 锡厚
   */
  tinThickness: number;

  /**
   * 最小线宽
   */
  minLineWidth: string | number;

  /**
   * 最小线距
   */
  minLineSpace: number;

  /**
   * 最小孔径
   */
  minAperture: number;

  /**
   * 总孔数
   */
  holeCount: number;

  /**
   * 孔密度
   */
  holeDensity: number;

  /**
   * 提交人
   */
  submitUserId: string | number;

  /**
   * 提交时间
   */
  submitTime: string;

  /**
   * 审核人
   */
  auditUserId: string | number;

  /**
   * 审核时间
   */
  auditTime: string;

  /**
   * 审核意见
   */
  auditComment: string;

  /**
   * 客户PO
   */
  customerPo: string;

  /**
   * 客户交期
   */
  deliveryTime: string;

  /**
   * 发货日期
   */
  dispatchTime: string;

  /**
   * 订单数量
   */
  quantity: number;

  /**
   * 加急（需配置字典）
   */
  urgent: string;

  /**
   * 面积
   */
  area: number;

  /**
   * 单价
   */
  price: number;

  /**
   * 平米价
   */
  areaPrice: number;

  /**
   * 订单类型（需配置字典）
   */
  orderType: string;

  /**
   * 含税总价
   */
  totalPrice: number;

  /**
   * 不含税总价
   */
  totalOrderPrice: number;

  /**
   * 税金
   */
  tax: number;

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
   * 流程状态（需配置字典）
   */
  flowStatus: string;

  /**
   * 订单状态（需配置字典）
   */
  status: string;

  /**
   * 成品板厚（需配置字典）
   */
  commodityThickness: string;

  /**
   * 业务员名称
   */
  cusSaleUserName: string;

  /**
   * 提交人名称
   */
  submitUserName: string;

  /**
   * 审核人名称
   */
  auditUserName: string;

  /**
   * 创建部门名称
   */
  createDeptName: string;

  /**
   * 创建者名称
   */
  createByName: string;

  /**
   * 更新者名称
   */
  updateByName: string;

  /**
   * 客户名称
   */
  cusName: string;

  cusCode:string;

  preDeliveryHour: number;

  delFlag: number;

  /**
   * 发外协前流程状态
   */
  preOutsourceStatus: string;

  /**
   * 暂停产品（0：未暂停；1：已暂停）
   */
  suspendFlag: string;

  /**
   * 制作单编号
   */
  miMakeCode: string;

  /**
   * 税率
   */
  taxRate: number;

  /**
   * 退货单价(元/pcs)
   */
  scrapSinglePrice: number;

  /**
   *退货分类
   */
  backType: number;

  /**
   * 退货原因
   */
  reason: string;

  /**
   * 退货数量
   */
  returnQuantity: number;

  /**
   *已退货数量
   */
  alreadyReturnQuantity: number;

  /**
   *送货数量
   */
  deliveryQuantity: number;

  /**
   *可退货数量
   */
  canReturnQuantity: number;

  /**
   * 创建时间
   */
  createTime: string;

}


export interface DirectOrder extends BaseEntity{
  orderList: [];
  idList:[];
  delOrderIds:any[];
  baseCustomerBo: {};
  cusCustomerData:[];
}

export interface OrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  quotationFileList:[];
  otherCostList:[];

  testFrame?: string;

  /**
   * 订单编号
   */
  code?: string;

  /**
   * 下单时间
   */
  placeOrderTime?: string;

  /**
   * 客户ID
   */
  cusId?: string | number;

  /**
   * 负责人
   */
  cusPrincipal?: string;

  /**
   * 负责人电话
   */
  cusPrincipalPhone?: string;

  /**
   * 传真
   */
  cusFax?: string;

  /**
   * 付款方式（需配置字典）
   */
  cusPaymentMethod?: string;

  /**
   * 月结方式（需配置字典）
   */
  cusMonthlyStatementWay?: string;

  /**
   * 币种（需配置字典）
   */
  cusCurrency?: string;

  /**
   * 税率
   */
  cusExchangeRate?: number;

  /**
   * 运输方式（需配置字典）
   */
  cusTransStyle?: string;

  /**
   * 收货地址
   */
  cusAddress?: string;

  /**
   * 客户检验标准（需配置字典）
   */
  cusQualityStand?: string;

  /**
   * 收货地址id
   */
  cusAddressId?: string | number;

  /**
   * 邮件
   */
  cusEmail?: string;

  /**
   * 客户资料（需配置字典）
   */
  cusCustomerData?: string;

  /**
   * 业务员id
   */
  cusSaleUserId?: string | number;

  /**
   * 客户是否含税(0-不含，1-含)
   */
  cusIsTaxRate?: string;

  /**
   * 客户备注
   */
  cusRemark?: string;

  /**
   * 产品名称
   */
  commodityName?: string;

  /**
   * 产品类型（需配置字典）
   */
  commodityType?: string;

  /**
   * 产品id
   */
  commodityId?: string | number;

  /**
   * 产品编码
   */
  commodityCode?: string;

  /**
   * 表面处理（需配置字典）
   */
  surfaceTreatment?: string;

  /**
   * 批量/样品（需配置字典）
   */
  model?: string;

  /**
   * 板层
   */
  materialLayer?: string;

  /**
   * 流水号
   */
  serialNumber?: string;

  /**
   * 客户物料编码
   */
  materialNumber?: string;

  /**
   * 客户物料名称
   */
  materialName?: string;

  /**
   * 特殊要求
   */
  specialRequirement?: string;

  /**
   * 包装要求（需配置字典）
   */
  packRequirement?: string;

  /**
   * 板材（需配置字典）
   */
  materialQuality?: string;

  /**
   * 板材品牌（需配置字典）
   */
  materialBrand?: string;

  /**
   * 板材级别（需配置字典）
   */
  materialLevel?: string;

  /**
   * 外层铜厚（需配置字典）
   */
  materialCopperOutside?: string | number;

  /**
   * 内层铜厚（需配置字典）
   */
  materialCopperInside?: string | number;

  /**
   * 订单备注
   */
  remark?: string;

  /**
   * 产品备注
   */
  commodityRemark?: string;

  /**
   * 单片宽
   */
  singleWidth?: string | number;

  /**
   * 单片长
   */
  singleLength?: number;

  /**
   * 联片宽
   */
  unitedWidth?: string | number;

  /**
   * 联片长
   */
  unitedLength?: number;

  /**
   * 联片数量
   */
  unitedNumber?: number;

  /**
   * 联片方式长
   */
  unitedWayLength?: number;

  /**
   * 联片方式宽
   */
  unitedWayWidth?: string | number;

  /**
   * 阻焊颜色（需配置字典）
   */
  commoditySolder?: string;

  /**
   * 阻焊面数（需配置字典）
   */
  commoditySolderCount?: string;

  /**
   * 金厚
   */
  goldenThickness?: string;

  /**
   * 阻焊光泽（需配置字典）
   */
  commoditySolderGloss?: string;

  /**
   * 阻焊要求
   */
  commoditySolderRequirement?: string;

  /**
   * 孔铜厚
   */
  poreCopper?: string;

  /**
   * 字符颜色（需配置字典）
   */
  characterColor?: string;

  /**
   * 字符面数（需配置字典）
   */
  characterCount?: string;

  /**
   * 成形方式（需配置字典）
   */
  commodityForm?: string;

  /**
   * 字符要求
   */
  characterRequirement?: string;

  /**
   * SET打叉
   */
  setCross?: string;

  /**
   * 板翘曲度
   */
  warpagePlate?: string;

  /**
   * 测试方式（需配置字典）
   */
  commodityTestWay?: string;

  /**
   * 测试点
   */
  testPoint?: number;

  /**
   * 备品数量
   */
  spareQuantity?: number;

  /**
   * 铜箔
   */
  copperFoil?: string;

  /**
   * vcut
   */
  vCut?: string;

  /**
   * 过孔要求（需配置字典）
   */
  holeRequirement?: string;

  /**
   * 检验标准（需配置字典）
   */
  inspectionStandard?: string;

  /**
   * 金面积
   */
  goldArea?: number;

  /**
   * PP
   */
  pp?: string;

  /**
   * 镍厚
   */
  nickelThickness?: number;

  /**
   * 锡厚
   */
  tinThickness?: number;

  /**
   * 最小线宽
   */
  minLineWidth?: string | number;

  /**
   * 最小线距
   */
  minLineSpace?: number;

  /**
   * 最小孔径
   */
  minAperture?: number;

  /**
   * 总孔数
   */
  holeCount?: number;

  /**
   * 孔密度
   */
  holeDensity?: number;

  /**
   * 提交人
   */
  submitUserId?: string | number;

  /**
   * 提交时间
   */
  submitTime?: string;

  /**
   * 审核人
   */
  auditUserId?: string | number;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 审核意见
   */
  auditComment?: string;

  /**
   * 客户PO
   */
  customerPo?: string;

  /**
   * 客户交期
   */
  deliveryTime?: string;

  /**
   * 发货日期
   */
  dispatchTime?: string;

  /**
   * 订单数量
   */
  quantity?: number;

  /**
   * 加急（需配置字典）
   */
  urgent?: string;

  /**
   * 面积
   */
  area?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 平米价
   */
  areaPrice?: number;

  /**
   * 订单类型（需配置字典）
   */
  orderType?: string;

  /**
   * 含税总价
   */
  totalPrice?: number;

  /**
   * 不含税总价
   */
  totalOrderPrice?: number;

  /**
   * 税金
   */
  tax?: number;

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
   * 流程状态（需配置字典）
   */
  flowStatus?: string;

  /**
   * 订单状态（需配置字典）
   */
  status?: string;

  /**
   * 成品板厚（需配置字典）
   */
  commodityThickness?: string;

  /**
   * 业务员名称
   */
  cusSaleUserName?: string;

  /**
   * 提交人名称
   */
  submitUserName?: string;

  /**
   * 审核人名称
   */
  auditUserName?: string;

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
   * 客户名称
   */
  cusName?: string;

  /**
   * 发外协前流程状态
   */
  preOutsourceStatus: string;

  /**
   * 暂停产品（0：未暂停；1：已暂停）
   */
  suspendFlag: string;

  /**
   * 制作单编号
   */
  miMakeCode: string;

  /**
   * 税率
   */
  taxRate: number;

  /**
   * 退货单价(元/pcs)
   */
  scrapSinglePrice: number;

  /**
   *退货分类
   */
  backType: number;

  /**
   * 退货原因
   */
  reason: string;

  /**
   * 退货数量
   */
  returnQuantity: number;

  /**
   *已退货数量
   */
  alreadyReturnQuantity: number;

  /**
   *送货数量
   */
  deliveryQuantity: number;

  /**
   *可退货数量
   */
  canReturnQuantity: number;
}

export interface OrderQuery extends PageQuery {

  /**
   * 订单编号
   */
  code?: string;

  isInventoryShipped?: string;

  /**
   * 下单时间
   */
  placeOrderTimeStart?: string;

  placeOrderTimeEnd?: string;

  popoverFileList:[];

  finishType?:string;
  /**
   * 客户ID
   */
  cusId?: string | number;

  /**
   * 负责人
   */
  cusPrincipal?: string;

  /**
   * 负责人电话
   */
  cusPrincipalPhone?: string;

  /**
   * 传真
   */
  cusFax?: string;

  /**
   * 付款方式（需配置字典）
   */
  cusPaymentMethod?: string;

  /**
   * 月结方式（需配置字典）
   */
  cusMonthlyStatementWay?: string;

  /**
   * 币种（需配置字典）
   */
  cusCurrency?: string;

  /**
   * 税率
   */
  cusExchangeRate?: number;

  /**
   * 运输方式（需配置字典）
   */
  cusTransStyle?: string;

  /**
   * 收货地址
   */
  cusAddress?: string;

  /**
   * 客户检验标准（需配置字典）
   */
  cusQualityStand?: string;

  /**
   * 收货地址id
   */
  cusAddressId?: string | number;

  /**
   * 邮件
   */
  cusEmail?: string;

  /**
   * 客户资料（需配置字典）
   */
  cusCustomerData?: string;

  /**
   * 业务员id
   */
  cusSaleUserId?: string | number;

  /**
   * 客户是否含税(0-不含，1-含)
   */
  cusIsTaxRate?: string;

  /**
   * 客户备注
   */
  cusRemark?: string;

  /**
   * 产品名称
   */
  commodityName?: string;

  /**
   * 产品类型（需配置字典）
   */
  commodityType?: string;

  /**
   * 产品id
   */
  commodityId?: string | number;

  /**
   * 产品编码
   */
  commodityCode?: string;

  /**
   * 表面处理（需配置字典）
   */
  surfaceTreatment?: string;

  /**
   * 批量/样品（需配置字典）
   */
  model?: string;

  /**
   * 板层
   */
  materialLayer?: string;

  /**
   * 流水号
   */
  serialNumber?: string;

  /**
   * 客户物料编码
   */
  materialNumber?: string;

  /**
   * 客户物料名称
   */
  materialName?: string;

  /**
   * 特殊要求
   */
  specialRequirement?: string;

  /**
   * 包装要求（需配置字典）
   */
  packRequirement?: string;

  /**
   * 板材（需配置字典）
   */
  materialQuality?: string;

  /**
   * 板材品牌（需配置字典）
   */
  materialBrand?: string;

  /**
   * 板材级别（需配置字典）
   */
  materialLevel?: string;

  /**
   * 外层铜厚（需配置字典）
   */
  materialCopperOutside?: string | number;

  /**
   * 内层铜厚（需配置字典）
   */
  materialCopperInside?: string | number;

  /**
   * 产品备注
   */
  commodityRemark?: string;

  /**
   * 单片宽
   */
  singleWidth?: string | number;

  /**
   * 单片长
   */
  singleLength?: number;

  /**
   * 联片宽
   */
  unitedWidth?: string | number;

  /**
   * 联片长
   */
  unitedLength?: number;

  /**
   * 联片数量
   */
  unitedNumber?: number;

  /**
   * 联片方式长
   */
  unitedWayLength?: number;

  /**
   * 联片方式宽
   */
  unitedWayWidth?: string | number;

  /**
   * 阻焊颜色（需配置字典）
   */
  commoditySolder?: string;

  /**
   * 阻焊面数（需配置字典）
   */
  commoditySolderCount?: string;

  /**
   * 金厚
   */
  goldenThickness?: string;

  /**
   * 阻焊光泽（需配置字典）
   */
  commoditySolderGloss?: string;

  /**
   * 阻焊要求
   */
  commoditySolderRequirement?: string;

  /**
   * 孔铜厚
   */
  poreCopper?: string;

  /**
   * 字符颜色（需配置字典）
   */
  characterColor?: string;

  /**
   * 字符面数（需配置字典）
   */
  characterCount?: string;

  /**
   * 成形方式（需配置字典）
   */
  commodityForm?: string;

  /**
   * 字符要求
   */
  characterRequirement?: string;

  /**
   * SET打叉
   */
  setCross?: string;

  /**
   * 板翘曲度
   */
  warpagePlate?: string;

  /**
   * 测试方式（需配置字典）
   */
  commodityTestWay?: string;

  /**
   * 测试点
   */
  testPoint?: number;

  /**
   * 备品数量
   */
  spareQuantity?: number;

  /**
   * 铜箔
   */
  copperFoil?: string;

  /**
   * vcut
   */
  vCut?: string;

  /**
   * 过孔要求（需配置字典）
   */
  holeRequirement?: string;

  /**
   * 检验标准（需配置字典）
   */
  inspectionStandard?: string;

  /**
   * 金面积
   */
  goldArea?: number;

  /**
   * PP
   */
  pp?: string;

  /**
   * 镍厚
   */
  nickelThickness?: number;

  /**
   * 锡厚
   */
  tinThickness?: number;

  /**
   * 最小线宽
   */
  minLineWidth?: string | number;

  /**
   * 最小线距
   */
  minLineSpace?: number;

  /**
   * 最小孔径
   */
  minAperture?: number;

  /**
   * 总孔数
   */
  holeCount?: number;

  /**
   * 孔密度
   */
  holeDensity?: number;

  /**
   * 提交人
   */
  submitUserId?: string | number;

  /**
   * 提交时间
   */
  submitTime?: string;

  /**
   * 审核人
   */
  auditUserId?: string | number;

  /**
   * 审核时间
   */
  auditTime?: string;

  /**
   * 审核意见
   */
  auditComment?: string;

  /**
   * 客户PO
   */
  customerPo?: string;

  /**
   * 客户交期
   */
  deliveryTime?: string;

  /**
   * 发货日期
   */
  dispatchTime?: string;

  /**
   * 订单数量
   */
  quantity?: number;

  /**
   * 加急（需配置字典）
   */
  urgent?: string;

  /**
   * 面积
   */
  area?: number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 平米价
   */
  areaPrice?: number;

  /**
   * 订单类型（需配置字典）
   */
  orderType?: string;

  /**
   * 含税总价
   */
  totalPrice?: number;

  /**
   * 不含税总价
   */
  totalOrderPrice?: number;

  /**
   * 税金
   */
  tax?: number;

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
   * 流程状态（需配置字典）
   */
  flowStatus?: string;

  /**
   * 订单状态（需配置字典）
   */
  status?: string;

  /**
   * 成品板厚（需配置字典）
   */
  commodityThickness?: string;

  /**
   * 业务员名称
   */
  cusSaleUserName?: string;

  /**
   * 提交人名称
   */
  submitUserName?: string;

  /**
   * 审核人名称
   */
  auditUserName?: string;

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
   * 客户名称
   */
  cusName?: string;

    /**
     * 日期范围参数
     */
    params?: any;

  /**
   * 退货单价(元/pcs)
   */
  scrapSinglePrice?: number;

  /**
   *退货分类
   */
  backType?: number;

  /**
   * 退货原因
   */
  reason?: string;

  /**
   * 退货数量
   */
  returnQuantity?: number;

  /**
   *已退货数量
   */
  alreadyReturnQuantity?: number;

  /**
   *送货数量
   */
  deliveryQuantity?: number;

  /**
   *可退货数量
   */
  canReturnQuantity?: number;
}



