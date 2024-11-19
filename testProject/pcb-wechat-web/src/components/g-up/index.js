import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

export default function GUp({zIndex,style={}}) {
    const upHandle = () => {
        Taro.pageScrollTo({ scrollTop: 0, duration: 100 })
    }
    return (
        <View className='g-up-box flex flex-center' style={{zIndex: zIndex, ...style}} onClick={upHandle}>
            <View className="primary-up-page"></View>
        </View>
    )
}
