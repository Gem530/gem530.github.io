import './index.less'
import dayjs from 'dayjs'
import { useRef, useState } from 'react'
import GPicker from '../../../components/g-picker'
import { View, Picker } from '@tarojs/components'
import { AtIcon, AtButton, AtInput,AtImagePicker } from "taro-ui"
import GFeedback from '../../../components/g-feedback'
import GWaterMark from '../../../components/g-water-mark'
import { scanQRCodeAPI } from '../../../pages/services/login/loginService'
import { queryUrlLinkAPI } from '../../../pages/services/login/loginService'
import { uploadFileDeal, downloadFileByKeys, hasPermi, loginOut } from '../../../pages/util/func'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { getCustomerListAPI, detailByCodeAPI, updateMaterialFlowAPI, getListLogisticsCompanyAPI, updateLogisticsNoAPI } from '../../../pages/services/saleContract'
import { getWxMaterialInTransitAPI } from '../../../pages/services/saleContract/index'
import { getSignedUrlErpAPI } from '../../../pages/services/upload/index'
import { getMaterialDeliveryDetailAPI } from '../../../pages/services/materialRequisition/index'
import { listVoucherCommonAPI } from '../../../pages/services/upload'

export default function LandRelatedLogistics() {
  const initForm = {
    id: 0,
    commodityCode: '', // 物料号
    customerPo: '', // 客户PO号
    commodityName: '', // 客户型号
    customerMaterialCode: '', // 客户物料号
    deliveryTime: '', // 发货时间
    code: '', // 发货单号
    commodityCode: '', // 物料号
    cusAddress: '', // 客户地址
    deliveryQuantity: '', // 发货数量
    codeQuantity: 0, // 订单数量
  }
  const initCustomer = {
    id: 0,
    companyName: '',
    customerCode: '',
  }
  const initCompany = {
    id: 0,
    code: '',
    name: '',
    fullName: '',
  }

  const GWaterMarkRef = useRef()
  const [open, setOpen] = useState(false)
  const [number, setNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [company, setCompany] = useState('')
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)
  const [companyList, setCompanyList] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [orderInfo, setOrderInfo] = useState(initForm)
  const [companyInfo, setCompanyInfo] = useState(initCompany)
  const [customerInfo, setCustomerInfo] = useState(initCustomer)
  const [deliveryId, setDeliveryId] = useState()
  useShareAppMessage(() => {
    return {
      title: '关联物流信息',
      path: '/pages/index/index'
    }
  })
  useLoad((option) => {
    Taro.hideHomeButton({}).then();
    console.log("===========,", option);
    getDetail(option.id);
    setDeliveryId(option.deliveryId);
    
    // getMaterialDeliveryDetailAPI(option.deliveryId).then((res) => {
    //   if (res.code == 200) {

    //     res.data?.logisticsTrackingNumber && setNumber(res.data?.logisticsTrackingNumber)
    //     res.data?.logisticsCompany && setCompanyInfo({
    //       id: undefined,
    //       code: '',
    //       name: '',
    //       fullName: res.data?.logisticsCompany
    //     })
    //     res.data?.phoneNumber && setPhoneNumber(res.data?.phoneNumber)

    //   }
    // }).finally(() => {
    //   setLoading(false)
    // })

    listVoucherCommonAPI(option.deliveryId,'33').then((res) => {
      console.log(res);
      setFileList(res.data)
    })

  })

  useDidShow(() => {
    const temp = Taro.getStorageSync('sendOrderInfo')
    console.log(temp)
    if (temp) {
      temp?.logisticsNo && setNumber(temp.logisticsNo)
      temp?.logisticsCompany && setCompanyInfo({
        id: undefined,
        code: '',
        name: '',
        fullName: temp.logisticsCompany
      })
      setOrderInfo(temp || initForm)
      Taro.removeStorageSync('sendOrderInfo')
    }
    getCustomerList()
    getListLogisticsCompany()
  })

  const getCustomerList = () => {
    getCustomerListAPI().then((res) => {
      if (res.code == 200) {
        setCustomerList(res.data || [])
      }
    })
  }

  const getDetail = (id) => {
    if (!id) return;
    Taro.showLoading({ title: '加载中...', mask: true })
    getWxMaterialInTransitAPI({
      id: id,
      isApplet: '1' // 小程序1 ，erp 0
    }).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        res.data && setOrderInfo(res.data)

      }
      Taro.hideLoading()
    }).catch((err) => {
      console.log('err', err)
      setTimeout(() => {
        Taro.hideLoading()
      }, 1500)
    })
  }

  const getListLogisticsCompany = () => {
    getListLogisticsCompanyAPI().then((res) => {
      if (res.code == 200) {
        setCompanyList(res.rows)
      }
    })
  }

  const changeHandle = (e, changeType) => {
    if (changeType == 'customer') {
      setOpen(false)
      const tempCrt = e
      console.log(e, customerList, tempCrt)
      setCustomerInfo(tempCrt)

      // 重新选择客户时，清空送货单信息
      setNumber('')
      setCompanyInfo(initCompany)
      setOrderInfo(initForm)
      Taro.removeStorageSync('sendOrderInfo')

      toPath('selectRelated/index?id=' + tempCrt.customerCode)
    } else if (changeType == 'company') {
      let tempCompany = companyList[Number(e.detail.value)]
      setCompanyInfo(tempCompany)
    }
  }

  const getUrlParam = (url) => {
    let obj = {}
    let params = url.split('?')[1].split('&')
    params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]))
    return obj
  }

  // 扫描物流单
  const scanLogistics = async () => {

    GWaterMarkRef.current.chooseImage(async (data) => {
      console.log(data)
      try {
        let fileInfo = data[0]
        console.log('上传图片', fileInfo)
        const imgInfo = await downloadFileByKeys(fileInfo.key, false)
        console.log('获取url', imgInfo, imgInfo?.data[fileInfo.key])
        console.log(encodeURIComponent(imgInfo?.data[fileInfo.key]))
        const res = await scanQRCodeAPI(encodeURIComponent(imgInfo?.data[fileInfo.key]))
        console.log('解码', res, code)
        let code = res.data;
        setNumber(code)
        setFileList(data)
        if (code && code.indexOf('SF') == 0) {
          let temp = companyList.find((f) => f.code == 'SFEXPRESS')
          setCompanyInfo(temp)
        } else if (code && code.indexOf('KY') == 0) {
          let temp = companyList.find((f) => f.code == 'KYEXPRESS')
          setCompanyInfo(temp)
        }
        Taro.hideLoading()
      } catch (err) {
        console.log('err', err)
        setTimeout(() => {
          Taro.hideLoading()
        }, 1000)
      }
    })
  }

  // 校验数据
  const checkData = () => {
    let res = ''
    if (!company) {
      res = '请选择物流公司'
    } else if (!number) {
      res = '请输入物流单号'
    } else if (!phoneNumber) {
      res = '顺丰物流请输入手机号'
    }
    return res
  }

  // 确认关联
  const confirmHandle = () => {
    const resText = checkData()
    if (resText) {
      Taro.showToast({
        title: resText,
        icon: 'error',
        duration: 1500
      })
      return;
    }
    if (orderInfo?.logisticsCompany || orderInfo?.logisticsNo) {
      Taro.showModal({
        title: '已有物流信息，是否修改？',
        success(result) {
          if (result.confirm) {
            submitHandle()
          }
        }
      })
      return
    }
    Taro.showModal({
      title: '是否确认关联？',
      success(result) {
        if (result.confirm) {
          submitHandle()
        }
      }
    })
  }

  const submitHandle = () => {
    // console.log(resText, orderInfo, customerInfo, number, companyInfo)
    //companyInfo?.fullName
    let params = {
      fileList: fileList,
      logisticsTrackingNumber: number,
      phoneNumber: phoneNumber,
      code: orderInfo?.code,
      logisticsCompany: company,
      logisticsCompanyCode: companyInfo?.code,
      purchaseDetailId: deliveryId
    }
    setLoading(true)
    updateLogisticsNoAPI(params).then((res) => {
      if (res.code == 200) {
        Taro.showToast({
          title: '关联成功',
          icon: 'success',
          duration: 1500
        })

        setNumber('')
        setCompany('')
        setCompanyInfo(initCompany)
        setOrderInfo(initForm)
        Taro.removeStorageSync('sendOrderInfo')
        //返回上一页
        Taro.navigateBack({ delta: 1 })
        // Taro.navigateBack({ delta: 1 })
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  const toPath = (url) => {
    // console.log(item, index)
    Taro.navigateTo({ url })
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
  }


  return (
    <View className='related-page'>

      <View className='common-card'>
        <View className='common-item'>
          <View className='common-title'>{orderInfo?.materialName}</View>
        </View>

        <View className='common-item'>
          <View className='common-item-label'>供应商名称</View>
          <View className='common-item-value'>{orderInfo?.companyName}</View>
        </View>
        <View className='common-item'>
          <View className='common-item-label'>送货地址</View>
          <View className='common-item-value'>{orderInfo?.deliveryAddress}</View>
        </View>
        <View className='common-item'>
          <View className='common-item-label'>规格型号</View>
          <View className='common-item-value'>{orderInfo?.specification}</View>
        </View>

        <View className='common-between half'>
          <View className='common-item detail-left'>
            <View className='common-item-label'>采购数量</View>
            <View className='common-item-value'>{orderInfo?.quantity}</View>
          </View>
          <View className='common-item detail-left'>
            <View className='common-item-label'>已收数量</View>
            <View className='common-item-value'>{orderInfo?.receiveQuantity}</View>
          </View>
        </View>
        <View className='common-between half'>
          <View className='common-item detail-left'>
            <View className='common-item-label'>在途数量</View>
            <View className='common-item-value'>{orderInfo?.inTransitNumber}</View>
          </View>
          <View className='common-item detail-left'>
            <View className='common-item-label'>单位</View>
            <View className='common-item-value'>{orderInfo?.units}</View>
          </View>
        </View>

        <View className='common-item'>
          <View className='common-item-label'>要求交期</View>
          <View className='common-item-value'>{dayjs(orderInfo.deliverTime).format('YYYY-MM-DD')}</View>
        </View>
      </View>



      <View className='related-card'>
        <View className='related-card-title'>物流信息</View>

        {/* <Picker mode="selector" rangeKey='fullName' range={companyList} onChange={(e) => changeHandle(e, 'company')}>
          <AtInput  className='related-label' editable={false} title='物流公司' placeholder='请选择物流公司' value={companyInfo.fullName}>
            <AtIcon size={16} value='chevron-down' color='rgba(45, 144, 237, 1)'></AtIcon>
          </AtInput>
        </Picker> */}
        <AtInput className='related-label' title='物流公司' placeholder='请输入物流公司' value={company} maxLength={30} onChange={(e) => setCompany(e)}></AtInput>
        <AtInput className='related-label' title='收货人手机号' placeholder='请输入收货人手机号' value={phoneNumber} maxLength={30} onChange={(e) => setPhoneNumber(e)}></AtInput>
        <AtInput  className='related-label' title='物流单号' placeholder='请输入物流单号' value={number} maxLength={30} onChange={(e) => setNumber(e)}></AtInput>

        <View className={`g-form-item flex flex-start`}>
          <View className='g-form-label'>凭证上传:</View>
          <AtImagePicker
            length={3}
            mode='aspectFit'
            files={fileList}
            onFail={fileFail}
            onChange={fileChange}
            onImageClick={previewImage}
          // sourceType={['camera']}
          ></AtImagePicker>
        </View>

        <AtButton loading={loading} disabled={loading} className='related-btn line-height' onClick={scanLogistics}>
          <View className='flex flex-center flex-column' style={'height: 100%;'}>
            <View>扫描物流单</View>
            <View>(物流单号对应的条形码)</View>
          </View>
        </AtButton>
      </View>

      <AtButton loading={loading} disabled={loading} className='related-btn-bottom related-btn' type='primary' onClick={confirmHandle}>确认关联</AtButton>

      <GFeedback></GFeedback>
      <GWaterMark ref={GWaterMarkRef}></GWaterMark>
    </View>
  )
}
