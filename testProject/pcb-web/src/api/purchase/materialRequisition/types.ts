export interface MaterialRequisitionVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 物料ID
   */
  rawMaterialId: string | number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 领用备注
   */
  remark: string;

  /**
   * 领用记录单单号
   */
  code: string;

  /**
   * 领用记录单状态
   */
  status: string;

  /**
   * 审核备注
   */
  checkRemark: string;

  /**
   * 审核时间
   */
  checkTime: string;

  /**
   * 审核人
   */
  checkUser: number;

  /**
   * 审核人名称
   */
  checkUserName: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

}

export interface MaterialRequisitionForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 领用备注
   */
  remark?: string;

  /**
   * 领用记录单单号
   */
  code?: string;

  /**
   * 领用记录单状态
   */
  status?: string;

  /**
   * 审核备注
   */
  checkRemark?: string;

  /**
   * 审核时间
   */
  checkTime?: string;

  /**
   * 审核人
   */
  checkUser?: number;

  /**
   * 审核人名称
   */
  checkUserName?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

}

export interface MaterialRequisitionQuery extends PageQuery {

  /**
   * 物料ID
   */
  rawMaterialId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 领用记录单单号
   */
  code?: string;

  /**
   * 领用记录单状态
   */
  status?: string;

  /**
   * 审核备注
   */
  checkRemark?: string;

  /**
   * 审核时间
   */
  checkTime?: string;

  /**
   * 审核人
   */
  checkUser?: number;

  /**
   * 审核人名称
   */
  checkUserName?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



