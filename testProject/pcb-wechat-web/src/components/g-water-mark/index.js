import dayjs from 'dayjs'
import GVoucherPop from '../g-voucher-pop'
import {getGlobalData} from "../../global"
import Taro, { useLoad } from '@tarojs/taro'
import bmap from '../../pages/util/bmap-wx.min'
import { View, Canvas } from '@tarojs/components'
import { MAP_AK } from '../../pages/config/commonConfig'
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { getSystemTimeAPI, addBatchVoucherAPI } from '../../pages/services/upload'
import { getImageInfo, canvasDraw, toDataUrl, uploadFileDeal, downloadFileByKeys } from '../../pages/util/func'

export default forwardRef(function GWaterMark({}, ref) {
    const [address, setAddress] = useState('')
    const [whInfo, setWhInfo] = useState({ w:0, h:0 })
    useLoad(() => {
        Taro.getLocation({
            success: (res) => {
                console.log(res)
            }
        })
    })

    // 选择图片
    const chooseHandle = async (addressStr, tempFile, fn) => {
        if (tempFile) {
            const res = await toCanvas(tempFile, addressStr)
            fn && fn(res)
        } else {
            // 图片上传
            Taro.chooseImage({
                count: 1,
                sizeType: 'compressed',
                success: async (file) => {
                    console.log('file', file)
                    const res = await toCanvas(file, addressStr)
                    fn && fn(res)
                },
            })
            // uploadImg && uploadImg()
        }
    }
    // 选择图片
    const chooseImage = async (fn, file) => {
        if (address) {
            chooseHandle(address, file, (data) => {
                fn && fn(data)
            })
        } else {
            let BMapCtx = new bmap.BMapWX({ ak: MAP_AK })
            // 发起regeocoding检索请求 
            BMapCtx.regeocoding({ 
                fail: err => {
                    // 本地时间需要为实时的，不能手动更改，会报错{"errno": 600001, "errMsg": "request:fail -2:net::ERR_FAILED"}
                    console.log('fail', err)
                    chooseHandle('', file, (data) => {
                        fn && fn(data)
                    })
                }, 
                success: success => {
                    console.log('success', success, success?.wxMarkerData[0])
                    setAddress(success?.wxMarkerData[0]?.address)
                    setTimeout(() => {
                        // 解决上传图片绘制水印时报错，canvasToTempFilePath:fail :create bitmap failed
                        chooseHandle(success?.wxMarkerData[0]?.address, file, (data) => {
                            fn && fn(data)
                        })
                    }, 250)
                }
            });
        }
    }

    // 画图
    const toCanvas = async (file, addressStr) => {
        if (!file?.tempFilePaths?.length) return
        // file.tempFilePaths.map((imgTmpUrl) => {
        //     imgToCanvas(imgTmpUrl)
        // })
        let fileList = []
        Taro.showLoading({mask: true})
        for (let i = 0; i < file.tempFilePaths.length; i++) {
            const res = await imgToCanvas(file.tempFilePaths[i], addressStr).catch((err) => {
                console.log('err1', err)
                Taro.hideLoading()
                Taro.showToast({ title: '上传失败，请重试', icon: 'error' })
            })
            // console.log(i, res)
            fileList.push(res)
        }
        Taro.showLoading({mask: true})
        let res = await uploadFileDeal(fileList).catch((err) => {
            console.log('err2', err)
            Taro.hideLoading()
            Taro.showToast({ title: '上传失败，请重试', icon: 'error' })
        })
        let resultList = res.map((m) => {
            return {
                // bizId: id,
                // bizType: 20,
                // bizCode: code,
                // moduleCodeStr: moduleCode,
                url: m.params.tmpUrl,
                ...m.params.fileInfo
            }
        })
        // // addBatchVoucher(resultList)
        return resultList
    }

    // 批量上传图片
    const addBatchVoucher = (list) => {
        addBatchVoucherAPI(list).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                Taro.showToast({ title: '上传成功', icon: 'success' })
            }
        }).finally(() => {
            setTimeout(() => { Taro.hideLoading() }, 1000)
        })
    }

    // 绘制图片到canvas
    const imgToCanvas = (imgUrl, addressStr) => {
        return new Promise(async (resolve, reject) => {
            try {
                let platform = getGlobalData('platform')
                let width = getGlobalData('windowWidth') // canvas 宽度
                let height = getGlobalData('windowHeight') // canvas 高度
                width = width
                height = Number(height.toString().replace('px', ''))
                setWhInfo({ w: width, h: height })
                let imgW = width // 图片宽
                let imgH = height // 图片高
                // console.log(width, height)
                // console.log('imgUrl', imgUrl)
                const ctx = Taro.createCanvasContext('writeCanvas', this)
                const { width: imgWidth, height: imgHeight } = await getImageInfo(imgUrl)
                // console.log(imgWidth, imgHeight, width, height)
                let wR = imgWidth / imgW
                let hR = imgHeight / imgH
                let centerW = 0
                let centerH = 0
                if (wR > hR) {
                    // 宽度超出更多
                    // 宽度不变 width = width
                    imgH = imgHeight * imgW / imgWidth
                    centerH = (height - imgH) / 2
                } else {
                    // 高度超出更多
                    // 高度不变 height = height
                    imgW = imgWidth * imgH / imgHeight
                    centerW = (width - imgW) / 2
                }
                let resTime = await getSystemTimeAPI()
                let sysTime = (resTime?.code == 200 ? resTime?.msg : '') || dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
                // console.log(imgW, imgH, imgWidth, imgHeight, wR, hR)
                if (platform == 'ios') {
                    // ios 手机不设置延时，会卡住，不往后执行，设置延时后成功 https://developers.weixin.qq.com/community/develop/doc/000c0e80f0c7d81e586d748db51400 https://www.jianshu.com/p/3a21c4edacf5
                    ctx.draw(false, setTimeout(async () => {
                        ctx.translate(centerW, centerH)
                        ctx.drawImage(imgUrl, 0, 0, imgW, imgH)
                        await fileTextToCanvas(ctx, addressStr, 0, imgH - 10, imgW)
                        await fileTextToCanvas(ctx, sysTime, 0, imgH - 10 - 20, imgW)
                        ctx.draw(true, setTimeout(async () => {
                            // , 'jpg', '0.6'
                            const res = await toDataUrl('writeCanvas', 'jpg', '0.6').catch((err) => {
                                // console.log('err3', err)
                                Taro.hideLoading()
                                Taro.showToast({ title: '上传失败，请重试', icon: 'error' })
                            })
                            // console.log(res, res.tempFilePath)
                            resolve(res.tempFilePath)
                        }, 150))
                    }, 50))
                } else {
                    await canvasDraw(ctx, false)
                    ctx.translate(centerW, centerH)
                    ctx.drawImage(imgUrl, 0, 0, imgW, imgH)
                    await fileTextToCanvas(ctx, addressStr, 0, imgH - 10, imgW)
                    await fileTextToCanvas(ctx, sysTime, 0, imgH - 10 - 20, imgW)
                    await canvasDraw(ctx, true)
                    // , 'jpg', '0.6'
                    const res = await toDataUrl('writeCanvas', 'jpg', '0.6').catch((err) => {
                        console.log('err3', err)
                        Taro.hideLoading()
                        Taro.showToast({ title: '上传失败，请重试', icon: 'error' })
                    })
                    // console.log(res, res.tempFilePath)
                    resolve(res.tempFilePath)
                }
            } catch(err) {
                reject(err)
                console.log('err3', err)
                Taro.hideLoading()
                Taro.showToast({ title: '上传失败，请重试', icon: 'error' })
            }
        })
    }
    // 绘制水印到canvas
    const fileTextToCanvas = (ctx, text, x, y, width) => {
        return new Promise(async (resolve, reject) => {
            try {
                ctx.setFontSize(16)
                ctx.setFillStyle('#fff')
                ctx.setGlobalAlpha(0.8)
                // 绘制水印文本
                let textWidth = ctx.measureText(text).width
                ctx.fillText(text, x || (width - textWidth - 10), y)
                // await canvasDraw(ctx, true)
                resolve(true)
            } catch(err) {
                reject(err)
            }
        })
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        chooseImage,
    }))
    return (
        <>
        <Canvas canvasId='writeCanvas' style={`position: fixed;left: 9999px;width: ${whInfo.w}px;height: ${whInfo.h}px;`}></Canvas>
        </>
    )
})
