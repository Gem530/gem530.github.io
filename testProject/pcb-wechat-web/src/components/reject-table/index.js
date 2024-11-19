import {View} from '@tarojs/components'
import './index.less'


export default function RejectTable({list, areaView, num}) {
    return (
        <View className='reject-box'>
            <View className='area-table'>
                <View className='area-tr'>
                    <View className='area-td'>序号</View>
                    <View className='area-td'>上报人</View>
                    <View className='area-td'>驳回/作废原因</View>
                    <View className='area-td'>驳回/作废时间</View>
                </View>
                <View className='area-body'>
                {
                    (list && list.length) ? list.map((item, index) => {
                        return (<View className='area-tr'>
                            <View className='area-td'>{index + 1}</View>
                            <View className='area-td'>{item.createByName}</View>
                            <View className='area-td'>{item?.reason}</View>
                            <View className='area-td'>{item.voidTime}</View>
                        </View>)
                    }) : <View className='flex flex-center area-table-empty'>暂无数据</View>
                }
                </View>
            </View>
        </View>
    )
}
