import {useState} from "react";
import Taro, {useLoad, useUnload, useDidHide} from '@tarojs/taro'
import { AtInput, AtIcon, AtButton, AtTextarea } from "taro-ui"
import './index.less'
import { View, Picker } from '@tarojs/components'
import MaterialDes from "../materialDes";
import { Decimal } from 'decimal.js'


export default function MaterialCard({index, item, onDelete, disabled = false, onChange, keyboardOpen, keyboardClose}) {
    const [id, setId] = useState(0);
    useLoad(async (options) => {
        // console.log(options.id)
        setId(Number(options.id))
    })

    // 选择时间
    const selectDate = (e) => {
        // console.log(e.detail.value)
        updateData(e.detail.value, 'deliverTime')
    }

    const updateData = (e, field) => {
        // console.log(e, field)
        if (field == 'actualSupplierName') {
            e = e.substring(0, 50)
        }
        if (field == 'remark') {
            e = e.substring(0, 200)
        }
        if (['quantity','price'].includes(field) && e.indexOf('.') == 0) {
            e = ('0' + e)
        }
        if (['price'].includes(field) && e.indexOf('.') != -1) {
            const num = e.indexOf('.') + 3
            e = e.slice(0, num)
        }
        onChange(e, field, index)
    }

    // input 键盘高度变化
    const onKeyboardHeightChange = (e) => {
        // console.log('input 键盘高度变化----', e)
        keyboardOpen(e?.detail?.height) // 抛出给父组件
    }
    // textarea 键盘获取焦点
    const onFocus = (e) => {
        // console.log('textarea 键盘获取焦点----', e)
        keyboardOpen(e?.detail?.height) // 抛出给父组件
    }
    // input/textarea 失去焦点
    const inputOrTextareaBlur = () => {
        keyboardClose()
    }
    return (
        <View className="material-card">
            <View className="material-index flex flex-center">{index + 1}</View>

            <MaterialDes item={item}></MaterialDes>

            <AtInput
                maxLength={50}
                title="实际供应商:"
                disabled={disabled}
                onBlur={inputOrTextareaBlur}
                placeholder="请输入实际供应商"
                value={item.actualSupplierName}
                onKeyboardHeightChange={onKeyboardHeightChange}
                onChange={(e) => updateData(e, 'actualSupplierName')}
            ></AtInput>
            <AtInput
                type='number'
                title="采购数量:"
                disabled={disabled}
                value={item.quantity}
                placeholder="请输入采购数量"
                onBlur={inputOrTextareaBlur}
                onChange={(e) => updateData(e, 'quantity')}
                onKeyboardHeightChange={onKeyboardHeightChange}
            ></AtInput>
            <AtInput
                type='digit'
                title="采购单价:"
                value={item.price}
                disabled={disabled}
                placeholder="请输入采购单价"
                onBlur={inputOrTextareaBlur}
                onChange={(e) => updateData(e, 'price')}
                onKeyboardHeightChange={onKeyboardHeightChange}
            ></AtInput>
            <Picker className="material-picker" mode='date' disabled={disabled} onChange={selectDate}>
                <AtInput title="要求交期:" value={item.deliverTime} disabled placeholder="请选择要求交期">
                    <AtIcon value='chevron-down' size='16'></AtIcon>
                </AtInput>
            </Picker>
            {/* <AtInput title="备注:" value={id} placeholder="请输入备注"></AtInput> */}
            <View className='g-form-item flex flex-start'>
                <View className='g-form-label'>备注:</View>
                <AtTextarea
                    onFocus={onFocus}
                    disabled={disabled}
                    value={item.remark}
                    placeholder="请输入备注"
                    className="g-form-textarea"
                    onBlur={inputOrTextareaBlur}
                    onChange={(e) => updateData(e, 'remark')}
                ></AtTextarea>
            </View>

            <View className="masterial-card-bottom flex flex-between">
                <View>采购金额: {!disabled ? (Decimal(Number('0' + item.quantity) || 0).mul(Decimal(Number('0' + item.price) || 0)).toNumber()) : item?.totalPrice}</View>
                {!disabled && <AtButton size="small" type='primary' onClick={() => onDelete(item)}>删除</AtButton>}
            </View>
        </View>
    )
}