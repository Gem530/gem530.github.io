import Taro from '@tarojs/taro'

// const SERVICE_DOMAIN = "http://192.168.0.28:8080"; // yl
// const SERVICE_DOMAIN = "http://192.168.0.105:8084"; // zl
// const SERVICE_DOMAIN = "http://192.168.0.134:8080"; // ql
// const SERVICE_DOMAIN = "http://192.168.0.121:8080"; // hw
// const SERVICE_DOMAIN = "http://192.168.0.129:8080"; // lb
// const SERVICE_DOMAIN = "http://192.168.0.102:8080" // yx
// const SERVICE_DOMAIN = "http://192.168.0.198:9000";
const SERVICE_DOMAIN = "http://pcb-test.enfccn.com:9100";
// const SERVICE_DOMAIN = "https://wechat.test.enfccn.com:9000";
// const SERVICE_ORDER_DOMAIN = "http://192.168.2.115:8880";
// 后端服务域名
// erp系统
// const SERVICE_DOMAIN = "https://pcb.enfccn.com";
// 外单系统
const SERVICE_ORDER_DOMAIN = "https://pcb.enfccn.com/pcbpljk441ofj4er-api";
// 环境接口前缀
// erp系统
export const API_PREFIX = '/prod-api';
// export const API_PREFIX = '/dev-api';
// export const API_PREFIX = '';
// 外单系统
export const API_ORDER_PREFIX = '';
//客户端ID
export const CLIENT_ID = "12cd7e4891bf95d1d19206ce24a7b32e";
//授权类型（根据密码授权）
export const GRANT_TYPE = "password";
//租户ID
export const TENANT_ID = "000000";
export const OWNER_ID = "";
//接口加密传输 RSA 公钥与后端解密私钥对应 如更换需前后端一同更换
export const VITE_APP_RSA_PUBLIC_KEY = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdHnzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ==";
// 订阅消息模板ID列表
export const TEMPLATE_IDS = ['PDA-RkgcmgZAJ3CjAIEJTTRBcP08CKCP6TOr6zB0pxo']
export const DAILY_TEMPLATE_IDS = ['7adZX50xmZOm6d6iM4KKXm_y-XkkISNGlBvlG4kvYzo']
// 百度地图ak
export const MAP_AK = 'IUkAgrxW2JmpAdhcTIjpQyUMvV11Uwrm'

