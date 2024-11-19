<template>
  <div v-if="deliverInfo" style="display:none; width: 600pt !important;padding-right:5pt; margin-top: 20pt;" ref="cardRef">
    <div style="width:100%;text-align:center;font-size:10pt;">

      <div style="width: 100%;display: flex;justify-content: center;">
        <div style="width: 20%;"></div>
        <div style="width: 60%;">
          <div style="font-size:18pt;font-weight:bold;">{{ deliverInfo.enterpriseName }}</div>
          <div style="font-size:14pt;padding-top:5pt">{{ deliverInfo.enterpriseEName }}</div>
        </div>
        <div style="width: 20%;justify-content: start;">
          <img style="width: 50pt;" :src="deliverInfo.qcCodeImage" />
        </div>
      </div>

      <div style="">
        工厂地址：{{ deliverInfo.enterpriseAddress }}&nbsp;&nbsp;电话：{{ deliverInfo.enterprisePhoneNumber }}
      </div>
      <div style="font-size:16pt;font-weight:600;">送&nbsp;货&nbsp;单</div>
      <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">


        <div v-if="deliverInfo.deliverTemplates && deliverInfo.deliverTemplates.length > 0 &&deliverInfo.showType">
          客户名称：{{ deliverInfo.showType=='11'?deliverInfo.customerCode: deliverInfo.customerName }}</div>
        <div v-else style="">客户名称：{{ deliverInfo.customerCode }}</div>
        <div style="width:170pt;text-align:left;">出货单号：{{ deliverInfo.code }}</div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
        <div style="text-align:left;width:400pt;">客户地址：{{ deliverInfo.cusAddress }}</div>
        <div style="width:170pt;text-align:left;">出货日期：{{ parseTime(deliverInfo.deliveryTime, '{y}-{m}-{d}') }}</div>
      </div>
    </div>

    <div style="min-height:200pt">
      <!--默认打印模板-->
      <table style="border-collapse: collapse; border: none;width:100%;"
        v-if="(!deliverInfo.deliverTemplates || deliverInfo.deliverTemplates.length == 0) && deliverInfo.customerCode != 'AC90'">
        <thead>
          <tr style="border: solid #000 1px; font-weight: normal; font-size: 9pt;">
            <th style="border: solid #000 1px;font-weight: normal;width: 90pt;">客户PO号</th>
            <th style="border: solid #000 1px;font-weight: normal;width: 75pt;">本厂编号</th>
            <th style="border: solid #000 1px;font-weight: normal;width: 80pt;">客户型号</th>
            <th style="border: solid #000 1px;font-weight: normal;width: 80pt;">客户物料号</th>
            <th style="border: solid #000 1px;font-weight: normal;width: 40pt;">规格型号</th>
            <th style="border: solid #000 1px;font-weight: normal;width: 20pt;  ">单位</th>
            <th style="border: solid #000 1px; font-weight: normal; width: 38pt;">订货数量</th>
            <th style="border: solid #000 1px; font-weight: normal; width: 38pt;">交货数量</th>
            <th style="border: solid #000 1px; font-weight: normal; width: 20pt;">备品</th>
            <th style="border: solid #000 1px; font-weight: normal; width: 35pt;">欠数量</th>
            <th style="border: solid #000 1px; font-weight: normal; width: 20pt;">箱数</th>
            <th style="border: solid #000 1px;font-weight: normal; width: 25pt;">备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in deliverInfo.detailList">
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px; text-align: center">
              {{ item.customerPo }}</td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px; text-align: center">
              {{ item.commodityCode }}</td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px; text-align: center">
              {{ item.commodityName }}</td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px; text-align: center">
              {{ item.customerMaterialCode }}</td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 6pt;padding:0px; text-align: center">
              <span style="font-size:10px;">{{ item.specification }}</span>
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
              {{ 'PCS' }}</td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
              {{ item.orderQuantity }}</td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
              <span v-if="item.quantity">{{ item.quantity }}</span>
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
              <span v-if="item.reserveQuantity">{{ item.reserveQuantity }}</span>
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
              <span v-if="item.waitDeliveryQuantity">{{ item.waitDeliveryQuantity < 0 ? 0 : item.waitDeliveryQuantity
              }}</span>
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
              <span v-if="item.caseNum != 0">{{ item.caseNum }}</span>
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;">{{ item.remark }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="9">
            </td>
          </tr>
        </tfoot>
      </table>

      <!--自定义打印模板-->
      <table style="border-collapse: collapse; border: none;width:100%;"
        v-if="deliverInfo.deliverTemplates && deliverInfo.deliverTemplates.length > 0">
        <thead>
          <tr style="border: solid #000 1px; font-weight: normal; font-size: 9pt;">
            <!-- <th style="width:40px;border: solid #000 1px;font-weight: normal;">序号</th> -->
            <th v-for="(item, index) in deliverInfo.deliverTemplates" :key="index"
              :style="item.width ? 'border: solid #000 1px; font-weight: normal;width:' + item.width + 'pt' : 'border: solid #000 1px; font-weight: normal;'">
              {{ item.aliasName }}
            </th>
          </tr>
        </thead>
        <tbody style="display:table-row-group;">
          <tr v-for="(detail, index) in deliverInfo.detailList">
            <!-- <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px;text-align:center;">
              {{ index + 1 }}</td> -->
            <td v-for="(deliverTemplate, index) in deliverInfo.deliverTemplates"
              style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px;text-align:center;">
              {{ getContent(detail, deliverTemplate) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="width:100%;font-size:10pt;">
      <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
        <div>
          发货人：{{ deliverInfo.createByName }}
        </div>
        <div>
          核对：
        </div>
        <div style="width: 200pt; text-align: left;">
          &nbsp;&nbsp;客户签收：
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
        <div>日&nbsp;&nbsp;&nbsp;&nbsp;期：{{ parseTime(deliverInfo.deliveryTime, '{y}-{m}-{d}') }}</div>
        <div style="width: 200pt;text-align:left;">
          （请使用正楷签名）
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
        <div>
          第一联存根(白) 第二联客户(红) 第三联回单(黄) 第四销售(绿)
        </div>
        <div style="width: 200pt; text-align: left;">
          &nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts" name="configDeliveryPdf">
import { getPrintDeliveryRecord } from '@/api/order/deliveryRecord';
import { getOrderBackPrintDeliveryRecord } from "@/api/order/deliveryRecord/index";
import { listDeliveryConfig } from '@/api/basedata/deliveryConfig';
import * as QRCode from "qrcode";
import {generateUrlLink} from "@/api/system/user";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const cardRef = ref();
const deliverInfo = ref<any>();
const props = defineProps({
  resInfo: {
    type: Object,
    default: undefined
  },
  scrapped: {
    type: Array,
    default: () => []
  }
})

const getContent = (detail: any, deliverTemplate: any) => {
  return detail[deliverTemplate.colValue]||"";
}

const printHtmlV2 = (Id: any) => {
  let printNode = cardRef.value;
  console.log(printNode);
  const newDoc = document.implementation.createHTMLDocument('Print Document');
  const pageStyle = newDoc.createElement("style");
  pageStyle.innerHTML = "@page { margin: 0.5cm; }"; // 0.5厘米边距
  newDoc.head.appendChild(pageStyle);
  newDoc.body.style.margin = "0px";
  let newContent = printNode.cloneNode(true);
  newContent.style.display = 'block';
  newDoc.body.appendChild(newContent);
  newDoc.documentElement.innerHTML;
  // 创建一个新的 Blob 对象
  const blob = new Blob([newDoc.documentElement.innerHTML], { type: 'text/html' });
  // 创建一个 Blob URL
  const blobUrl = URL.createObjectURL(blob);
  // 创建一个 iframe 用于打印
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobUrl;
  // 将 iframe 添加到页面并触发打印
  document.body.appendChild(iframe);
  iframe?.contentWindow.print();
  // 清理 Blob URL 和 iframe
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(iframe);
  }, 3000); // 等待 1 秒后清理
}

