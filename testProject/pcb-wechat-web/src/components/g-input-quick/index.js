import './index.less'
import { View } from '@tarojs/components'
import GTagHistory from '../g-tag-history'
import Taro, { useLoad } from '@tarojs/taro'
import { AtIcon, AtButton, AtInput } from "taro-ui"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getWriteRecordsAPI, saveWriteRecordsAPI, deleteWriteRecordsAPI } from '../../pages/services/login/loginService'

export default forwardRef(function GInputQuick({cacheRecordEnum, input, onChoose, iconHandle}, ref) {
    const [show, setShow] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [tagList, setTagList] = useState([])
    useLoad(() => {
        // console.log('cacheRecordEnum', cacheRecordEnum)
    })
    useEffect(() => {
        if (show) {
            setIsDelete(false)
            getWriteRecords()
            // initShowNum()
        }
    }, [show])

    // useEffect(() => {
    //     initShowNum()
    // }, [])

    // 获取 记录
    const getWriteRecords = () => {
        getWriteRecordsAPI({cacheRecordEnum}).then((res) => {
            if (res.code == 200) {
                let tempList = res.data || []
                tempList = tempList.map((m, mI) => {
                    return {
                        id: mI+1,
                        name: m,
                    }
                })
                setTagList(tempList)

                // if (tempList?.length) {
                //     initShowNum()
                // }
            }
        })
    }
    // 保存 记录
    const save = (text) => {
        if (!text) return;
        saveWriteRecordsAPI({cacheRecordEnum, text}).then((res) => {
            if (res.code == 200) {
                getWriteRecords()
            }
        })
    }
    // 删除记录
    const del = (text) => {
        deleteWriteRecordsAPI({cacheRecordEnum, textList: text ? [text] : undefined}).then((res) => {
            if (res.code == 200) {
                getWriteRecords()
                // Taro.showToast({ title: '删除成功' })
            }
        })
    }

    // 切换 显示快捷按钮
    const toggle = () => {
        setShow(!show)
    }
    // 手动设置 是否显示快捷按钮
    const changeShow = (bol) => {
        console.log('bol', bol)
        setShow(bol)
    }
    // 快捷键选择
    const chooseHandle = (value) => {
        setShow(false)
        // setTagInfo(value)
        onChoose && onChoose(value?.name)
    }

    // 控制显隐
    const makeHide = () => {
        setShow(!show)
        iconHandle && iconHandle()
    }

    useImperativeHandle(ref, () => ({
        save,
        toggle,
        changeShow,
    }))
    return (
        <View className='w-100 g-input-quick-parent'>
            <View className='flex flex-start'>
                {input && input(
                    <View className={`expend-click ${show ? 'primary-clock-active' : 'primary-clock'}`} onClick={makeHide}></View>
                )}
            </View>
            {show ? <View className='g-input-quick m-t-10'>
                <View className='flex flex-between m-b-10'>
                    <View className='font-weight-6' style={'font-size: 28rpx;color: #919191;'}>填写历史</View>
                    <View>
                    <View className='flex flex-end'>
                        {isDelete ? <View className='delete-all-btn' onClick={() => del()}>全部删除</View> : <></>}
                        <View className='expend-click' onClick={() => setIsDelete(!isDelete)}>
                            {isDelete ? <View style={'font-size: 28rpx;color: #F8431A;'}>完成</View> : <View className='primary-del-init'></View>}
                        </View>
                    </View>
                    </View>
                </View>
                <GTagHistory list={tagList} style={'margin: 12rpx 12rpx 0 0;'} choose={chooseHandle} isDelete={isDelete} onDelete={(text) => del(text)}></GTagHistory>
            </View> : <></>}
        </View>
    )
})