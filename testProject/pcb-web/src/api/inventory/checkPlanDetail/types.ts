export interface CheckPlanDetailVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 产品/物料ID
   */
  bizId: string | number;

  /**
   * 类型（1盘盈，2盘亏）
   */
  type: string;

  /**
   * 盘点数量
   */
  checkQuantity: number;

  /**
   * 复盘数量
   */
  replayQuantity: number;

  /**
   * 库存数量
   */
  inventoryQuantity: number;

  /**
   * 库存成本
   */
  inventoryCost: number;

  /**
   * 盘点计划表id
   */
  inventoryCheckPlanId: string | number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 物料编码
   */
  rawMaterialCode: string;

  /**
   * 物料类别名称
   */
  categoryName: string;

  /**
   * 物料名称
   */
  materialName: string;

  /**
   * 单位
   */
  units: string;

  /**
   * 材质牌号
   */
  materialQuality: string;

  /**
   * 铜厚
   */
  copperThickness: string;

  /**
   * 颜色
   */
  color: string;

  /**
   * 级别
   */
  level: string;

  /**
   * 长
   */
  length: string | number;

  /**
   * 宽
   */
  width: string | number;

  /**
   * 品牌
   */
  manufacturer: string;

  /**
   * 客户编码
   */
  customerCode: string;

  /**
   * 产品编码
   */
  commodityCode: string;

  /**
   * 产品名称
   */
  commodityName: string;

  /**
   * 仓库名称
   */
  storageName: string;
}

export interface CheckPlanDetailForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 产品/物料ID
   */
  bizId?: string | number;

  /**
   * 类型（1盘盈，2盘亏）
   */
  type?: string;

  /**
   * 盘点数量
   */
  checkQuantity?: number;

  /**
   * 复盘数量
   */
  replayQuantity?: number;

  /**
   * 库存数量
   */
  inventoryQuantity?: number;

  /**
   * 库存成本
   */
  inventoryCost?: number;

  /**
   * 盘点计划表id
   */
  inventoryCheckPlanId?: string | number;

  /**
   * 备注
   */
  remark?: string;

}

export interface CheckPlanDetailQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 产品/物料ID
   */
  bizId?: string | number;

  /**
   * 类型（1盘盈，2盘亏）
   */
  type?: string;

  /**
   * 盘点数量
   */
  checkQuantity?: number;

  /**
   * 复盘数量
   */
  replayQuantity?: number;

  /**
   * 库存数量
   */
  inventoryQuantity?: number;

  /**
   * 库存成本
   */
  inventoryCost?: number;

  /**
   * 盘点计划表id
   */
  inventoryCheckPlanId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



