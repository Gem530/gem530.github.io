import { List } from "echarts";

export interface EcnVO {
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
   * 通知单编号
   */
  no: string;

  /**
   * 产品id
   */
  commodityId: string | number;

  /**
   * 产品编号
   */
  commodityNo: string;

  /**
   * 产品名称
   */
  commodityName: string;
  
  /**
   * 客户编号
   */
  customerCode: string;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 是否完结（1-完结，2-未完结）
   */
  isFinish: string;

  /**
   * 产品新编码
   */
  commodityNewNo: string;

  /**
   * 是否内部更改
   */
  isSelfChange: string;

  /**
   * 是否客户更改
   */
  isCustomerChange: string;

  /**
   * 变更原因
   */
  changeReason: string;

  /**
   * 变更项目
   */
  changeItem: string;

  /**
   * 生效时间节点
   */
  effectiveNode:  string;

  /**
   * 原有产品处理意见
   */
  originCommodityHanding: string;

  /**
   * 通知部门
   */
  notifyDep: string;

  /**
   * 治工具菲林
   */
  toolFilin:  string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 通知日期
   */
  notifyTime: string;

}

export interface EcnForm extends BaseEntity {
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
   * 通知单编号
   */
  no?: string;

  /**
   * 产品id
   */
  commodityId?: string | number;

  /**
 * 产品编号
 */
  commodityNo?: string;

  /**
   * 产品名称
   */
  commodityName?: string;
  /**
   * 客户编号
   */
  
  customerCode?: string;
  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 是否完结（1-完结，2-未完结）
   */
  isFinish?: string;

  /**
   * 产品新编码
   */
  commodityNewNo?: string;

  /**
   * 是否内部更改
   */
  isSelfChange?: string;

  /**
   * 是否客户更改
   */
  isCustomerChange?: string;

  /**
   * 变更原因
   */
  changeReason?: string;

  /**
   * 变更项目
   */
  changeItem?: changeItemVO[] | string;

  /**
   * 生效时间节点
   */
  effectiveNode?: string[] | string;

  /**
   * 原有产品处理意见
   */
  originCommodityHanding?: string;

  /**
   * 通知部门
   */
  notifyDep?: string[] | string;

  /**
   * 治工具菲林
   */
  toolFilin?: FLItemVO[] | string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 通知日期
   */
  notifyTime?: string;

}

export interface EcnQuery extends PageQuery {

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
   * 通知单编号
   */
  no?: string;

  /**
   * 产品id
   */
  commodityId?: string | number;

  /**
 * 产品编号
 */
  commodityNo?: string;

  /**
   * 产品名称
   */
  commodityName?: string;
  /**
   * 客户编号
   */
  
  customerCode?: string;
  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 是否完结（1-完结，2-未完结）
   */
  isFinish?: string;

  /**
   * 产品新编码
   */
  commodityNewNo?: string;

  /**
   * 是否内部更改
   */
  isSelfChange?: string;

  /**
   * 是否客户更改
   */
  isCustomerChange?: string;

  /**
   * 变更原因
   */
  changeReason?: string;

  /**
   * 变更项目
   */
  changeItem?: string;

  /**
   * 生效时间节点
   */
  effectiveNode?: string;

  /**
   * 原有产品处理意见
   */
  originCommodityHanding?: string;

  /**
   * 通知部门
   */
  notifyDep?: string;

  /**
   * 治工具菲林
   */
  toolFilin?: string;

  /**
   * 通知日期
   */
  notifyTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface changeItemVO {
  id: number;
  itemName: string;
  content: string;
  craftId: number;
  craftName: string;
}
export interface FLItemVO {
  id: number;
  itemName: string;
  content: string;
}

