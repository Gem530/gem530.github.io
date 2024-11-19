import { useState, useEffect } from "react";
import Taro, {useLoad, useDidShow} from '@tarojs/taro'
import {Input, Image, View} from '@tarojs/components'
import scan from "../../../../public/static/scan1.png";
import Search from "../../../components/searchOld/index";
import QrcodeCard from "../../../components/qrcode-card/index";
import './report.less'
import {getCurrentCardAPI, createCapacityAPI} from '../../services/productWork/index'
// import GFeedback from "../../../components/g-feedback";


export default function Report() {
    const [id, setId] = useState(undefined)
    const [card, setCard] = useState(undefined)
    const [loading, setLoading] = useState(false)
    // const [work, setWork] = useState(undefined)
    const [random, setRandom] = useState(Math.random)
    
    // useEffect(() => {
    //     // console.log(random)
    //     const res = Taro.getStorageSync('code_data')
    //     console.log('code_data', res)
    //     if (res) {
    //         setId(res.cardId)
    //         setCard(res)
    //         // setWork(res.data)
    //     }
    // }, [random])
    // 获取流转卡详情信息
    const getCardDetail = (cardId) => {
        // setId(undefined)
        setCard(undefined)
        // type 1:详情 2:工序以及面积、产品
        getCurrentCardAPI({cardId: cardId}).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                setId(res.data.cardId)
                setCard(res.data)
                // setWork(res.data)
                Taro.setStorageSync('code_data', res.data)
            }
        })
    }
    // 上报函数
    const createCapacityHandle = (params) => {
        setLoading(true)
        createCapacityAPI(params).then((res) => {
            if (res.code == 200) {
                setId(undefined)
                setCard(undefined)
                Taro.removeStorageSync('code_data')
                Taro.showToast({
                    title: '上报成功',
                    icon: 'success',
                    duration: 1500
                })
            }
        }).finally(() => {
            setLoading(false)
        })
    }
    const onScanQrCode = () => {
        Taro.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                console.log(res)
                // setId(res.result)
                // setCard(res.result)
                getCardDetail(res.result)
            },
            fail: (err) => {
                if (!err.errMsg.includes('scanCode:fail cancel')) {
                    Taro.showToast({
                        title: '识别失败，请重试',
                        icon: 'error',
                        duration: 1500
                    })
                }
            }
        })
    }

    // 上报
    const reportHandle = (e) => {
        const params = {
            productionId: card.productionId,
            cardId: card.cardId,
            craftId: e.workInfo.id,
            productionCardNodeId: e.workInfo.id,
            reportedQuantity: e.pnlNum,
            auditQuantity: 0,
            unit: e.workInfo.unit,
            // saleOrderId: e.prodInfo.id,
        }
        if (e.workInfo.unit == '2') {
            params.saleOrderId = e.prodInfo.id
        }
        // console.log('--', e, params)
        createCapacityHandle(params)
    }
    return (
        <view className={`report-box ${!id && 'report-box-bottom'}`}>
            {!id && <View>
                <Image className="qrcode-image" src={scan} mode='widthFix' onClick={onScanQrCode}></Image>
                <View style='text-align: center;'>请点击图标扫码</View>
            </View>
            }
            {id && card && 
                <view>
                    <Search
                        inputView={<Input value={card.cardCode} disabled className="search-input"></Input>}
                        buttonView={<Image src={scan} className="qrcode-mini-image" mode='widthFix' onClick={onScanQrCode}></Image>}>
                    </Search>
                    
                    <QrcodeCard id={id} card={card} onChange={reportHandle} loading={loading}></QrcodeCard>
                </view>
            }
            {/* <GFeedback></GFeedback> */}
        </view>
    )
}
