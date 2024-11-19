import './index.less'
import { useState, useEffect } from 'react'
import { AtModal, AtModalHeader, AtModalContent }  from 'taro-ui'
import { View, Input, PickerView, PickerViewColumn } from '@tarojs/components'


export default function GPicker({value, list, rangeKey = 'name', cancel, confirm, placeholder}) {
    const [name, setName] = useState([0])
    const [flag, setFlag] = useState(true)
    const [result, setResult] = useState()
    const [search, setSearch] = useState('')
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        if (value) {
            setDataList(list)
            setResult(list[0])
        } else {
            setName([0])
            setSearch('')
        }
    }, [value])

    // 取消
    const onClose = (e) => {
        cancel()
    }

    // 确认
    const confirmHandle = () => {
        // console.log(result)
        // console.log(flag)
        confirm(result)
    }

    // 搜索
    const searchHandle = (e) => {
        let val = e.detail.value
        setSearch(val)
        let tempList = list.filter((item) => item[rangeKey].toLocaleUpperCase().includes(val.toLocaleUpperCase()))
        setDataList(tempList)
        setResult(tempList[0])
        setName([0])
    }

    const changeHandle = (e) => {
        let index = e.detail.value[0]
        // console.log(e, index, dataList[index])
        setResult(dataList[index])
        setName([index])
    }

    return (
        <AtModal isOpened={value} onClose={onClose} className='g-picker-mask'>
            <AtModalHeader>
                <View className="flex flex-between">
                    <View className='picker-cancel' onClick={onClose}>取消</View>
                    <Input placeholderClass='input-search-placeholder' className='picker-search-input' value={search} placeholder={placeholder} onInput={searchHandle}></Input>
                    <View className={`picker-confirm ${!flag && 'disabled'}`} onClick={confirmHandle}>确认</View>
                </View>
            </AtModalHeader>
            <AtModalContent>
                <PickerView style={'height: 300px;'} value={name} onChange={changeHandle} onPickStart={() => setFlag(false)} onPickEnd={() => setFlag(true)}>
                    <PickerViewColumn>
                    {
                        dataList.map((item) => {
                            return (
                                <View className='flex flex-center'>{item[rangeKey]}</View>
                            )
                        })
                    }
                    </PickerViewColumn>
                </PickerView>
            </AtModalContent>
        </AtModal>
    )
}
