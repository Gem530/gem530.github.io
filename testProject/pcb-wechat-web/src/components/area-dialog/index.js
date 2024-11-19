// import { useEffect, useState } from "react";
// import { useLoad, useDidShow } from '@tarojs/taro'
import { AtCurtain, AtModal, AtModalHeader, AtModalContent }  from 'taro-ui'
import { View } from '@tarojs/components'
import AreaTable from '../area-table'
import RejectTable from '../reject-table'
import './index.less'


export default function AreaDialog({value, list, onChange, voidList}) {
    // const [lists, setLists] = useState([])
    // useEffect(() => {
    //     setLists(list || [])
    //     console.log('-', list)
    // }, [list])
    const onClose = (e) => {
        // console.log(e, list)
        onChange(false)
    }
    return (
        <AtModal isOpened={value} onClose={onClose} className='area-dialog-mask'>
            <AtModalHeader>上报面积记录</AtModalHeader>
            <AtModalContent>
                <View className='area-dialog'>
                    {/* <View className='area-dialog-title'>上报面积记录：</View> */}
                    <View className='area-content'>
                        <AreaTable list={list}></AreaTable>
                    </View>

                    {voidList && <View className='area-content'>
                        <View className='area-dialog-title'>驳回/作废记录</View>
                        <RejectTable list={voidList}></RejectTable>
                    </View>}
                </View>
            </AtModalContent>
            {/* <AtModalAction> <Button>取消</Button> <Button>确定</Button> </AtModalAction> */}
        </AtModal>
        // <AtCurtain
        //     isOpened={value}
        //     onClose={onClose}
        // >
        // </AtCurtain>
    )
}
