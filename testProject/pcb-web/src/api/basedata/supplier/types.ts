export interface SupplierVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 供应商名称
   */
  supplierName: string;

  supplierCode: string;

  /**
   * 对账时间
   */
  reconciliationTime: string;

  /**
   * 物料类别 1:板材 2菲林 3测试架 4模具 5文字网板 6生产半成品 7边料
    8干膜 9钻嘴 10销钉 11槽刀 12锣刀 13物耗品 14设备配件
    15拉网 16铝片 17油墨
   */
  materialType: any;

  materialTypeName: string;

  /**
   * 工艺 1包装 2开料 3外层钻孔 4压合 5线检QC 6导电膜 7外层线路
    8图形电镀 9镀锡 10退膜/蚀刻 11阻焊 12丝印字符 13文字后烤 14表面处理
    15成形 16V-CUT 17FQC 18阻焊QC 19测试 20除胶渣沉铜21内层线路22内存线路检查23内层蚀刻
    24内层蚀检25蚀检QC26沉铜27成品检测28表面后处理29 .....
   */
  craft: number;

  craftName: string;

  /**
   * 公司负责人
   */
  companyManager: string;

  /**
   * 负责人电话
   */
  companyManagerPhone: string;

  /**
   * 公司电话
   */
  companyPhone: string;

  /**
   * 公司地址
   */
  companyAddress: string;

  /**
   * 月结方式 1：月结30天  2 ：月结45天 3：月结60天 4：月结90天  5：预付30% :6：货到付款
    7：预付款 8：当月结 9：现金 10：预付30%，尾款到发货 11：现金货到付款
    12：下单预付50%，发货付清
   */
  monthlyMethod: number;

  /**
   * 是否含税 1否 2是
   */
  isTax: string;

  /**
   * 文件id
   */
  fileId: string | number;

  /**
   * 状态
   */
  delFlag: string;

  /**
   * 新增时间
   */
  createTime: any;
  /**
   * 物料id已关联回显
   */
  materialIds: string[];

  /**
   * 供应商类型（1物料供应商、2全制程供应商、3半制成供应商）
   */
  type: string;

  typeList: string;

  /**
   * 币种
   */
  currency: string;
}

export interface SupplierForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;
  /**
   * $column.columnComment
   */
  companyId: string | number;

  /**
   * 供应商名称
   */
  supplierName?: string;
  /**
   * 供应商编码
   */
  supplierCode?: string | number;

  /**
   * 对账时间
   */
  reconciliationTime?: string;

  /**
   * 物料类别 1:板材 2菲林 3测试架 4模具 5文字网板 6生产半成品 7边料
    8干膜 9钻嘴 10销钉 11槽刀 12锣刀 13物耗品 14设备配件
    15拉网 16铝片 17油墨
   */
  materialType?: any;
  /**
   * 加多条物料类型
   */
  materialTypeStrList?: any;
  /**
   * 已关联物料id
   */
  materialIds: string[];

  /**
   * 工艺 1包装 2开料 3外层钻孔 4压合 5线检QC 6导电膜 7外层线路
    8图形电镀 9镀锡 10退膜/蚀刻 11阻焊 12丝印字符 13文字后烤 14表面处理
    15成形 16V-CUT 17FQC 18阻焊QC 19测试 20除胶渣沉铜21内层线路22内存线路检查23内层蚀刻
    24内层蚀检25蚀检QC26沉铜27成品检测28表面后处理29 .....
   */
  craft?: number;

  /**
   * 公司负责人
   */
  companyManager?: string;

  /**
   * 负责人电话
   */
  companyManagerPhone?: string;

  /**
   * 公司电话
   */
  companyPhone?: string;

  /**
   * 公司地址
   */
  companyAddress?: string;

  /**
   * 月结方式 1：月结30天  2 ：月结45天 3：月结60天 4：月结90天  5：预付30% :6：货到付款
    7：预付款 8：当月结 9：现金 10：预付30%，尾款到发货 11：现金货到付款
    12：下单预付50%，发货付清
   */
  monthlyMethod?: number;

  /**
   * 是否含税 0否 1是
   */
  isTax?: string | number;

  /**
   * 文件id
   */
  fileId?: string | number;

  delFlag?: string;

  /**
   * 供应商类型（1物料供应商、2全制程供应商、3半制成供应商）
   */
  type?: string;
  /**
   * 供应商类型（1物料供应商、2全制程供应商、3半制成供应商）
   */
  typeList?: [];

  /**
   * 币种
   */
  currency?: string | number;
}

export interface SupplierQuery extends PageQuery {
  /**
   * 供应商名称
   */
  supplierName?: string;

  supplierCode?: string;

  /**
   * 对账时间
   */
  reconciliationTime?: string;

  /**
   * 物料类别 1:板材 2菲林 3测试架 4模具 5文字网板 6生产半成品 7边料
    8干膜 9钻嘴 10销钉 11槽刀 12锣刀 13物耗品 14设备配件
    15拉网 16铝片 17油墨
   */
  materialType?: number;

  /**
   * 工艺 1包装 2开料 3外层钻孔 4压合 5线检QC 6导电膜 7外层线路
    8图形电镀 9镀锡 10退膜/蚀刻 11阻焊 12丝印字符 13文字后烤 14表面处理
    15成形 16V-CUT 17FQC 18阻焊QC 19测试 20除胶渣沉铜21内层线路22内存线路检查23内层蚀刻
    24内层蚀检25蚀检QC26沉铜27成品检测28表面后处理29 .....
   */
  craft?: number;

  /**
   * 公司负责人
   */
  companyManager?: number;

  /**
   * 负责人电话
   */
  companyManagerPhone?: string;

  /**
   * 公司电话
   */
  companyPhone?: string;

  /**
   * 公司地址
   */
  companyAddress?: string;

  /**
   * 月结方式 1：月结30天  2 ：月结45天 3：月结60天 4：月结90天  5：预付30% :6：货到付款
    7：预付款 8：当月结 9：现金 10：预付30%，尾款到发货 11：现金货到付款
    12：下单预付50%，发货付清
   */
  monthlyMethod?: number;

  /**
   * 是否含税 0否 1是
   */
  isTax?: string;

  /**
   * 文件id
   */
  fileId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;

  /**
   * 供应商类型（1物料供应商、2全制程供应商、3半制成供应商）
   */
  type?: string;

  /**
   * 币种
   */
  currency?: string;
}
