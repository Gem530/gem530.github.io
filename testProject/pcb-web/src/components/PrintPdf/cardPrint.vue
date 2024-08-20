<template>
  <div class="p-2 xtable-page">
    <PrintPdf
      ref="cardRefPrint"
      :allData="allData"
      :scrapped="scrapped"
      :printType="printType"
      :drillInfos="drillInfos"
      :qcCodeImage="qcCodeImage"
      :drillTitles="drillTitles"
      :laminateInfo="laminateInfo"
      :n_drillInfos="n_drillInfos"
      :drillHeaders="drillHeaders"
      :n_drillTitles="n_drillTitles"
      :n_drillHeaders="n_drillHeaders"
      :currentPdfList="currentPdfList"
      :commodityInfos="commodityInfos"
      :productionDetails="productionDetails"
      :publicCommodityInfo="publicCommodityInfo"
      v-if="allData && qcCodeImage && startPrint"
    ></PrintPdf>
  </div>
</template>

<script setup name="MIPrint" lang="ts">
import { getPrintOrder, getCardSum} from '@/api/production/card';
import { ref } from "vue";
import * as QRCode from "qrcode";
import { loadFile } from '@/utils/pdfToImg'

  const printType = ref("noOutsideImages");
  const code = ref("");
  const productionDetails = ref<any>([]);
  const allData = ref<any>();
  const commodityInfos = ref<any>([]);
  const publicCommodityInfo = ref<any>([]);
  const drillHeaders = ref<any>([]);
  const drillInfos = ref<any>([]);
  const drillTitles = ref<any>([]);
  const n_drillInfos = ref<any>([]);
  const n_drillHeaders = ref<any>([]);
  const n_drillTitles = ref<any>([]);
  const qcCodeImage = ref<any>([]);
  const schemeImages = ref<any>([]);
  const laminateImages = ref<any>([]);
  //存压合工艺参数
  const laminateInfo = ref<any>();
  const outsideImages = ref<any>([]);
  const scrapped = [1, 2, 3, 4, 5, 6, 7];
  const cardRefPrint = ref();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const props = defineProps({
  resInfo: {
    type: Object,
    default: undefined
  },
  printType: {
    type: String,
    default: 'outsideImages'
  }
})


