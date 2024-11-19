import './index.less'
import { useState, useRef } from 'react'
import {Image, Swiper, SwiperItem, View} from '@tarojs/components'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import {receiveFileAPI} from "../../../../../pages/services/outSource/receive";



export default function InventoryCheckDetail() {

  const [id, setId] = useState()
  const [didShow, setDidShow] = useState(false)
  const [fileList, setFileList] = useState([])


  useShareAppMessage(() => {
    return {
      title: '发货单详情',
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    console.log(option)
    setId(option.id)

  })
  useDidShow(async () => {
    if (didShow) {
      setDidShow(false)
      return
    }
    const isRefresh = Taro.getStorageSync('isRefresh')
    if (id) {
      const request = {
        bizId : id,
        bizType: '33',
      }
      const res = await receiveFileAPI(request)
      setFileList(res.data);
      console.log(res);
    }
  })

  const isImage = (type) => {
    return ['jpg','jpeg','tiff','svg','bmp','png','webp','gif','tif','psd'].includes(((type || '')+'').replace('.','').toLowerCase())
  }

  // 预览图片
  const previewImg = (index) => {
    const crtFile = fileList[index]
    if (isImage(crtFile.type)) {
      let list = fileList.filter((f) => isImage(f.type)).map((item) => item.url)
      Taro.previewImage({
        current: crtFile.url,
        urls: list
      })
    } else {
      Taro.downloadFile({
        url: crtFile.url,
        success: function (res) {
          var filePath = res.tempFilePath
          Taro.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }
  }

  return (
    <View >
        {fileList?.length ? <View>

                <View className='receive-card flex flex-wrap'>
                  {
                    fileList.map((item, index) => { return ( isImage(item.type) ?   <Image onClick={() => previewImg(index)} src={item.url} className='receiveFile' mode='aspectFit'></Image> : <View className='receiveFile'>{item.name}</View> ) }) }

                </View>

        </View> : <View className='g-sign-empty flex flex-center flex-column'>
          <View className='g-sign-empty-voucher'>暂无凭证</View>
        </View>}
    </View>
  )
}