const doPrint_back = async (_ids?: any) => {

  proxy?.$modal.loading("加载中");
  let dev = await getPrintDeliveryRecord(_ids as string);
  deliverInfo.value = dev.data;
  console.log("dev,", dev);

  setTimeout(() => {
    proxy?.$modal.closeLoading();
    printHtmlV2(null);
  }, 800)
}

const getDeliveryInfoById = async (_ids?: any) => {
  let dev = await getPrintDeliveryRecord(_ids as string);
  return dev.data;
}


const getBackDeliveryInfoById = async (_ids?: any) => {
  let dev = await getOrderBackPrintDeliveryRecord(_ids as string);
  return dev.data;
}


const doDemoPrint = async (formTemp:any) => {
  deliverInfo.value = undefined;
  proxy?.$modal.loading("加载中");
  deliverInfo.value = demoData.value;
  deliverInfo.value.deliverTemplates = formTemp.deliveryConfig;
  deliverInfo.value.customerCode = formTemp.customerCode;
  deliverInfo.value.cusAddress = formTemp.customerAddress;
  deliverInfo.value.showType = formTemp.showType;
  await doPrintCommon();
}

const doPrint = async (_ids?: any) => {
  deliverInfo.value = undefined;
  proxy?.$modal.loading("加载中");
  deliverInfo.value = await getDeliveryInfoById(_ids);
  deliverInfo.value.deliverTemplates =  await getDeliveryConfigTemplate(deliverInfo.value.customerCode,'2');

  if(!deliverInfo.value.deliverTemplates||deliverInfo.value.deliverTemplates.length==0){
    deliverInfo.value.deliverTemplates =  await getCommonDeliveryConfigTemplate('1');
  }
  await doPrintCommon();
}
const doBackPrint = async (_ids?: any) => {
  deliverInfo.value = undefined;
  proxy?.$modal.loading("加载中");
  deliverInfo.value = await getBackDeliveryInfoById(_ids);
  deliverInfo.value.deliverTemplates =  await getDeliveryConfigTemplate(deliverInfo.value.customerCode,'4');

  if(!deliverInfo.value.deliverTemplates||deliverInfo.value.deliverTemplates.length==0){
    deliverInfo.value.deliverTemplates =  await getCommonDeliveryConfigTemplate('3');
  }
  await doPrintCommon();
}
const getCommonDeliveryConfigTemplate = async (_type?: any) => {
  console.log("使用通用模板 1/3",_type);
  const queryParams = {
    type: _type,
  }
  const res = await listDeliveryConfig(queryParams);
  if(res.rows && res.rows.length > 0){
    deliverInfo.value.showType=res.rows[0].showType;
    return res.rows[0].deliveryConfig;
  }
  return undefined;
}

