import {View} from '@tarojs/components'
import './index.less'


export default function AreaTable({list, areaView, num}) {
    return (
        <View className='area-box'>
            <View className='area-table'>
                <View className='area-tr'>
                    <View className='area-td'>序号</View>
                    <View className='area-td'>上报人</View>
                    <View className='area-td'>上报数量</View>
                    <View className='area-td'>上报面积(㎡)</View>
                    <View className='area-td'>上报时间</View>
                </View>
                <View className='area-body'>
                {
                    (list && list.length) ? list.map((item, index) => {
                        return (<View className='area-tr'>
                            <View className='area-td'>{index + 1}</View>
                            <View className='area-td'>{item.createByName}</View>
                            <View className='area-td'>{num ? num(item) : (Number(item.auditQuantity) > 0 ? item.auditQuantity : item.reportedQuantity)} {item.unit == 2 ? 'SET' : 'PNL'}</View>
                            <View className='area-td'>{areaView ? areaView(item) : item.alreadyReportedArea}</View>
                            <View className='area-td'>{item.createTime}</View>
                        </View>)
                    }) : <View className='flex flex-center area-table-empty'>暂无数据</View>
                }
                </View>
            </View>
        </View>
    )
}