const startPrint = ref(false)
const currentPdfList = ref<string[]>([])
let currentNode = ref();

  const replaceParamValue = (value: any) => {
    if (typeof value === 'string') {
      if (value && value.startsWith('备注')) {
        return value.replace('备注', '【备注】');
      }
    } else if (value instanceof Array) {
    }
    return value;
  }

  const replaceParamName = (name: any) => {
    //&&name.endsWith('：')
    if (typeof name === 'string') {
      return '【' + name.replace('：', '') + '】：';
    } else {
      return name;
    }
  }

  const buildProductionInfos = async (result: any) => {
    let inx = 0;
    let nodeList;
    if(result.productionCardNodeList&&result.productionCardNodeList.length>0){
      nodeList = result.productionCardNodeList;
    }else{
      nodeList = result.miNodeInfoVoList;
    }
    let productionDetailsObj = nodeList.map((item: any) => {
      if (item.craftName == "压合") {
        laminateInfo.value = item;
        laminateInfo.value.remark = laminateInfo.value.remark ? laminateInfo.value.remark.public : '';
        if (item.requirement && item.requirement.length > 0) {
          item.requirement.forEach((element: any) => {

            let unit = element.unit ? element.unit : '';
            //压合板厚
            if (element.code == "Pressed_Thickness" && element.defaultValue) {
              laminateInfo.value.pressedThickness = element.defaultValue + unit;
            }
            //公差
            if (element.code == "Pressed_Tolerance" && element.defaultValue) {
              laminateInfo.value.pressedTolerance = element.defaultValue + unit;
            }

          });
        }
        //层叠状态
        laminateInfo.value.pressedLayeredStatus = item.extension?item.extension.cascadingState:'';
      }
      inx++;
      let isOver = item.isCount == 1 ? "*" : "";
      let detail = {
        index: isOver + inx,
        productionCraft: item.craftName,
        params: [] as { name: string; para: string; }[],
      };
      item.requirement.forEach((req: any) => {
        let unit = req.unit ? req.unit : '';
        let _name = req.name ? req.name : '';
        if (req.differPNL && req.differPNL.length > 0) {

          req.differPNL.forEach((diff: any) => {
            let val = diff.parameterValue ? diff.parameterValue : diff.defaultValue;
            let showVal = val + unit;
            if (val == null || val == undefined || val == 'null') {
              showVal = '';
            }
            detail.params.push({
              name: _name,
              para: showVal,
            })
          });

        } else {
          let val = req.defaultValue;
          let showVal = val + unit;
          if (val == null || val == undefined || val == 'null') {
            showVal = '';
          }
          detail.params.push({
            name: _name,
            para: showVal,
          })
        }
      });
      let remark = item.remark ? item.remark.public : '';
      if(item.remark&&item.remark.differPNL&&item.remark.differPNL.length>0){
        item.remark.differPNL.forEach((remarkDiffPNL: any) => {
          let pnlName = remarkDiffPNL.pnlName?remarkDiffPNL.pnlName:'';
          let pnlRemark = remarkDiffPNL.remark?remarkDiffPNL.remark:'';
          if(pnlRemark!=''){
            remark+='    '+pnlName+'备注：'+pnlRemark;
          }
        });
      }
      if(remark&&remark!=''){
        remark='【备注】：'+remark;
      }
      detail.params.push({
        name: '备注',
        para: remark,
      })
      return detail;
    })
      //sort
    productionDetailsObj.forEach((pd:any)=>{
      pd.params=pd.params.sort((a: any, b: any) => {
        let nameA = a.name.toUpperCase(); // 转换为大写以忽略大小写
        let nameB = b.name.toUpperCase();
        return nameA.localeCompare(nameB);
      });
    });
    console.log('productionDetails', productionDetailsObj);
    console.log('laminateInfo', laminateInfo.value);
    productionDetails.value = productionDetailsObj;
  }

  const buildDrillData = async (result: any) => {
    //非金属的钻孔数据
    if (result.ndrillInfos && result.ndrillInfos.length > 0) {
      n_drillInfos.value = [];
      n_drillHeaders.value = [];
      n_drillTitles.value = [];

      let rebuildDrillInfo = [];
      let sumRow = ['', '合计', '', ''];
      let _drillInfo: any = [];
      //let totalQuantity: any = 0;
      let pnlSet = new Set(result.ndrillInfos.map(_item => _item.pnlId));
      result.ndrillInfos?.length && result.ndrillInfos.forEach((item: any) => {
        let _quantity = item.quantity ? item.quantity : 0;
        //totalQuantity += _quantity;
        let detail = [item.code, item.diameter, item.tolerance, item.productDiameter];// item.quantity, 'Y', item.remark
        if(pnlSet.size>1){
          result.ndrillInfos?.filter((rp:any)=>rp.code==item.code).forEach((hole:any) => {
              detail.push(hole.quantity)
          })
        }else{
          detail.push(item.quantity);
        }
        detail.push('Y');
        detail.push(item['remark']);

        _drillInfo.push(detail);
      });
      //去重
      _drillInfo = _drillInfo.filter((v, i, a) => a.findIndex(t => JSON.stringify(t) === JSON.stringify(v)) === i);

      result.pnlInfos.forEach((hole:any) => {
            const hasTitle =result.ndrillInfos?.filter((rp:any)=>rp.code== result.ndrillInfos[0].code);
            //如果存在pnlid一样才push这个titel
            if(hasTitle?.length && hasTitle.some((rp:any)=>rp.pnlId==hole.id)){
              sumRow.push(hole.drillQuantity);
            }
      })
      sumRow.push('');
      sumRow.push('');

      _drillInfo.push(sumRow);
      rebuildDrillInfo.push(_drillInfo);
      n_drillInfos.value = rebuildDrillInfo;
      let n_drillHeaders2 = result.ndrillInfos?.length && result.ndrillInfos.map((o: any) => {
        let drillHeaderBefore = ['序号', '孔径', '公差', '成品孔径'];
        let drillHeaderAfter = ['Y/N', '备注'];
        let drillHeaderMiddle: any = [];
        //drillHeaderMiddle.push(result.pnlInfos[0].name + '板孔数')//
        result.pnlInfos.forEach((hole:any) => {
            //drillHeaderMiddle.push(hole.name + '板孔数');
            const hasTitle =result.ndrillInfos?.filter((rp:any)=>rp.code== result.ndrillInfos[0].code);
            //如果存在pnlid一样才push这个titel
            if(hasTitle?.length && hasTitle.some((rp:any)=>rp.pnlId==hole.id)){
              drillHeaderMiddle.push(hole.name + '板孔数');
            }
      })

        return drillHeaderBefore.concat(drillHeaderMiddle).concat(drillHeaderAfter);
      })
      n_drillHeaders.value = n_drillHeaders2;
      n_drillTitles.value.push(result.drill);
      console.log("n_drillInfos", n_drillInfos.value)
    }
    if (result.drillInfos && result.drillInfos.length > 0) {

      drillInfos.value = [];
      drillHeaders.value = [];
      drillTitles.value = [];

      let rebuildDrillInfo = [];
      let sumRow = ['', '合计', '', ''];
      let _drillInfo: any = [];
      //let totalQuantity: any = 0;
      let pnlSet = new Set(result.drillInfos.map(_item => _item.pnlId));
      result.drillInfos.forEach((item: any) => {
        let _quantity = item.quantity ? item.quantity : 0;
        //totalQuantity += _quantity;
        let detail = [item.code, item.diameter, item.tolerance, item.productDiameter];// item.quantity, 'Y', item.remark
        if(pnlSet.size>1){
          result.drillInfos.filter((rp:any)=>rp.code==item.code).forEach((hole:any) => {
              detail.push(hole.quantity)
          })
        }else{
          detail.push(item.quantity);
        }
        detail.push('Y');
        detail.push(item['remark']);
        _drillInfo.push(detail);
      });

      //去重
      _drillInfo = _drillInfo.filter((v, i, a) => a.findIndex(t => JSON.stringify(t) === JSON.stringify(v)) === i);

      result.pnlInfos.forEach((hole:any) => {
            const hasTitle =result.drillInfos.filter((rp:any)=>rp.code== result.drillInfos[0].code);
            //如果存在pnlid一样才push这个titel
            if(hasTitle.some((rp:any)=>rp.pnlId==hole.id)){
              sumRow.push(hole.drillQuantity);
            }
      })
      sumRow.push('');
      sumRow.push('');

      _drillInfo.push(sumRow);
      rebuildDrillInfo.push(_drillInfo);
      drillInfos.value = rebuildDrillInfo;
      let n_drillHeaders2 = result.drillInfos.map((o: any) => {
        let drillHeaderBefore = ['序号', '孔径', '公差', '成品孔径'];
        let drillHeaderAfter = ['Y/N', '备注'];
        let drillHeaderMiddle: any = [];

        //drillHeaderMiddle.push(result.pnlInfos[0].name + '板孔数')//
        result.pnlInfos.forEach((hole:any) => {
            const hasTitle =result.drillInfos.filter((rp:any)=>rp.code== result.drillInfos[0].code);
            //如果存在pnlid一样才push这个titel
            if(hasTitle.some((rp:any)=>rp.pnlId==hole.id)){
              drillHeaderMiddle.push(hole.name + '板孔数');
            }
        })

        return drillHeaderBefore.concat(drillHeaderMiddle).concat(drillHeaderAfter);
      })
      drillHeaders.value = n_drillHeaders2;
      drillTitles.value.push(result.drill);
      console.log("drillInfos", drillInfos.value)
    }
  }
  const getMedianCommaPosition = (str:any) =>{
    const commaCount = (str.match(/\//g) || []).length;
    const halfCount = Math.floor(commaCount / 2)+1;
    const medianIndex = commaCount % 2 === 0 ? halfCount : halfCount + 1;
    const commaIndices = str.split('/').map((_, index) => index + 1); // 逗号位置从1开始计数
    return commaIndices[medianIndex - 1]; // 中值位置从0开始计数
  }
  const insertStringAtPosition = (str, position, insertStr) =>{
    let beforePart = str.slice(0, position);
    let afterPart = str.slice(position);
    const _startsWith = beforePart.startsWith('/');
    const _endsWith = beforePart.endsWith('/');
    const _startsWith2 = afterPart.startsWith('/');
    const _endsWith2 = afterPart.endsWith('/');
    //拼接尾部去除前后斜杠
    if(_startsWith2){
      afterPart = afterPart.slice(1);
    }
    if(_endsWith2){
      afterPart = afterPart.slice(0,-1);
    }
    //拼接前部 end添加斜杠
    if(!_endsWith){
      beforePart = beforePart +'/';
    }
    console.log('beforePart ',beforePart, _startsWith, _endsWith);
    console.log('afterPart ',afterPart, _startsWith2, _endsWith2);
    console.log('insertStr', insertStr);
    if(!afterPart){
      return beforePart + insertStr;
    }
      return beforePart + insertStr +'/'+ afterPart;
  }
  const buildPublicCommodityInfo = async (result: any) => {
    if (Array.isArray(result.commodityInfos) && result.commodityInfos.length != 0) {
      //成品铜厚
      let _materialCopperInside = result.commodityInfos[0].materialCopperInside ? result.commodityInfos[0].materialCopperInside : '';
      let _materialCopperOutside = result.commodityInfos[0].materialCopperOutside ? result.commodityInfos[0].materialCopperOutside : '';
      let _copperThickness = _materialCopperInside + _materialCopperOutside;
      if(_materialCopperOutside&&_materialCopperOutside!=''&&_materialCopperInside&&_materialCopperInside!=''){
        let arr=_materialCopperOutside.split('/');
        let al=Math.floor(arr.length/2);
        console.log("length",al)
        if(al>0){
          arr.splice(al, 0, _materialCopperInside);
          _copperThickness = arr.join("/");
        }else{
          _copperThickness = _materialCopperOutside+'/'+ _materialCopperInside;
        }
        const _endsWith2 = _copperThickness.endsWith('/');
        if(_endsWith2){
          _copperThickness = _copperThickness.slice(0,-1);
        }
          console.log('_copperThicknes adds', _copperThickness);
      }
      publicCommodityInfo.value = {
        commodityCode: result.commodityInfos[0].commodityCode,
        customerPO: result.commodityInfos[0].customerPO,
        commodityName: result.commodityInfos[0].commodityName,
        orderQuantity: result.commodityInfos[0].orderQuantity,
        materialCode: result.commodityInfos[0].materialCode,
        deliveryTime: result.commodityInfos[0].deliveryTime,
        dispatchTime: result.commodityInfos[0].dispatchTime,
        pcS_Size: result.commodityInfos[0].singleLength + '*' + result.commodityInfos[0].singleWidth,
        seT_Size: result.commodityInfos[0].unitedLength + '*' + result.commodityInfos[0].unitedWidth,
        commodityForm: result.commodityInfos[0].commodityForm,
        characterColor: result.commodityInfos[0].characterColor,
        commoditySolder: result.commodityInfos[0].commoditySolder,
        commodityThickness: result.commodityInfos[0].commodityThickness,
        copperThickness: _copperThickness,
        productionQuantity: result.commodityInfos[0].productionQuantity,
        unitedWay: result.commodityInfos[0].unitedWayLength + '*' + result.commodityInfos[0].unitedWayWidth,
        commodityTestWay: result.commodityInfos[0].commodityTestWay,
        cardArea: result.commodityInfos[0].cardArea,
        cardQuantity: result.commodityInfos[0].cardQuantity,
        productionArea: result.commodityInfos[0].productionArea,
        area: result.commodityInfos[0].area,
        placeOrderTime: result.commodityInfos[0].placeOrderTime,
      };
    }
  }

  const doPrint = async (data: any, type: string, fn: any) => {
    startPrint.value = false
    printType.value = type
    code.value = data.productionNo;
    resetAllData();
    try {
      proxy?.$modal.loading('加载中...')
      let res = await getPrintOrder(data.id);
      let result = res;
      console.log('allData', result);
      allData.value = result;
      commodityInfos.value = result.commodityInfos;
      //构建钻孔数据
      await buildDrillData(result);
      //构建公共部分数据
      await buildPublicCommodityInfo(result);
      //构建工艺数据
      await buildProductionInfos(result);

      if (printType.value == "outsideImages") {
        let _outsideImages = result.outsideImages;

        if (_outsideImages && _outsideImages.length > 0) {
          let pdfUrls = [];
          for (let obj of _outsideImages) {
            // console.log(obj)
            // pdfUrls.push(obj.url);
            // let _pdflocalFile = encodeURIComponent(obj.url);
            // obj.pdfUrl = _pdflocalFile;
            if (obj.type && obj?.type.toLocaleLowerCase().includes('pdf')) {
              const tempUrl = obj?.url.includes('http:') ? obj.url.replace('http:', 'https:') : obj.url
              const resIm: any = await loadFile(tempUrl)
              resIm.forEach((url: any) => {
                currentPdfList.value.push(url)
              })
            } else {
              currentPdfList.value.push(obj.url)
            }
          }
        }

        if (type == 'outsideImages' && !currentPdfList.value.length) {
          ElMessage.warning('该订单没有外形图！')
          proxy?.$modal.closeLoading()
          return
        }
        outsideImages.value = _outsideImages;
        // console.log('currentPdfList', currentPdfList.value)
      }

      if(printType.value == "noOutsideImages"){
        let schemeInfos = result.schemeInfos;
        if (schemeInfos && schemeInfos.length > 0) {
          let pdfUrls = [];
          for (let obj of schemeInfos) {
            if (obj.schemeFileList && obj.schemeFileList.length > 0) {
              for (let file of obj.schemeFileList) {
                if (file.url.includes('.pdf')) {
                  const resIm: any = await loadFile(file.url)
                  resIm.forEach((url: any) => {
                    obj.schemeFileList.push({url: url})
                  })

                }
              }
              obj.schemeFileList = obj.schemeFileList.filter((v: any) => !v.url.includes('.pdf'));
            }
          }
        }
      }

      let returnQty = allData.value.returnQty;
      if (returnQty) {
        allData.value.commodityCode = allData.value.commodityCode + '-' + returnQty
      }
      //开料率
      if (allData.value.schemeInfos && allData.value.schemeInfos.length > 0) {
        allData.value.schemeInfos.forEach(element => {
          let s_cuttingRate = element.cuttingRate;
          if (s_cuttingRate) {
            element.cuttingRate = Number(s_cuttingRate).toFixed(2) + "%";
          }
        });
      }
      //二维码
      let _productionCardId: string = allData.value.productionCardId.toString();
      QRCode.toDataURL(_productionCardId, {errorCorrectionLevel: 'H'}, (err: any, url: string) => {
        if (err) {
          console.log('Error: ' + err);
        } else {
          qcCodeImage.value = url;
        }
      });

      startPrint.value = true


      setTimeout(() => {
        printHtmlV2(null, fn);
      }, 800)
      proxy?.$modal.closeLoading()
    } catch(err) {
      console.log(err)
      // proxy?.$modal.msgError('预览错误')
    } finally {
      proxy?.$modal.closeLoading()
    }
  }

  const resetAllData = () => {
    allData.value = undefined;
    commodityInfos.value = [];
    publicCommodityInfo.value = [];
    productionDetails.value = [];
    qcCodeImage.value = [];
    drillInfos.value = [];
    drillHeaders.value = [];
    drillTitles.value = [];
    n_drillInfos.value = [];
    n_drillHeaders.value = [];
    n_drillTitles.value = [];
    currentPdfList.value = []
  }

  const printHtmlV2 = (Id: any, fn: any) => {
    let printNode = cardRefPrint.value.cardRef;
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
    const blob = new Blob([newDoc.documentElement.innerHTML], {type: 'text/html'});
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
      fn && fn();
    }, 3000); // 等待 1 秒后清理
  }

defineExpose({ doPrint })
</script>

<style>
.flex_column_display {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
