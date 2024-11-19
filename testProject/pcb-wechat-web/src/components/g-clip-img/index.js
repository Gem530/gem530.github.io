import Taro from '@tarojs/taro'
import { Canvas } from '@tarojs/components'
import { forwardRef, useImperativeHandle } from 'react'
import { getDomInfo, toDataUrlNative } from '../../pages/util/func'


export default forwardRef(function GClipImg({}, ref) {
    const startClip = (params) => {
        return new Promise(async (resolve, reject) => {
            try {
                Taro.showLoading({ mask: true })
                Taro.hideLoading()
                // 初始化画布
                const domArr = await getDomInfo('#clipImg')
                const canvas = domArr[0].node
                canvas.width = params.width
                canvas.height = params.height
                // console.log(canvas)
                const ctx = canvas.getContext('2d')
                // console.log(ctx)

                // 清空画布，防止上次绘制残留
                ctx.clearRect(0, 0, params.width, params.height)
                ctx.putImageData(params.imgData, 0, 0)
                // 生成图片
                const result = await toDataUrlNative(canvas)
                resolve(result.tempFilePath)
            } catch(err) {
                reject(err)
            }
        })
    }
    useImperativeHandle(ref, () => ({
        startClip
    }))
    return (
        <Canvas type='2d' id='clipImg' style={{
            position: 'fixed',
            top: 0,
            left: '9900px',
        }}></Canvas>
    )
})
