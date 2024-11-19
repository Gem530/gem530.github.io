import dayjs from 'dayjs'
import Taro, { useLoad } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { useState, forwardRef, useImperativeHandle } from "react"
import { AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { validEmail, uploadFileDeal, downloadImg, downloadFileByKeys } from '../../pages/util/func'
import { queryEmailRecordAPI, sendMessageWithAttachmentByKeyAPI } from '../../pages/services/upload'


export default forwardRef(function GShareFile({}, ref) {
    // 弹框信息
    const initDialog = {
        key: '',
        name: '',
        email: '',
        open: false,
        title: '发送邮箱',
    }
    const [emailList, setEmailList] = useState([])
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    useLoad(() => {
        console.log(ref)
    })

    // 修改数据
    const updateData = (arr, tempType = 'dialog') => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        if (tempType == 'dialog') {
            let tempInfo = JSON.parse(JSON.stringify(dialogInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setDialogInfo(tempInfo)
        }
    }

    // 设置邮箱
    const setInitEmail = (emailStr, item) => {
        updateData([
            { value: true, field: 'open' },
            { value: item.key, field: 'key' },
            { value: emailStr, field: 'email' },
            { value: item.name, field: 'name' },
        ], 'dialog')
    }
    // 保存文件
    const saveFile = async (item) => {
        if (!item.key) {
            Taro.showToast({ title: '查询不到对应的签名文件', icon: 'none', duration: 1500 })
            return
        }
        // Taro.showActionSheet({
        //     itemList: ['发送给好友', '发送邮箱'],
        //     success: async (res) => {
        //     //   console.log(res.tapIndex)
        //         if (res?.tapIndex == 0) {
                    const res = await downloadFileByKeys(item.key)
                    const tempFilePath = await downloadImg(res.data[item.key])
                    Taro.shareFileMessage({
                        filePath: tempFilePath,
                        fileName: item.name,
                        // success: (result) => { console.log('转发成功', result) },
                        fail: (err) => {
                            console.log(err)
                            Taro.showToast({ title: '转发失败，请重试', icon: 'error' })
                        }
                    })
        //         } else if (res?.tapIndex == 1) {
        //             Taro.showLoading({ mask: true })
        //             queryEmailRecordAPI().then((res) => {
        //                 if (res.code == 200) {
        //                     Taro.hideLoading()
        //                     setEmailList(res.data || [])
        //                     setInitEmail(res.data?.length ? res.data[0] : '', item)
        //                 } else setInitEmail('', item)
        //             }).catch(() => setInitEmail('', item))
        //         }
        //     },
        //     fail: function (res) {
        //         console.log(res.errMsg)
        //     }
        // })
    }

    // 数据校验
    const checkData = () => {
        let res = ''
        if (!dialogInfo.email) res = '请填写邮箱'
        else if (!validEmail(dialogInfo.email)) res = '请填写正确的邮箱格式'
        return res
    }
    // 确定发送邮箱
    const confirmHandle = () => {
        let errMsg = checkData()
        if (errMsg) {
            Taro.showToast({ title: errMsg, icon: 'none', duration: 1500 })
            return
        }
        let params = {
            text: '',
            key: dialogInfo.key,
            to: dialogInfo.email,
            subject: dialogInfo.name,
        }
        sendMessageWithAttachmentByKeyAPI(params).then((res) => {
            if (res.code == 200) {
                console.log(res)
                Taro.showToast({ title: '发送成功', icon: 'success', duration: 1500 })
            }
        })
        // console.log(dialogInfo, validEmail(dialogInfo.email))
        updateData([{ value: false, field: 'open' }], 'dialog')
    }
    
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        saveFile,
    }))
    return (
        <>
        {
        dialogInfo.open ? <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new'>
            {/* 转发文件 */}
            <AtModalHeader>{dialogInfo.title}</AtModalHeader>
            <AtModalContent>
                <AtInput className='input-content-gray new' title='邮箱' value={dialogInfo.email} placeholder={dialogInfo.open ? '请填写邮箱' : ''} onChange={(e) => updateData([{ value: e, field: 'email' }])}>
                    <Picker mode='selector' range={emailList?.length ? emailList : ['暂无数据']} onChange={(e) => updateData([{ value: emailList[Number(e?.detail?.value)], field: 'email' }], 'dialog')}>
                        <View className='flex flex-center' style={`width: 66rpx;height: 96rpx;padding: 0 10rpx 0 20rpx;box-sizing: border-box;`}><View className='primary-bottom expend-click'></View></View>
                    </Picker>
                </AtInput>
            </AtModalContent>
            <AtModalAction>
                <AtButton onClick={() => updateData([{ value: false, field: 'open' }])}>取消</AtButton>
                <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
            </AtModalAction>
        </AtModal> : <></>
        }
        </>
    )
})
