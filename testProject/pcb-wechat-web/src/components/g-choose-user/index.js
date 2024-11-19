// import Taro from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import * as service from '../../pages/services/login/loginService'
import { useState, forwardRef, useImperativeHandle } from "react";
import { getFileInfo, uploadFileDeal } from '../../pages/util/func'
import { AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"


export default forwardRef(function GChooseUser({}, ref) {
    const initRecord = {
        open: false,
        avatarUrl: '',
        wxNickName: '',
        title: '系统提示',
    }
    const [prmoiseFun, setPrmoiseFun] = useState()
    const [recordInfo, setRecordInfo] = useState(initRecord)

    // 修改数据
    const updateData = (arr, tempType = 'record') => {
        if (!arr?.length) return
        if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        }
    }
    // 打开弹框
    const openConfirm = (info) => {
        return new Promise((resolve, reject) => {
            updateData([
                { value: true, field: 'open' },
                { value: info?.title || '系统提示', field: 'title' },
                { value: info?.avatarUrl || '', field: 'avatarUrl' },
                { value: info?.wxNickName || '', field: 'wxNickName' },
            ])
            setPrmoiseFun({ resolve, reject })
        })
    }

    const getUserProfile = (e) => {
        // console.log(e.detail.avatarUrl)
        updateData([
            { value: e.detail.avatarUrl || '', field: 'avatarUrl' },
        ])
    }
    const nickHandle = (e, v) => {
        console.log(e, v)
        updateData([ { value: e?.detail?.value, field: 'wxNickName' } ])
    }

    // 取消弹框
    const cancelHandle = () => {
        updateData([ { value: false, field: 'open' } ])
        prmoiseFun.resolve({cancel: true})
    }
    // 确定弹框
    const confirmHandle = async (e) => {
        let tempInfo = recordInfo
        tempInfo.wxNickName = e?.detail?.value['wxNickName']
        console.log(recordInfo, e)
        setRecordInfo(tempInfo)
        // console.log(e.detail.value['wxNickName'])
        // updateData([ { value: false, field: 'open' } ])
        let params = {}
        if (tempInfo.avatarUrl) {
            // params.avatarUrl = tempInfo.avatarUrl
            console.log(tempInfo.avatarUrl)
            let size = await getFileInfo(tempInfo.avatarUrl)
            const tmpIndex = tempInfo.avatarUrl.indexOf('tmp/')
            // const tmpLastIndex = files[0].url.lastIndexOf('.')
            const tempName = tempInfo.avatarUrl.slice(tmpIndex + 4)
            let files = [{
                name: tempName,
                size: size?.size,
                path: tempInfo.avatarUrl,
            }]
            let res1 = await uploadFileDeal(files, {hasInfo: true})
            let fileList = res1[0].params.fileInfo
            params.avatarUrl = fileList.key
        }
        if (tempInfo.wxNickName) {
            params.wxNickName = tempInfo.wxNickName
        }
        await service.editXcxUserInfoAPI(params)
        prmoiseFun.resolve({confirm: true, data: tempInfo})
    }
    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openConfirm,
    }))
    return (
        <form onSubmit={confirmHandle}>
        <AtModal isOpened={recordInfo.open} closeOnClickOverlay={false} className='new pop-bottom'>
            {/* <AtModalHeader>{recordInfo.title}</AtModalHeader> */}
            <AtModalContent>
                <View className='choose-user-content'>
                    {/* <View className='flex flex-center' style={`min-height: 100rpx;`}>{recordInfo.content}</View> */}
                    <Button className='choose-avator' open-type="chooseAvatar" onChooseAvatar={getUserProfile}>
                        <Image src={recordInfo?.avatarUrl || 'https://pcb-prod.oss-cn-shenzhen.aliyuncs.com/wechat/avator-user.png'} mode='aspectFit' style={'width: 100%;height: 100%;'}></Image>
                    </Button>
                    {/* <View className='common-item'> */}
                    <AtInput title='姓名' className='new' name="wxNickName" type="nickname" placeholder={recordInfo.open ? '请输入姓名' : ''} onInput={(e) => updateData([ { value: e?.detail?.value, field: 'wxNickName' } ])} onNicknamereview={nickHandle}></AtInput>
                    {/* </View> */}
                </View>
            </AtModalContent>
            <AtModalAction className="choose-user-btn">
                <AtButton onClick={cancelHandle}>取消</AtButton>
                {/* <AtButton type='primary' onClick={confirmHandle}>确定</AtButton> */}
                <AtButton type='primary' formType='submit'>确定</AtButton>
            </AtModalAction>
        </AtModal>
        </form>
    )
})
