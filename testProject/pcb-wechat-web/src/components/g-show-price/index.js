// import './index.less'
// import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

export default function GShowPrice({ show, classStr = 'flex flex-start', style = '', children, click }) {
    return (
        <View className={`${classStr}`}>
            {show ? children : '**'}
            <View className={`${show ? 'primary-show-price' : 'primary-hide-price'} expend-click m-l-10`} style={style} onClick={() => click && click()}></View>
        </View>
    )
}
