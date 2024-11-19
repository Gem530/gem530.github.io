import './index.less'
import GConfirm from '../g-confirm';
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { signListAPI, queryIsAuthAPI, authorizeAPI } from '../../pages/services/signMange'
import { AtButton, AtDrawer, AtTabs, AtIcon, AtLoadMore, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

export default forwardRef(function GSignPop({id, open, type, codeList, onClose, onChoose, toSign, right = true, width = '616rpx'}, ref) {
    const GConfirmRef = useRef()
    const [h, setH] = useState(0)
    const [list, setList] = useState([])
    const [crtSign, setCrtSign] = useState()
    const [current, setCurrent] = useState(0)
    const [showTab, setShowTab] = useState(true)
    
    useEffect(() => {
        if (open) {
            getSignList()
        }
    }, [open])

    // 对应 onShow
    useDidShow(() => {
        getSignList()
        let userInfo = Taro.getStorageSync('__USER_INFO__');
        if (userInfo?.user?.ownerId == '1821105007311372289') {
            // 未加入单位 1821105007311372289
            setShowTab(false)
        } else {
            setShowTab(true)
        }
        setTimeout(() => {
            Taro.createSelectorQuery().select('.nav-bar').fields({ rect: true, scrollOffset: true, size: true, dataset: true }, (res) => {
                console.log(res?.height)
                // getGlobalData('menuButtonInfo').top
                let barHeight = res?.height// + getGlobalData('menuButtonInfo').top
                setH(barHeight || 0)
            }).exec()
        }, 100)
    })

    // 获取签章列表
    const getSignList = (query) => {
        let type = (query || query == 0) ? query : current
        let params = {
            signType: type == 0 ? '2' : '1'
        }
        signListAPI(params).then((res) => {
            if (res.code == 200) {
                setList(res.data || [])
            }
        })
    }

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        console.log(e)
        getSignList(e)
        // getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 0 ? '2' : '3', field: 'confirmStatus' }])
    }

    // 是否选择签名
    const chooseHandle = (item) => {
        if (!item) {
            Taro.showToast({ title: '请选择签章', icon: 'error' })
            return;
        }
        Taro.showModal({
            title: `是否选择 ${item.signName} 去签名？`,
            success: (res) => {
                if (res?.confirm) {
                    onChoose(item)
                }
            }
        })
    }

    // 新增签名、印章，判断是否授权
    const addSignHandle = (url) => {
        queryIsAuthAPI().then((res) => {
            if (res.code == 200 && res.data?.isAuth == '0') {
                GConfirmRef.current.openConfirm({
                  title: res.data?.title,
                  content: <text className='w-100 f-s-32 font-weight-4' style={'line-height: 1.5;'}>
                    {res.data?.content}
                  </text>,
                  cancelText: '拒绝',
                  confirmText: '接受',
                }).then(() => {
                    Taro.login({
                        success: (wxRes) => {
                            console.log(wxRes, wxRes.code)
                            authorizeAPI({wxCode: wxRes.code})
                            toPath(url)
                        }
                    })
                })
            } else if (res.code == 200 && res.data?.isAuth == '1') {
                toPath(url)
            }
        })
    }
    const toPath = (url) => {
        if (['91', '101'].includes(type+'')) {
            Taro.setStorageSync('codeList', codeList);
        }
        Taro.navigateTo({ url })
        toSign && toSign()
    }

    // 打开签名弹框
    const openSign = (data) => {}

    // 把方法抛出给父组件
    useImperativeHandle(ref, () => ({
        openSign,
    }))

    return (
        <View catchMove={true} style={'position: relative;z-index: 999;'}>
        <AtDrawer mask width={width} right={right} show={open} onClose={onClose} className={`g-sign-drawer ${!open && 'none-dom'}`}>
            <View style={`height: ${h}px;`}></View>
            <View className='at-drawer-title linght-border flex flex-center'>选择签章</View>
            {showTab ? <AtTabs
                animated={false}
                current={current}
                className="new no-body border-bottom"
                tabList={[
                    { title: '电子签名' },
                    { title: '电子印章' },
                ]}
                onClick={handleClick}>
            </AtTabs> : <></>}
            <ScrollView scrollY className="at-drawer-content" style={`height: calc(100% - 64rpx - 96rpx - 156rpx - ${h}px + ${showTab ? 0 : 64}rpx);padding-top: 20rpx;padding-bottom: 20rpx;`}>
                {current == 0 ? <>
                    <View className='flex flex-end primary-color f-s-28' onClick={() => addSignHandle(`/pages/subOne/userInfo/signBoard/index?len=${list?.length}&isSave=${'1'}&orderId=${id}&type=${type}`)}>
                        <AtIcon value='add' size='14' color='#1890FF' className='m-r-10'></AtIcon>新增签名
                    </View>
                </> : <>
                    <View className='flex flex-end primary-color f-s-28' onClick={() => addSignHandle(`/pages/subOne/userInfo/seal/index?len=${list?.length}&isSave=${'1'}&orderId=${id}&type=${type}`)}>
                        <AtIcon value='add' size='14' color='#1890FF' className='m-r-10'></AtIcon>新增印章
                    </View>
                </>}
                {list?.length ? 
                    list.map((item, index) => {
                        return (
                            <View className={`sign-drawer-card ${crtSign?.id == item?.id && 'active'}`} onClick={() => setCrtSign(item)}>
                                <View className='sign-drawer-card-title'>{item?.signName}</View>
                                <View className='sign-drawer-card-content'>
                                    <Image src={item?.url} className='sign-drawer-card-img' mode='aspectFit'></Image>
                                </View>
                                {crtSign?.id == item?.id ? <View className='sign-drawer-card-active primary-material-success'></View> : <></>}
                            </View>
                        )
                    })
                    : <View className='g-sign-empty flex flex-center flex-column'>
                    <View className='g-sign-empty-text'>暂无电子签名</View>
                    <View className='g-sign-empty-tip'>可新增签名，并保存</View>
                </View>}
            </ScrollView>
            <View className='at-drawer-bottom'>
                <AtButton onClick={onClose}>取消</AtButton>
                <AtButton type='primary' onClick={() => chooseHandle(crtSign)}>确认使用</AtButton>
            </View>
        </AtDrawer>
        <GConfirm ref={GConfirmRef} cancelClass={'new'} confirmClass={'new'}></GConfirm>
        </View>
        // <AtModal isOpened={open} onClose={onClose} className='new pop-bottom common-dialog g-sign-pop'>
        //     <AtModalHeader>电子签名</AtModalHeader>
        //     <AtModalContent>
        //         {list?.length ? <Swiper
        //             circular
        //             indicatorDots
        //             className='sign-swiper'
        //             indicatorColor='rgba(211, 211, 211, 1)'
        //             indicatorActiveColor='rgba(45, 144, 237, 1)'>
        //             {
        //                 list.map((item, index) => {
        //                     return (
        //                         <SwiperItem>
        //                             <View className='sign-swiper-card' onClick={() => chooseHandle(item)}>
        //                                 <View className='sign-swiper-card-title'>{item.signName}</View>
        //                                 <Image src={item.url} className='sign-swiper-card-img' mode='aspectFit'></Image>
        //                             </View>
        //                         </SwiperItem>
        //                     )
        //                 })
        //             }
        //         </Swiper> : <View className='g-sign-empty flex flex-center flex-column'>
        //             <View className='g-sign-empty-text'>暂无电子签名</View>
        //             <View className='g-sign-empty-tip'>可新增签名，并保存</View>
        //         </View>}
        //     </AtModalContent>
        //     <AtModalAction>
        //         <AtButton onClick={() => toPath(`/pages/subOne/userInfo/signBoard/index?len=${list?.length}&isSave=${'1'}&orderId=${id}&type=${type}`)}>新增签名</AtButton>
        //         <AtButton type='primary' onClick={() => toPath(`/pages/subOne/userInfo/seal/index?len=${list?.length}&isSave=${'1'}&orderId=${id}&type=${type}`)}>新增印章</AtButton>
        //     </AtModalAction>
        // </AtModal>
    )
})