const config = {
  httpMethod: {
    get: 'get',
    post: 'post',
  },
  domain: SERVICE_DOMAIN,
  orderDomain: SERVICE_ORDER_DOMAIN,
  // 后端服务接口api,暂没网关
  api: {
    transition: {
      doRequest: 'transition/doRequest'
    },
    auth: {
      login: 'auth/login',
      switchLogin: 'auth/switchingUnit',
      userInfo: 'system/user/getInfo',
      getOwnerList: 'system/user/getOwnerList',
      getXcxRouters: 'system/menu/getXcxRouters',
      getNoticeList: 'system/notice/list',
      getUserCount: 'auth/count',
      userFeedback: 'outsource/userFeedback/add',
      generateUrlLink: 'wx/generateUrlLink',
      queryUrlLink: 'wx/queryUrlLink',
      getUserReportRole: 'applet/send/getUserReportRole',
      addUserReportRole: 'applet/send/addUserReportRole',
      scanQRCode: 'wx/scanQRCode',
      editXcxUserInfo: 'system/user/editXcxUserInfo',
      editLogo: 'system/dept/editLogo',
      editPassword: 'system/user/profile/updateWeChatPwd',
      getAppletUserMenu: 'system/menu/getAppletUserMenu',
      getAppletUserByMenuId: 'system/menu/getAppletUserByMenuId/', // {menuId}
      dateMaking: 'system/user/dateMaking',
      verifyNumber: 'production/orderProcess/verifyNumber',
      setLoginQRCodeValue: 'wx/setLoginQRCodeValue',
      setScanValue: 'wx/setScanValue',
      getWriteRecords: 'applet/send/getWriteRecords',
      saveWriteRecords: 'applet/send/saveWriteRecords',
      deleteWriteRecords: 'applet/send/deleteWriteRecords',
    },
    scanProduction: {
      getCardType: 'production/card/getCardsByQrCode',
      getCardInfo: 'production/card/getCardDetails',
      handleTask: 'production/production/saveCardNode',
      getCanCountQuantity: 'production/production/getCanCountQuantity',
    },
    signManage: {
      signList: 'pdf/sign/signList',
      getSignDetail: 'pdf/sign/', //{id}
      addSign: 'pdf/sign/addSign',
      editSign: 'pdf/sign/edit',
      delSign: 'pdf/sign/del/', // {ids}
      confirmDefault: 'pdf/sign/default',
      queryIsAuth: 'pdf/signProtocolRecord/queryIsAuth',
      authorize: 'pdf/signProtocolRecord/authorize',
    },
    // 日报
    dailyReport: {
      marketDailyReport: 'appletReport/marketDailyReport',
      marketDailyReportLine: 'appletReport/marketDailyReportLine',
      projectDailyReportHeard: 'appletReport/projectDailyReportHeard',
      projectDailyReportExcel: 'appletReport/projectDailyReportExcel',
      projectDailyReportLine: 'appletReport/projectDailyReportLine',
      productionDailyReport: 'appletReport/productionDailyReport',
      productionDailyReportLine: 'appletReport/productionDailyReportLine',
      // operationDailyReport: 'appletReport/operationDailyReport', // 原运营日报接口
      operationDailyReport: 'appletReport/operationDailyReportNotRange', // 根据昨日改变
      onlyOnLineAndOffLineData: 'appletReport/getOperationDailyReportOnlyOnLineAndOffLineData', // 根据昨日改变
      operationDailyReportNotChange: 'appletReport/operationDailyReportHasRange', // 不根据昨日改变
      factoryDailyReport: 'appletReport/factoryDailyReport',
      factoryDailyReportLine: 'appletReport/factoryDailyReportLine',
      dailySwitch: 'outsource/dailySwitch/', //{type}
      dailySwitchReset: 'outsource/dailySwitch/reset',
      queryOperateReportPrice: 'outsource/dailySwitch/queryOperateReportPrice',
      updateOperateReportPrice: 'outsource/dailySwitch/updateOperateReportPrice',
      operationProductionReport: 'appletReport/operationProductionReport',
      tenantConfigReport: 'tenant/tenantConfig/listConfig',
      getOperationDailyReportOnlyQuotation: 'appletReport/getOperationDailyReportOnlyQuotation',
      getOperationDailyReportOnlyRanking: 'appletReport/getOperationDailyReportOnlyRanking',
      getSumEQP: 'eqp/getSum',
    },
    // 采购签章
    materialRequisition: {
      queryMaterialInventory: 'purchase/materialApply/queryMaterialInventory',
      getReceiveAddress: 'basedata/customerAddress/listByOwnerIdEnable',
      getSupplierList: 'basedata/supplier/listByFour',
      addAppletPurchaseOrder: 'purchase/materialHandle/addAppletPurchaseOrder',
      listAppletPurchaseOrder: 'purchase/materialHandle/listAppletPurchaseOrder',
      getAppletPurchaseOrderDetail: `purchase/materialHandle/reviewAppletPurchaseOrder/`,//{id}
      updateAppletPurchaseOrder: 'purchase/materialHandle/updateAppletPurchaseOrder',
      listAppletPurchaseOrderAudit: 'purchase/materialHandle/listAppletPurchaseOrderAudit',
      auditPurchaseOrder: 'purchase/materialHandle/auditPurchaseOrder',
      // 合同
      listPurchaseMaterialOrder: 'purchase/materialHandle/listPurchaseMaterialOrder',
      // getMaterialOrderDetail: 'purchase/materialOrder/coll/', //{id} 用下面接口替换
      getMaterialOrderDetail: 'purchase/materialOrder/coll/detail',
      uploadMaterialFile: 'purchase/materialHandleDetail/uploadFile',
      queryOperateRecordList: 'purchase/materialHandleDetail/queryOperateRecordList',
      listMaterialFile: 'purchase/materialHandleDetail/listFile',
      confirmOrderApp: 'purchase/materialOrder/coll/confirmOrderApp',
      previewSignature: 'purchase/materialHandle/previewSignature/', //{id}
      confirmOrderFinish: 'purchase/materialOrder/coll/confirmOrderFinish',
      materialOrderCompareList: 'purchase/materialOrder/coll/compareList',
      cancelOrder: 'purchase/materialOrder/coll/cancelOrder',
      // 送货
      listByOrder: 'purchase/materialDelivery/listByOrder',
      getMaterialDeliveryDetail: 'purchase/materialDelivery/', // {id}
      editMaterialDelivery: 'purchase/materialDelivery/edit',
      previewDeliverySignature: 'purchase/materialDelivery/previewSignature/', // {id}
      materialDeliverySign: 'purchase/materialDelivery/sign',
      updateVerify: 'purchase/materialDelivery/updateVerify',
      listByWait: 'purchase/materialHandleDetail/listDeliveryOrder',
      deliveryDetail:'purchase/materialHandleDetail/listDeliveryDetail',
      addDelivery:'purchase/materialDelivery/add',
      // 退货
      listMaterialBackApp: 'system/materialBackDetail/listMaterialBackApp',
      materialBackDeDetail: 'system/materialBackDetail/materialBackDeDetail',
      confirmBackDetail: 'system/materialBackDetail/confirmBackDetail',
      previewSignatureBack: 'system/materialBackDetail/previewSignature/', // {id}
      confirmMaterialBack: 'system/materialBackDetail/confirmMaterialBackApp',
      confirmMaterialBackFinish: 'system/materialBackDetail/confirmMaterialBackFinish',
      materialBackDetailCompareList: 'system/materialBackDetail/compareList',
      createSignFile: 'system/materialBackDetail/createSignFile',
      // 对账
      confirmList: 'financial/accountOrder/confirmList',
      previewSignatureStatement: 'financial/accountOrder/previewSignature/', // {id}
      accountOrderSign: 'financial/accountOrder/sign',
      accountOrderSignV2: 'financial/accountOrder/signV2',
      cancelAccount: 'financial/accountOrder/cancelAccount',
      supConfirm: 'financial/accountOrder/supConfirm',
      applyList: 'financial/accountOrder/applyList',
      applyListCount: 'financial/accountOrder/applyListCount',
      confirmListV2: 'financial/accountOrder/confirmListV2',
      accountOrderCount: 'financial/accountOrder/count',
      accountOrderDetial: 'financial/accountOrder/getInfo/', // {id}
      adjustListApp: 'financial/accountOrder/adjustListApp',
      queryUseModule: 'pdf/sign/queryUseModule',
      // 扫码校验
      // 送货
      verifyPermissionMaterial: 'purchase/materialDelivery/verifyPermission/', // {id}
      verifyPermissionSourceFull: 'outsource/sourceFullProcessDelivery/verifyPermission/', // {id}
      verifyPermissionSourceHalf: 'outsource/sourceHalfProcessDelivery/verifyPermission/', // {id}
      // 采购合同，退货
      orderDataIsolationMaterial: 'system/materialBackDetail/orderDataIsolation',
      // 外协合同，退货
      orderDataIsolationOutsource: 'outsource/sourceFullProcessOrderBack/orderDataIsolation',
      // 对账
      accountOrderCheck: 'financial/accountOrder/check',
    },
    // 订单外协签章
    orderOutsource: {
      // 合同
      listSupplierOrder: 'outsource/sourceFullProcessOrder/listSupplierOrderApp',
      getOrderDetail: 'outsource/sourceFullProcessOrder/orderDetail/', // {id}
      confirmOrder: 'outsource/sourceFullProcessOrder/confirmOrder',
      previewSignature: 'outsource/sourceFullProcessOrder/previewSignature/', // {id}
      confirmOrderFinish: 'outsource/sourceFullProcessOrder/confirmOrderFinish',
      // 送货
      sourceFullProcessDeliveryList: 'outsource/sourceFullProcessDelivery/listByOrder',
      sourceFullProcessDeliveryDetail: 'outsource/sourceFullProcessDelivery/', // {id}
      sourceFullProcessDeliveryEdit: 'outsource/sourceFullProcessDelivery/edit',
      sourceFullProcessDeliveryPreview: 'outsource/sourceFullProcessDelivery/previewSignature/', // {id}
      sourceFullProcessDeliverySign: 'outsource/sourceFullProcessDelivery/sign',
      // 退货
      listSupplierBackAppSource: 'outsource/sourceFullProcessOrderBack/listSupplierBackApp',
      supplierBackDetail: 'outsource/sourceFullProcessOrderBack/supplierBackDetail',
      confirmBackApp: 'outsource/sourceFullProcessOrderBack/confirmBackApp',
      previewSignatureProcessBack: 'outsource/sourceFullProcessOrderBack/previewSignature/', // {id}
      confirmOrderBackFinish: 'outsource/sourceFullProcessOrderBack/confirmOrderBackFinish',
    },
    // 工序外协签章
    processOutsource: {
      // 接单
      querySupplierPageListApp: 'outsource/sourceHalfProcessOrder/listSupplierOrderApp',
      supplierOrderDetail: 'outsource/sourceHalfProcessOrder/supplierOrderDetail',
      confirmAppHalfProcess: 'outsource/sourceHalfProcessOrder/confirmApp',
      confirmFinishHalfProcess: 'outsource/sourceHalfProcessOrder/confirmFinish',
      previewSignatureHalfProcess: 'outsource/sourceHalfProcessOrder/previewSignature/', // {id}
      batchConfirmFinish: 'outsource/sourceHalfProcessOrder/batchConfirmFinish',
      // 送货
      sourceHalfProcessDeliveryList: 'outsource/sourceHalfProcessDelivery/listByOrder',
      sourceHalfProcessDeliveryDetail: 'outsource/sourceHalfProcessDelivery/', // {id}
      sourceHalfProcessDeliveryEdit: 'outsource/sourceHalfProcessDelivery/edit',
      sourceHalfProcessDeliveryPreview: 'outsource/sourceHalfProcessDelivery/previewSignature/', // {id}
      sourceHalfProcessDeliverySign: 'outsource/sourceHalfProcessDelivery/sign',
      sourceHalfProcessDeliverySignBatch: 'outsource/sourceHalfProcessDelivery/signBatch'
    },
    // 结单/取消单据处理
    statement: {
      listOrderStatement: 'purchase/materialHandle/listOrderStatement',
      statementDetail: 'purchase/materialHandleDetail/statementDetail',
      listOrderStatementSourceFull: 'outsource/sourceFullProcessOrder/listOrderStatement',
      statementDetailSourceFull: 'outsource/sourceFullProcessOrder/statementDetail',
      listOrderStatementSourceHalf: 'outsource/sourceHalfProcessOrder/listOrderStatement',
      statementDetailSourceHalf: 'outsource/sourceHalfProcessOrder/statementDetail',
    },
    productCapacity: {
      getCurrentCard: 'personal/capacity/getCardDetail',
      createCapacity: 'personal/capacity/createCapacity',
      getCapacityList: 'personal/capacity/list',
      getAuditList: 'personal/capacity/getAuditList',
      getCapacityDetails: 'personal/capacity/getCapacityDetails',
      passCapacity: 'personal/capacity/passCapacity',
      queryUserDeptNodeList: 'personal/capacityTechnique/queryUserDeptNodeList',
      craftCapacityList: 'personal/capacity/craftCapacityList',
      rejectCapacity: 'personal/capacity/rejectCapacity',
      voidCapacity: 'personal/capacity/voidCapacity',
      passCapacityByCard: 'personal/capacity/passCapacityByCard',
    },
    upload: {
      getSignedUrl: 'resource/oss/getSignedUrl',
      getUrlByKeys: 'resource/oss/getUrlByKeys',
      test: '/financial/accountOrder/test2',
      addBatchVoucher: 'system/file/addBatch',
      listVoucher: 'system/file/listVoucher/', // {code}/{fileBizType}
      // sendMessageWithAttachmentByKey: 'resource/oss/sendMessageWithAttachmentByKey',
      sendMessageWithAttachmentByKey: 'applet/send/sendMessageWithAttachmentByKey', // 替换老的邮箱发送
      queryEmailRecord: 'applet/send/queryEmailRecord',
      getSystemTime: 'auth/getSystemTime',
      uploadDelivery: 'order/deliveryRecord/uploadDelivery',
    },
    saleContract: {
      getOrderProcess: 'production/orderProcess/getOrderProcessApplet',
      getCustomerList: 'basedata/customer/getList',
      signList: 'order/deliveryRecord/codeSignList',
      backSignList: 'order/deliveryRecord/codeQueryOrderBackSignPageList',
      detailByCode: 'order/deliveryRecord/detailByCode/', // {code}
      updateMaterialFlow: 'order/deliveryRecord/updateMaterialFlow',
      getListLogisticsCompany: 'basedata/logisticsCompany/list',
      wxOrderList: 'production/orderProcess/wxOrderList',
      signListApp: 'order/deliveryRecord/signListApp',
      detailByCodeApp: 'order/deliveryRecord/detailByCodeApp/', //{code}
      signApp: 'order/deliveryRecord/signApp',
      previewSignature: 'order/deliveryRecord/previewSignature/', // {id}
      getDeliveryOrderNum: 'order/deliveryRecord/getOrderCount',
      wxMaterialInTransitList: 'purchase/materialDelivery/wxMaterialProcessList',
      wxMaterialCategoryList: 'purchase/materialDelivery/wxMaterialProcessCategoryList',
      getMaterialProcessApplet: 'purchase/materialDelivery/getMaterialProcessApplet',
      updateLogisticsNo: 'purchase/materialDelivery/updateLogisticsNo',
    },
    orderUpload: {
      getEmail: 'tencentCloud/getEmailByKeys',
      // sendEmail: 'purchase/email/send',
      saveEmail: 'purchase/email/sendEmailAndAddData',
      getSignedUrl: 'resource/oss/getSignedUrlIgnore',
      getUrlByKeys: 'resource/oss/getUrlByKeys',
      businessCardList: 'system/businessCard/list',
      getEmailByKeyList: 'tencentCloud/getEmailByKeyList',
      sendBatchEmailAndAddData: 'purchase/email/sendBatchEmailAndAddData',
    },
    // 报表
    reportForms: {
      projectReportHeard: 'appletReport/projectReportHeard',
      getProjectReportThirtyExcel: 'appletReport/getProjectReportThirtyExcel',
      projectDailyReportLine: 'appletReport/projectDailyReportLine',
      capacityAuditStatistics: 'personal/capacity/auditStatistics',
      handleStatistics: 'purchase/materialApply/handleStatistics',
      getProductionReportTop: 'appletReport/getProductionReportTop',
      getProductionReportBottom: 'appletReport/getProductionReportBottom',
      detailStatistics: '/purchase/materialHandleDetail/detailStatistics',
      craftStatistics: '/outsource/sourceHalfProcessOrder/craftStatistics',
      supplierStatistics: '/outsource/sourceHalfProcessOrder/supplierStatistics',
      productionArea: 'appletReport/getProductionReportTop/productionArea',
      scrapArea: 'appletReport/getProductionReportTop/scrapArea',
      productionException: 'appletReport/getProductionReportTop/productionException',
      deptCapacity: 'appletReport/getProductionReportTop/deptCapacity',
      capacityCount: 'personal/capacity/capacityCount',
      capacityCountByDept: 'personal/capacity/capacityCountByDept',
      capacityCountByPersonal: 'personal/capacity/capacityCountByPersonal',
      capacityCountByCraft: 'personal/capacity/capacityCountByCraft',
      capacityReportByDept: 'personal/capacity/capacityReportByDept',
    },
    // 盘点
    checkPlan: {
      checkPlanList: 'inventory/checkPlan/list',
      checkPlan: 'inventory/checkPlan/', // {id}
      checkPlanDetailList: 'inventory/checkPlanDetail/list',
      invalidList: 'inventory/checkPlan/invalidList/', // {id}
      checkPlanStart: 'inventory/checkPlan/start',
      delCheckPlanDetail: 'inventory/checkPlanDetail/', // {ids}
      temporarySave: 'inventory/checkPlanDetail/temporary',
      checkPlanCancel: 'inventory/checkPlan/cancel',
      checkPlanDetail: 'inventory/checkPlanDetail/detail',
      submitAudit: 'inventory/checkPlan/submitAudit',
      auditPost: 'inventory/checkPlan/audit',
      checkPlanListCount: 'inventory/checkPlan/count',
      checkPlanDetailCount: 'inventory/checkPlanDetail/count',
      listCategory: 'basedata/rawMaterialCategory/listCategoryApp',
      materialInventory: 'purchase/materialApply/materialInventory',
    },
    // 通知
    noticePage: {
      getWxPendingNum: 'notification/pending/getWxPendingNum',
      getNotifyList: 'notify/getList',
      getNotifyNum: 'notify/getNotifyNum',
      getNotifyRecord: 'notify/notifyRecord/getList',
      getRecordNum: 'notify/notifyRecord/getRecordNum',
      readNotify: 'notify/notifyRecord/readNotify',
      readAllNotify: 'notify/notifyRecord/readAllNotify',
      getUserRemindConfig: 'remind/config/getUserRemindConfig',
      remindConfig: 'remind/config',
    },
    // 外协接单管理
    outSource: {
      // 加工
      orderList: 'outsource/sourceOrder/listApp',
      orderDetail: 'outsource/sourceOrder/',  //{id}
      orderCount: 'outsource/sourceOrder/count',
      orderComplete: 'outsource/sourceOrder/complete',
      orderEntering: '/outsource/sourceOrderDetail/entering',
      orderScrap: '/outsource/sourceOrderScrap',
      orderUser: '/system/user/list/deptId/',  //{id}
      orderScrapQuantity: '/outsource/sourceOrderScrap/maxQuantity/', //${id}
      //送货
      receiveList: '/outsource/sourceOrderDelivery/listApp',
      receiveDetail: '/outsource/sourceOrderDelivery/app/', //{id}
      receiveCount: '/outsource/sourceOrderDelivery/count',
      receivePreview: '/outsource/sourceOrderDelivery/preview/', //{bizId}
      receiveSign: '/outsource/sourceOrderDelivery/sign',
      receiveFile: '/system/file/getFileListAndOssUrl', //{bizId}
      // 记录
      sourceOrderProcessRecord: 'outsource/sourceOrderProcessRecord/list',
    }
  },
  windowHeight: Taro.getSystemInfoSync().windowHeight,
  windowWidth: Taro.getSystemInfoSync().windowWidth,
  statusBarHeight: Taro.getSystemInfoSync().statusBarHeight,
};
export default config;
