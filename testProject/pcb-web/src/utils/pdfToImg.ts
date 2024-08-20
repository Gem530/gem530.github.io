import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import workerSrc from "pdfjs-dist/build/pdf.worker.min.js";
// import * as pdfjsLib from "~/build/pdf.mjs";

var pdfDoc: any = null; // 保存加载的pdf文件流
let pdfPages: any = 0; // pdf文件的页数
let pdfScale: any = 1.0; // 缩放比例
let pdfImgList: any = [];
//获取pdf文档流与pdf文件的页数
export const loadFile = async (url: any) => {
    // let pdfjsLib = require('~/build/pdf.mjs')
  return new Promise((resolve,reject) => {
    try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 
            // workerSrc;
            // "../../node_modules/pdfjs-dist/build/pdf.worker.min.js";
            "/js/pdf.worker.min.js";
            // "/build/pdf.worker.mjs";
            // "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js";
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(async (pdf: any) => {
            pdfImgList=[]
            // console.log('pdf--', pdf);
            pdfDoc = pdf;
            pdfPages = pdf.numPages;
            // console.log('pdfPages',pdfPages)
            for (let i = 1; i <= pdfPages; i++) {
              await renderPage(i);
            }
            resolve(pdfImgList.sort((a:any,b:any)=>a.sort-b.sort).map((v: any) => v.url))
        }).catch((err: any) => {
          // console.log('err111', err)
          // reject(err)
        });
    } catch(err) {
        reject(err)
    }
  })
};
//渲染pdf文件
const renderPage = (num: number) => {
  return new Promise((resolve, reject) => {
    pdfDoc.getPage(num).then(async (page: any) => {
        try {
          // const canvasId = "pdf-canvas-" + num;
          // const canvas = document.getElementById(canvasId);
          const canvas: any = document.createElement('canvas')
          const ctx: any = canvas.getContext("2d");
          const dpr = window.devicePixelRatio || 1;
          const bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1;
          const ratio = dpr / bsr;
          const viewport = page.getViewport({ scale: pdfScale });
          // console.log('viewport---', viewport)
          let resW = viewport.width
          let resH = viewport.height
          canvas.width = resW * ratio;
          canvas.height = resH * ratio;
          canvas.style.width = resW + 'px';
          canvas.style.height = resH + 'px';
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
          
          // setTimeout(()=> {
            // 手动在pdf.mjs中加了一个回调函数,3225行
            pdfImgList.push({sort: num,url:canvas.toDataURL('image/png')})
            // console.log('pdfImgList---------',pdfImgList)
            resolve(pdfImgList)
          // }, 10)
          // if (num < pdfPages) {
          //   await renderPage(num + 1);
          // }
        } catch(err: any) {
          reject(err)
        }
    }).catch((err: any) => {
      reject(err)
    });
  })
};

