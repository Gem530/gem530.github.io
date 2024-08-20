export interface EquipmentUserVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 设备id
   */
  equipmentId: string | number;

  /**
   * 设备负责人id
   */
  userId: string | number;

  /**
   * 备注
   */
  remark: string;

}

export interface EquipmentUserForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 设备id
   */
  equipmentId?: string | number;

  /**
   * 设备负责人id
   */
  userId?: string | number;

  /**
   * 备注
   */
  remark?: string;

}

export interface EquipmentUserQuery extends PageQuery {

  /**
   * 设备id
   */
  equipmentId?: string | number;

  /**
   * 设备负责人id
   */
  userId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



