import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'


export default function GTag({newF = false, classStr, list = [], tagInfo, style, choose}) {
    useLoad(() => {
    })
    const chooseHandle = (item) => {
        choose && choose(item)
    }
    return (
        <View className={`g-tag-list ${newF && 'new'} ${classStr || ''}`}>
        {
            list?.length ? list.map((item, index) => {
                return (
                    <View style={style} className={`g-tag ${item?.id == tagInfo?.id && 'active'}`} onClick={() => chooseHandle(item)}>{item.name}</View>
                )
            }) : <></>
        }
        </View>
    )
}
