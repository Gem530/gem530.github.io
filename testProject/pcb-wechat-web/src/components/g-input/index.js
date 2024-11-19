import { useState } from "react";
import { AtIcon, AtButton, AtInput } from "taro-ui"
import Taro, { useLoad } from '@tarojs/taro'
import {View,Input} from '@tarojs/components'
import './index.less'


export default function GInput({color = '#999', value, onInput, placeholder, slot, slotIcon, clear, clearShow, onConfirm}) {
    useLoad(() => {

    })
    const changeHandle = (e) => {
        // console.log(e.detail.value)
        onInput(e.detail.value)
    }
    const clearHandle = (e) => {
        // console.log(e, '1212')
        clear()
        // value = undefined
    }
    return (
        <View className="g-input flex">
            {slotIcon ? slotIcon : <AtIcon value='search' size='16' color="#999" className="g-icon"></AtIcon>}
            {slot ? slot : <Input value={value} onInput={changeHandle} placeholder={placeholder} onConfirm={onConfirm}></Input>}
            {clearShow && value && <View className="clear-icon flex flex-center" onClick={clearHandle}><AtIcon value='close' size='12' color={color}></AtIcon></View>}
        </View>
    )
}
