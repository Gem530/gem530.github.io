<template>
    <div class="pdf-to-img" style="width: 100%; height: 100%; overflow: hidden;">
        <!-- <div class="interviewVideo_main" id="videoContainer"> -->
        <!--此处根据pdf的页数动态生成相应数量的canvas画布-->
        <!-- <canvas
          v-for="pageIndex in pdfPages"
          :id="`pdf-canvas-` + pageIndex"
          :key="pageIndex"
          style="display: block"
        ></canvas> -->
        <img style="width: 100%; height: 100%; object-fit: contain;" v-for="item in (pdfImgList && pdfImgList.sort((a:any, b:any) => a.sort-b.sort))" :key="item.url" :src="item.url"/>
       </div>
    <!-- </div> -->
</template>

<script setup lang="ts" name="PdfToImg">
import * as pdfjsLib from "~/build/pdf.mjs";
const props = defineProps({
    url: String,
    scale: {
        type: Number,
        default: 2.0
    },
})
let pdfDoc = reactive({}); // 保存加载的pdf文件流
let pdfPages = ref(0); // pdf文件的页数
let pdfUrl = ref(props.url); //pdf文件的链接
let pdfScale = ref(props.scale); // 缩放比例
const pdfImgList = ref<{sort: number,url: string}[]>([]);
//调用loadFile方法
onMounted(() => {
  loadFile(pdfUrl.value);
//   console.log('pdfUrl.value----', pdfUrl.value)
});
//获取pdf文档流与pdf文件的页数
const loadFile = async (url) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "/build/pdf.worker.mjs";
    // "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js";
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then((pdf) => {
    pdfImgList.value=[]
    console.log(pdf);
    pdfDoc = pdf;
    pdfPages.value = pdf.numPages;
    nextTick(() => {
      renderPage(1);
    });
  });
};
//渲染pdf文件
const renderPage = (num) => {
  pdfDoc.getPage(num).then((page) => {
    // const canvasId = "pdf-canvas-" + num;
    // const canvas = document.getElementById(canvasId);
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const bsr =
      ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio ||
      1;
    const ratio = dpr / bsr;
    const viewport = page.getViewport({ scale: pdfScale.value });
    let resW = viewport.width
    let resH = viewport.height
    canvas.width = resW * ratio;
    canvas.height = resH * ratio;
    canvas.style.width = resW + props.unit;
    canvas.style.height = resH + props.unit;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page.render(renderContext, () => {
        // 手动在pdf.mjs中加了一个回调函数,3225行
        pdfImgList.value.push({sort: num,url:canvas.toDataURL('image/png')})
    });
    if (num < pdfPages.value) {
      renderPage(num + 1);
    }
  });
};
</script>

<style lang="scss" scoped>
.pdf-to-img {
    width: 100%;
    height: 100%;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>