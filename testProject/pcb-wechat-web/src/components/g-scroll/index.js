import Taro from '@tarojs/taro'
import { useRef, useEffect } from 'react'
import { AtButton, AtDrawer } from "taro-ui"
import { View, ScrollView } from '@tarojs/components'
import { useState, forwardRef, useImperativeHandle } from "react";

export default forwardRef(function GScroll({
    children,
    onScrollToLower
}, ref) {
    const [scrollIntoId, setScrollIntoId] = useState('')

    // 滚动中
    const onScroll = () => {
        setScrollIntoId('')
    }

    useImperativeHandle(ref, () => ({
    }))
    return (
        <ScrollView
            scrollY
            onScroll={onScroll}
            scrollIntoView={scrollIntoId}
            onScrollToLower={onScrollToLower}
        >{children}</ScrollView>
    )
})