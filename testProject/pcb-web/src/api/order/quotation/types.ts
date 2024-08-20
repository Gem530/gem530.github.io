
export interface DirectQuotation extends BaseEntity{
  id: string | number;
  baseCustomerBo: {};
  DirectQuotation:[];
}

export interface QuotationVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 报价单号
   */
  code: string;

  /**
   * 报价时间
   */
  quotationTime: string;

  /**
   * 客户ID
   */
  cusId: string | number;

  /**
   * 客户名称
   */
  cusName: string;

  /**
   * 产品名称
   */
  commodityName: string;

  /**
   * 产品类型（需配置字典）
   */
  commodityType: string;

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
   * 成品板厚（需配置字典）
   */
  commodityThickness: string;

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
  unitedWidth: string | number;

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
  unitedWayWidth: string | number;

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
   * 提交人名称
   */
  submitUserName: string;

  /**
   * 提交时间
   */
  submitTime: string;

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
   * 状态状态（1-待报价，2-已报价，3-已作废
   */
  status: string;

  /**
   * 预审单id
   */
  saleAuditId: string | number;

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

  otherCostList:[];

}

export interface QuotationForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 报价单号
   */
  code?: string;

  /**
   * 外形要求
   */
  appearanceRequirements?: string;

  /**
   * 报价时间
   */
  quotationTime?: string;

  /**
   * 客户ID
   */
  cusId?: string | number;

  /**
   * 客户名称
   */
  cusName?: string;

  /**
   * 产品名称
   */
  commodityName?: string;

  /**
   * 产品类型（需配置字典）
   */
  commodityType?: string;

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
   * 版本号
   */
  version?: string | number;

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
   * 成品板厚（需配置字典）
   */
  commodityThickness?: string;

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
   * 测试架
   */
  testFrame?: string | number;

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
   * 提交人名称
   */
  submitUserName?: string;

  /**
   * 提交时间
   */
  submitTime?: string;

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
   * 状态状态（1-待报价，2-已报价，3-已作废
   */
  status?: string;

  /**
   * 预审单id
   */
  saleAuditId?: string | number;

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

  otherCostList: [];
  /**
   * 文件集合
   */
  quotationFileList:[];

}

export interface QuotationQuery extends PageQuery {

  /**
   * 报价单号
   */
  code?: string;

  /**
   * 报价时间
   */
  quotationTime?: string;

  /**
   * 客户ID
   */
  cusId?: string | number;

  /**
   * 客户名称
   */
  cusName?: string;

  /**
   * 产品名称
   */
  commodityName?: string;

  /**
   * 产品类型（需配置字典）
   */
  commodityType?: string;

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
   * 成品板厚（需配置字典）
   */
  commodityThickness?: string;

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
   * 提交人名称
   */
  submitUserName?: string;

  /**
   * 提交时间
   */
  submitTime?: string;

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
   * 状态状态（1-待报价，2-已报价，3-已作废
   */
  status?: string;

  /**
   * 预审单id
   */
  saleAuditId?: string | number;

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
     * 日期范围参数
     */
    params?: any;

  otherCostList:[];
  /**
   * 文件集合
   */
  quotationFileList:[];
}



