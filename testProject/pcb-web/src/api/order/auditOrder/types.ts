export interface AuditOrderVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 预审单编号
   */
  code: string;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 产品名称
   */
  commodityName: string;

  /**
   * 产品类型
   */
  commodityType: string;

  /**
   * 表面处理（需配置字典）
   */
  surfaceTreatment: string;

  /**
   * 板层（需配置字典）
   */
  materialLayer: string;

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
   * 预审备注
   */
  remark: string;

  /**
   * 预审状态
   */
  status: string;

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

}

export interface AuditOrderForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 预审单编号
   */
  code?: string;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 客户名称
   */
  customerName?: string | number;

  /**
   * 产品名称
   */
  commodityName?: string;

  /**
   * 产品类型
   */
  commodityType?: string;

  /**
   * 表面处理（需配置字典）
   */
  surfaceTreatment?: string;

  /**
   * 板层（需配置字典）
   */
  materialLayer?: string;

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
  finishedPlateThickness?: string | number;

  /**
   * 外层铜厚（需配置字典）
   */
  materialCopperOutside?: string | number;

  /**
   * 内层铜厚（需配置字典）
   */
  materialCopperInside?: string | number;

  /**
   * 预审备注
   */
  remark?: string;

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
  unitedWayLength?: string;

  /**
   * 联片方式宽
   */
  unitedWayWidth?: string;

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
   * 测试架（需配置字典）
   */
  testStand?: string;

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
   * 外形要求
   */
  appearanceRequirements?: string;

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
   * 测试架
   */
  testFrame?: string | number;

}

export interface AuditOrderQuery extends PageQuery {

  /**
   * 预审单编号
   */
  code?: string;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 产品名称
   */
  commodityName?: string;

  /**
   * 客户编码
   */
  customerCode?: string;
  /**
   * 产品类型
   */
  commodityType?: string;

  /**
   * 制单人
   */
  userName?: string;

  /**
   * 表面处理（需配置字典）
   */
  surfaceTreatment?: string;

  /**
   * 板层（需配置字典）
   */
  materialLayer?: string;

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
     * 日期范围参数
     */
    params?: any;



}



