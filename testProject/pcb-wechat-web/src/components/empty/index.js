// import './index.less'
import Taro, { useLoad } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'


export default function Empty({text, classText, styleBox}) {
    useLoad(() => {
    })
    const changeHandle = (e) => {
        // console.log(e.detail.value)
        onInput(e.detail.value)
    }
    const searchHandle = (e) => {
        console.log(e, '1212')
        search()
        // value = undefined
    }
    return (
        <View className="empty-box flex flex-center flex-column" style={styleBox}>
            <View className={`empty-content ${classText ? classText : 'empty-default'}`}></View>
            <View className="empty-text">{text || '暂无数据'}</View>
        </View>
    )
}
