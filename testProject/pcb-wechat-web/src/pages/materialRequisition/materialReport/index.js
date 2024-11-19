import { subscribeMessage } from '../../util/func'
import {useState, useEffect} from "react";
import Taro, {useLoad, useUnload, useDidShow} from '@tarojs/taro'
import { AtInput, AtIcon, AtButton, AtLoadMore, AtImagePicker, AtTextarea, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import './index.less'
import { Decimal } from 'decimal.js'
import MaterialCard from "../materialCard";
import TableDes from "../../../components/table-des";
import { View, Picker, Text, Button } from '@tarojs/components'
import { getSignedUrlErpAPI } from '../../services/upload/index'
import { auditPurchaseOrderAPI, getReceiveAddressAPI, getSupplierListAPI, addAppletPurchaseOrderAPI, updateAppletPurchaseOrderAPI } from '../../services/materialRequisition/index'
import GFeedback from '../../../components/g-feedback';


export default function MaterialReport({type, disabled = false, detailInfo = undefined}) {
    // type 1:新增采购 2:修改采购 3:个人查看记录 4:待审核 5:审核记录
    const [fileList, setFileList] = useState([])
    const [keyOpen, setKeyOpen] = useState(true)
    const [loading, setLoading] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [chooseList, setChooseList] = useState([])
    const [addressList, setAddressList] = useState([])
    const [random, setRandom] = useState(Math.random())
    const [address, setAddress] = useState({
        id: undefined,
        address: '',
    })
    const [supperList, setSupperList] = useState([])
    const [supper, setSupper] = useState({
        id: undefined,
        supplierName: '',
    })
    const [auditInfo, setAuditInfo] = useState({
        open: false,
        comment: '',
        auditFlag: true,
    })

    // useLoad(() => {
    // })
    useDidShow(() => {
        // setRandom(Math.random())
        // if (!detailInfo) {
        const data = Taro.getStorageSync('car_data')
        // console.log('useDidShow', data)
        if (data && data.length) {
            setChooseList(data)
        }
        // }
    })

    useEffect(() => {
        console.log('report--', type, disabled)
        getSupplierListHandle()
        getReceiveAddressHandle()
        if (detailInfo) {
            setSupper({
                id: detailInfo.supplierId,
                supplierName: detailInfo.supplierName,
            })
            setAddress({
                id: detailInfo.addressId,
                address: detailInfo.address,
            })
            setFileList(detailInfo.cgFileList || [])
            setChooseList(detailInfo.orderDetailVoList || [])
            // console.log('----', detailInfo)
        }

        const data = Taro.getStorageSync('car_data')
        // console.log('useEffect', data)
        if (data && data.length) {
            setChooseList(data)
        }
    }, [type])

    // 计算总金额
    useEffect(() => {
        let tempList = [...chooseList]
        let total = 0
        tempList.map((item) => {
            let crtTotal = Decimal(('0' + item.quantity) || 0).mul(Decimal(('0' + item.price) || 0)).toNumber()
            total = Decimal(total).add(Decimal(crtTotal)).toNumber()
        })
        setTotalPrice(total)
    }, [chooseList])

    // 获取收货地址列表
    const getReceiveAddressHandle = () => {
        getReceiveAddressAPI().then((res) => {
            if (res.code == 200) {
                setAddressList(res.data || [])
                if (res.data?.length && !detailInfo?.addressId) {
                    setAddress(res.data[0])
                }
            }
        })
    }
    // 获取供应商列表
    const getSupplierListHandle = () => {
        getSupplierListAPI().then((res) => {
            if (res.code == 200) {
                setSupperList(res.data || [])
                if (res.data?.length && !detailInfo?.supplierId) {
                    setSupper(res.data[0])
                }
            }
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
            },
            fail: (err) => {
                console.log(err)
            }
        })
    }
    // 根据图片获取url
    const getUploadUrl = (row) => {
        let {fileName, tmpUrl, item, files} = row
        const params = {
            fileName
        }
        getSignedUrlErpAPI(params).then(async (res) => {
            if (res.code == 200) {
                // console.log(res)
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
                setFileList(files)

                ossUpload(rowTemp)
            }
        })
    }
    // 图片上传
    const fileChange = async (files, operationType, index) => {
        // files 值发生变化触发的回调函数, operationType:add新增 remove删除 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引
        if (operationType == 'add') {
            const flag = files.some((s) => (s?.file?.size) > 5 * 1024 * 1024)
            if (flag) {
                Taro.showToast({
                    title: '图片不能超过5M',
                    icon: 'none',
                    duration: 1500
                })
                return
            }
            files.map((item) => {
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
                    getUploadUrl(row)
                }
            })
        } else {
            setFileList(files)
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

    // 选择地址
    const selectAddress = (e) => {
        const tempAddressInfo = addressList[Number(e.detail.value)]
        setAddress(tempAddressInfo)
    }

    // 选择供应商
    const selectSupper = (e) => {
        const tempSupperInfo = supperList[Number(e.detail.value)]
        setSupper(tempSupperInfo)
    }

    // 跳转到选择物料页
    const toPath = () => {
        Taro.setStorageSync('car_data', chooseList)
        Taro.navigateTo({url: '/pages/materialSelect/index'})
    }

    // 保存选择的列表
    const saveChooseList = (tempList) => {
        setChooseList(tempList)
        Taro.setStorageSync('car_data', tempList)
    }
    // 删除物料
    const onDelete = (item) => {
        Taro.showModal({
            title: '系统提示',
            content: `确定删除${item.code}-${item.name}?`,
            success: function (res) {
                if (res.confirm) {
                    let tempList = [...chooseList]
                    tempList = tempList.filter((f) => f.rawMaterialId != item.rawMaterialId)
                    // console.log(item)
                    saveChooseList(tempList)
                }
            }
        })
    }

    // 物料数据改变
    const cardChange = (val, field, i) => {
        let tempList = [...chooseList]
        let tempInfo = tempList[i]
        // if (field == 'price' && val.indexOf('.') == 0) {
        //     val = ('0' + val)
        // }
        tempInfo[field] = val
        // console.log(val, field, i)
        saveChooseList(tempList)
    }

    // 校验提交数据
    const checkData = () => {
        let res = ''
        if (!supper.id) {
            res = '请选择供应商'
        } else if (!address.id) {
            res = '请选择收货地址'
        } else if (!chooseList?.length) {
            res = '请选择物料'
        } else if (chooseList?.length) {
            chooseList.some((m, i) => {
                if (!m.rawMaterialId) {
                    res = `第${i + 1}条: 物料ID不存在,请删除后重新选择`
                    return true
                } else if (!m.actualSupplierName) {
                    res = `第${i + 1}条: 请输入实际供应商名称`
                    return true
                } else if (!m.quantity) {
                    res = `第${i + 1}条: 采购数量不能为空`
                    return true
                } else if (Number(m.quantity) <= 0) {
                    res = `第${i + 1}条: 采购数量不能小于0`
                    return true
                } else if (!m.price) {
                    res = `第${i + 1}条: 采购单价不能为空`
                    return true
                } else if (Number(m.price) <= 0) {
                    res = `第${i + 1}条: 采购单价不能小于0`
                    return true
                } else if (!m.deliverTime) {
                    res = `第${i + 1}条: 请选择要求交期`
                    return true
                }
            })
        }
        return res
    }

    // 新增物料请购
    const addMaterial = (params, submitType) => {
        addAppletPurchaseOrderAPI(params).then((res) => {
            if (res.code == 200) {
                // 清空选择的文件以及申请的数据
                setFileList([])
                saveChooseList([])
                setSupper(supperList[0])
                setAddress(addressList[0])
                Taro.removeStorageSync('car_data')
                Taro.showToast({
                    title: submitType == 2 ? '提交成功' : '已保存草稿',
                    icon: 'success',
                    duration: 1500
                })
            } else {
                setLoading(false)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    // 编辑物料请购
    const updateMaterial = (params, submitType) => {
        updateAppletPurchaseOrderAPI(params).then((res) => {
            if (res.code == 200) {
                // 清空选择的文件以及申请的数据
                // console.log(submitType == 2 ? '提交成功' : '已保存草稿')
                Taro.showToast({
                    title: submitType == 2 ? '提交成功' : '已保存草稿',
                    icon: 'success',
                    duration: 1500
                })
                Taro.removeStorageSync('car_data')
                Taro.navigateBack({ detail: 1 })
            } else {
                setLoading(false)
            }
        }).finally(() => {
            setLoading(false)
        })
    }
    // 提交 submitType 1:存草稿 2:提交
    const saveHandle = (submitType) => {
        let tempList = [...chooseList]
        const errMsg = checkData()
        if (errMsg) {
            Taro.showToast({
                title: errMsg,
                icon: 'none',
                duration: 1500
            })
            return
        }
        subscribeMessage().finally(() => {
            let orderDetailBoList = tempList
            // .map((m) => {
            //     return {
            //         rawMaterialId: m.rawMaterialId,
            //         actualSupplierName: m.actualSupplierName,
            //         quantity: m.quantity,
            //         price: m.price,
            //         deliverTime: m.deliverTime,
            //         remark: m.remark,
            //     }
            // })
            const params = {
                supplierId: supper.id,
                addressId: address.id,
                cgFileList: fileList,
                orderDetailBoList
            }
            if (submitType == '2') params.status = '5'
            console.log('params', params)
            setLoading(true)
            if (detailInfo?.id) {
                params.id = detailInfo.id
                if (detailInfo?.code) params.code = detailInfo.code
                updateMaterial(params, submitType)
            } else {
                addMaterial(params, submitType)
            }
        })
    }

    // 对识别的数据进行修改
    const updateData = (value, txt) => {
        let tempInfo = Object.assign({}, auditInfo)
        tempInfo[txt] = value
        setAuditInfo(tempInfo)
    }
    // 通过或驳回物料请购申请 auditType false:驳回 true:通过
    const auditPurchaseOrderHandle = () => {
        let tempDetailInfo = Object.assign({}, detailInfo)
        tempDetailInfo.orderDetailBoList = [...tempDetailInfo.orderDetailVoList]
        tempDetailInfo.orderDetailVoList = undefined
        delete tempDetailInfo.orderDetailVoList
        const params = {
            comment: auditInfo.comment,
            auditFlag: auditInfo.auditFlag,
            ...tempDetailInfo
        }
        setLoading(true)
        auditPurchaseOrderAPI(params).then((res) => {
            if (res.code == 200) {
                // 清空选择的文件以及申请的数据
                updateData(false, 'open')
                Taro.showToast({
                    title: auditInfo.auditFlag ? '通过成功' : '驳回成功',
                    icon: 'success',
                    duration: 1500
                })
                Taro.navigateBack({ delta: 1 })
            } else {
                setLoading(false)
            }
        }).finally(() => {
            setLoading(false)
        })
    }
    // 打开审核弹框
    const openDialog = (auditType) => {
        subscribeMessage().finally(() => {
            let tempInfo = Object.assign({}, auditInfo)
            tempInfo.open = true
            tempInfo.comment = ''
            tempInfo.auditFlag = auditType
            // console.log('tempInfo', tempInfo)
            setAuditInfo(tempInfo)
        })
    }
    // 审核确定
    const confirmChange = () => {
        // 驳回时:意见必填 通过时:意见不必填
        if (!auditInfo.auditFlag && !auditInfo.comment) {
            Taro.showToast({
                title: '请填写审核意见',
                icon: 'none',
                duration: 1500
            })
            return;
        }
        auditPurchaseOrderHandle()
    }

    // 键盘弹出
    const keyboardOpen = (height) => {
        if (height) {
            setKeyOpen(false)
        }
    }
    // 键盘关闭
    const keyboardClose = () => {
        setKeyOpen(true)
    }
    return (
        <View className={`material-report ${detailInfo ? 'material-detail-report' : ''}`}>
            <Picker className="material-picker" disabled={disabled} rangeKey='address' mode='selector' range={addressList} onChange={selectAddress}>
                <AtInput title="收货地址:" value={address.address} disabled placeholder="请选择收货地址">
                    <AtIcon value='chevron-down' size='16'></AtIcon>
                </AtInput>
            </Picker>

            <Picker className="material-picker" disabled={disabled} rangeKey='supplierName' mode='selector' range={supperList} onChange={selectSupper}>
                <AtInput title="供应商:" value={supper.supplierName} disabled placeholder="请选择供应商">
                    <AtIcon value='chevron-down' size='16'></AtIcon>
                </AtInput>
            </Picker>

            {[1, 2].includes(Number(type)) ? <View className="material-choose flex flex-between">
                <View className="flex flex-start" style={'color: #6190e8;'} onClick={toPath}>
                    <AtIcon value='menu' size='20'></AtIcon>
                    <Text className="ml-5">选择物料</Text>
                </View>
                <View className="flex flex-end">采购总金额: {totalPrice}</View>
            </View> : <TableDes list={[
                { label: '采购总数:', value: detailInfo?.quantity },
                { label: '采购总金额:', value: detailInfo?.total || 0 },
                { label: '开单人:', value: detailInfo?.createByName },
                { label: '开单日期:', value: detailInfo?.submitTime },
            ]}></TableDes>}

            {
                chooseList?.length ? chooseList.map((item, index) => {
                    return (<MaterialCard
                        item={item}
                        index={index}
                        disabled={disabled}
                        onDelete={onDelete}
                        onChange={cardChange}
                        keyboardOpen={keyboardOpen}
                        keyboardClose={keyboardClose}
                    ></MaterialCard>)
                }) : <AtLoadMore status='noMore' noMoreText='暂无数据'></AtLoadMore>
            }

            <View className={`g-form-item flex flex-start ${disabled ? 'image-disabled' : ''}`}>
                <View className='g-form-label'>凭证上传:</View>
                <AtImagePicker
                    length={3}
                    mode='aspectFit'
                    files={fileList}
                    onFail={fileFail}
                    onChange={fileChange}
                    showAddBtn={!disabled}
                    onImageClick={previewImage}
                    // sourceType={['camera']}
                ></AtImagePicker>
            </View>

            {!disabled && <View className={`material-reprot-bottom flex flex-start ${keyOpen ? '' : 'bottom-hide'}`}>
                <AtButton loading={loading}  disabled={loading} className="btn-template" onClick={() => saveHandle('1')}>存草稿</AtButton>
                <AtButton loading={loading}  disabled={loading} type='primary' onClick={() => saveHandle('2')}>提交</AtButton>
            </View>}
            
            {type == 4 && <View className={`material-reprot-bottom flex flex-start`}>
                <AtButton className="btn-reject" onClick={() => openDialog(false)}>驳回</AtButton>
                <AtButton type='primary' onClick={() => openDialog(true)}>通过</AtButton>
            </View>}

            {auditInfo.open && <AtModal isOpened={auditInfo.open} closeOnClickOverlay={false}>
                <AtModalHeader>审核</AtModalHeader>
                <AtModalContent>
                    <View className="g-form-item flex flex-start">
                        <View className="g-form-label">审核意见:</View>
                        <AtTextarea value={auditInfo.comment} onChange={(e) => updateData(e, 'comment')} placeholder="请填写审核意见"></AtTextarea>
                    </View>
                </AtModalContent>
                <AtModalAction> <Button loading={loading} disabled={loading} onClick={() => updateData(false, 'open')}>取消</Button> <Button loading={loading} disabled={loading} onClick={confirmChange}>确定</Button> </AtModalAction>
            </AtModal>}
            <GFeedback></GFeedback>
        </View>
    )
}