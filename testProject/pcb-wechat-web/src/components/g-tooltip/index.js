import Taro from "@tarojs/taro"
import { useState } from "react"
import { View } from '@tarojs/components'
import { AtIcon, AtModal, AtModalContent }  from 'taro-ui'


export default function GTooltip({msg, icon, size = 20, color = '#999', msgSlot}) {
    const [open, setOpen] = useState(false)
    const openDialog = () => {
        if (msgSlot) {
            setOpen(true)
        } else {
            Taro.showModal({
                content: msg,
                showCancel: false,
                confirmText: '知道了'
            })
        }
    }
    return (
        <>
        <View className="expend-click" onClick={openDialog}>{icon ? icon : <AtIcon value='help' size={size} color={color}></AtIcon>}</View>
        {/* {icon ? icon : <View className="expend-click" onClick={() => setOpen(true)}><AtIcon value='help' size={size} color='#999'></AtIcon></View>} */}
        {open ? <AtModal isOpened={open} onClose={() => setOpen(false)} className='new'>
            <AtModalContent>
                <View style={`width: 100%;height: 100%;`}>{msgSlot}</View>
            </AtModalContent>
        </AtModal> : <></>}
        </>
    )
}
