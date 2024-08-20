export interface EquipmentVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 设备编码
   */
  equipmentCode: string;

  /**
   * 设备名称
   */
  equipmentName: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 状态
   */
  delFlag: string;
}

export interface EquipmentForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 设备编码
   */
  equipmentCode?: string;

  /**
   * 设备名称
   */
  equipmentName?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 状态
   */
  delFlag?: string;

  /**
   * 负责人
   */
  equipmentList?: [];
  
  /**
   * 工艺
   */
  craftList?: [];
}

export interface EquipmentQuery extends PageQuery {

  /**
   * 设备编码
   */
  equipmentCode?: string;

  /**
   * 设备名称
   */
  equipmentName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



