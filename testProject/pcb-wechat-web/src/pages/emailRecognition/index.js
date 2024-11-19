import { useState } from 'react'
import Taro, {useLoad,useShareAppMessage} from '@tarojs/taro'
import './index.less'
import { View } from '@tarojs/components'
import GCamera from '../../components/g-camera'
import { AtImagePicker, AtButton, AtInput, AtTextarea } from 'taro-ui'
import { getSignedUrlAPI, getUrlByKeysAPI, customUrl, saveEmailAPI, getEmailAPI } from '../services/emailRecognition/index'
import GFeedback from '../../components/g-feedback'

export default function EmailRecognition() {
    useShareAppMessage(() => {
      return {
        title: '邮箱识别',
        path: '/pages/index/index'
      }
    })
    // const [tempKey, setTempKey] = useState('')
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)
    const [emailInfo, setEmailInfo] = useState({
        name: '',
        company: '',
        address: '',
        email: '',
        phoneNumber: '',
        remark: '',
    })
    useLoad(() => {
    })
    const downloadFile = (url, name) => {
        return new Promise((resolve, reject) => {
            const callback = (blob) => {
                resolve(blob)
            }
            // 把接口返回的url地址转换为 blob
            const xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'blob';
            xhr.onload = () => {
                // 返回文件流，进行下载处理
                callback(xhr.response)
            }
            xhr.send();
        })
    }
    // oss上传url
    const ossUpload = (row) => {
        let {url, data, tmpUrl, fileName} = row
        Taro.uploadFile({
            url: url,
            filePath: tmpUrl,
            name: 'file',
            formData: {
                ...data
            },
            success: (res) => {
                console.log(res)
                const query = {
                    data: {
                        keys: data.key
                    }
                }
                getEmailAPI(query).then((res) => {
                    if (res.code == 200 && res.data) {
                        res.data.email = res.data?.email ? res.data?.email : ''
                        if (!res.data.email) {
                            Taro.showToast({
                                title: '邮箱识别失败',
                                icon: 'error',
                                duration: 1500
                            })
                        }
                        res.data.remark = ''
                        setEmailInfo(res.data)
                    }
                    setLoading(false)
                }).catch(() => {
                    initQuery()
                    setLoading(false)
                })
            },
            fail: (err) => {
                console.log(err)
                setLoading(false)
            }
        })
    }
    // 初始化数据
    const initQuery = () => {
        setFileList([])
        setEmailInfo({
            name: '',
            company: '',
            address: '',
            email: '',
            phoneNumber: '',
        })
    }
    // 根据图片获取url
    const getUploadUrl = (row) => {
        let {fileName, tmpUrl, files} = row
        const params = {
            data: {
                fileName
            }
        }
        setLoading(true)
        getSignedUrlAPI(params).then(async (res) => {
            if (res.code == 200) {
                console.log(res)
                // res.data.file = await downloadFile(tmpUrl)
                // setTempKey(res.data.key)
                const row = {
                    url: res.data.urlStr,
                    data: res.data,
                    tmpUrl,
                    fileName
                }
                // 处理文件数据
                const tmpLastIndex = fileName.lastIndexOf('.')
                files[0].key = res.data.key
                files[0].name = fileName
                files[0].size = (files[0].file.size / 1024) * 10000 / 10000
                files[0].type = fileName.slice(tmpLastIndex + 1)
                setFileList(files)

                ossUpload(row)
            } else {
                setLoading(false)
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    // 对识别的数据进行修改
    const updateData = (value, txt) => {
        let tempInfo = emailInfo
        if (txt == 'remark') {
            value = value.substring(0, 200)
        }
        tempInfo[txt] = value
        setEmailInfo(tempInfo)
    }
    // 图片上传
    const fileChange = async (files, operationType, index) => {
        // files 值发生变化触发的回调函数, operationType:add新增 remove删除 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引
        if (operationType == 'add') {
            const tmpIndex = files[0].url.indexOf('tmp/')
            // const tmpLastIndex = files[0].url.lastIndexOf('.')
            const tempName = files[0].url.slice(tmpIndex + 4)
            const row = {
                fileName: tempName,
                tmpUrl: files[0].url,
                files
            }
            if (files?.length) {
                getUploadUrl(row)
            }
        } else if (operationType == 'remove') {
            initQuery()
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
    const validEmail = (email) => {
        const reg =
            /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    };
    const checkData = () => {
        let res = ''
        if (!emailInfo.email) {
            res = '邮箱不能为空'
        } else if (!validEmail(emailInfo.email)) {
            res = '邮箱格式错误'
        }
        return res
    }
    // 发送邮件
    const sendEmail = () => {
        const msg = checkData()
        console.log(emailInfo)
        if (msg) {
            Taro.showToast({
                title: msg,
                icon: 'error',
                duration: 1500
            })
            return
        }
        Taro.showModal({
            title: '系统提示',
            content: `确定给${emailInfo.email}发送邮件？`,
            success: function (res) {
                if (res.confirm) {
                    const userInfo = Taro.getStorageSync('__USER_INFO__')
                    // console.log(userInfo)
                    const params = {
                        data: {
                            ...emailInfo,
                            userId: userInfo?.user?.userId,
                            userName: userInfo?.user?.userName,
                            nickName: userInfo?.user?.nickName,
                            mpFileList: fileList,
                            flag: false,
                        },
                        method: 'POST'
                    }
                    // console.log(fileList, params)
                    setLoading(true)
                    saveEmailAPI(params).then((result) => {
                        // console.log(result)
                        if (result.code == 200) {
                            if (result.data == true) {
                                againSend(result.msg)
                            } else {
                                initQuery()
                                Taro.showToast({
                                    title: '发送成功',
                                    icon: 'success',
                                    duration: 1500
                                })
                            }
                        }
                    }).finally(() => { setLoading(false) })
                }
            }
        })
    }

    // 多次发送，确定后再发送
    const againSend = (msg) => {
        Taro.showModal({
            // title: '系统提示',
            content: msg,
            success: function (res) {
                if (res.confirm) {
                    const userInfo = Taro.getStorageSync('__USER_INFO__')
                    // console.log(userInfo)
                    const params = {
                        data: {
                            ...emailInfo,
                            userId: userInfo?.user?.userId,
                            userName: userInfo?.user?.userName,
                            nickName: userInfo?.user?.nickName,
                            mpFileList: fileList,
                            flag: true,
                        },
                        method: 'POST'
                    }
                    // console.log(fileList, params)
                    setLoading(true)
                    saveEmailAPI(params).then((result) => {
                        // console.log(result)
                        if (result.code == 200) {
                            initQuery()
                            Taro.showToast({
                                title: '发送成功',
                                icon: 'success',
                                duration: 1500
                            })
                        }
                    }).finally(() => { setLoading(false) })
                }
            }
        })
    }

    const toRecord = () => {
        Taro.navigateTo({ url: '/pages/emailRecord/index' })
    }
    const toBtach = () => {
        Taro.navigateTo({ url: '/pages/emailBatch/index' })
    } 
    return (
        <View className='email-recognition flex flex-column'>
            {/* <View className='g-form-item flex flex-start'>
                <View className='g-form-label'>邮箱识别:</View>
                <AtImagePicker
                    count={1}
                    length={3}
                    mode='aspectFit'
                    files={fileList}
                    onFail={fileFail}
                    onChange={fileChange}
                    sourceType={['camera']}
                    showAddBtn={fileList.length < 1}
                ></AtImagePicker>
            </View> */}
            {/* <AtInput title='姓名:' placeholder='姓名' value={emailInfo.name} onChange={(value) => updateData(value, 'name')}></AtInput> */}
            <View className='email-title'>邮箱:</View>
            <AtTextarea className='input-email-bold' title='' placeholder='邮箱' value={emailInfo.email} onChange={(value) => updateData(value, 'email')}></AtTextarea>
            <View className='remark-title'>备注:</View>
            <AtTextarea className='input-remark-bold' title='' height="60" placeholder='备注' value={emailInfo.remark} onChange={(value) => updateData(value, 'remark')}></AtTextarea>
            {/* <AtInput title='手机号:' placeholder='手机号' value={emailInfo.phoneNumber} onChange={(value) => updateData(value, 'phoneNumber')}></AtInput>
            <AtInput title='公司:' placeholder='公司' value={emailInfo.company} onChange={(value) => updateData(value, 'company')}></AtInput>
            <AtInput title='地址:' placeholder='地址' value={emailInfo.address} onChange={(value) => updateData(value, 'address')}></AtInput> */}
            <View className='email-upload flex flex-center'>
                <AtImagePicker
                    count={1}
                    length={1}
                    mode='aspectFit'
                    files={fileList}
                    onFail={fileFail}
                    onChange={fileChange}
                    showAddBtn={fileList?.length < 1}
                ></AtImagePicker>
                {/* <GCamera onChange={fileChange}></GCamera> */}
            </View>
            <View className='email-button flex flex-between'>
                <AtButton loading={loading} disabled={loading} onClick={toRecord}>发送记录</AtButton>
                <AtButton loading={loading} disabled={loading} onClick={toBtach}>去批量发送</AtButton>
            </View>
            <View className='email-button flex flex-between'>
                <AtButton type='primary' loading={loading} disabled={loading} onClick={sendEmail}>发送邮件</AtButton>
            </View>

            <GFeedback></GFeedback>
        </View>
    )
}
