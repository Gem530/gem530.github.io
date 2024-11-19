import { useState } from "react";
import { AtIcon, AtButton, AtInput } from "taro-ui"
import Taro, { useLoad } from '@tarojs/taro'
import {View,Input} from '@tarojs/components'
import './index.less'


export default function GSearch({value, onInput, placeholder, slot, clear, searchBtn, search, onConfirm}) {
    useLoad(() => {
    })
    const changeHandle = (e) => {
        // console.log(e.detail.value)
        onInput(e.detail.value)
    }
    const searchHandle = (e) => {
        // console.log(e, '1212')
        search()
        // value = undefined
    }
    return (
        <View className="g-search flex">
            {slot ? slot : <Input value={value} onInput={changeHandle} onConfirm={onConfirm} placeholder={placeholder}></Input>}
            {searchBtn ? searchBtn : <AtButton className="search-icon flex flex-center" onClick={searchHandle}><AtIcon value='search' size='16' color="rgba(51, 51, 51, 1)"></AtIcon></AtButton>}
        </View>
    )
}
