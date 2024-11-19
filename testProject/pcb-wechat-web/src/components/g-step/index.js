// import './index.less'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'


export default function GStep({list, current}) {
    useLoad(() => {
    })
    return (
        <View className='common-step'>
            {
                list.map((item, index) => {
                    return (
                        <>
                        <View className={`common-step-item ${index < current && 'pass'} ${current == index && 'wait'} ${index > current && 'gray'}`}>
                            <View className='common-step-item-content'>
                                <View className={`${index < current && 'primary-flow-pass'} ${current == index && 'primary-flow-wait'} ${index > current && 'primary-flow-gray'}`}></View>
                                <View className='common-step-item-content-text'>{item}</View>
                            </View>
                        </View>
                        {(list.length - 1) != index && <View className={`common-step-item-line  ${index < current ? 'primary-flow-line-blue' : 'primary-flow-line-gray'}`}></View>}
                        </>
                    )
                })
            }
        </View>
    )
}
