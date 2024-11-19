import './index.less'
import { useState } from "react"
import { AtNavBar } from "taro-ui"
import { getGlobalData } from "../../global"
import Taro, { useLoad } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'


export default function NavBar({
    title,
    color,
    fixed,
    large,
    border,
    leftText,
    transparent,
    leftIconType,
    rightFirstIconType,
    rightSecondIconType,
    onClickLeftIcon,
    onClickRgIconSt,
    onClickRgIconNd,
}) {
    const [isRedirect, setIsRedirect] = useState(0)
    useLoad((options) => {
        // console.log('options----', options)
        if (options?.isRedirect) setIsRedirect(options?.isRedirect)
        if (options?.companyId) {
            const currentInstance = Taro.getCurrentInstance()?.router
            let path = `url=${currentInstance.path}`
            let params = JSON.parse(JSON.stringify(currentInstance?.params))
            // delete params?.companyId
            delete params?.$taroTimestamp
            if (JSON.stringify(params) != '{}') {
                let str = ''
                for (let key in params) {
                    str += `&${key}=${params[key]}`
                }
                path += str
                path = path.replace('?&', '?')
            }
            console.log(currentInstance, path, params, JSON.stringify(params))
            Taro.setStorageSync('__RedirectInfo__', path)
            // Taro.setStorageSync('__CompanyId__', options?.companyId)
        }
        // getGlobalData('statusHeight')
        // getGlobalData('menuButtonHeight')
    })
    const backHandle = () => {
        if (isRedirect == 1) {
            // const pathArr = Taro.getCurrentPages()
            // console.log('pathArr:', pathArr)
            Taro.redirectTo({ url: '/pages/home/home' })
        } else if (leftIconType == 'home') {
            let token = Taro.getStorageSync('__TOKEN__');
            if (token) {
                // token存在即已登录，点击 home 图标，返回首页
                Taro.redirectTo({ url: '/pages/home/home' })
                Taro.removeStorageSync('__RedirectInfo__')
            } else {
                // token不存在即未登录，点击 home 图标，返回登录页
                Taro.redirectTo({ url: '/pages/index/index' })
                Taro.removeStorageSync('__RedirectInfo__')
            }
        } else if (leftIconType || leftText) {
            Taro.navigateBack({ delta: 1 })
        }
        onClickLeftIcon && onClickLeftIcon()
    }
    return (
        <>
        <View className="nav-bar-mask" style={`height: ${getGlobalData('menuButtonInfo').height+getGlobalData('menuButtonInfo').top}px;`}></View>
        <View className={`nav-bar ${transparent && 'transparent'} ${large && "nav-bar-large"}`} style={`height: ${getGlobalData('menuButtonInfo').height}px; padding-top: ${getGlobalData('menuButtonInfo').top}px;`}>
            <View className="fixed-nav-bar" style={`height: ${getGlobalData('menuButtonInfo').height}px; top: ${getGlobalData('menuButtonInfo').top}px;`}>
            {/* style={`height: ${getGlobalData('menuButtonInfo').height}px; top: ${getGlobalData('menuButtonInfo').top}px;`} */}
                <AtNavBar
                    color={color}
                    title={title}
                    border={border || false}
                    leftText={leftText}
                    leftIconType={leftIconType}
                    rightFirstIconType={rightFirstIconType}
                    rightSecondIconType={rightSecondIconType}
                    onClickLeftIcon={backHandle}
                    onClickRgIconSt={onClickRgIconSt}
                    onClickRgIconNd={onClickRgIconNd}
                    // style={`top: ${getGlobalData('menuButtonInfo').top}px;`}
                    // style={`top: ${getGlobalData('menuButtonInfo').top}px;`}
                ></AtNavBar>
            </View>
        </View>
        </>
    )
}
