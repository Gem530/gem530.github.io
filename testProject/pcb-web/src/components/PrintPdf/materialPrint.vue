<template>
  <div style="display: none;padding-left:3mm;padding-top:1mm;" ref="cardRef">

    <div class="global-flex flex-start flex-wrap">
      <div v-for="(item, index) in material" :style="`margin: 0.5mm 0 0 0.5mm;display: inline-block;${indexList.includes(index) ? 'width:49mm;' : 'width:76mm;'}`">
        <!--默认打印模板-->
        <table :style="`border-collapse: collapse; border: none;width:76mm;height: 49mm; ${indexList.includes(index) ? 'transform: rotate(90deg) translate(13.3mm, 12.5mm);' : ''}`">
          <tbody>
          <tr>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              物料名称
            </td>
            <td colspan="3" style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 46.6mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.name }}
                </div>
              </div>
            </td>

            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              物料类别
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 9.8mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.categoryName }}
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              物料编码
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 18.4mm;height: 9.8mm">
                <div style="display: flex;justify-content: flex-start;align-items: center;">
                  <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                    {{ item.materialCode }}
                  </div>
                </div>
            </td>

            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;font-weight: 550; padding:0px; text-align: center;height: 9.8mm">
              长宽(㎜)
            </td>
            <td colspan="3" style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 38mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div v-if="item.length" style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.length }}*{{ item.width }}
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              板厚(㎜)
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 18.4mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.boardThickness }}
                </div>
              </div>
            </td>

            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              铜厚(oz)
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 18.4mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.copperThickness }}
                </div>
              </div>
            </td>

            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              单位
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 9.8mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.unit }}
                </div>
              </div>
            </td>
          </tr>

          <tr>

            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt; font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              级别
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 18.4mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.level }}
                </div>
              </div>
            </td>

            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              品牌
            </td>
            <td colspan="2" style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 18.4mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.manufacturer }}
                </div>
              </div>
            </td>

            <td rowspan="2" style="border: solid #000 1px; word-break: break-all; text-align:center; width: 19.6mm;height: 19.6mm;">
              <div class="global-flex flex-center" style="width: 100%;height: 100%;overflow: hidden;">
                <img :src="item.qrcodeImg" style="width: 19.5mm;height: 19.5mm;"/>
              </div>
            </td>
          </tr>

          <tr>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              材质牌号
            </td>
            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 18.4mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.materialQuality }}
                </div>
              </div>
            </td>

            <td style="border: solid #000 1px; word-break: break-all; font-size: 9pt;font-weight: 550; padding:0px; text-align: center;width: 9.8mm;height: 9.8mm">
              规格型号
            </td>
            <td colspan="2" style="border: solid #000 1px; word-break: break-all; font-size: 9pt;padding:0 10px; text-align: left;width: 18.4mm;height: 9.8mm">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="width: 100%;height: 100%;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;" >
                  {{ item.specification }}
                </div>
              </div>
            </td>

          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="materialPrint">
import * as QRCode from "qrcode";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const cardRef = ref();
const material = ref<any[]>([]);

const indexList = ref<number[]>([4, 11]);
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

const printHtmlV2 = () => {
  let printNode = cardRef.value;
  const newDoc = document.implementation.createHTMLDocument('Print Document');
  const pageStyle = newDoc.createElement("style");
  pageStyle.innerHTML = "@page { margin: 0.3cm;size: landscape; }"; // 0.3厘米边距,横版打印
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

/** 产品打印 */
const doPrint = (data?: any[]) => {
  indexList.value = [];
  if (data) {
    material.value = data.map(item => {
      item.customerName = item.customerName + '(' + item.customerCode + ')';
      setQrCode(item);
      return item;
    })
    // 处理横版表格坐标
    let count = Math.ceil(material.value.length / 14);
    for(let i = 1; i <= count; i++) {
      let temp = 14*(i - 1) + 3;
      indexList.value.push(temp);
      indexList.value.push(temp + 7);
    }
  }

  nextTick(() => {
    printHtmlV2();
  })
}

const setQrCode = async (item: any) => {
  return new Promise((resolve, reject) => {
    //二维码
    QRCode.toDataURL(item.rawMaterialId+'', {margin: 1, errorCorrectionLevel: 'H'}, (err: any, url: string) => {
      if (err) {
        reject(err)
      } else {
        item.qrcodeImg = url;
        resolve(true)
      }
    });
  })
}

defineExpose({ cardRef, doPrint, })
</script>

<style>
</style>
