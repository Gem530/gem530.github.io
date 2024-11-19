export interface PendingVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 所属配置ID
   */
  configId: string | number;

  /**
   * 来源单据ID
   */
  bizId: string | number;

  /**
   * 是否完成代办（0未完成 1已完成）
   */
  status: string;

  /**
   * 菜单ID
   */
  menuId: string | number;

  /**
   * 类型(1待审核 2待我方确认)
   */
  type: string;

  /**
   * 代办角色id集合
   */
  verifyRole: string;

  /**
   * 页面跳转参数
   */
  param: string;

  /**
   * 是否发送通知（0不发送 1发送）
   */
  notifySwitch: string;

  /**
   * 代办处理人数
   */
  dealNum: number;

  /**
   * 是否一人审批直接完成 (0否 1是)
   */
  oneStepFinish: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 来源单据编号
   */
  bizNo?: string;

  /**
   * 归属分类
   */
  category?: string;

  /**
   * 标题
   */
  title?: string;
}

export interface PendingForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 所属配置ID
   */
  configId?: string | number;

  /**
   * 来源单据ID
   */
  bizId?: string | number;

  /**
   * 是否完成代办（0未完成 1已完成）
   */
  status?: string;

  /**
   * 菜单ID
   */
  menuId?: string | number;

  /**
   * 类型(1待审核 2待我方确认)
   */
  type?: string;

  /**
   * 代办角色id集合
   */
  verifyRole?: string;

  /**
   * 页面跳转参数
   */
  param?: string;

  /**
   * 是否发送通知（0不发送 1发送）
   */
  notifySwitch?: string;

  /**
   * 代办处理人数
   */
  dealNum?: number;

  /**
   * 是否一人审批直接完成 (0否 1是)
   */
  oneStepFinish?: string;

  /**
   * 所属单位ID
   */
  ownerId: string | number;

  /**
   * 来源单据编号
   */
  bizNo: string;

  /**
   * 归属分类
   */
  category: string;

  /**
   * 标题
   */
  title: string;
}

export interface PendingQuery extends PageQuery {

  /**
   * 所属配置ID
   */
  configId?: string | number;

  /**
   * 来源单据ID
   */
  bizId?: string | number;

  /**
   * 是否完成代办（0未完成 1已完成）
   */
  status?: string;

  /**
   * 菜单ID
   */
  menuId?: string | number;

  /**
   * 类型(1待审核 2待我方确认)
   */
  type?: string;

  /**
   * 代办角色id集合
   */
  verifyRole?: string;

  /**
   * 页面跳转参数
   */
  param?: string;

  /**
   * 是否发送通知（0不发送 1发送）
   */
  notifySwitch?: string;

  /**
   * 代办处理人数
   */
  dealNum?: number;

  /**
   * 是否一人审批直接完成 (0否 1是)
   */
  oneStepFinish?: string;

  /**
   * 所属单位ID
   */
  ownerId?: string | number;

  /**
   * 来源单据编号
   */
  bizNo?: string;

  /**
   * 归属分类
   */
  category?: string;

  /**
   * 标题
   */
  title?: string;
    /**
     * 日期范围参数
     */
    params?: any;
}

export interface PendingCategoryItem {
  code: string;
  name: string;
}

export const PendingCategory: Record<keyof typeof PendingCategory, PendingCategoryItem> = {
  ORDER: { code: '1', name: '销售' },
  INVENTORY: { code: '3', name: '库存' },
  PURCHASE: { code: '4', name: '采购' },
  ENGINEERING: { code: '5', name: '工程' },
  PRODUCTION: { code: '6', name: '生产' },
  OUTSOURCE: { code: '7', name: '外协' },
  QUALITY: { code: '8', name: '品质' },
  FINANCIAL: { code: '9', name: '财务' },
  ADMINISTRATIVE: { code: '10', name: '行政' },
  OTHER: { code: '99', name: '其他' }
};

