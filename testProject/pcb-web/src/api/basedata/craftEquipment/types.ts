export interface CraftEquipmentVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 工艺id
   */
  craftId: string | number;

  /**
   * 设备id
   */
  equipmentId: string | number;

  /**
   * 备注
   */
  remark: string;

}

export interface CraftEquipmentForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 工艺id
   */
  craftId?: string | number;

  /**
   * 设备id
   */
  equipmentId?: string | number;

  /**
   * 备注
   */
  remark?: string;

}

export interface CraftEquipmentQuery extends PageQuery {

  /**
   * 工艺id
   */
  craftId?: string | number;

  /**
   * 设备id
   */
  equipmentId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



