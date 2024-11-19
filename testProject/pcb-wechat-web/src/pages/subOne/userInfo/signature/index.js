import './index.less'
import { useRef, useState } from "react"
import GConfirm from '../../../../components/g-confirm'
import GFeedback from '../../../../components/g-feedback'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { delSignAPI, editSignAPI, signListAPI, confirmDefaultAPI, queryIsAuthAPI, authorizeAPI } from '../../../services/signMange'
import { AtTabs, AtButton, AtInput, AtLoadMore, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtIcon } from "taro-ui"

export default function Signature() {
    // 弹框信息
    const initDialog = {
        id: 0,
        name: '',
        open: false,
        title: '修改数据',
    }
    const GConfirmRef = useRef()
    const [list, setList] = useState([]);
    const [current, setCurrent] = useState(0)
    const [showTab, setShowTab] = useState(false);
    const [dialogInfo, setDialogInfo] = useState(initDialog)

    useShareAppMessage(() => {
        return {
            title: '签章管理',
            path: '/pages/index/index'
        }
    })
    // 对应 onShow
    useDidShow(() => {
        let userInfo = Taro.getStorageSync('__USER_INFO__');
        if (userInfo?.user?.ownerId == '1821105007311372289') {
            // 未加入单位 1821105007311372289
            setShowTab(false)
        } else {
            setShowTab(true)
        }
        getSignList()
    })

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        console.log(e)
        getSignList(e)
        // getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 0 ? '2' : '3', field: 'confirmStatus' }])
    }

    // 获取签章列表
    const getSignList = (query) => {
        let type = (query || query == 0) ? query : current
        let params = {
            signType: type == 0 ? '2' : '1'
        }
        signListAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                res.data?.length && res.data.map((item) => {
                    item.loading = 0
                })
                setList(res.data || [])
            }
        })
    }

    // 修改数据
    const updateDialog = (arr, tempType = 'dialog') => {
        // arr = [{ value: '1212', field: 'number' }]
        // console.log(arr)
        if (!arr?.length) return
        if (tempType == 'dialog') {
            let tempDialog = JSON.parse(JSON.stringify(dialogInfo))
            arr.map((item, index) => {
                // console.log(item)
                if (item.field == 'name') {
                    item.value = item.value.substring(0, 20)
                }
                tempDialog[item.field] = item.value
            })
            // console.log(tempDialog)
            setDialogInfo(tempDialog)
        }
    }

    // 打开 编辑签章名称
    const openEdit = (row) => {
        updateDialog([
            { value: true, field: 'open' },
            { value: row.id, field: 'id' },
            { value: row.signName, field: 'name' },
            { value: '编辑签章名称', field: 'title' },
        ])
    }

    // 编辑签章名称
    const confirmHandle = () => {
        // console.log(dialogInfo)
        let tempList = JSON.parse(JSON.stringify(list))
        let crtTemp = tempList.find((f) => f.id == dialogInfo.id)
        crtTemp.signName = dialogInfo.name
        // setList(tempList)
        updateDialog([
            { value: false, field: 'open' },
            // { value: row.id, field: 'id' },
            // { value: row.name, field: 'name' },
            // { value: '编辑签章名称', field: 'title' },
        ])
        // console.log(crtTemp)
        let params = crtTemp
        editSignAPI(params).then((res) => {
            if (res.code == 200) {
                // console.log(res)
                getSignList()
            }
        })
    }

    // // 加载中 如果加载很快，会导致只有一个加载完成，由于react每次改变都会渲染数据，导致list的loading只有最后一个修改成功
    // const handleLoading = (item) => {
    //     console.log(item)
    //     let tempList = JSON.parse(JSON.stringify(list))
    //     const crt = tempList.find((f) => f.id == item.id)
    //     crt.loading = 0
    //     setList(tempList)
    // }

    // 设置为默认
    const confrimDefault = (item) => {
        if (item.state == '1') return
        let params = {
            state: '1',
            id: item.id,
        }
        
        // 开启loading
        const tempList = JSON.parse(JSON.stringify(list))
        tempList?.length && tempList.map((m) => {
            if (item.id == m.id) m.loading = 1
            else m.loading = 0
        })
        setList(tempList || [])

        confirmDefaultAPI(params).then((res) => {
            if (res.code == 200) {
                getSignList()
            }
        }).catch(() => {
            // 结束loading
            const tempList = JSON.parse(JSON.stringify(list))
            tempList?.length && tempList.map((m) => {
                m.loading = 0
            })
            setList(tempList || [])
        })
    }

    // 删除事件
    const delHandle = (row) => {
        Taro.showModal({
            content: `确定删除 ${row.signName} 签章吗`,
            success: (res) => {
                if (res?.confirm) {
                    delSignAPI([row.id]).then((res) => {
                        if (res.code == 200) {
                            // console.log(res)
                            getSignList()
                        }
                    })
                    // console.log('删除')
                    // let tempList = JSON.parse(JSON.stringify(list))
                    // let crtIndex = tempList.findIndex((f) => f.id == row.id)
                    // tempList.splice(crtIndex, 1)
                    // setList(tempList)
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
        Taro.navigateTo({ url })
    }

    return (
        <View className="signature-page">
            {showTab ? <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '签名' },
                    { title: '印章' },
                ]}
                onClick={handleClick}>
            </AtTabs> : <></>}
            <ScrollView className={`signature-scroll ${!showTab && 'no-tab'}`} scrollY>
            <View className='signature-box'>
            {
                list?.length ? list.map((item, index) => {
                    return (
                        <View className='sign-card'>
                            <View className='sign-head flex flex-between'>
                                <View className='sign-head-left flex flex-start' onClick={() => openEdit(item)}>
                                    <View className='primary-edit'></View>
                                    <View className='sign-head-name'>{item?.signName}</View>
                                </View>

                                <View className='sign-head-right flex flex-between'>
                                    <View className='sign-head-time'>{item?.createTime}</View>
                                    <View className='sign-head-icon' onClick={() => delHandle(item)}>
                                        <View className='primary-del'></View>
                                    </View>
                                </View>
                            </View>
                            
                            <Image src={item.url} className='sign-card-img' mode='aspectFit'></Image>

                            <View className='sign-item flex flex-between'>
                                {
                                    item.loading == 1 ? <AtButton className='loading-btn' loading={true}></AtButton> :
                                    <View className='sign-default flex flex-start' onClick={() => confrimDefault(item)}>
                                        <View className={`sign-icon ${item.state == '1' ? 'primary-choose-active' : 'primary-choose'}`}></View>
                                        <View className='sign-default-text'>默认{current == 0 ? '签名' : '印章'}</View>
                                    </View>
                                }

                                <AtButton type='primary' className='sign-card-btn' onClick={() => toPath(`/pages/subOne/userInfo/${current == 0 ? 'signBoard' : 'seal'}/index?id=${item.id}&len=${list?.length}&isSave=${'0'}`)}>重新上传</AtButton>
                            </View>
                        </View>
                    )
                }) : <AtLoadMore status='noMore'></AtLoadMore>
            }
            { list?.length ? 
            <View className='sign-default-tip flex flex-start'>
                <View className='sign-default-tip-text'>点击</View>
                <View className='primary-choose'></View>
                <View className='sign-default-tip-text'>设置为默认{current == 0 ? '签名' : '印章'}</View>
            </View>: <></>}
            </View>
            </ScrollView>

            <View className='common-bottom-btn'>
                <AtButton type='primary' onClick={() => addSignHandle(`${current == 0 ? `/pages/subOne/userInfo/signBoard/index?len=${list?.length}&isSave=${'0'}` : `/pages/subOne/userInfo/seal/index?len=${list?.length}&isSave=${'0'}`}`)}>新增{current == 0 ? '签名' : '印章'}</AtButton>
            </View>

            <AtModal isOpened={dialogInfo.open} onClose={() => updateDialog([{ value: false, field: 'open' }])} className='new'>
                <AtModalHeader>{dialogInfo.title}</AtModalHeader>
                <AtModalContent>
                    <AtInput className='input-content-gray new' title='签章名称' value={dialogInfo.name} placeholder={dialogInfo.open ? '请填写签章名称' : ''} maxLength={20} onChange={(e) => updateDialog([{ value: e, field: 'name' }])}></AtInput>
                </AtModalContent>
                <AtModalAction>
                    <AtButton onClick={() => updateDialog([{ value: false, field: 'open' }])}>取消</AtButton>
                    <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
                </AtModalAction>
            </AtModal>
            <GFeedback></GFeedback>

            <GConfirm ref={GConfirmRef} cancelClass={'new'} confirmClass={'new'}></GConfirm>
        </View>
    )
}
