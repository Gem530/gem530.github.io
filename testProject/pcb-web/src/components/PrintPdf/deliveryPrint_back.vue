<template>
    <div v-if="deliverInfo" style="display:none; width: 600pt !important;padding-right:5pt;" ref="cardRef">
        <div style="width:100%;text-align:center;font-size:10pt;">
          <div style="font-size:18pt; font-weight:bold;">{{ deliverInfo.enterpriseName }}</div>
          <div style="font-size:14pt;padding-top:5pt">{{ deliverInfo.enterpriseEName }}</div>
          <div style="">
            工厂地址：{{ deliverInfo.enterpriseAddress }}&nbsp;&nbsp;电话：{{ deliverInfo.enterprisePhoneNumber }}
          </div>
          <div style="font-size:16pt;font-weight:600;">送&nbsp;货&nbsp;单</div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div style="">客户名称：{{ deliverInfo.customerCode }}</div>
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
            v-if="(!deliverInfo.deliverTemplates || deliverInfo.deliverTemplates.length == 0)&&deliverInfo.customerCode!='AC90'">
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
                  <span style="font-size:10px;">{{ item.specification }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  {{ 'PCS'}}</td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  {{ item.orderQuantity }}</td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.quantity">{{ item.quantity }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.reserveQuantity">{{ item.reserveQuantity }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.waitDeliveryQuantity">{{ item.waitDeliveryQuantity<0?0:item.waitDeliveryQuantity }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.caseNum != 0">{{ item.caseNum }}</span></td>
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

          <!--AC90打印模板-->
          <table style="border-collapse: collapse; border: none;width:100%;"
            v-if="deliverInfo.customerCode=='AC90'">
            <thead>
              <tr style="border: solid #000 1px; font-weight: normal; font-size: 9pt;">
                <th style="border: solid #000 1px;font-weight: normal;width: 75pt;">客户PO号</th>
                <th style="border: solid #000 1px;font-weight: normal;width: 95pt;">本厂编号</th>
                <th style="border: solid #000 1px;font-weight: normal;width: 85pt;">客户型号</th>
                <th style="border: solid #000 1px;font-weight: normal;width: 50pt;">客户物料名称</th>
                <th style="border: solid #000 1px;font-weight: normal;width: 50pt;">客户物料号</th>
                <th style="border: solid #000 1px;font-weight: normal;width: 40pt;">规格型号</th>
                <th style="border: solid #000 1px;font-weight: normal;width: 20pt;  ">单位</th>
                <th style="border: solid #000 1px; font-weight: normal; width: 38pt;">订货数量</th>
                <th style="border: solid #000 1px; font-weight: normal; width: 38pt;">交货数量</th>
                <th style="border: solid #000 1px; font-weight: normal; width: 20pt;">备品</th>
                <th style="border: solid #000 1px; font-weight: normal; width: 30pt;">欠数量</th>
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
                  {{ item.customerMaterialName }}</td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px; text-align: center">
                  {{ item.customerMaterialCode }}</td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 6pt;padding:0px; text-align: center">
                  <span style="font-size:10px;">{{ item.specification }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  {{ 'PCS'}}</td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  {{ item.orderQuantity }}</td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.quantity">{{ item.quantity }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.reserveQuantity">{{ item.reserveQuantity }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.waitDeliveryQuantity">{{ item.waitDeliveryQuantity<0?0:item.waitDeliveryQuantity }}</span></td>
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0px;text-align: center;">
                  <span v-if="item.caseNum != 0">{{ item.caseNum }}</span></td>
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
          <table style="border-collapse: collapse; border: none;width:100%;" v-if="deliverInfo.deliverTemplates&&deliverInfo.deliverTemplates.length>0">
            <thead>
              <tr style="font-size: 9pt;">
                <th style="width:40px;border: solid #000 1px;font-weight: normal;">序号</th>
                <th v-for="(item, index) in deliverInfo.deliverTemplates" :key="index"
                  style="border: solid #000 1px; font-weight: normal;">
                  {{ item.name }}
                </th>
              </tr>
            </thead>
            <tbody style="display:table-row-group;">
              <tr v-for="(detail, index) in deliverInfo.detail">
                <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; padding: 0px;text-align:center;">
                  {{ index + 1 }}</td>
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
              &nbsp;&nbsp;客&nbsp;&nbsp;户&nbsp;&nbsp;签&nbsp;&nbsp;收：
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>日&nbsp;&nbsp;&nbsp;&nbsp;期：{{  parseTime(deliverInfo.deliveryTime, '{y}-{m}-{d}') }}</div>
            <div style="width: 200pt;text-align:left;">
              （请使用正楷签名）
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 2pt 0pt;">
            <div>
              第一联存根(白) 第二联客户(红) 第三联回单(黄) 第四销售(绿)
            </div>
            <div style="width: 200pt; text-align: left;">
              &nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;期：
            </div>
          </div>
        </div>
  
      </div>
</template>

<script setup lang="ts" name="deliveryPdf">
import { getPrintDeliveryRecord } from '@/api/order/deliveryRecord';

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
  let content = deliverTemplate.content;
  let reg = /\$\{[^\}]+\}/g;
  let arr = content.match(reg);
  if (arr) {
    arr.forEach((item: any) => {
      let key = item.substring(2, item.length - 1);
      let value = detail[key];
      content = content.replace(item, value);
    });
  }
  return content;
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

const doPrint = async (_ids?: any) => {

proxy?.$modal.loading("加载中");
let dev = await getPrintDeliveryRecord(_ids as string);
deliverInfo.value = dev.data;
console.log("dev,", dev);
//ppppdrawer.visible = true;

setTimeout(() => {
  proxy?.$modal.closeLoading();
  printHtmlV2(null);
}, 800)
}

// console.log(121212121212)
defineExpose({ cardRef,doPrint })
</script>

<style lang="scss" scoped>
</style>