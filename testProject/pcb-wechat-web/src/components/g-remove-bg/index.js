import Taro from '@tarojs/taro'
// import GClipImg from '../g-clip-img'
import { Canvas } from '@tarojs/components'
import { useRef, forwardRef, useImperativeHandle } from 'react'
import { createImage, getImageInfo, getDomInfo, toDataUrlNative } from '../../pages/util/func'


export default forwardRef(function GRemoveBg({}, ref) {
    // const GClipImgRef = useRef()
    const chooseImg = () => {
        return new Promise((resolve, reject) => {
            Taro.chooseImage({
                count: 1,
                success: async (res) => {
                    if (res.tempFiles?.length) {
                        try {
                            Taro.showLoading({ mask: true })
                            let {path,size} = res.tempFiles[0]
                            // console.log('size:', size)
                            if (size > 5 * 1024 * 1024) {
                                Taro.showToast({ title: '图片大小不可超过5M', icon: 'none' })
                                return
                            }
                            const imgInfo = await getImageInfo(path)
                            // if (imgInfo.width > 500) {
                            //     imgInfo.width = imgInfo.width / 2
                            //     imgInfo.height = imgInfo.height / 2
                            // }
                            // console.log('imgInfo:', imgInfo)

                            // 初始化画布
                            const domArr = await getDomInfo('#removeBgId')
                            const canvas = domArr[0].node
                            canvas.width = imgInfo.width
                            canvas.height = imgInfo.height
                            // console.log(canvas)
                            const ctx = canvas.getContext('2d')
                            // console.log(ctx)

                            // 清空画布，防止上次绘制残留
                            ctx.clearRect(0, 0, imgInfo.width, imgInfo.height)

                            // 获取图片
                            const image = await createImage(canvas, path)
                            ctx.drawImage(image, 0, 0, imgInfo.width, imgInfo.height)
                            
                            // 对图片像素进行二值化处理
                            const imgData = await ctx.getImageData(0, 0, imgInfo.width, imgInfo.height)
                            // let startTime = new Date().getTime()
                            let pixArr = []
                            await imgData.data.map((item, i) => {
                                if (i % 4 == 0) {
                                    let r = imgData.data[i]
                                    let g = imgData.data[i + 1]
                                    let b = imgData.data[i + 2]
                                    let a = imgData.data[i + 3]
                                    let sum = (r + g + b) / 3
                                    let index = 120 // 阀值
                                    // let index = 255 / 2 // 阀值
                                    if (sum > index) {
                                        imgData.data[i] = 0
                                        imgData.data[i + 1] = 0
                                        imgData.data[i + 2] = 0
                                        imgData.data[i + 3] = 0
                                    } else {
                                        imgData.data[i] = 255
                                        imgData.data[i + 1] = 0
                                        imgData.data[i + 2] = 0
                                        imgData.data[i + 3] = 255
                                        // // 找到第一个红色像素点，i / 4 是像素的横坐标，i % 4 是像素的纵坐标
                                        // const x = (i / 4) % imgInfo.width
                                        // const y = Math.floor((i / 4) / imgInfo.width)
                                        // // 输出位置
                                        // // console.log(`红色像素点位置：x = ${x}, y = ${y}`)
                                        // pixArr.push({
                                        //     x,
                                        //     y,
                                        // })
                                    }
                                }
                            })
                            // let endTime = new Date().getTime()
                            // console.log('执行时间：', (endTime - startTime) / 1000)
                            ctx.putImageData(imgData, 0, 0)

                            // // 取出上方第一点 y最小
                            // let top = imgInfo.height
                            // pixArr.map((m) => top = top >= m.y ? m.y : top)
                            // // 取出下方第一点 y最大
                            // let bottom = 0
                            // pixArr.map((m) => bottom = bottom >= m.y ? bottom : m.y)
                            // // 取出左方第一点 x最小
                            // let left = imgInfo.width
                            // pixArr.map((m) => left = left >= m.x ? m.x : left)
                            // // 取出右方第一点 x最大
                            // let right = 0
                            // pixArr.map((m) => right = right >= m.x ? right : m.x)
                            // // console.log(top, bottom, left, right)
                            // let blank = 2
                            // let newY = top - blank
                            // let newX = left - blank
                            // let newW = right - left + (blank * 3.5)
                            // let newH = bottom - top + (blank * 3)
                            // const newImgData = ctx.getImageData(newX, newY, newW, newH)
                            // // console.log(newW, newH)

                            // 生成图片
                            const result = await toDataUrlNative(canvas)
                            // const clipRes = await GClipImgRef.current.startClip({
                            //     x: newX,
                            //     y: newY,
                            //     width: newW,
                            //     height: newH,
                            //     imgData: newImgData
                            // })
                            Taro.hideLoading()
                            resolve(result.tempFilePath)
                            // resolve(clipRes)
                        } catch(err) {
                            reject(err)
                        }
                    }
                },
                fail: (err) => reject(err)
            })
        })
    }
    useImperativeHandle(ref, () => ({
        chooseImg
    }))
    return (
        <>
        <Canvas type='2d' id='removeBgId' style={{
            position: 'fixed',
            top: 0,
            left: '9999px',
        }}></Canvas>
        {/* <GClipImg ref={GClipImgRef}></GClipImg> */}
        </>
    )
})
