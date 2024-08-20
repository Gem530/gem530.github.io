export interface ScrapRecordVO {
  /**
   * $column.columnComment
   */
  id: string | number;

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
   * 报废类型（生产报废、成品报废、半成品报废）
   */
  type: string;

  /**
   * 报废数量
   */
  quantity: number;

  /**
   * 业务ID
   */
  bizId: string | number;

  /**
   * 业务ID
   */
  code: string;


  /**
   * 备注
   */
  remark: string;

  /**
   * 责任人ID
   */
  responsibleUserId: string | number;
  /**
   * 责任人名称
   */
  responsibleUserName: string;

  /**
   * 报废工艺id
   */
  craftId: string | number;

  /**
   * 责任人部门id
   */
  responsibleDeptId: string | number;
  /**
   * 责任人部门名称
   */
  responsibleDeptName: string;

}

export interface ScrapRecordForm extends BaseEntity {
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
   * 报废类型（生产报废、成品报废、半成品报废）
   */
  type?: string;

  /**
   * 报废数量
   */
  quantity?: number;

  /**
   * 业务ID
   */
  bizId?: string | number;

  /**
   * 业务ID
   */
  code?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 责任人ID
   */
  responsibleUserId?: number;
  /**
   * 责任人名称
   */
  responsibleUserName?: string;

  /**
   * 报废工艺id
   */
  craftId?: any;

  /**
   * 责任人部门id
   */
  responsibleDeptId?: number;
  /**
   * 责任人部门名称
   */
  responsibleDeptName?: string;

}

export interface ScrapRecordQuery extends PageQuery {

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
   * 报废类型（生产报废、成品报废、半成品报废）
   */
  type?: string;

  /**
   * 报废数量
   */
  quantity?: number;

  /**
   * 业务ID
   */
  bizid?: string | number;

  /**
   * 业务ID
   */
  code?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



