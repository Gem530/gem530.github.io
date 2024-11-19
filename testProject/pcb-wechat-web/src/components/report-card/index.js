import { useState } from "react";
import { AtTag }  from 'taro-ui'
import Taro, {useLoad} from '@tarojs/taro'
import {View, Picker} from '@tarojs/components'
import AreaDialog from "../area-dialog";
import './index.less'
import { statusType } from '../../pages/util/enum'


export default function ReportCard({data, type}) {
    const [open, setOpen] = useState(false)
    // const [areaList, setAreaList] = useState([])
    useLoad(() => {
    })
    const openClick = (e) => {
        e.stopPropagation()
        setOpen(true)
    }

    const toDetail = (item) => {
        // console.log(item)
        if (item.status == '8') {
            // 只有驳回才跳转
            Taro.navigateTo({
                url: `/pages/againReport/index?id=${item.cardId}&craftId=${item.craftId}`
            })
        }
    }
    // 1审核完成 2待部门主管审核 3待生产经理审核
    return (
        <View className='report-card'>
            {/* <View onClick={() => toDetail(data)}> */}
                <View className='flex flex-between'>
                    <View className='qrcode-item'>
                        {data.cardCode && data.cardCode.includes('-') ? data.cardCode.split('-').map((m) => {
                            <View>{m}</View>
                        }) : data.cardCode}
                    </View>
                    <View className='flex-grow'></View>
                    <View className='qrcode-item'>
                        {data.status && <AtTag active circle className={`${data.status == 1 && 'tag-success'} ${['8','9'].includes(data.status + '') && 'tag-error'}`}>{statusType[data.status]}</AtTag>}
                    </View>
                </View>
                <View className='flex flex-between'>
                    <View className='qrcode-item'>产品编码：{data.commodityCode}</View>
                </View>
                <View className='flex flex-between'>
                    <View className='qrcode-item'>本卡面积：{data.cardArea || 0} ㎡</View>
                    <View className='qrcode-item'>本卡数量：{data.bundlePnlQuantity || 0} PNL</View>
                </View>
                <View className='flex flex-between'>
                    <View className='qrcode-item' style='color: #6190e8;' onClick={openClick}>本卡已上报面积：{data.totalArea || 0} ㎡</View>
                </View>
                <View className='flex flex-between' style='font-weight: 600;'>
                    <View className='qrcode-item'>上报面积：{data.alreadyReportedArea || 0} ㎡</View>
                    <View className='qrcode-item'>个人产能：{data.auditQuantity || data.reportedQuantity} {data.unit == 2 ? 'SET' : 'PNL'}</View>
                </View>
                <View className='flex flex-between'>
                    {type == 2 && <View className='qrcode-item'>上报人：{data.createByName}</View>}
                    <View className='qrcode-item'>上报时间：{data.createTime}</View>
                    {type == 1 && <View className='qrcode-item'>上报工序：{data.craftName}</View>}
                </View>
                {type == 2 && <View className='flex flex-between'>
                    <View className='qrcode-item'>上报工序：{data.craftName}</View>
                </View>}
            {/* </View> */}
            {open && <AreaDialog value={open} list={data.personalCapacityVoList || []} voidList={data.voidList || []} onChange={(e) => setOpen(e)}></AreaDialog>}
        </View>
    )
}
