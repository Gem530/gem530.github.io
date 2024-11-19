export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/register/index',
    'pages/home/home',
    'pages/capacityReporting/index',
    'pages/process/index',
    'pages/processDetail/index',
    'pages/againReport/index',
    'pages/workProcess/index',
    'pages/emailRecognition/index',
    'pages/emailBatch/index',
    'pages/emailRecord/index',
    'pages/materialRequisition/index',
    'pages/materialSelect/index',
    'pages/materialDetail/index',
    'pages/processMaterialRequisition/index',
    'pages/product/Product',
    'pages/product/components/Detail',
    'pages/scanProduction/Index',
    'pages/saleContract/index',
    'pages/relatedLogistics/index',
    'pages/relatedLogistics/selectRelated/index',
    'pages/reviewPdf/index',
  ],
  subPackages: [{
    root: 'pages/subOne/',
    pages: [
      'userInfo/index',
      'userInfo/changeName/index',
      'userInfo/aboutUs/index',
      'userInfo/changePassword/index',
      'userInfo/signature/index',
      'userInfo/signBoard/index',
      'userInfo/pcbProgress/index',
      'userInfo/seal/index',
      'userInfo/reportConfig/index',
      'userInfo/changeCompany/index',
      'userInfo/permissionList/index',
      'userInfo/permissionList/detail/index',
      'userInfo/noticeSetting/index',
      'userInfo/noticePage/index',
      // 采购
      'procurementSignature/contract/index',
      'procurementSignature/contract/detail/index',
      'procurementSignature/deliveryOrder/index',
      'procurementSignature/deliveryOrder/detail/index',
      'procurementSignature/deliveryOrder/shipDetail/index',
      'procurementSignature/returnOrder/index',
      'procurementSignature/returnOrder/detail/index',
      'procurementSignature/statementAccount/index',
      'procurementSignature/statementAccount/detail/index',
      'procurementSignature/statementAccount/record/index',
      // 订单外协
      'outsourceSignature/contract/index',
      'outsourceSignature/contract/detail/index',
      'outsourceSignature/deliveryOrder/index',
      'outsourceSignature/deliveryOrder/detail/index',
      'outsourceSignature/returnOrder/index',
      'outsourceSignature/returnOrder/detail/index',
      'outsourceSignature/statementAccount/index',
      // 工序外协
      'processSignature/contract/index',
      'processSignature/contract/detail/index',
      'processSignature/deliveryOrder/index',
      'processSignature/deliveryOrder/detail/index',
      'processSignature/statementAccount/index',
      // 结单/取消单据处理
      'statementDocument/statement/index',
      'statementDocument/statement/detail/index',
      // 日报
      'dailyReport/index',
    ]
  }, {
    root: 'packageB/',
    pages: [
      'report/engineeringReport/index',
      'report/productReport/index',
      'report/purchaseReport/index',
      'report/outSourceReport/index',
      'report/pendingReport/index',
      'deliveryOrder/index',
      'deliveryOrder/detail/index',
      'landMaterial/index',
      'landMaterial/detail/index',
      'landMaterial/relatedLogistics/index',
      'inventoryCheck/index',
      'inventoryCheck/detail/index',
      'inventoryCheck/invalidDetail/index',
      'reportSort/index',
      'scanLogin/index',
      'scanSuccess/index',
      'report/capacityReport/index',
      'accountApply/index',
      //外协管理
      'outSource/order/index',
      'outSource/receive/index',
      'outSource/order/detail/index',
      'outSource/receive/detail/index',
      'outSource/receive/detail/file/index',
      'outSource/record/index',
    ]
  }],
  permission: {
    'scope.userLocation': {
      'desc': '你的位置信息将用于小程序位置接口的效果展示'
    }
    // 'scope.userFuzzyLocation': {
    //   'desc': '你的位置信息将用于小程序位置接口的效果展示'
    // }
  },
  requiredPrivateInfos: [
    'getLocation',
    // 'getFuzzyLocation',
    // 'chooseAddress',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'default'
  },
  global: {
    share: true,
  }
})
