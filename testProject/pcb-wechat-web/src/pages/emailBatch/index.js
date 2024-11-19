import { useState } from 'react'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
import './index.less'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import GCamera from '../../components/g-camera'
import EmailIcon from '../../../public/static/email.png'
import { AtImagePicker, AtButton, AtInput, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import { getSignedUrlAPI, getUrlByKeysAPI, customUrl, getEmailByKeyListAPI, sendBatchEmailAndAddDataAPI } from '../services/emailRecognition/index'
import GFeedback from '../../components/g-feedback'

export default function EmailRecognition() {
    useShareAppMessage(() => {
      return {
        title: '邮箱识别',
        path: '/pages/index/index'
      }
    })
    // const [tempKey, setTempKey] = useState('')
    const [msg, setMsg] = useState('')
    const [show, setShow] = useState(false)
    const [height, setHeight] = useState(true)
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)
    const [allExist, setAllExist] = useState(true)
    const [emailList, setEmailList] = useState([])
    useLoad(() => {
    })
    useDidShow(() => {
        Taro.onKeyboardHeightChange(res => {
            // console.log('onKeyboardHeightChange:', res)
            if (res?.height <= 0) {
                setHeight(true)
            }
        })
    })
    useDidHide(() => {
        Taro.offKeyboardHeightChange()
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
        return new Promise((resolve, reject) => {
            let {url, data, tmpUrl, fileName} = row
            Taro.uploadFile({
                url: url,
                filePath: tmpUrl,
                name: 'file',
                formData: {
                    ...data
                },
                success: (res) => {
                    // console.log(res)
                    resolve(res)
                },
                fail: (err) => {
                    console.log(err)
                    setLoading(false)
                    reject(false)
                }
            })
        })
    }
    // 初始化数据
    const initQuery = () => {
        setFileList([])
        setEmailList([])
    }
    // 根据图片获取url
    const getUploadUrl = (row) => {
        return new Promise((resolve, reject) => {
            let {fileName, tmpUrl, item, files} = row
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
                    const rowTemp = {
                        url: res.data.urlStr,
                        data: res.data,
                        tmpUrl,
                        fileName
                    }
                    // 处理文件数据
                    const tmpLastIndex = fileName.lastIndexOf('.')
                    item.key = res.data.key
                    item.name = fileName
                    item.size = (item.file.size / 1024) * 10000 / 10000
                    item.type = fileName.slice(tmpLastIndex + 1)
                    // setFileList(files)

                    ossUpload(rowTemp).then((res) => {
                        resolve(res)
                    }).catch(() => {
                        reject(false)
                    })
                } else {
                    setLoading(false)
                    reject(false)
                }
            }).catch(() => {
                setLoading(false)
                reject(false)
            })
        })
    }
    // 对识别的数据进行修改
    const updateData = (value, txt, index) => {
        let tempList = emailList
        tempList[index][txt] = value
        setEmailList(tempList)
    }
    // 图片上传
    const fileChange = async (files, operationType, index) => {
        // files 值发生变化触发的回调函数, operationType:add新增 remove删除 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引
        if (loading) return;
        if (operationType == 'add') {
            for (let i = 0; i < files.length; i++) {
                let item = files[i]
                if (!item.type && !item.size) {
                    const tmpIndex = item.url.indexOf('tmp/')
                    // const tmpLastIndex = files[0].url.lastIndexOf('.')
                    const tempName = item.url.slice(tmpIndex + 4)
                    const row = {
                        fileName: tempName,
                        tmpUrl: item.url,
                        item,
                        files
                    }
                    const res = await getUploadUrl(row)
                    console.log('1111--', res)
                }
            }
            setFileList(files)
            // console.log('result--', files)
            const query = {
                data: {
                    keys: files.map((m) => m.key).join(',')
                    // key: files[0].key
                }
            }
            getEmailByKeyListAPI(query).then((res) => {
                if (res.code == 200 && res.data) {
                    // res.data.email = res.data?.email ? res.data?.email : ''
                    // if (!res.data.email) {
                    //     Taro.showToast({
                    //         title: '邮箱识别失败',
                    //         icon: 'error',
                    //         duration: 1500
                    //     })
                    // }
                    res.data.map((m) => {
                        const crtObj = emailList.find((f) => f.key == m.key)
                        if (crtObj) {
                            // m = crtObj
                            for (let key in m) {
                                m[key] = crtObj[key]
                            }
                        }
                        m.mpFileList = files.filter((f) => f.key == m.key)
                    })
                    setEmailList(res.data || [])
                    console.log(res.data)
                }
                setLoading(false)
            }).catch(() => {
                // initQuery()
                setLoading(false)
            })
        } else if (operationType == 'remove') {
            // console.log(files, fileList, emailList, index)
            setFileList(files)
            let tempList = emailList
            tempList.splice(index, 1)
            setEmailList(tempList)
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
        if (!emailList?.length) {
            res = '邮箱不能为空'
        }
        emailList.map((item) => {
            if (!item.email) {
                res = '邮箱不能为空'
            } else if (!validEmail(item.email)) {
                res = '邮箱格式错误'
            }
        })
        return res
    }
    // 发送邮件
    const sendEmail = () => {
        const msg = checkData()
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
            content: `确定发送邮件？`,
            success: function (res) {
                if (res.confirm) {
                    const userInfo = Taro.getStorageSync('__USER_INFO__')
                    let tempList = emailList
                    tempList.map((m) => {
                        m.userId = userInfo?.user?.userId
                        m.userName = userInfo?.user?.userName
                        m.nickName = userInfo?.user?.nickName
                    })
                    // console.log(userInfo)
                    const params = {
                        data: {
                            cardBoList: tempList,
                            flag: false,
                            isSkip: false
                        },
                        method: 'POST'
                    }
                    // console.log(fileList, params)
                    setLoading(true)
                    sendBatchEmailAndAddDataAPI(params).then((result) => {
                        // console.log(result)
                        if (result.code == 200) {
                            if (result?.data?.recordsExist == true) {
                                // againSend(result.msg)
                                // result.msg = result.msg.replaceAll('\r\n', '<br/>')
                                // console.log(result.msg)
                                setMsg(result.msg)
                                setAllExist(result?.data?.allExist)
                                setShow(true)
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
    const againSend = (isSkip) => {
        // Taro.showModal({
        //     // title: '系统提示',
        //     content: msg,
        //     success: function (res) {
        //         if (res.confirm) {
                    const userInfo = Taro.getStorageSync('__USER_INFO__')
                    let tempList = emailList
                    tempList.map((m) => {
                        m.userId = userInfo?.user?.userId
                        m.userName = userInfo?.user?.userName
                        m.nickName = userInfo?.user?.nickName
                    })
                    // console.log(userInfo)
                    const params = {
                        data: {
                            cardBoList: tempList,
                            flag: true,
                            isSkip: isSkip || false
                        },
                        method: 'POST'
                    }
                    // console.log(fileList, params)
                    setLoading(true)
                    sendBatchEmailAndAddDataAPI(params).then((result) => {
                        // console.log(result)
                        if (result.code == 200) {
                            initQuery()
                            Taro.showToast({
                                title: '操作成功',
                                icon: 'success',
                                duration: 1500
                            })
                            setShow(false)
                        }
                    }).finally(() => { setLoading(false) })
        //         }
        //     }
        // })
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

    const keyboardHeightChange = (e) => {
        console.log('keyboardHeightChange', e)
        // setHeight(e?.detail?.height)
        if (e?.detail?.height) {
            setHeight(false)
        }
    }
    const inputBlur = () => {
        setHeight(true)
    }

    const toRecord = () => {
        Taro.navigateTo({ url: '/pages/emailRecord/index' })
    }
    return (
        <>
        <ScrollView scrollY={height} className='email-batch flex flex-column'>
            <View className='email-batch-box'>
                {
                    emailList.map((item, index) => {
                        return (
                            <AtInput title={
                                <Image className="email-batch-image" src={EmailIcon} mode='widthFix'></Image>
                            } placeholder='请输入邮箱' value={item.email} onChange={(value) => updateData(value, 'email', index)} onKeyboardHeightChange={keyboardHeightChange} onBlur={inputBlur}></AtInput>
                        )
                    })
                }
                <View className='g-form-item flex flex-start'>
                    <View className='g-form-label'>邮箱识别</View>
                    <AtImagePicker
                        count={99}
                        length={3}
                        multiple={true}
                        mode='aspectFit'
                        files={fileList}
                        onFail={fileFail}
                        onChange={fileChange}
                        showAddBtn={fileList?.length < 99}
                        onImageClick={previewImage}
                    ></AtImagePicker>
                </View>
                {/* {msg+''} */}
            </View>
            <View className={`email-button flex flex-between ${height ? '' : 'email-btn-hide'}`}>
                <AtButton type='primary' loading={loading} disabled={loading} onClick={sendEmail}>发送邮件</AtButton>
            </View>

            <AtModal closeOnClickOverlay={false} isOpened={show}>
                <AtModalContent>
                    <Text style={'display: inline-block;width: 100%;text-align: center;white-space: pre-wrap;'}>{msg}</Text>
                </AtModalContent>
                <AtModalAction>
                    <Button onClick={() => setShow(false)}>取消</Button>
                    <Button onClick={() => againSend(true)}>跳过已发</Button>
                    <Button onClick={() => againSend()}>全部发送</Button>
                </AtModalAction>
            </AtModal>
        </ScrollView>
        <GFeedback></GFeedback>
        </>
    )
}