// export interface PendingTypeItem {
//   value: string;
//   desc: string;
// }

// export const PendingType: Record<keyof typeof PendingType, PendingTypeItem> = {
//   WAIT_AUDIT: { code: '1', name: '待审核' },
//   WAIT_ONE_CONFIRM: { code: '2', name: '待确认' },
//   WAIT_PRICE: { code: '3', name: '待报价' },
//   WAIT_DELIVERY: { code: '4', name: '待发货' },
//   WAIT_RECEIVE: { code: '5', name: '待收货' },
//   WAIT_HANDLE: { code: '6', name: '待受理' },
//   WAIT_PROCESS: { code: '7', name: '待处理' },
//   WAIT_RECONCILIATION: { code: '8', name: '待对账' },
//   WAIT_PUT_INTO_STORAGE: { code: '9', name: '待入库' }
// };


// export interface PendingMenuConfigItem {
//   // 菜单id
//   id: number;
//   // 菜单名称
//   name: string;
//   // 模块分类
//   category: keyof typeof PendingCategory;
//   // 单据标题描述
//   desc: string;
//   // 单据类型
//   type: string;
// }

// export const PendingMenuConfig: Record<keyof typeof PendingMenuConfig, PendingMenuConfigItem> = {
//   DELIVERY_RECORD: { id: '1738512482984468482', name: '订单发货', category: 'ORDER', desc: '订单', type: 'WAIT_DELIVERY' },
//   QUOTATION: { id: '1705068787214114236', name: '报价下单', category: 'ORDER', desc: '报价单', type: 'WAIT_PRICE' },
//   ORDER_PREDICTION: { id: '1717825836951818242', name: '订单预投', category: 'ORDER', desc: '预投单', type: 'WAIT_AUDIT' },
//   ORDER_BACK_HANDLE: { id: '1706211472286363650', name: '退货产品处理', category: 'INVENTORY', desc: '退货', type: 'WAIT_AUDIT' },
//   MATERIAL_BACK_DETAIL: { id: '1707270616818807451', name: '物料退货', category: 'INVENTORY', desc: '退货', type: 'WAIT_AUDIT' },
//   MATERIAL_BORROW: { id: '1707270616818809654', name: '借料管理', category: 'INVENTORY', desc: '借料', type: 'WAIT_AUDIT' },
//   MATERIAL_REQUISITION: { id: '1772819910130118658', name: '领料管理', category: 'INVENTORY', desc: '领料', type: 'WAIT_AUDIT' },
//   PURCHASE_ORDER: { id: '1707230669030191105', name: '采购订单', category: 'PURCHASE', desc: '采购单', type: 'WAIT_ONE_CONFIRM' },
//   SUP_PURCHASE_ORDER: { id: '1790587065150902273', name: '供应商采购合同', category: 'PURCHASE', desc: '采购合同', type: 'WAIT_ONE_CONFIRM' },
//   PURCHASE_MATERIAL_DELIVERY: { id: '1790264457834614786', name: '供应商物料送货', category: 'PURCHASE', desc: '订单', type: 'WAIT_DELIVERY' },
//   MATERIAL_RECEIPT: { id: '1707270616818806785', name: '物料收货', category: 'PURCHASE', desc: '物料', type: 'WAIT_RECEIVE' },
//   PURCHASE_DELIVERY_CONFIRM: { id: '1810919693271511041', name: '物料送货确认', category: 'PURCHASE', desc: '送货单', type: 'WAIT_ONE_CONFIRM' },
//   SUPPLIER_MATERIAL_BACK: { id: '1791388987390885890', name: '物料退货确认', category: 'PURCHASE', desc: '退货单', type: 'WAIT_ONE_CONFIRM' },
//   MI_AUDIT: { id: '1722137084002656257', name: 'MI工艺单审核', category: 'ENGINEERING', desc: 'MI单', type: 'WAIT_AUDIT' },
//   PRODUCTION_FEED: { id: '1726910015932657665', name: '生产投料', category: 'PRODUCTION', desc: '投料', type: 'WAIT_AUDIT' },
//   PRODUCTION_STORAGE: { id: '1735909555387838466', name: '生产入库', category: 'PRODUCTION', desc: '流转卡', type: 'WAIT_PUT_INTO_STORAGE' },
//   SOURCE_FULL_PROCESS_RECEIVE: { id: '1725706240781348866', name: '订单外协收货', category: 'OUTSOURCE', desc: '外协单', type: 'WAIT_RECEIVE' },
//   SOURCE_FULL_PROCESS_ORDER_BACK: { id: '1726786534661873666', name: '订单外协退货订单', category: 'OUTSOURCE', desc: '外协退货', type: 'WAIT_AUDIT' },
//   SOURCE_HALF_PROCESS_RECEIVE: { id: '1729429279343849473', name: '外协加工收货', category: 'OUTSOURCE', desc: '外协加工', type: 'WAIT_RECEIVE' },
//   ORDER_SALE_DETAIL: { id: '1734483926994255873', name: '销售对账单', category: 'FINANCIAL', desc: '销售对账单', type: 'WAIT_AUDIT' },
//   ORDER_FILIN_OUT_DETAIL: { id: '1731565507059789825', name: '菲林/网板对账单', category: 'FINANCIAL', desc: '菲林/网板对账单', type: 'WAIT_PRICE' },
//   MATERIAL_BORROW_ACCOUNT: { id: '1714522811763200001', name: '借入对账单', category: 'FINANCIAL', desc: '借入对账单', type: 'WAIT_RECONCILIATION' },
//   MATERIAL_BORROW_OUT: { id: '1716291093709099010', name: '借出对账单', category: 'FINANCIAL', desc: '借出对账单', type: 'WAIT_RECONCILIATION' },
//   PAYMENT_LIST: { id: '1805436737200111618', name: '付款单', category: 'FINANCIAL', desc: '付款单', type: 'WAIT_AUDIT' },
//   PRE_PAYMENT_LIST: { id: '1805437272787566594', name: '预付款单', category: 'FINANCIAL', desc: '预付款单', type: 'WAIT_AUDIT' },
//   PAYMENT_MANAGE: { id: '1805440641761591297', name: '收款单', category: 'FINANCIAL', desc: '收款单', type: 'WAIT_AUDIT' },
//   PRE_REPAYMENT_LIST: { id: '1805440881239572482', name: '预收款单', category: 'FINANCIAL', desc: '预收款单', type: 'WAIT_AUDIT' },
//   SUP_REPAYMENT_LIST: { id: '1805440641761591298', name: '供应商收款单', category: 'FINANCIAL', desc: '收款单', type: 'WAIT_AUDIT' },
//   SUP_PRE_REPAYMENT_LIST: { id: '1805440881239572483', name: '供应商预收款单', category: 'FINANCIAL', desc: '预收款单', type: 'WAIT_AUDIT' },
//   CUSTOMER_COMPLAINT: { id: '1767842870356590593', name: '客诉管理', category: 'QUALITY', desc: '客诉单', type: 'WAIT_PROCESS' },
//   ACCOUNT_ORDER_CUS_DEDUCTION: { id: '1827912555091496962', name: '客户扣款', category: 'QUALITY', desc: '客户扣款单', type: 'WAIT_AUDIT' },
//   ACCOUNT_ORDER_SUP_DEDUCTION: { id: '1827913555214897154', name: '供应商扣款', category: 'QUALITY', desc: '供应商扣款单', type: 'WAIT_AUDIT' },
//   INCENTIVE: { id: '1828309550893408257', name: '奖惩管理', category: 'ADMINISTRATIVE', desc: '奖惩单', type: 'WAIT_AUDIT' }
// };