const getDeliveryConfigTemplate = async (customerCode?: any,_type?:any) => {
  let queryParams = {
    customerCode: customerCode,
    type:_type
  }
  const res = await listDeliveryConfig(queryParams);
  if(res.rows && res.rows.length > 0){
    deliverInfo.value.showType=res.rows[0].showType;
    return res.rows[0].deliveryConfig;
  }
  return undefined;
}
const doPrintCommon = async () => {
  await setQrCode();
  //计算列宽pt 总650pt
  if (deliverInfo.value.deliverTemplates && deliverInfo.value.deliverTemplates.length > 0) {
    const totalColWidth = 650;
    const templates = deliverInfo.value.deliverTemplates;
    templates.forEach((item, inx) => {
      if (inx < templates.length - 1) {
        item.width = Number(Number(item.colWidth) / 100 * totalColWidth).toFixed(0);
      } else {
        item.width = totalColWidth - templates.slice(0, inx).reduce((pre, cur) => { return pre + Number(cur.width) }, 0);
      }
    });
  }
  console.log("doPrintCommon",deliverInfo.value);
  setTimeout(() => {
    proxy?.$modal.closeLoading();
    printHtmlV2(null);
  }, 800)
}
const setQrCode = async () => {
  //二维码
  if(!deliverInfo.value.qcCodeImage){
    //为空的时候预览二维码设置
    deliverInfo.value.qcCodeImage='00000000';
  }
  QRCode.toDataURL(deliverInfo.value.qcCodeImage, {errorCorrectionLevel: 'H'}, (err: any, url: string) => {
    if (err) {
      console.log('Error: ' + err);
    } else {
      deliverInfo.value.qcCodeImage = url;
    }
  });
}
const demoData = ref({
  "id": "0",
  "createByName": "发货",
  "updateByName": "发货",
  "code": "NSTSH240100001",
  "customerName": "江西电子有限公司",
  "deliveryTime": "2024-02-21",
  "createTime": "2024-02-21",
  "logisticsCompany": "跨越",
  "currency": "人民币",
  "enterpriseName": "江西诺思特电路有限公司",
  "enterpriseEName": "Jiangxi Nosth PCB Co. ,LTD",
  "enterprisePhoneNumber": "0755-26076931",
  "enterpriseAddress": "江西省赣州市信丰县龙翔工业园江西诺思特电路有限公司 ",
  "detailList": [
    {
      "id": "1760291226610008066",
      "createDeptName": "江西诺思特电路有限公司",
      "createByName": "发货",
      "updateByName": "发货",
      "type": "0",
      "quantity": 3000,
      "bizId": 50134,
      "code": "NSTSH240100001",
      "updateTime": "2024-02-21",
      "saleOrderNo": "NSTHT24013390",
      "commodityId": 50436,
      "commodityCode": "AC106P2R06145A0",
      "isCallback": "0",
      "commodityName": "DMO-JC-0920-10S-61-84-A-Ver1.4",
      "materialQuality": "FR4",
      "unit": "PCS",
      "orderQuantity": 3000,
      "inventoryQuantity": 100,
      "returnQuantity": 19,
      "deliveryQuantity": 3000,
      "waitDeliveryQuantity": 0,
      "cusDeliveryTime": "2024-02-21",
      "deliveryTime": "2024-02-21",
      "dispatchTime": "2024-02-21",
      "shipQuantity": 55,
      "reserveQuantity": 12,
      "mantissaQuantity": 11,
      "caseNum": 3,
      "remark": "客户要求加急送达",
      "urgent":"正常",
      "createTime": "2024-02-21",
      "deliveryVehicle": "五菱宏光mini",
      "deliveryPersonnel": "张三",
      "logisticsCompany": "跨越",
      "logisticsNo": "SF1234567890",
      "commodityInOutRecordId": "1760291226610008066",
      "area": null,
      "customerPo": "DMO20240115001",
      "customerMaterialCode": "DH-0920-10S-61-84-A-Ver1.4",
      "customerMaterialName": "YH123456789",
      "accountDate": "2024-02-21",
      "hasAccountOrder": "0",
      "currency": "人民币",
      "isTax": "1",
      "engineeringCost": "0",
      "testFrameCost": "0",
      "flyProbeCost": "0",
      "mouldCost": "0",
      "expeditedCost": "0",
      "otherCost": "0",
      "sampleCost": "0",
      "orderCode": "NSTHT24013390",
      "orderPrice": "1.5800",
      "cusMonthlyStatementWay": "月结60天",
      "deliveryCode": "NSTSH240200033",
      "deliveryUserName": "发货",
      "materialNumber": "DMO-JC-0920-10S-61-84-A-Ver1.4",
      "specification": "184.00*190.71/6",
      "placeOrderTime": "2024-01-15"
    }
  ]
});

defineExpose({ cardRef, doPrint, doDemoPrint,doBackPrint })
</script>

<style lang="scss" scoped></style>
