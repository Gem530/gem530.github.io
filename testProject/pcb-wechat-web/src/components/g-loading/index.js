import './index.less'
// import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

export default function GLoading({ loading = false, icon, size = '30', color = '#fff', classStr = 'flex flex-center', style = '', children }) {
    return (
        <>
        {
            loading ?
            <>
            <View className={`loading-box ${classStr}`} style={style}>
                <View className='loading-cricle'>{icon ? icon : <AtIcon value="loading-3" size={size} color={color}></AtIcon>}</View>
            </View>
            </> :
            (children ? children : <></>)
        }
        </>
    )
}
