import { delCommodity } from "@/api/order/commodity";

export interface InOutRecordVO {
  /**
   * 主键id
   */
  id: string | number;

  /**
   * 产品ID
   */
  rawMaterialId: string | number;

  /**
   * 仓库ID
   */
  storageId: string | number;

  /**
   * 数量
   */
  quantity: number | string;

  /**
   * 出入库时间
   */
  intOutTime: string;

  /**
   * 类型（订单外协收货入库、订单外协退货出库、生产入库、订单出库、退货入库、盘点入库、盘点出库、成品报废）
   */
  type: string;

  /**
   * 业务ID
   */
  bizId: string | number;

  /**
   * 出入库记录编号
   */
  no: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  code: string;

}

export interface InOutRecordForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  /**
   * 产品ID
   */
  rawMaterialId?: string | number;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 出入库时间
   */
  intOutTime?: string;

  /**
   * 类型（订单外协收货入库、订单外协退货出库、生产入库、订单出库、退货入库、盘点入库、盘点出库、成品报废）
   */
  type?: string;

  /**
   * 业务ID
   */
  bizId?: string | number;

  /**
   * 出入库记录编号
   */
  no?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

}

export interface InOutRecordQuery extends PageQuery {

  /**
   * 产品ID
   */
  rawMaterialId?: string | number;

  /**
   * 仓库ID
   */
  storageId?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 出入库时间
   */
  intOutTime?: string;

  /**
   * 类型（订单外协收货入库、订单外协退货出库、生产入库、订单出库、退货入库、盘点入库、盘点出库、成品报废）
   */
  type?: string;

  /**
   * 业务ID
   */
  bizId?: string | number;

  /**
   * 出入库记录编号
   */
  no?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}

export enum InOutRecordTypeEnum {
  /**
    * 订单外协收货入库
    */
  OUTSOURCE_RECEIVE = "1",
  /**
   * 订单外协退货出库
   */
  OUTSOURCE_RETURN = "2",
  /**
   * 生产入库
   */
  PRODUCTION_IN = "3",
  /**
   * 订单出库
   */
  ORDER_OUT = "4",
  /**
   * 退货入库
   */
  RETURN_IN = "5",
  /**
   * 盘点入库
   */
  CHECK_IN = "6",
  /**
   * 盘点出库
   */
  CHECK_OUT = "7",
  /**
   * 成品报废
   */
  SCRAP = "8",
}


