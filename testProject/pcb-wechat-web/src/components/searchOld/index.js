import Taro, {useLoad} from '@tarojs/taro'
import {Button, Image, View} from '@tarojs/components'
import './index.less'


export default function SearchOld({inputView, buttonView, style}) {
    useLoad(() => {

    })
    return (
        <View className='search-box at-row'>
            <View className='at-col' style={style}>
                {inputView}
            </View>
            {buttonView ? <View className='at-col at-col-1 at-col--auto' style={style}>
                {buttonView}
            </View> : <></>}
        </View>
    )
}
