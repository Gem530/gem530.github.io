export interface SourceOrderDetailVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 外协接单加工单ID
   */
  outSourceOrderId: string | number;

  /**
   * 产品型号
   */
  commodityCode: string;

  /**
   * 长
   */
  length: number;

  /**
   * 宽
   */
  width: string | number;

  /**
   * 数量
   */
  quantity: number;

  /**
   * 单位(1PNL，2SET，3大料)
   */
  unit: string;

  /**
   * 工序ID
   */
  outSourceCraftId: string | number;

  /**
   * 加工部门ID
   */
  processDeptId: string | number;

  /**
   * 加工要求
   */
  requirement: string;

  /**
   * 备注
   */
  remark: string;

}

export interface SourceOrderDetailForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 外协接单加工单ID
   */
  outSourceOrderId?: string | number;

  /**
   * 产品型号
   */
  commodityCode?: string;

  /**
   * 长
   */
  length?: number;

  /**
   * 宽
   */
  width?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单位(1PNL，2SET，3大料)
   */
  unit?: string;

  /**
   * 工序ID
   */
  outSourceCraftId?: string | number;

  /**
   * 加工部门ID
   */
  processDeptId?: string | number;

  /**
   * 加工要求
   */
  requirement?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface SourceOrderDetailQuery extends PageQuery {

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 外协接单加工单ID
   */
  outSourceOrderId?: string | number;

  /**
   * 产品型号
   */
  commodityCode?: string;

  /**
   * 长
   */
  length?: number;

  /**
   * 宽
   */
  width?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 单位(1PNL，2SET，3大料)
   */
  unit?: string;

  /**
   * 工序ID
   */
  outSourceCraftId?: string | number;

  /**
   * 加工部门ID
   */
  processDeptId?: string | number;

  /**
   * 加工要求
   */
  requirement?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



