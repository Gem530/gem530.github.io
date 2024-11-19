import './index.less'
import { useState } from 'react'
import GSearch from '../g-search'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import {
    verifyPermissionMaterialAPI, verifyPermissionSourceFullAPI, verifyPermissionSourceHalfAPI, orderDataIsolationMaterialAPI, orderDataIsolationOutsourceAPI, accountOrderCheckAPI
} from '../../pages/services/materialRequisition'

export default function CSearch({showScan = true, placeholder, type, search, scanPath, params = '', scanError, inputChange, bgWhite = false}) {
    const [value, setValue] = useState('')
    useLoad(() => {})

    // 搜索事件
    const searchHandle = () => {
        search(value)
    }

    // 扫码二维码
    const scanQr = (params) => {
        if (['2'].includes(type+'')) {
            // 采购送货
            return verifyPermissionMaterialAPI(params.id)
        } else if (['6'].includes(type+'')) {
            // 订单外协送货
            return verifyPermissionSourceFullAPI(params.id)
        } else if (['10'].includes(type+'')) {
            // 工序外协送货
            return verifyPermissionSourceHalfAPI(params.id)
        } else if (['1','3'].includes(type+'')) {
            // 采购合同、退货
            return orderDataIsolationMaterialAPI(params)
        } else if (['5','7','9'].includes(type+'')) {
            // 外协合同、退货
            return orderDataIsolationOutsourceAPI(params)
        } else if (['4','8','11'].includes(type+'')) {
            // 外协合同、退货
            return accountOrderCheckAPI(params)
        }
    }

    const inputHandle = (e) => {
        inputChange && inputChange(e)
        setValue(e)
    }

    // 扫码按钮
    const scanHandle = () => {
        Taro.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                console.log(res)
                // scan(res.result)
                try {
                    let crt = JSON.parse(res.result)
                    // if (!crt?.type || !crt?.status || !crt.id) {
                    // 目前供应商和客户可以查询所有状态数据的单，不需要根据状态区分
                    if(!crt?.type || !crt.id) {
                        console.log(11)
                        Taro.showToast({ title: '不可操作', icon: 'none', duration: 1500 })
                        return
                    }
                    if (crt?.type != type) {
                        console.log(222)
                        let tempStr = ['采购合同','采购送货单','采购退货单','采购对账单','订单外协合同','订单外协送货单','订单外协退货单','订单外协对账单','工序外协接单','工序外协送货单','工序外协对账单']
                        Taro.showToast({ title: `请扫描${tempStr[(Number(type) - 1)]}二维码`, icon: 'none', duration: 1500 })
                        return
                    }
                    scanQr(crt).then((res) => {
                        if (res.code == 200) {
                            let str = ''
                            if (crt?.status) {
                                str = `&status=${crt.status}`
                            }
                            Taro.navigateTo({ url: `${scanPath}?id=${crt?.id}${str}${params}` })
                        }
                    })
                    // if (['1','3','5','7'].includes(type+''))
                    // if (crt?.status != '3') {
                    //     if (['1','3','5','7'].includes(type+'')) {
                    //         // 合同，退货
                    //         if (crt.status == '1') {
                    //             Taro.showToast({ title: tempStr[Number(type) - 1]+'待对方确认暂不可操作', icon: 'none', duration: 1500 })
                    //             return
                    //         }
                    //     } else if (['2','6','10'].includes(type+'')) {
                    //         // 合同，退货
                    //         if (crt.status == '2') {
                    //             Taro.showToast({ title: tempStr[Number(type)]+'待对方确认暂不可操作', icon: 'none', duration: 1500 })
                    //             return
                    //         }
                    //     }
                    // }
                } catch(err) {
                    Taro.showToast({ title: '不可操作', icon: 'none', duration: 1500 })
                    console.log(err)
                }
            },
            fail: (err) => {
                console.log(err)
                if (!err?.errMsg.includes('scanCode:fail cancel'))
                Taro.showToast({
                    title: '识别失败，请重试',
                    icon: 'error',
                    duration: 1500
                })
            }
        })
    }
    return (
        <View className={`c-search flex flex-start ${bgWhite && 'bg-white'}`}>
            <GSearch value={value} onInput={(e) => inputHandle(e)} placeholder={placeholder} search={searchHandle} onConfirm={searchHandle}></GSearch>
            {showScan ? <View className='primary-search-scan' onClick={scanHandle}></View> : <></>}
        </View>
    )
}