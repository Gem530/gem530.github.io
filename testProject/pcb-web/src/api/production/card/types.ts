export interface CardVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 排产单ID
   */
  productionId: string | number;

  /**
   * 单位ID
   */
  ownerId: string | number;

  /**
   * 扎号
   */
  bundleCode: string;

  /**
   * 排产总扎数
   */
  bundleCount: number;

  /**
   * 父卡ID（拆卡时有用）
   */
  parentId: string | number;

  /**
   * 流转卡卡号
   */
  code: string;

  /**
   * 本卡PNL数量
   */
  bundlePnlQuantity: number;

  /**
   * 每张卡配置的PNL数量
   */
  quantityPerCard: number;

  /**
   * 工艺pnlId
   */
  pnlId: string | number;

}

export interface CardForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  /**
   * 扎号
   */
  bundleCode?: string;

  /**
   * 排产总扎数
   */
  bundleCount?: number;

  /**
   * 父卡ID（拆卡时有用）
   */
  parentId?: string | number;

  /**
   * 流转卡卡号
   */
  code?: string;

  /**
   * 本卡PNL数量
   */
  bundlePnlQuantity?: number;

  /**
   * 每张卡配置的PNL数量
   */
  quantityPerCard?: number;

  /**
   * 工艺pnlId
   */
  pnlId?: string | number;

}

export interface CardQuery extends PageQuery {
  isAsc?: string;

  orderByColumn?: string;
  /**
   * 排产单ID
   */
  productionId?: string | number;

  /**
   * 单位ID
   */
  ownerId?: string | number;

  isFinished?: string;

  /**
   * 扎号
   */
  bundleCode?: string;

  /**
   * 排产总扎数
   */
  bundleCount?: number;

  /**
   * 父卡ID（拆卡时有用）
   */
  parentId?: string | number;

  /**
   * 流转卡卡号
   */
  code?: string;

  /**
   * 本卡PNL数量
   */
  bundlePnlQuantity?: number;

  /**
   * 每张卡配置的PNL数量
   */
  quantityPerCard?: number;

  /**
   * 工艺pnlId
   */
  pnlId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}



