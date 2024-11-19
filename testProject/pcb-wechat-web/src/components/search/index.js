import './index.less'
import GInput from '../g-input'
import GSearch from '../g-search'
import { AtBadge } from 'taro-ui'
// import GTeimDialog from '../g-time-dialog'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, forwardRef, useImperativeHandle } from 'react'
import {Button, Image, Input, Picker, View} from '@tarojs/components'


export default forwardRef(function Search({
    btn1,
    btn,
    tag,
    time,
    input,
    select,
    tagInfo,
    tagList,
    tagTotal,
    selectInfo,
    selectList,
    placeholder,
    inputChange,
    onChange,
}, ref) {
    const [show, setShow] = useState()
    const [value, setValue] = useState()
    const [endTime, setEndTime] = useState()
    const [startTime, setStartTime] = useState()
    // const [tagInfo, setTagInfo] = useState({
    //     id: 0,
    //     name: ''
    // })
    // const [selectInfo, setSelectInfo] = useState({
    //     id: 0,
    //     name: ''
    // })
    useLoad(() => {
    })
    const changeTime = (e, timeType) => {
        if (timeType == 'startTime') {
            if (endTime && e?.detail?.value) {
                if (new Date(e.detail.value) > new Date(endTime)) {
                    Taro.showToast({
                        title: '不能大于结束时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            // setStartTime(e?.detail?.value)
            confirm({endTime: endTime, startTime: e?.detail?.value})
        } else {
            if (startTime && e?.detail?.value) {
                if (new Date(e.detail.value) < new Date(startTime)) {
                    Taro.showToast({
                        title: '不能小于开始时间',
                        icon: 'none',
                        duration: 1500
                    })
                    return
                }
            }
            // setEndTime(e?.detail?.value)
            confirm({endTime: e?.detail?.value, startTime: startTime})
        }
    }
    // useEffect(() => {
    //     if (tagList?.length) {
    //         setTagInfo(tagList[0])
    //     }
    // }, [tagList])
    // useEffect(() => {
    //     if (selectList?.length) {
    //         setSelectInfo(selectList[0])
    //     }
    // }, [selectList])

    // tag改变
    const changeTag = (item) => {
        // setTagInfo(item)
        // console.log(item)
        onChangeHandle({
            value,
            tagInfo: item,
            endTime,
            startTime,
            selectInfo,
            operat: 'tag'
        })
    }

    // 选择列表
    const selectHandle = (e) => {
        // console.log(e)
        // setSelectInfo(selectList[Number(e.detail.value)])
        onChangeHandle({
            value,
            tagInfo,
            endTime,
            startTime,
            selectInfo: selectList[Number(e.detail.value)],
            operat: 'select'
        })
    }

    // 确认时间
    const confirm = (data) => {
        setEndTime(data.endTime)
        setStartTime(data.startTime)
        // console.log(data)
        // setShow(false)
        onChangeHandle({
            value,
            tagInfo,
            endTime: data.endTime,
            startTime: data.startTime,
            selectInfo,
            operat: 'time'
        })
    }
    // 重置
    const reset = () => {
        setEndTime()
        setStartTime()
        setShow(false)
        onChangeHandle({
            value,
            tagInfo,
            endTime: '',
            startTime: '',
            selectInfo,
            operat: 'time'
        })
    }

    const searchHandle = () => {
        onChangeHandle({ value, tagInfo, endTime, startTime, selectInfo, operat: 'search' })
    }

    const inputHandle = (e) => {
        inputChange && inputChange(e)
        setValue(e)
    }

    const onChangeHandle = ({ value, tagInfo, endTime, startTime, selectInfo, operat }) => {
        setTimeout(() => {
            onChange({
                value,
                tagInfo,
                endTime,
                startTime,
                selectInfo,
                operat
            })
        }, 10)
    }

    // 清除搜索条件
    const clear = (data) => {
        if (data) {
            setValue(data?.value || '')
            if (data.startTime) {
                changeTime(data.startTime, 'startTime')
            } else {
                setStartTime('')
            }
            if (data.endTime) {
                changeTime(data.endTime, 'endTime')
            } else {
                setEndTime('')
            }
        }
    }

    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        clear,
    }))
    return (
        <View className='search-box'>
            <View className='search-item flex flex-between'>
                {/* {time ? time : <>
                    <View className='search-item-time' onClick={() => setShow(true)}>
                        <View className={`search-time-box flex flex-start ${(startTime || endTime) && 'search-time-active'}`}>
                            <View className='search-time-box-icon'></View>
                            <View className='search-time-box-text'>时间筛选</View>
                        </View>
                    </View>
                </>} */}
              {btn1 ? btn1 : <></>}
                {input ? input : <>
                    <View className='search-item-input'>
                        <GSearch value={value} onInput={(e) => inputHandle(e)} placeholder={placeholder} search={searchHandle} onConfirm={searchHandle}></GSearch>
                    </View>
                </>}
                {btn ? btn : <></>}
            </View>
            {time ? time : <View className='search-item search-time flex flex-start'>
                <View className='search-time-half'>
                    <GInput value={startTime} slotIcon={<View className='search-time-box-icon'></View>} clearShow={true} clear={() => changeTime(undefined, 'startTime')} slot={
                        <Picker mode='date' onChange={(e) => changeTime(e, 'startTime')}>
                            <Input value={startTime} disabled placeholder='请选择开始时间'></Input>
                        </Picker>
                    }></GInput>
                </View>
                <View className='search-time-between'>至</View>
                <View className='search-time-half'>
                    <GInput value={endTime} slotIcon={<></>} clearShow={true} clear={() => changeTime(undefined, 'endTime')}
                    slot={
                        <Picker mode='date' onChange={(e) => changeTime(e, 'endTime')}>
                            <Input value={endTime} disabled placeholder='请选择结束时间'></Input>
                        </Picker>
                    }></GInput>
                </View>
            </View>}
            <View className='search-item flex flex-between'>
                {tag ? tag : <>
                    <View className='search-item-tag'>
                        <View className='search-tag-list flex flex-start'>
                        {
                            tagList?.length ? tagList.map((item, index) => {
                                return (
                                    (!['', null, undefined].includes(tagTotal) && index == 0) ? <AtBadge value={tagTotal} maxValue={99}>
                                        <View className={`search-tag-item ${item.id == tagInfo?.id && 'search-tag-active'}`} onClick={() => changeTag(item)}>{item.name}</View>
                                    </AtBadge> : <View className={`search-tag-item ${item.id == tagInfo?.id && 'search-tag-active'}`} onClick={() => changeTag(item)}>{item.name}</View>
                                )
                            }) : <></>
                        }
                        </View>
                    </View>
                </>}
                {select ? select : <>
                    <View className='search-item-select'>
                        <Picker rangeKey='name' mode='selector' range={selectList} onChange={selectHandle}>
                            <View className='search-select-box flex flex-center'>
                                <View>{selectInfo?.name || '请选择'}</View>
                                <View className='search-select-box-down'></View>
                            </View>
                        </Picker>
                    </View>
                </>}
            </View>
            {/* startTime={new Date()} endTime={new Date()} */}
            {/* <GTeimDialog show={show} title='时间筛选' reset={reset} confirm={confirm} onClose={() => setShow(false)}></GTeimDialog> */}
        </View>
    )
})
