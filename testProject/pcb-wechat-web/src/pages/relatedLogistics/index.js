import './index.less'
import { useRef, useState } from 'react'
import GPicker from '../../components/g-picker'
import { View, Picker } from '@tarojs/components'
import { hasPermi, loginOut } from '../util/func'
import GFeedback from '../../components/g-feedback'
import GWaterMark from '../../components/g-water-mark'
import { uploadDeliveryAPI } from '../services/upload'
import { scanQRCodeAPI } from '../services/login/loginService'
import { queryUrlLinkAPI } from '../services/login/loginService'
import { uploadFileDeal, downloadFileByKeys } from '../util/func'
import { AtIcon, AtButton, AtInput, AtImagePicker } from "taro-ui"
import Taro, {useLoad, useDidShow, useShareAppMessage} from '@tarojs/taro'
import { getCustomerListAPI, detailByCodeAPI, updateMaterialFlowAPI, getListLogisticsCompanyAPI } from '../services/saleContract'


export default function RelatedLogistics() {
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
    // companyAddress: '',
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
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)
  const [voucherList, setVoucherList] = useState([])
  const [companyList, setCompanyList] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [orderInfo, setOrderInfo] = useState(initForm)
  const [companyInfo, setCompanyInfo] = useState(initCompany)
  const [customerInfo, setCustomerInfo] = useState(initCustomer)
  useShareAppMessage(() => {
    return {
      title: '关联物流信息',
      path: '/pages/index/index'
    }
  })
  useLoad(() => {
  })

  useDidShow(() => {
    const temp = Taro.getStorageSync('sendOrderInfo')
    console.log(temp)
    if (temp) {
      // orderInfo?.logisticsCompany || orderInfo?.logisticsNo
      temp?.logisticsNo && setNumber(temp.logisticsNo)
      temp?.logisticsCompany && setCompanyInfo({
        id: undefined,
        code: '',
        name: '',
        fullName: temp.logisticsCompany
      })
      setFileList(temp?.fileList || [])
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
      // console.log(e)

      // const tempCrt = customerList.find((f) => f.id == e)
      // const tempCrt = customerList[Number(e.detail.value)]
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
      // toPath('pages/relatedLogistics/selectRelated/index')
      // setCompanyInfo({
      //   id: 1,
      //   name: '顺丰'
      // })
    }
  }

  const getUrlParam = (url) => {
    let obj = {}
    let params = url.split('?')[1].split('&')
    params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]))
    return obj
  }

  // 扫描送货单
  const scanSend = () => {
    setNumber('')
    setCompanyInfo(initCompany)
    setOrderInfo(initForm)
    setCustomerInfo(initCustomer)
    Taro.removeStorageSync('sendOrderInfo')

    Taro.scanCode({
      onlyFromCamera: true,
      success: async (res) => {
        console.log(res)
        const wxRes = await queryUrlLinkAPI({ urlLink: res.result })
        let code = wxRes.data
        if (wxRes?.data?.query) {
          let url = decodeURIComponent(wxRes.data.path +'?'+ wxRes.data?.query)
          let obj = getUrlParam(url)
          // console.log(obj)
          // getDetail(obj.code)
          code = obj.code
        }
        // console.log(code)
        detailByCodeAPI(code).then((res) => {
          if (res.code == 200) {
            // console.log(res)
            setCustomerInfo({
              id: res.data?.customerId,
              companyName: res.data?.customerName,
              customerCode: res.data?.customerCode,
              // companyAddress: res.data?.cusAddress,
            })
            setFileList(res.data?.fileList || [])

      
            if (res.data.detailList?.length) {
              res.data.detailList[0].cusAddress = res.data.detailList[0]?.cusAddress || res.data?.cusAddress
              setOrderInfo(res.data.detailList[0])

              let temp = res.data.detailList[0]
              temp?.logisticsNo && setNumber(temp.logisticsNo)
              temp?.logisticsCompany && setCompanyInfo({
                id: undefined,
                code: '',
                name: '',
                fullName: temp.logisticsCompany
              })
            }
          }
        })
      }
    })
  }

  // 扫描物流单
  const scanLogistics = async () => {
    // setNumber('')
    // setCompanyInfo(initCompany)

    // GWaterMarkRef.current.chooseImage(async (data) => {
    //   console.log(data)
    //   try {
    //     // let res1 = await uploadFileDeal(file.tempFilePaths)
    //     let fileInfo = data[0]
    //     console.log('上传图片', fileInfo)
    //     const imgInfo = await downloadFileByKeys(fileInfo.key, false)
    //     console.log('获取url', imgInfo, imgInfo?.data[fileInfo.key])
    //     console.log(encodeURIComponent(imgInfo?.data[fileInfo.key]))
    //     const res = await scanQRCodeAPI(encodeURIComponent(imgInfo?.data[fileInfo.key]))
    //     console.log('解码', res, code)
    //     let code = res.data;
    //     setNumber(code)
    //     setFileList(data)
    //     if (code && code.indexOf('SF') == 0) {
    //       let temp = companyList.find((f) => f.code == 'SFEXPRESS')
    //       setCompanyInfo(temp)
    //     } else if (code && code.indexOf('KY') == 0) {
    //       let temp = companyList.find((f) => f.code == 'KYEXPRESS')
    //       setCompanyInfo(temp)
    //     }
    //     Taro.hideLoading()
    //   } catch(err) {
    //     console.log('err', err)
    //     setTimeout(() => {
    //       Taro.hideLoading()
    //     }, 1000)
    //   }
    // })

    // // 图片上传
    // const file = await Taro.chooseImage({ count: 1, sizeType: 'compressed' })
    // // console.log(file)
    // // const imgInfo = await getImageInfo(file.tempFilePaths[0])
    // // const fileInfo = await getFileInfo(file.tempFilePaths[0])
    // // console.log(imgInfo, fileInfo)
    // if (file?.errMsg == 'chooseImage:ok') {
    //     Taro.showLoading({title: '加载中...', mask: true})
    //     try {
    //       let res1 = await uploadFileDeal(file.tempFilePaths)
    //       let fileInfo = res1[0].params.fileInfo
    //       console.log('上传图片', fileInfo)
    //       const imgInfo = await downloadFileByKeys(fileInfo.key, false)
    //       console.log('获取url', imgInfo, imgInfo?.data[fileInfo.key])
    //       console.log(encodeURIComponent(imgInfo?.data[fileInfo.key]))
    //       const res = await scanQRCodeAPI(encodeURIComponent(imgInfo?.data[fileInfo.key]))
    //       console.log('解码', res, code)
    //       let code = res.data;
    //       setNumber(code)
    //       setFileList([res1[0].params.fileInfo])
    //       if (code.indexOf('SF') == 0) {
    //         let temp = companyList.find((f) => f.code == 'SFEXPRESS')
    //         setCompanyInfo(temp)
    //       } else if (code.indexOf('KY') == 0) {
    //         let temp = companyList.find((f) => f.code == 'KYEXPRESS')
    //         setCompanyInfo(temp)
    //       }
    //       Taro.hideLoading()
    //     } catch(err) {
    //       console.log('err', err)
    //       setTimeout(() => {
    //         Taro.hideLoading()
    //       }, 1000)
    //     }
    // }

    Taro.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        let code = res.result;
        // console.log(res, code)
        setNumber(code)
        if (code.indexOf('SF') == 0) {
          let temp = companyList.find((f) => f.code == 'SFEXPRESS')
          setCompanyInfo(temp)
        } else if (code.indexOf('KY') == 0) {
          let temp = companyList.find((f) => f.code == 'KYEXPRESS')
          setCompanyInfo(temp)
        }
      }
    })
  }

  // 校验数据
  const checkData = () => {
    let res = ''
    if (!orderInfo?.id) {
      res = '请选择送货单'
    } else if (!companyInfo?.fullName) {
      res = '请选择物流公司'
    } else if (!number) {
      res = '请输入物流单号'
    } else if (!fileList?.length) {
      res = '请上传送货凭证'
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
        success (result) {
          if (result.confirm) {
            submitHandle()
          }
        }
      })
      return
    }
    Taro.showModal({
      title: '是否确认关联？',
      success (result) {
        if (result.confirm) {
          submitHandle()
        }
      }
    })
  }

  const submitHandle = () => {
    // console.log(resText, orderInfo, customerInfo, number, companyInfo)
    let params = {
      fileList: fileList,
      logisticsNo: number,
      code: orderInfo?.code,
      logisticsCompany: companyInfo?.fullName,
      logisticsCompanyCode: companyInfo?.code,
    }
    setLoading(true)
    updateMaterialFlowAPI(params).then((res) => {
      if (res.code == 200) {
        Taro.showToast({
          title: '关联成功',
          icon: 'success',
          duration: 1500
        })

        setNumber('')
        setFileList([])
        setCompanyInfo(initCompany)
        setOrderInfo(initForm)
        setCustomerInfo(initCustomer)
        Taro.removeStorageSync('sendOrderInfo')
        // Taro.navigateBack({ delta: 1 })

        // // pcb送货单
        // let voucherParams = {
        //   id: orderInfo.id,
        //   code: orderInfo.code,
        //   fileList: voucherList,
        // }
        // uploadDeliveryAPI(voucherParams).finally(() => setLoading(false))
      }
    }).finally(() => setLoading(false))
  }

  // 图片上传
  const fileChange = async (files, operationType, index) => {
      // files 值发生变化触发的回调函数, operationType:add新增 remove删除 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引
      console.log('files', files)
      if (operationType == 'add') {
        let tempFiles = files.filter((f) => f.file)
        let tempFile = {
          tempFilePaths: tempFiles.map((m) => m.file.path),
          tempFiles: tempFiles.map((m) => m.file),
        }
        GWaterMarkRef.current.chooseImage(async (data) => {
          console.log('data', data)
          let tempHasUrl = files.filter((f) => !f.file)
          let tempData = [...(tempHasUrl?.length ? tempHasUrl : []), ...data]
          console.log('tempData', tempData)
          setFileList(tempData)
          Taro.hideLoading()
        }, tempFile)
      } else {
          setFileList(files)
          // updateData([{ value: files, field: 'fileList' }], 'record')
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

  const toPath = (url) => {
    // console.log(item, index)
    Taro.navigateTo({ url })
  }
  return (
    <View className='related-page'>
      <View className='related-card'>
        <View className='related-card-title flex flex-start'>送货单信息
          <View className='related-card-subtitle'>(订单数量：{orderInfo?.codeQuantity})</View>
        </View>

        <View className='related-card-item'>
          <View className='related-card-label'>客户编码:</View>
          <View className='related-card-value'>{customerInfo?.customerCode}</View>
          <View className='related-card-tag' onClick={() => setOpen(true)}>
            选择客户
          </View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>客户地址:</View>
          <View className='related-card-value'>{orderInfo?.cusAddress}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>客户PO号:</View>
          <View className='related-card-value'>{orderInfo?.customerPo}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>客户型号:</View>
          <View className='related-card-value'>{orderInfo?.commodityName}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>客户物料号:</View>
          <View className='related-card-value'>{orderInfo?.customerMaterialCode}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>料号:</View>
          <View className='related-card-value'>{orderInfo?.commodityCode}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>发货数量:</View>
          <View className='related-card-value'>{orderInfo?.deliveryQuantity}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>发货时间:</View>
          <View className='related-card-value'>{orderInfo?.deliveryTime}</View>
        </View>
        <View className='related-card-item'>
          <View className='related-card-label'>发货单号:</View>
          <View className='related-card-value'>{orderInfo?.code}</View>
        </View>

        <AtButton loading={loading} disabled={loading} className='related-btn' onClick={scanSend}>扫描送货单</AtButton>
      </View>

      <View className='related-card'>
        <View className='related-card-title'>物流信息</View>

        <Picker mode="selector" rangeKey='fullName' range={companyList} onChange={(e) => changeHandle(e, 'company')}>
          <AtInput editable={false} title='物流公司' placeholder='请选择物流公司' value={companyInfo.fullName}>
            <AtIcon size={16} value='chevron-down' color='rgba(45, 144, 237, 1)'></AtIcon>
          </AtInput>
        </Picker>
        <AtInput title='物流单号' placeholder='请输入物流单号' value={number} maxLength={30} onChange={(e) => setNumber(e)}></AtInput>

        <AtButton loading={loading} disabled={loading} className='related-btn line-height' onClick={scanLogistics}>
          <View className='flex flex-center flex-column' style={'height: 100%;'}>
            <View>扫描物流单</View>
            <View>(物流单号对应的条形码)</View>
          </View>
        </AtButton>
      </View>

      <View className='related-card'>
        <View className='related-card-title'>送货凭证</View>
        {/* {orderInfo?.id ?  */}
        <AtImagePicker
          length={4}
          multiple={true}
          mode='aspectFit'
          files={fileList}
          className='related-file'
          onFail={fileFail}
          onChange={fileChange}
          onImageClick={previewImage}
        ></AtImagePicker>
        {/*  : <View className='g-empty-desens flex flex-center' style={'color: #9d9d9d;'}>请先选择送货单</View>} */}
      </View>

      <AtButton loading={loading} disabled={loading} className='related-btn-bottom related-btn' type='primary' onClick={confirmHandle}>确认关联</AtButton>

      {open && <GPicker list={customerList} rangeKey='customerCode' placeholder='请输入客户编码搜索' value={open} cancel={() => setOpen(false)} confirm={(e) => changeHandle(e, 'customer')}></GPicker>}
      <GFeedback></GFeedback>
      <GWaterMark ref={GWaterMarkRef}></GWaterMark>
    </View>
  )
}
