export interface SourceHalfProcessOrderVO {
  /**
   * 主键id
   */
  id: string | number;
  /**
   * MI工艺单ID
   */
  planId: string | number;
  /**
   * 产品编码
   */
  commodityCode: string;
  /**
   * 订单ID
   */
  saleOrderId: string | number;

  /**
   * 供应商ID
   */
  supplierId: string | number;

  /**
   * 单价
   */
  price: number;

  /**
   * 总金额
   */
  totalPrice: number;

  /**
   * 地址ID
   */
  addressId: string | number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 收货数量
   */
  receiveQuantity: number;

  /**
   * 下单时间
   */
  placeOrderTime: string;

  /**
   * 完成时间
   */
  completeTime: string;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 外发单位（大料、PNL、SET）
   */
  unit: string;

  /**
   * 流转卡ID
   */
  productionCardId: string | number;

  /**
   * 排产单ID
   */
  productionId: string | number;

  productionCode: string;

  /**
   * 工艺ID
   */
  craftId: string | number;

  /**
   * 产品ID
   */
  commodityId: string | number;

  /**
   * 外发类型（PNLA、PNLB、大料、产品编号这些，存字符串）
   */
  type: string;

  /**
   * 加工要求
   */
  requirement: string;

  /**
   * 数量
   */
  quantity: number;

  /**
   *长
   */
  length: number;

  /**
   * 宽
   */
  width: string | number;

  /**
   * 工艺名称
   */
  craftName: string;
  /**
   * 排产单集合
   */
  planProductionList: any[];

  /**
   * 产品集合
   */
  planCommodityList: any[];
  /**
   * pnl集合
   */
  planPnlList: any[];
  /**
   * 大料集合
   */
  planSchemeList: any[];
}

export interface SourceHalfProcessOrderForm extends BaseEntity {
  /**
   * 主键id
   */
  id?: string | number;

  index: number;

  /**
   * 供应商ID
   */
  supplierId?: string | number;
  /**
   * 产品编码
   */
  commodityCode?: string;
  /**
   * 工艺单id
   */
  planId?: string | number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 地址ID
   */
  addressId?: string | number;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 编号
   */
  code?: string;

  /**
   * 收货数量
   */
  receiveQuantity?: string | number;
  quantity?: string | number;
  maxQuantity?: string | number;
  length?: string | number;
  width?: string | number;

  /**
   * 下单时间
   */
  placeOrderTime?: string;

  /**
   * 完成时间
   */
  completeTime?: string;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 外发单位（大料、PNL、SET）
   */
  unit?: string;

  /**
   * 流转卡ID
   */
  productionCardId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;
  productionCode?: string;

  /**
   * 工艺ID
   */
  craftId?: string | number;
  craftName?: string;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 外发类型id
   */
  type?: string | number;

  /**
   * 加工要求
   */
  requirement?: string;

  /**
   * 确认备注
   */
  confirmRemark?: string;
}

export interface SourceHalfProcessOrderQuery extends PageQuery {
  /**
   * 供应商ID
   */
  supplierId?: string | number;

  /**
   * 单价
   */
  price?: number;

  /**
   * 总金额
   */
  totalPrice?: number;

  /**
   * 地址ID
   */
  addressId?: string | number;

  /**
   * 编号
   */
  code?: string;

  /**
   * 收货数量
   */
  receiveQuantity?: number;

  /**
   * 下单时间
   */
  placeOrderTime?: string;

  /**
   * 完成时间
   */
  completeTime?: string;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 外发单位（大料、PNL、SET）
   */
  unit?: string;

  /**
   * 流转卡ID
   */
  productionCardId?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 工艺ID
   */
  craftId?: string | number;

  /**
   * 产品ID
   */
  commodityId?: string | number;

  /**
   * 外发类型（PNLA、PNLB、大料、产品编号这些，存字符串）
   */
  type?: string;

  /**
   * 加工要求
   */
  requirement?: string;

  /**
   * 大料数量
   */
  schemeQuantity?: number;

  /**
   * 大料长
   */
  schemeLength?: number;

  /**
   * 大料宽
   */
  schemeWidth?: string | number;

  /**
   * PNL数量
   */
  pnlQuantity?: number;

  /**
   * PNL长
   */
  pnlLength?: number;

  /**
   * PNL宽
   */
  pnlWidth?: string | number;

  /**
   * SET数量
   */
  setQuantity?: number;

  /**
   * SET长
   */
  setLength?: number;

  /**
   * SET宽
   */
  setWidth?: string | number;

  /**
   * 数量
   */
  quantity?: number;

  /**
   * 确认状态（1待甲方确认、2待已方确认、3已完成）
   */
  confirmStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
export enum ReduceCraftNameENUM {
  BM = '表面处理',
  BMH = '表面后处理',
  TXDD = '图形电镀',
  QBDD = '全板电镀',
  CJ = '沉金',
  WCZK = '外层钻孔',
}
export enum ReduceReqNameENUM {
  TYPE_BM = 'SurfaceTreatment_Type',
  TYPE_BMH = '后处理工艺',
  CJ = '沉金',
  YQPX = '有铅喷锡',
  WQPX = '无铅喷锡',
  OSP = 'OSP'
}
export enum ReduceCodeENUM {
  BM = '表面',
  GX_OUT_BM_PX = 'GX_OUT_BM_PX', //表面处理喷锡工序备注
  GX_OUT_PNL_BM_CJ = 'GX_OUT_PNL_BM_CJ', //外协PNL表面沉金扣减
  GX_OUT_PNL_BM_OSP = 'GX_OUT_PNL_BM_OSP', //外协PNL OSP扣减
  GX_OUT_PNL_BM_WQPX = 'GX_OUT_PNL_BM_WQPX', //外协PNL无铅喷锡扣减
  GX_OUT_PNL_BM_YQPX = 'GX_OUT_PNL_BM_YQPX', //外协PNL有铅喷锡扣减
  GX_OUT_PNL_CJ = 'GX_OUT_PNL_CJ', //外协PNL沉金扣减
  GX_OUT_PNL_QBDD = 'GX_OUT_PNL_QBDD', //外协PNL 全板电镀
  GX_OUT_PNL_TXDD = 'GX_OUT_PNL_TXDD', //外协PNL 全板电镀
  GX_OUT_SET_BM_CJ = 'GX_OUT_SET_BM_CJ', //外协SET表面沉金扣减
  GX_OUT_SET_BM_OSP = 'GX_OUT_SET_BM_OSP', //外协SET OSP扣减
  GX_OUT_SET_BM_WQPX = 'GX_OUT_SET_BM_WQPX', //外协SET无铅喷锡扣减
  GX_OUT_SET_BM_YQPX = 'GX_OUT_SET_BM_YQPX' //外协SET有铅喷锡扣减
}
