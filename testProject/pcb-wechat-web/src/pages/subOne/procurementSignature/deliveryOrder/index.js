import './index.less'
import dayjs from 'dayjs'
import {useEffect, useRef, useState} from 'react'
import CSearch from '../../../../components/c-search'
import { View, ScrollView } from '@tarojs/components'
import GTag from '../../../../components/g-tag/index'
import { AtTabs, AtLoadMore, AtButton } from "taro-ui"
import DeliveryOrderCard from '../components/deliveryOrderCard'
import DeliveryWaitCard from '../components/deliveryWaitCard'
import GDownList from '../../../../components/g-down-list'
import GVoucherPop from '../../../../components/g-voucher-pop'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import GFeedback from '../../../../components/g-feedback'
import {listByOrderAPI, getMaterialDeliveryDetailAPI, listByWaitAPI} from '../../../services/materialRequisition/index'

export default function ProcurementSignatureDeliveryOrder() {
    const initRecord = {
        id: '',
        code: '',
        list: [],
        open: false,
        title: '文件列表',
    }
    // 弹框信息
    const initDialog = {
        email: '',
        open: false,
        title: '发送邮箱',
    }
    const tagList = [
        { id: 0, name: '全部' },
        { id: 2, name: '待对方确认' },
        { id: 3, name: '已确认' },
    ]
    const scrollRef = useRef()
    const GDownListRef = useRef()
    const GVoucherPopRef = useRef()
    const [list, setList] = useState([])
    const [waitList, setWaitList] = useState([])
    const [current, setCurrent] = useState(0)
    const [checkArray, setCheckArray] = useState([])
    const [checkFlag, setCheckFlag] = useState(false)
    const [status, setStatus] = useState('loading')
    const [tagInfo, setTagInfo] = useState(tagList[0])
    const [scrollIntoId, setScrollIntoId] = useState('')
    const [dialogInfo, setDialogInfo] = useState(initDialog)
    const [recordInfo, setRecordInfo] = useState(initRecord)
    const [query, setQuery] = useState({
        code: '',
        pageNum: 1,
        status: '1', // 待签收送货列表传'1',已签收列表传'3'
        pageSize: 10,
    })
    useLoad(() => {
        handleClick(current)
    })
    useDidShow(() => {
        Taro.removeStorageSync('detailData')
        // getAuditList([{ value: 1, field: 'pageNum' }])
        const isRefresh = Taro.getStorageSync('isRefresh')
        if (isRefresh) {
            // setList([])
            handleClick(current)
            Taro.removeStorageSync('isRefresh')
        }
    })
    useShareAppMessage(() => {
        return {
          title: current == 0 ? '待送货列表' : current == 1 ? '待签收送货单' : '签收记录',
          path: '/pages/index/index'
        }
    })
    useEffect(() => {
      let tempList = waitList.filter(item => item.choose == true)
      setCheckArray(tempList)
      // console.log(list, tempList)
    }, [waitList])

    // tab点击
    const handleClick = (e) => {
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '待送货列表'
        } else if (e == 1) {
            title = '待签收送货单'
        } else if (e == 2) {
          title = '签收记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
      // 查询待送货列表
      if(e == 0) {
        getWaitList([{ value: 1, field: 'pageNum' }])
      } else {
        getAuditList([{ value: 1, field: 'pageNum' },{ value: e == 1 ? '1' : (tagInfo?.id || ''), field: 'status' }])
      }

    }

    // 搜索事件
    const searchHandle = (e) => {
        const tempList = [{ value: 1, field: 'pageNum' },{ value: e, field: 'code' }]
        getAuditList(tempList)
    }

    // 搜索事件
    const searchWaitHandle = (e) => {
      const tempList = [{ value: 1, field: 'pageNum' },{ value: e, field: 'code' }]
      getWaitList(tempList)
    }

    // 选择卡片
    const chooseTag = (item) => {
        setTagInfo(item)
        const tempList = [{ value: 1, field: 'pageNum' },{ value: item?.id || '', field: 'status' }]
        getAuditList(tempList)
    }

    // 修改数据
    const updateData = (arr, tempType = 'query') => {
        // arr = [{ value: '1212', field: 'number' }]
        if (!arr?.length) return
        if (tempType == 'query') {
            let tempInfo = JSON.parse(JSON.stringify(query))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setQuery(tempInfo)
        } else if (tempType == 'record') {
            let tempInfo = JSON.parse(JSON.stringify(recordInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setRecordInfo(tempInfo)
        } else if (tempType == 'dialog') {
            let tempInfo = JSON.parse(JSON.stringify(dialogInfo))
            arr.map((item, index) => {
                tempInfo[item.field] = item.value
            })
            setDialogInfo(tempInfo)
        }
    }

    // 获取列表数据
    const getAuditList = (arr) => {
        const params = query
        if (arr?.length) {
            // params
            arr.map((item, index) => {
                params[item.field] = item.value
            })
            updateData(arr)
        }
        if (params.pageNum == 1) {
            setStatus('loading')
        }
        if (!params.code) delete params.code
        if (!params.status) delete params.status
        // console.log(params)
        listByOrderAPI(params).then((res) => {
            if (res.code == 200) {
                let tempList = []
                if (params.pageNum != 1) {
                    tempList = list
                }
                res.rows.map((m) => {
                    m.showDetail = false,
                    m.list = [1,2,3]
                })
                tempList = tempList.concat(res.rows || [])
                setList(tempList)
                // setStatus('more')
                if (tempList.length >= res.total) {
                    setStatus('noMore')
                } else {
                    params.pageNum = params.pageNum + 1
                    updateData((arr || []).concat([{ value: params.pageNum, field: 'pageNum' }]))
                }
            }
            if (params.pageNum <= 2) {
                setTimeout(() => {
                    setScrollIntoId('top')
                }, 10)
            }
        })
    }

    // 获取待送货列表数据
    const getWaitList = (arr) => {
      const params = query
      if (arr?.length) {
        // params
        arr.map((item) => {
          params[item.field] = item.value
        })
        updateData(arr)
      }
      if (params.pageNum == 1) {
        setStatus('loading')
      }
      params.status = '';
      // console.log(params)
      listByWaitAPI(params).then((res) => {
        if (res.code == 200) {
          let tempList = []
          if (params.pageNum != 1) {
            tempList = waitList
          }
          res.rows.map((m) => {
            m.choose = false
          })
          tempList = tempList.concat(res.rows || [])
          setWaitList(tempList)
          // setStatus('more')
          if (tempList.length >= res.total) {
            setStatus('noMore')
          } else {
            params.pageNum = params.pageNum + 1
            updateData(arr.concat([{ value: params.pageNum, field: 'pageNum' }]))
          }
        }
      })
    }

    // 触底事件
    const scrolltolower = () => {
        console.log('触底')
        if (status == 'noMore') {
            return;
        }
        if(current == 0) {
          getWaitList()
        } else {
          getAuditList()
        }
    }

    // 打开文件列表
    const openFile = async (e, item) => {
        e.stopPropagation()
        GDownListRef.current?.openFile(e, item, '2')
    }
    // 切换展开
    const toggle = async (e, item) => {
        e.stopPropagation()
        let tempList = JSON.parse(JSON.stringify(list))
        tempList.map((m) => {
            m.detailList = []
            if (item.id == m.id) {
                m.showDetail = !m.showDetail
            } else {
                m.showDetail = false
            }
        })
        setList(tempList)
        setTimeout(async () => {
            let temps = JSON.parse(JSON.stringify(tempList))
            const currentTemp = temps.find((f) => f.id == item.id)
            if (currentTemp.showDetail) {
                const res = await getMaterialDeliveryDetailAPI(currentTemp.id)
                if (res.code == 200) {
                    currentTemp.detailList = res.data?.purchaseMaterialDeliveryList || []
                    setList(temps)
                }
            }
        }, 10)
    }

    // 滚动中
    const scrollHandle = () => {
        setScrollIntoId('')
    }

    // 预览凭证
    const openVouch = (e, item) => {
        e.stopPropagation()
        GVoucherPopRef.current?.openVoucher(item.code, item.bizId, '2')
    }

    // 跳转到详情
    const toDetail = (id) => {
        Taro.navigateTo({ url: `detail/index?id=${id}` })
    }

    // 跳转到发货详情
    const toShipDetail = (id) => {
      Taro.navigateTo({ url: `shipDetail/index?id=${id}` })
    }

  // 长按开启多选
  const handleLongPress = (e, item) => {
    if (current != 0) return
    setCheckFlag(true);
    // 如果有选中的数据校验是否地址相同，不同则不能勾选
    if (checkArray?.length > 0) {
      if (checkArray[0].addressId != item.addressId) {
        return;
      }
    }
    let tempList = JSON.parse(JSON.stringify(waitList))
    let crtTemp = tempList.find((f) => f.id == item.id)
    crtTemp.choose = true
    // console.log(crtTemp, item)
    setWaitList(tempList)
    // chooseHandle(e, item)
  }

  // 点击选择
  const chooseHandle = (e, item) => {
    e.stopPropagation();
    let tempList = JSON.parse(JSON.stringify(waitList))
    // 如果有选中的数据校验是否地址相同，不同则不能勾选
    if (checkArray?.length > 0) {
      if (checkArray[0].addressId != item.addressId) {
        return;
      }
    }
    let crtTemp = tempList.find((f) => f.id == item.id)
    crtTemp.choose = !crtTemp.choose
    setWaitList(tempList)
  }

  // 确认选择
  const confirmChoose = () => {
    if (!checkFlag) {
      Taro.showToast({ title: '请选择采购单', icon: 'error' })
      return
    }
    if (!checkArray?.length) {
      Taro.showToast({ title: '请选择采购单', icon: 'error' })
      return
    }
    // 勾选id
    let tempIds = [];
    // 根据送货地址id分组checkArray
    let map = new Map()
    checkArray.map((item) => {
      tempIds.push(item.id)
      map.set(item.addressId, item)
    })
    if(map.size > 1) {
      Taro.showToast({ title: '所选采购单有不同送货地址，请重新选择', icon: 'none'})
      return
    }
    // 调整到新建送货单
    Taro.navigateTo({ url: `shipDetail/index?ids=${tempIds}` })
  }
  // 取消选择
  const cancelChoose = () => {
    let tempList = JSON.parse(JSON.stringify(waitList))
    tempList.map((item) => {
      item.choose = false
    })
    setWaitList(tempList)
    setCheckFlag(false)
    // console.log('取消选择', checkArray, list, tempList)
  }
  // 全选
  const chooseAll = () => {
    if (checkArray.length != waitList.length) {
      // 开启选中
      setCheckFlag(true)
    }
    let tempList = JSON.parse(JSON.stringify(waitList))
    tempList.map((item) => {
      if (checkArray.length == waitList.length) {
        // 取消全选
        item.choose = false
      } else {
        // 全部选中
        item.choose = true
      }
    })
    setWaitList(tempList)
  }

    return (
        <View className='delivery-page'>

            {current == 0 ? <CSearch showScan={false} placeholder={'采购单号'} inputChange={(e) => updateData([{ value: e, field: 'code' }])} search={(e) => searchWaitHandle(e)} type={2} scanPath="detail/index" scanError="订单不存在"></CSearch>
              : <CSearch placeholder={'送货单号/商品名称/规格型号/送货方/接收地址'} inputChange={(e) => updateData([{ value: e, field: 'code' }])} search={(e) => searchHandle(e)} type={2} scanPath="detail/index" scanError="订单不存在"></CSearch>
            }

            <AtTabs
                animated={false}
                current={current}
                tabList={[
                    { title: '待送货列表' },
                    { title: '待签收送货单' },
                    { title: '签收记录' },
                ]}
                onClick={handleClick}>
            </AtTabs>


          {current == 2 ? <View style={`padding: 0 32rpx;margin-top: 20rpx;`}>
            <GTag tagInfo={tagInfo} list={tagList} choose={(item) => chooseTag(item)}></GTag>
            </View> : <></>}

            <ScrollView ref={scrollRef} lowerThreshold={150} className={`delivery-box list-no-scroll ${current == 2 && 'contract-has-tag'}`} scrollY onScrollToLower={scrolltolower} scrollIntoView={scrollIntoId} onScroll={scrollHandle}>
                {
                  current == 0 ? waitList.map((item, index) => {
                      return (
                        <DeliveryWaitCard item={item} index={index} toDetail={toShipDetail} openVouch={openVouch} checkFlag={checkFlag} chooseHandle={chooseHandle} handleLongPress={handleLongPress}></DeliveryWaitCard>
                      )
                    }) :
                     list.map((item, index) => {
                        return (
                            <DeliveryOrderCard current={current} item={item} index={index} toDetail={toDetail} openVouch={openVouch} openFile={openFile} toggle={toggle}></DeliveryOrderCard>
                            // <View id={index == 0 && 'top'} className='common-card' onClick={() => toDetail(item.id)}>
                            //     {item?.status == '3' ? <View className='primary-status-confirm common-status'></View> : <></>}
                            //     <View className='common-item head'>
                            //         <View className='primary-detail-check' onClick={(e) => openVouch(e, item)}></View>
                            //         <View className='common-title'>{item.code}</View>
                            //         <View className='primary-right'></View>
                            //     </View>

                            //     <View className='common-between'>
                            //         <View className='common-item'>
                            //             <View className='common-item-label'>送货数量</View>
                            //             <View className='common-item-value'>{item?.deliveryQuantity}</View>
                            //         </View>
                            //         <View className='common-item'>
                            //             <View className='common-item-label'>送货人</View>
                            //             <View className='common-item-value'>{item?.createByName}</View>
                            //         </View>
                            //     </View>

                            //     <View className='common-item'>
                            //         <View className='common-item-label'>送货方</View>
                            //         <View className='common-item-value'>{item?.companyName}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>送货日期</View>
                            //         <View className='common-item-value'>{item?.deliveryTime}</View>
                            //     </View>
                            //     <View className='common-item'>
                            //         <View className='common-item-label'>接收地址</View>
                            //         <View className='common-item-value'>{item?.deliveryAddress}
                            //             {current == 1 ? <AtButton type='primary' className='common-item-btn' onClick={(e) => openFile(e, item)}>发送给好友</AtButton> : <></>}
                            //         </View>
                            //     </View>
                            // </View>
                        )
                    })
                }
                <AtLoadMore status={status}></AtLoadMore>
            </ScrollView>

            {current == 0 && <View className='common-confirm-btn'>
              <View className='common-btn-box flex flex-start'>
                <View className='common-btn-confirm flex flex-center flex-column' onClick={confirmChoose}>
                  <View className='common-btn-confirm-text flex flex-center'>全部确定{checkFlag && <View className='common-btn-confirm-num'>（{checkArray?.length}）</View>}</View>
                  {!checkFlag && <View className='common-btn-confirm-tip'>长按采购单可多选</View>}
                </View>
                {checkFlag && <View className='common-btn-cancel flex flex-center flex-column' onClick={cancelChoose}>
                  <View className={`common-btn-cancel-icon`}></View>
                  <View className='common-btn-choose-text'>取消多选</View>
                </View>}
              </View>
              <View className='common-btn-right flex flex-center flex-column' onClick={chooseAll}>
                <View className={`common-btn-choose ${checkArray?.length > 0 && list?.length > 0 && checkArray.length == list.length ? 'primary-choose-active' : 'primary-choose'}`}></View>
                <View className='common-btn-choose-text'>全选</View>
              </View>
            </View>}

            <GVoucherPop ref={GVoucherPopRef}></GVoucherPop>

            <GDownList ref={GDownListRef} moduleCode='11'></GDownList>
            <GFeedback></GFeedback>
        </View>
    )
}
