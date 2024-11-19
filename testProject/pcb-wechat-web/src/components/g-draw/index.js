import './index.less'
import { AtButton } from "taro-ui"
import { View, Canvas } from '@tarojs/components'
import { useRef, useState, useEffect } from 'react'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
// import { getSignedUrlErpAPI, getUrlByKeysErpAPI } from '../../pages/services/upload/index'
import { getDomInfo, downloadImg, toDataUrl, getImageInfo, getFileInfo, canvasDraw, uploadFileByAl } from '../../pages/util/func'

// 使用变量的地方需要修改
export default function GDraw({initUrl, name = '签章', isSave = '0', reset, load, saveImg}) {
    // isSave 0不显示 保存电子签名 1显示
    // const [initUrl, setInitUrl] = useState('http://tmp/mMjWaV85nfOkfaba84d81ead0fb4e0347760bd2283b5.png')
    // 图片宽高
    const [whInfo, setWhInfo] = useState({
        width: 0,
        height: 0,
    })
    const [choose, setChoose] = useState(true)
    const [loading, setLoading] = useState(false)
    // 绘图画布引用
    const context = useRef();
    // 绘制轨迹信息
    const lineInfo = useRef({ startX: 0, startY: 0, fontSize: 1 });

    // // 获取canvas的宽高
    // const getDomInfo = (domId) => {
    //     return new Promise((resolve, reject) => {
    //         Taro.createSelectorQuery().select(domId).fields({ node: true, size: true }).exec((res) => resolve(res))
    //     })
    // }
    // // 下载图片
    // const downloadImg = (url) => {
    //     return new Promise((resolve, reject) => {
    //         Taro.downloadFile({
    //             url,
    //             success: (res) => {
    //                 if (res?.statusCode == 200 && res?.tempFilePath) resolve(res.tempFilePath)
    //                 else reject(false)
    //             },
    //             fail: err => reject(false)
    //         })
    //     })
    // }
    // // canvas保存图片
    // const toDataUrl = (canvasId) => {
    //     return new Promise((resolve, reject) => {
    //         Taro.canvasToTempFilePath({
    //             canvasId: canvasId,
    //             fileType: 'png',
    //             success: res => resolve(res),
    //             fail: err => reject(err)
    //         });
    //     })
    // }
    // // 临时地址转换
    // const getImageInfo = (tempFilePath) => {
    //     return new Promise((resolve, reject) => {
    //         Taro.getImageInfo({
    //             src: tempFilePath,
    //             success: res => resolve(res),
    //             fail: err => reject(err)
    //         })
    //     })
    // }
    // // 临时地址转换
    // const getFileInfo = (filePath) => {
    //     return new Promise((resolve, reject) => {
    //         Taro.getFileInfo({
    //             filePath: filePath,
    //             success: res => resolve(res),
    //             fail: err => reject(err)
    //         })
    //     })
    // }
    // // 绘制图形
    // const canvasDraw = (canvas, reserve = true) => {
    //     return new Promise((resolve, reject) => {
    //         canvas?.draw(reserve, () => resolve(true))
    //     })
    // }

    useLoad(() => {
        setTimeout(async () => {
            const res = await getDomInfo('#myDraw')
            // console.log(res)
            const { width, height } = res[0]
            setWhInfo({ width, height })
            context.current = Taro.createCanvasContext('drawBoard')
            context.current?.setLineWidth(5)
            context.current?.setLineCap('round')
            context.current?.setLineJoin('round')
            // console.log(context.current)
        }, 100)
    })
    useEffect(() => {
        setTimeout(async () => {
            if (initUrl && whInfo?.width) {
                const tempPath = await downloadImg(initUrl)
                const {width: imgHeight, height: imgWidth} = await getImageInfo(tempPath)
                let { width, height } = whInfo
                // console.log(imgWidth, imgHeight, width, height)
                let wR = imgWidth / width
                let hR = imgHeight / height
                if (wR > hR) {
                    // 宽度超出更多
                    // 宽度不变 width = width
                    height = imgHeight * width / imgWidth
                } else {
                    // 高度超出更多
                    // 高度不变 height = height
                    width = imgWidth * height / imgHeight
                }
                // console.log(wR, hR, width, height)

                // 横向图片 转 竖向图片
                context.current?.save() // 保存这之前的操作，restore恢复这时保存的状态信息(包括原点以及旋转)
                context.current?.translate(width, 0)
                context.current?.rotate(90 * Math.PI / 180)
                context.current?.translate(width / 2, height / 2)
                context.current?.translate(-width / 2, -height / 2)
                context.current?.drawImage(tempPath, 0, 0, height, width)
                context.current?.restore() // 恢复之前保存的
                context.current?.draw(true)
            }
        }, 100)
    }, [initUrl, whInfo])
    useDidShow(() => {
        // setTimeout(() => {
            // const query = Taro.createSelectorQuery()

            // query.select('#drawBoard').fields({ node: true, size: true })
            // .exec(res => {
            //     console.log(res)
            //     const canvas = res[0].node
            //     const ctx = canvas.getContext('2d')
            //     console.log(res, canvas, ctx)
            //     if (!res?.context) return

            //     const { windowWidth, windowHeight } = Taro.getSystemInfoSync()

            //     res.context.canvas.width = windowWidth;
            //     res.context.canvas.height = windowHeight;

            //     res.context.setStrokeStyle('#000000');
            //     res.context.setLineWidth(4);
            //     res.context.setLineCap('round');
            //     res.context.setLineJoin('round');
            //     context.current = res.context;
            // })
        // }, 1000)
    })

    // 手指按下
    const startHandle = (e) => {
        e.preventDefault();
        e.stopPropagation()
        // console.log('startHandle', e)
        lineInfo.current = {
            startX: e.changedTouches[0].clientX - e.target.offsetLeft,
            startY: e.changedTouches[0].clientY - e.target.offsetTop,
            // fontSize: e.changedTouches[0].force,
        }
        context.current?.beginPath()
        // console.log(context.current)
    }
    // 手指移动
    const moveHandle = (e) => {
        e.preventDefault();
        e.stopPropagation()
        // console.log('moveHandle', e)
        let x = e.changedTouches[0].clientX - e.target.offsetLeft
        let y = e.changedTouches[0].clientY - e.target.offsetTop
        // let fontSize = 5// 1 + (e.changedTouches[0].force - 0.5)
        // fontSize = Math.abs(fontSize - lineInfo.current.fontSize) > 2 ? fontSize - lineInfo.current.fontSize : fontSize
        // console.log(fontSize, x, y, lineInfo.current.startX, lineInfo.current.startY)
        // context.current?.setLineWidth(fontSize)
        context.current?.moveTo(lineInfo.current.startX, lineInfo.current.startY)
        context.current?.lineTo(x, y)
        context.current?.stroke()
        setTimeout(() => {
            // 设置为异步，解决draw阻断touchmove事件，无效，使用微信3.3.5版本，并推送至微信才解决，不一定能解决线上版本的问题，在Canvas组件上disableScroll设置为true，解决touchmove延迟问题
            context.current?.draw(true)
        }, 50)
        lineInfo.current = {
            startX: x,
            startY: y,
            // fontSize: fontSize,
        }
    }
    // 手指抬起
    const endHandle = (e) => {
        e.preventDefault();
        e.stopPropagation()
        // console.log('endHandle', e)
        context.current?.closePath()
    }

    // 重置画板
    const resetHandle = () => {
        context.current?.draw()
        context.current?.setLineWidth(5)
        context.current?.setLineCap('round')
        context.current?.setLineJoin('round')
        Taro.createCanvasContext('saveBoard')?.draw()

        reset && reset()
    }

    // // oss上传url
    // const ossUpload = (row) => {
    //     return new Promise((resolve, reject) => {
    //         let { url, data, tmpUrl } = row
    //         Taro.uploadFile({
    //             url: url,
    //             filePath: tmpUrl,
    //             name: 'file',
    //             formData: {
    //                 ...data
    //             },
    //             success: (res) => resolve(res),
    //             fail: (err) => reject(false)
    //         })
    //     })
    // }
    // // 根据图片获取url
    // const uploadFileByAl = (row) => {
    //     return new Promise((resolve, reject) => {
    //         let { fileName, tmpUrl, size, type } = row
    //         const params = {
    //             fileName
    //         }
    //         getSignedUrlErpAPI(params).then(async (res) => {
    //             if (res.code == 200) {
    //                 const rowTemp = {
    //                     url: res.data.urlStr,
    //                     data: res.data,
    //                     tmpUrl,
    //                     fileInfo: {
    //                         size: size,
    //                         type: type,
    //                         name: fileName,
    //                         key: res?.data?.key
    //                     }
    //                 }

    //                 const result = await ossUpload(rowTemp)
    //                 // console.log('result', result)
    //                 result.params = rowTemp
    //                 resolve(result)
    //             } else {
    //                 reject(false)
    //             }
    //         }).catch((err) => reject(err))
    //     })
    // }

    // 保存签名
    const saveBoard = async (isTempSign) => {
        try {
            const { width, height } = whInfo
            const { tempFilePath } = await toDataUrl('drawBoard')

            // 保存图片的旋转操作
            // 竖向图片 转 横向图片
            const saveCanvas = Taro.createCanvasContext('saveBoard')
            await canvasDraw(saveCanvas, false)
            // const { path } = await getImageInfo(tempFilePath)
            saveCanvas?.translate(0, width)
            saveCanvas?.rotate(-90 * Math.PI / 180)
            saveCanvas?.drawImage(tempFilePath, 0, 0, width, height)
            await canvasDraw(saveCanvas)

            // canvas保存图片
            const { tempFilePath: tempFilePaths } = await toDataUrl('saveBoard')
            // console.log(tempFilePath, tempFilePaths, whInfo)

            // 获取文件大小
            let imgSize = await getFileInfo(tempFilePaths)
            // 获取图片信息
            let imgInfo = await getImageInfo(tempFilePaths)
            // console.log(imgSize, imgInfo)
            setLoading(true)
            const updateRes = await uploadFileByAl({
                type: imgInfo?.type,
                tmpUrl: tempFilePaths,
                size: imgSize?.size / 1024,
                fileName: name + '.' + imgInfo?.type,
            }).finally(() => { setLoading(false) })
            // console.log('updateRes', updateRes)
            updateRes.isSave = isSave
            // choose true 签名时保存，按钮逻辑改变，现在所有按钮都会保存签名
            updateRes.choose = true
            updateRes.isTempSign = isTempSign // 是否签名
            if (updateRes.errMsg == 'uploadFile:ok') {
                console.log('上传成功')

                // getUrlByKeysErpAPI({keys: updateRes.params.fileInfo.key}).then((res) => {
                //     console.log('down', res)
                // })
            }
            saveImg && saveImg(updateRes)
        } catch(err) {
            console.log(err)
            Taro.showToast({ title: '保存失败，请重试', icon: 'error' })
        }
    }
    return (
        <View className='g-draw flex flex-start'>
            <View className='g-draw-content'>
                <View className='g-draw-mask flex flex-center'><View>请在此签名</View></View>
                <Canvas
                    id='myDraw'
                    className='g-board'
                    canvasId='drawBoard'
                    disableScroll={true} // 加上这个之后，不再出现touchmove事件延迟问题
                    onTouchEnd={endHandle}
                    onTouchMove={moveHandle}
                    onTouchStart={startHandle}
                ></Canvas>
                <Canvas
                    id='saveDraw'
                    style={{width: whInfo?.height + 'px', height: whInfo?.width + 'px'}}
                    className='save-draw-board'
                    canvasId='saveBoard'
                ></Canvas>
            </View>
            <View className='g-draw-bottom flex flex-between flex-column'>
                {/* <View className='g-draw-left'>
                    {isSave != '0' && <View className='g-draw-left-box flex flex-start' onClick={() => setChoose(!choose)}>
                        <View className={`${choose ? 'primary-choose-active' : 'primary-choose'}`}></View>
                        <View className='g-draw-choose-text'>保存电子签名</View>
                    </View>}
                </View> */}
                <View className='g-draw-right flex flex-end flex-column'>
                    <AtButton className='new error' loading={loading || load} disabled={loading || load} onClick={() => Taro.navigateBack({ delta: 1 })}>退出</AtButton>

                    <View className='flex-grow'></View>
                    <AtButton className='new gray-btn' loading={loading || load} disabled={loading || load} onClick={resetHandle}>重写</AtButton>
                    {isSave == '0' ? 
                        <AtButton loading={loading || load} disabled={loading || load} type='primary' onClick={() => saveBoard(false)}>保存</AtButton> :
                    <>
                        <AtButton className='new gray-btn' loading={loading || load} disabled={loading || load} type='primary' onClick={() => saveBoard(false)}>仅保存</AtButton>
                        <AtButton loading={loading || load} disabled={loading || load} type='primary' onClick={() => saveBoard(true)}>保存并签名</AtButton>
                    </>}
                </View>
            </View>
        </View>
    )
}
