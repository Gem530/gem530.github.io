import './index.less'
import GFixedIcon from '../g-fixed-icon'
import { View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { uploadFileDeal } from '../../pages/util/func'
import { userFeedbackAPI } from '../../pages/services/login/loginService'
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { AtTextarea, AtImagePicker, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"


export default forwardRef(function GFeedback({ children, jsonData, style, right }, ref) {
    const initRecord = {
        open: false,
        feedback: '',
        fileList: [],
        title: '问题反馈',
    }
    const [loading, setLoading] = useState(false)
    const [recordInfo, setRecordInfo] = useState(initRecord)

    useEffect(() => {
        console.log('jsonData', jsonData)
    }, [jsonData])
    useLoad(() => {
    })
    // 修改数据
    const updateData = (arr, tempType = 'record') => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                if (item.field == 'feedback') {
                    item.value = item.value.substring(0, 200)
                }
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        }
    }
    // 图片上传
    const fileChange = async (files, operationType, index) => {
        // files 值发生变化触发的回调函数, operationType:add新增 remove删除 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引
        console.log(files)
        if (operationType == 'add') {
            // const flag = files.some((s) => (s?.file?.size) > 5 * 1024 * 1024)
            // if (flag) {
            //     Taro.showToast({
            //         title: '图片不能超过5M',
            //         icon: 'none',
            //         duration: 1500
            //     })
            //     return
            // }
            let tempFiles = files.map((m) => m?.url || m?.file?.path)
            console.log(tempFiles)
            const res = await uploadFileDeal(tempFiles)
            if (res?.length) {
              console.log(res, res[0]?.params?.fileInfo)
              let tempFileList = res.map((m) => {
                return {
                    url: m.params.tmpUrl,
                    key: m.params.fileInfo.key,
                    name: m.params.fileInfo.name,
                    size: m.params.fileInfo.size,
                    type: m.params.fileInfo.type,
                }
              })
            //   setFileList([{...res[0]?.params?.fileInfo, url: files[0].file.path}])
              updateData([{ value: tempFileList, field: 'fileList' }], 'record')
            }
        } else {
            // setFileList(files)
            updateData([{ value: files, field: 'fileList' }], 'record')
        }
        // console.log('fileChange', files, operationType, index)
    }
    // 图片上传失败回调
    const fileFail = (res) => {
        if (res.errMsg != 'chooseImage:fail cancel') {
            Taro.showToast({
                title: '图片上传失败',
                icon: 'none',
                duration: 1500
            })
        }
    }
    // 图片预览
    const previewImage = (i) => {
        const urlArr = fileList.map((item) => item.url)
        // console.log(i, urlArr)
        Taro.previewImage({
            current: urlArr[i],
            urls: urlArr
        })
    }

    // 打开弹框
    const openDialog = () => {
        updateData([
            { value: true, field: 'open' },
            { value: [], field: 'fileList' }
        ], 'record')
    }
    // 关闭
    const closeHandle = () => {
        updateData([
            { value: false, field: 'open' },
            { value: '', field: 'feedback' },
            { value: [], field: 'fileList' },
        ], 'record')
    }
    // 确认
    const confirmHandle = () => {
        if (!recordInfo?.feedback) {
            Taro.showToast({ title: '请填写反馈意见', icon: 'error' })
            return
        }
        // console.log('confirmHandle', recordInfo)
        setLoading(true)
        userFeedbackAPI({
            feedback: recordInfo?.feedback,
            fileList: recordInfo?.fileList || [],
            feedbackParam: jsonData ? JSON.stringify(jsonData) : ''
        }).then((res) => {
            if (res.code == 200) {
                Taro.showToast({ title: '提交成功' })
                closeHandle()
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        // openFile,
    }))
  return (
    <>
        <GFixedIcon style={style ? style : (right ? 'right: auto;left: 0px;bottom: 192rpx;' : '')}>
            <View className={`feedback-box flex ${right ? 'right flex-start' : 'flex-end'}`} onClick={openDialog}><View className='primary-feedback'></View></View>
        </GFixedIcon>

        <AtModal isOpened={recordInfo.open} onClose={closeHandle} className={`new pop-bottom common-dialog feed-pop ${recordInfo.open ? '' : 'none-dom'}`}>
            <AtModalHeader>{recordInfo.title}</AtModalHeader>
            <AtModalContent>
                <View>
                    <AtTextarea placeholderClass="feedback-textarea-place" className='feedback-textarea' height={310} placeholder='请填写反馈意见' value={recordInfo.feedback} onChange={(e) => updateData([{ value: e, field: 'feedback' }], 'record')}></AtTextarea>
                    <View className='feedback-title'>上传图片</View>
                    <AtImagePicker
                        length={4}
                        multiple={true}
                        mode='aspectFit'
                        className='feedback-file'
                        files={recordInfo.fileList}
                        onFail={fileFail}
                        onChange={fileChange}
                        onImageClick={previewImage}
                    ></AtImagePicker>
                </View>
            </AtModalContent>
            <AtModalAction>
                <AtButton loading={loading} disabled={loading} className='feedback-btn' type='primary' onClick={confirmHandle}>提交</AtButton>
            </AtModalAction>
        </AtModal>
    </>
  )
})
