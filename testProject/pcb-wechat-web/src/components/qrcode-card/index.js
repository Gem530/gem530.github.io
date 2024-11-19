import { subscribeMessage } from '../../pages/util/func'
import { useState, useEffect } from "react";
import { AtIcon, AtForm, AtInput, AtButton, AtList, AtListItem }  from 'taro-ui'
import Taro, {useLoad} from '@tarojs/taro'
import {View, Picker} from '@tarojs/components'
import AreaDialog from "../area-dialog";
import './index.less'
import {getCurrentCardAPI, queryUserDeptNodeListAPI} from '../../pages/services/productWork/index'

export default function QrcodeCard({id, card, onChange, loading}) {
    const [data, setData] = useState()
    const [area, setArea] = useState(0)
    const [open, setOpen] = useState(false)
    const [pnlNum, setPnlNum] = useState(undefined)
    const [workInfo, setWorkInfo] = useState(undefined)
    const [workList, setWorkList] = useState([])
    const [prodInfo, setProdInfo] = useState([])
    const [prodList, setProdList] = useState([])
    const [areaList, setAreaList] = useState([])
    useLoad(() => {
    })
    const getCardDetail = (cardId, craftId) => {
        // type 1:详情 2:工序以及面积、产品
        getCurrentCardAPI({cardId: cardId, craftId: craftId}).then((res) => {
            if (res.code == 200) {
                setProdList(res.data.saleOrderVoList)
                setProdInfo(res.data.saleOrderVoList[0])

                setAreaList(res.data.personalCapacityVoList || [])
                setArea(res.data.alreadyReportedArea || 0)
                setData(res.data)
            }
        })
    }
    const getUserDeptNodeList = () => {
        queryUserDeptNodeListAPI().then((res) => {
            if (res.code == 200) {
                if (res.rows?.length) {
                    setWorkList(res.rows)
                    setWorkInfo(res.rows[0])
                }
            }
        })
    }
    useEffect(() => {
        setPnlNum(undefined)
        getUserDeptNodeList()
        getCardDetail(id, card.productionCardNodeVoList?.length && card.productionCardNodeVoList[0].craftId)
    }, [id])
    const selectWork = (e) => {
        // console.log(e)
        setWorkInfo(workList[Number(e.detail.value)])
        getCardDetail(id, workList[Number(e.detail.value)].id)
    }
    const selectProd = (e) => {
        // console.log(e)
        setProdInfo(prodList[Number(e.detail.value)])
    }
    const checkData = () => {
        let res = ''
        if (!workInfo) {
            res = '请选择工序'
        } else if (!pnlNum) {
            res = '请填写个人产能'
        } else if (pnlNum <= 0) {
            res = '个人产能需大于0'
        }
        return res
    }
    const reportClick = () => {
        const errMsg = checkData()
        if (errMsg) {
            Taro.showToast({
                title: errMsg,
                icon: 'none',
                duration: 1500
            })
            return
        }
        // console.log(workInfo, pnlNum)
        subscribeMessage().finally(() => {
            onChange({workInfo, prodInfo, pnlNum})
        })
    }
    const openClick = () => {
        setOpen(true)
        // setAreaList([{ id: 1, index: 1, reportName: 'admin' + Math.random(), reportNum: '200', reportArea: '0.1200', createdTime: '2024-03-12 12:12' }])
    }
    return (
        <View className='qrcode-card'>
            <View className='flex flex-between'>
                <View className='qrcode-item'>
                    {card.cardCode && card.cardCode.includes('-') ? card.cardCode.split('-').map((m) => {
                        <View>{m}</View>
                    }) : card.cardCode}
                </View>
                <View className='flex-grow'></View>
                <View className='qrcode-item'>
                    <AtButton size='small' type='primary' loading={loading} disabled={loading} onClick={reportClick}>
                        <View className="flex flex-center">
                            <AtIcon value='external-link' size='16'></AtIcon>
                            <text style='margin-left: 6px;'>上报</text>
                        </View>
                    </AtButton>
                </View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>产品编码：{card.commodityCode}</View>
            </View>
            <View className='flex flex-between'>
                <View className='qrcode-item'>本卡面积：{data?.cardArea || card.cardArea} ㎡</View>
                <View className='qrcode-item'>本卡数量：{card.bundlePnlQuantity} PNL</View>
            </View>
            {workInfo && <View className='flex flex-between'>
                <View className='qrcode-item' style='color: #6190e8;' onClick={openClick}>已上报面积：{area || 0} ㎡</View>
            </View>}
            <View>
                <Picker className="qrcode-picker" rangeKey='nodeName' mode='selector' range={workList} onChange={selectWork}>
                    <AtInput title='所属工序：' disabled value={workInfo?.nodeName} placeholder="请选择工序">
                        <AtIcon value='chevron-down' size='16'></AtIcon>
                    </AtInput>
                </Picker>
            </View>
            {workInfo && workInfo.unit == '2' && <View>
                <Picker className="qrcode-picker" rangeKey='commodityCode' mode='selector' range={prodList} onChange={selectProd}>
                    <AtInput title='选择产品：' disabled value={prodInfo?.commodityCode} placeholder="请选择产品">
                        <AtIcon value='chevron-down' size='16'></AtIcon>
                    </AtInput>
                </Picker>
            </View>}
            <View>
                {/* pnl 1, set 2 */}
                <AtInput title='个人产能：' type='number' value={pnlNum} onChange={(e) => setPnlNum(e)} placeholder="请填写个人产能">
                    <View>{workInfo && workInfo.unit == '2' ? 'SET' : 'PNL'}</View>
                </AtInput>
            </View>
            {open && <AreaDialog value={open} list={areaList} onChange={(e) => setOpen(e)}></AreaDialog>}
        </View>
    )
}
