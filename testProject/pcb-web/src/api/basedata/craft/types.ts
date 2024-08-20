export interface CraftVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 工艺名称
   */
  craftName: string;

  /**
   * 编码
   */
  code: string;
  /**
   * 是否可以外协1否 2是
   */
  // canOutsource: number;

  /**
   * 是否自动过数1 否 2是
   */
  // voluntarilyCount: number;



  /**
   * 工艺负责角色
   */
  craftRoleNames: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 工艺参数字符拼接
   */
  craftParamerConfigStr: string;
  /**
   * 工艺参数数组
   */
  craftParameterConfigs:[];


  selectConfigs:[];

  /**
   * 工艺id
   */
  craftId: number | string;

  /**
   * 工艺使用状态 0 1
   */
  status: string;

  /**
   * 工艺已关联设备id
   */
  equipmentIds: [];
  /**
   * 工艺已关联设备信息
   */
  equipmentVoList: [];

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
   * 是否可以外协
   */
  isOutSource: string;

  /**
   * 是否自动过数
   */
  isAutoWip: string;

  /**
   * 公共备注
   */
  publicDefaultRemark: string;

  /**
   * WIP显示别名
   */
  wipName: string;

  /**
   * 是否启用
   */
  isOpen: string;


}

export interface CraftForm extends BaseEntity {
  /**
   *
   */
  id?: string | number;


  /**
   * 分配人员
   */
  staffAllocation?: string;
  code?: string;
  /**
   * 工艺负责角色
   */
  managerRole?: string;

  /**
   * 备注
   */
  remark?: string;

  craftParameterConfigs?: any;
  craftId: number | string;


  roleIds?: [];

  deptIds?: [];

  /**
   * 工艺使用状态 0 1
   */
  status: string;

  /**
   * 是否可以外协
   */
  isOutSource?: string;

  /**
   * 是否自动过数
   */
  isAutoWip?: string;

  /**
   * 公共备注
   */
  publicDefaultRemark?: string;

  /**
   * WIP显示别名
   */
  wipName?: string;

  /**
   * 是否启用
   */
  isOpen?: string;

  /**
   * 配置
   */
  configs?: [];


}

export interface CraftQuery extends PageQuery {
  /**
   * 是否可以外协1否 2是
   */
  canOutsource?: number;

  /**
   * 是否自动过数1 否 2是
   */
  voluntarilyCount?: number;

  /**
   * 分配人员
   */
  staffAllocation?: string;

  /**
   * 工艺负责角色
   */
  managerRole?: string;

  /**
   * 日期范围参数
   */
  params?: any;

  equipmentIds?: any;
  craftId: number | string;
}



