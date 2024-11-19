import './index.less'
import { listVoucherAPI } from '../../pages/services/upload'
import { useState, forwardRef, useImperativeHandle } from "react"
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import { detailByCodeAppAPI } from '../../pages/services/saleContract/index'
import { AtButton, AtLoadMore, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

export default forwardRef(function GVoucherPop({ previewHandle }, ref) {
    const initDialog = {
        id: '',
        type: '',
        list: [],
        open: false,
        title: '预览凭证',
    }
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    // 对应 onShow
    useDidShow(() => {
    })
    // 修改数据
    const updateData = (arr, tempType = 'dialog') => {
        // arr = [{ value: '1212', field: 'number' }]
        // console.log(arr)
        if (!arr?.length) return
        if (tempType == 'dialog') {
            let tempDialog = JSON.parse(JSON.stringify(dialogInfo))
            arr.map((item, index) => {
                tempDialog[item.field] = item.value
            })
            // console.log(tempDialog)
            setDialogInfo(tempDialog)
        }
    }

    // 打开弹框
    const openVoucher = (code, id, type) => {
        // let item
        if (type == 22) {
            Taro.showLoading({mask: true})
            detailByCodeAppAPI(code).then((res) => {
                if (res.code == 200) {
                    updateData([
                        // ['2','6','10'].includes(type+'')
                        { value: id, field: 'id' },
                        { value: true, field: 'open' },
                        { value: type, field: 'type' },
                        { value: `预览${code||''}凭证`, field: 'title' },
                        { value: res.data?.fileList || [], field: 'list' },
                    ])
                }
            }).finally(() => Taro.hideLoading())
        } else {
            Taro.showLoading({mask: true})
            listVoucherAPI(['2','6','10'].includes(type+'') ? id : id).then((res) => {
                if (res.code == 200) {
                    updateData([
                        // ['2','6','10'].includes(type+'')
                        { value: id, field: 'id' },
                        { value: true, field: 'open' },
                        { value: type, field: 'type' },
                        { value: res.data || [], field: 'list' },
                        { value: `预览${code||''}凭证`, field: 'title' }
                    ])
                }
            }).finally(() => Taro.hideLoading())
        }
        updateData([
            { value: id, field: 'id' },
            { value: true, field: 'open' },
            { value: type, field: 'type' },
            { value: `预览${code}凭证`, field: 'title' }
        ])
    }

    const isImage = (type) => {
        return ['jpg','jpeg','tiff','svg','bmp','png','webp','gif','tif','psd'].includes(((type || '')+'').replace('.','').toLowerCase())
    }
    // 预览图片
    const previewImg = (index) => {
        const crtFile = dialogInfo.list[index]
        previewHandle && previewHandle()
        if (isImage(crtFile.type)) {
            let list = dialogInfo.list.filter((f) => isImage(f.type)).map((item) => item.url)
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

    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openVoucher
    }))
    return (
        <AtModal isOpened={dialogInfo.open} onClose={() => updateData([{ value: false, field: 'open' }])} className='new pop-bottom common-dialog g-sign-pop'>
            <AtModalHeader>{dialogInfo.title}</AtModalHeader>
            <AtModalContent>
                {dialogInfo.list?.length ? <Swiper
                    circular
                    indicatorDots
                    className='sign-swiper'
                    indicatorColor='rgba(211, 211, 211, 1)'
                    indicatorActiveColor='rgba(45, 144, 237, 1)'>
                    {
                        dialogInfo.list.map((item, index) => {
                            return (
                                <SwiperItem>
                                    <View className='sign-swiper-card' onClick={() => previewImg(index)}>
                                        {/* <View className='sign-swiper-card-title'>{item.signName}</View> */}
                                        {isImage(item.type) ? <Image src={item.url} className='sign-swiper-card-img' mode='aspectFit'></Image> : <View className='sign-swiper-card-file flex flex-center'>{item.name}</View>}
                                    </View>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper> : <View className='g-sign-empty flex flex-center flex-column'>
                    <View className='g-sign-empty-voucher'>暂无凭证</View>
                </View>}
            </AtModalContent>
        </AtModal>
    )
})