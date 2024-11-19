import { useState } from 'react'
import Taro, {useDidShow, useLoad, useShareAppMessage} from '@tarojs/taro'
import './index.less'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { AtIcon, AtButton, AtLoadMore, AtActivityIndicator } from 'taro-ui'
import { deepClone } from '../util/func'
import add from "../../../public/static/add.png";
import jian from "../../../public/static/jian.png";
import GInput from '../../components/g-input/index'
import Search from '../../components/searchOld/index'
import { queryMaterialInventoryAPI } from '../services/materialRequisition/index'
import dayjs from 'dayjs'
import GFeedback from '../../components/g-feedback'


export default function MaterialSelect() {
    const [page, setPage] = useState(1)
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [siderId, setSiderId] = useState(0)
    const [loading, setLoading] = useState(false)
    const [siderList, setSiderList] = useState([])
    const [chooseList, setChooseList] = useState([])
    const [contentList, setContentList] = useState([])
    useLoad(() => {
        let tempArr = Taro.getStorageSync('car_data')
        queryMaterialInventoryHandle({materialSpecification: ''}, tempArr)
    })
    useShareAppMessage(() => {
        return {
            title: '选择物料',
            path: '/pages/index/index'
        }
    })

    // 获取物料规格列表
    const queryMaterialInventoryHandle = (params, tempArr = []) => {
        setLoading(true)
        queryMaterialInventoryAPI(params).then((res) => {
            if (res.code == 200) {
                if (res.data?.materialVoList?.length) {
                    res.data?.materialVoList.map((item) => {
                        item.isChoose = false
                    })
                }
                const categoryVoList = res.data?.categoryVoList || []
                const materialVoList = res.data?.materialVoList || []
                setSiderList(categoryVoList)
                setContentList(materialVoList)
                if (categoryVoList?.length) {
                    // console.log(res.data?.materialVoList.filter((f) => f.categoryId == res.data?.categoryVoList[0].id))
                    siderId == 0 && setSiderId(categoryVoList[0].id)

                    const data = tempArr?.length ? tempArr : [...chooseList]
                    // console.log(data)
                    if (data?.length) {
                        let tempList = [...materialVoList]
                        data.map((item) => {
                            const currentCard = tempList.find((f) => f.rawMaterialId == item.rawMaterialId)
                            currentCard.isChoose = item.isChoose
                        })
                        // console.log(tempList)
                        setContentList(tempList)
                        setChooseList(data)
                    }
                }
            } else {
                setLoading(false)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    // 搜索
    const searchHandle = () => {
        console.log('search', search)
        queryMaterialInventoryHandle({materialSpecification: search})
    }

    // 点击左侧菜单
    const chooseSider = (item) => {
        // console.log('item:', item)
        setPage(1)
        setSiderId(item.id)
    }

    // 加减物品
    const makeHandle = (item) => {
        let contentListTemp = [...contentList]
        let tempList = [...chooseList]
        item.isChoose = !item.isChoose
        if (item.isChoose) {
            item.actualSupplierName = ''
            item.quantity = ''
            item.price = ''
            item.deliverTime = dayjs(new Date()).format('YYYY-MM-DD')
            item.remark = ''
            // 加 物品
            tempList.push(item)
        } else {
            // 减 物品
            tempList = tempList.filter((f) => f.rawMaterialId != item.rawMaterialId)
        }
        const currentCard = contentListTemp.find((f) => f.rawMaterialId == item.rawMaterialId)
        currentCard.isChoose = item.isChoose
        setContentList(contentListTemp)
        setChooseList(tempList)
    }

    // 返回上一页
    const toRequisition = () => {
        if (!chooseList?.length) {
            Taro.showToast({
                title: '请至少需要选择一条物料',
                icon: 'none',
                duration: 1500
            })
            return
        }
        Taro.setStorageSync('car_data', chooseList)
        Taro.navigateBack({delta: 1})
    }

    // 内容触底
    const onScrollToLower = () => {
        console.log('onScrollToLower-触底')
        setPage(page + 1)
    }
    return (
        <View className='material-select'>
            <Search
                className='search-box'
                inputView={<GInput value={search} placeholder='物料规格' onInput={(e) => setSearch(e || '')} clear={() => setSearch('')} onConfirm={searchHandle}></GInput>}
                buttonView={<AtButton type='primary' size='small' onClick={searchHandle}>搜索</AtButton>}
            ></Search>

            {!loading ? <View className='select-box flex flex-start'>
            {siderList?.length ? <View style={'height: 100%;'} className='flex flex-start'>
                <ScrollView scrollY className='sider'>
                    {
                        siderList.map((item) => {
                            return (
                                <View className={`sider-item ${siderId == item.id && 'sider-active'}`} onClick={() => chooseSider(item)}>{item.name}</View>
                            )
                        })
                    }
                </ScrollView>
                <ScrollView scrollY className='content' onScrollToLower={onScrollToLower}>
                    {
                        contentList?.length ? contentList.filter((f) => f.categoryId == siderId).slice(0, page * 10).map((item) => {
                            return (
                                <View className='content-card'>
                                    <View className='content-card-item flex flex-start'>
                                        <View className='content-code'>{item.code}</View>
                                        <View className='content-name'>{item.name}</View>
                                    </View>
                                    <View className='content-card-item flex flex-start'>物料规格:{item.materialSpecification}</View>
                                    <View className='content-card-item flex flex-start'>单位:{item.units}</View>
                                    <View className='flex flex-between'>
                                        <View>库存:{item.actualStock}</View>
                                        {/* <Image className='make-image' src={!item.isChoose ? add : jian} mode='widthFix' onClick={() => makeHandle(item)}></Image> */}
                                        <AtIcon value={!item.isChoose ? 'add-circle' : 'subtract-circle'} color={!item.isChoose ? '#67c23a' : '#f56c6c'} size='30' onClick={() => makeHandle(item)}></AtIcon>
                                    </View>
                                </View>
                            )
                        }) : <AtLoadMore status='noMore' noMoreText='暂无数据'></AtLoadMore>
                    }
                </ScrollView>
            </View> : <AtLoadMore status='noMore' noMoreText='暂无数据'></AtLoadMore>}
            </View> : <View className='select-box flex flex-start'><AtActivityIndicator mode='center' content='Loading...'></AtActivityIndicator></View>}

            <View className='select-bottom flex flex-between'>
                <View className='flex flex-start' onClick={() => setOpen(!open)}>
                    <AtIcon value='shopping-cart' size='22'></AtIcon>
                    <Text style={'color: #6190e8;'}>共{chooseList.length}条物料</Text>
                </View>
                <AtButton type='primary' onClick={toRequisition}>去请购</AtButton>

                {
                    open && <ScrollView scrollY className='selected-position'>
                        {
                            chooseList?.length ? chooseList.map((item, index) => {
                                return (
                                    <View className='selected-item flex flex-start'>
                                        <View className='selected-index flex flex-center'>{index + 1}</View>
                                        <View className='selected-item-box'>
                                            <View className='selected-item-flex flex flex-start'>
                                                <View className='select-item-code'>{item.code}</View>
                                                <View className='select-item-name'>{item.name}</View>
                                            </View>
                                            <View className='flex flex-start'>
                                                <View className='select-item-half'>物料规格:{item.materialSpecification}</View>
                                                <View className='select-item-half'>库存:{item.actualStock}{item.units}</View>
                                            </View>
                                        </View>
                                        <AtIcon value={'subtract-circle'} color={'#f56c6c'} size='30' onClick={() => makeHandle(item)}></AtIcon>
                                    </View>
                                )
                            }) : <AtLoadMore status='noMore' noMoreText='暂无数据'></AtLoadMore>
                        }
                    </ScrollView>
                }
            </View>
            {
                open && <View className='selected-mask' onClick={() => setOpen(false)}></View>
            }
            <GFeedback></GFeedback>
        </View>
    )
}
