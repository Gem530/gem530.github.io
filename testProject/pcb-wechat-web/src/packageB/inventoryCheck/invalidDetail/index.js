import './index.less'
import dayjs from 'dayjs'
// import { Decimal } from 'decimal.js'
import { useState, useRef } from 'react'
import { View } from '@tarojs/components'
import GUp from '../../../components/g-up'
import NavBar from '../../../components/nav-bar'
import GFeedback from '../../../components/g-feedback'
import Taro, { useLoad, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { AtIcon, AtTabs, AtSteps, AtTimeline, AtLoadMore, AtProgress, AtButton } from 'taro-ui'
import { invalidListAPI, delCheckPlanDetailAPI } from '../../../pages/services/checkPlan/index'


export default function InventoryCheckInvalidDetail() {
  const GShareFileRef = useRef()
  const [id, setId] = useState()
  const [list, setList] = useState()
  const [options, setOptions] = useState()
  const [didShow, setDidShow] = useState(false)
  const [waitShowAll, setWaitShowAll] = useState(false) // 待盘点 是否查看所有的数据
  
  useShareAppMessage(() => {
    return {
      title: `失效${options.type == 1 ? '产品' : '物料'}详情`,
      path: '/pages/index/index'
    }
  })

  useLoad((option) => {
    Taro.hideHomeButton({}).then();
    console.log('option:', option)
    setId(option.id)
    setOptions(option)
    Taro.setNavigationBarTitle({ title: `失效${option.type == 1 ? '产品' : '物料'}详情` })
    if (option?.q) {
      let url = decodeURIComponent(option.q)
      let obj = getUrlParam(url)
      setId(obj.id)
    }
  })
  useDidShow(() => {
    if (didShow) {
      setDidShow(false)
      return
    }
    if (id) {
      getDetail(id)
    }
  })
  
  const getUrlParam = (url) => {
    let obj = {}
    let params = url.split('?')[1].split('&')
    params.map(v => (obj[v.split('=')[0]] = v.split('=')[1]))
    return obj
  }

  // 步骤改变
  const changeStep = (e) => {
    console.log('changeStep', e)
  }

  // tab改变
  const tabClick = (e) => {
    console.log('tabClick', e)
    setExpressCrt(e)
  }

  // 复制功能
  const copyText = (text) => {
    if (!text) return;
    Taro.setClipboardData({
      data: text,
      success () {
        Taro.showToast({ title: '复制成功', icon: 'success', duration: 1500 })
      }
    })
  }

  // 跳转 拨打电话
  const makePhone = (phoneNumber) => {
    Taro.makePhoneCall({ phoneNumber })
  }

  const previewImg = (fileList) => {
    if (!fileList?.length) return
    setDidShow(true)
    Taro.previewImage({
      current: fileList[0],
      urls: fileList
    })
  }

  // 页面跳转
  const toPath = (url) => {
    Taro.navigateTo({url})
  }
  
  const getDetail = (tempId) => {
    if (!tempId) return;
    Taro.showLoading({title: '加载中...',mask: true})
    invalidListAPI(tempId).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        setList(res?.data || [])
      }
      Taro.hideLoading()
    }).catch((err) => {
      console.log('err', err)
      setTimeout(() => {
        Taro.hideLoading()
      }, 1500)
    })
  }

  // 一键移除
  const delAll = () => {
    // Taro.navigateBack({ delta: 1 })
    let params = list.map((m) => m.id)
    // console.log('delAll', params)
    Taro.showLoading({ mask: true })
    delCheckPlanDetailAPI(params).then((res) => {
      if (res.code == 200) {
        // Taro.hideLoading()
        Taro.showToast({ title: '移除成功', icon: 'success' })
        setTimeout(() => {
          Taro.navigateBack({ delta: 1 })
        }, 1000)
      }
    })
  }
  return (
    <View className='inventory-page'>
      <NavBar color={'#333'} title={`失效产品/物料详情`} leftIconType={options?.isRedirect == '1' ? 'home' : 'chevron-left'}></NavBar>

      {/* 盘点明细 */}
      <View className='common-card new inventory-detail'>
        <View className='common-item new'>
          <View className='common-title mini flex flex-start'>
            <View className='primary-inventory-reject-tip'></View>
            <View style={'margin-left: 8rpx;flex: 1;'}>失效数据明细</View>
          </View>
        </View>

        {
          // 待盘点
          true ? <>
          <View className='inventory-wait-head flex flex-between f-s-28'>
            <View style={'flex: 1;'}>合计&nbsp;<View className='display-inline-block font-weight-7'>{list?.length || 0}</View>&nbsp;条数据</View>
            <View style={'flex: 1;'} className='flex flex-end primary-color-new' onClick={() => setWaitShowAll(!waitShowAll)}>
              {
                waitShowAll ? <>
                  <View className={`primary-top`}></View>
                  点击收起
                </> : <>
                  <View className={`primary-bottom`}></View>
                  点击展开
                </>
              }
            </View>
          </View>
          {
            list?.length ? list.slice(0, waitShowAll ? 50 : 5).map((item) => {
              return (
                <View className='inventory-detail-row'>
                  {
                  // 物料盘点
                  options?.type == 2 ? <>
                  <View className='common-item new'>
                    <View className='common-title mini'>{item?.materialName}</View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>材质牌号</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.materialQuality}</View></View>
                  </View>
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>物料编码</View>
                      <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.materialCode}</View></View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>物料类别</View>
                      <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.categoryName}</View></View>
                    </View>
                  </View>
  
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>品牌</View>
                      <View className='common-item-value'>{item?.manufacturer}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>板厚<View className='common-label-unit'>(mm)</View></View>
                      <View className='common-item-value'>{item?.boardThickness}</View>
                    </View>
                  </View>
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>单位</View>
                      <View className='common-item-value'>{item?.units}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>长*宽<View className='common-label-unit'>(mm)</View></View>
                      <View className='common-item-value'>{item?.length}*{item?.width}</View>
                    </View>
                  </View>
                  <View className='common-between fixed-half'>
                    <View className='common-item new'>
                      <View className='common-item-label'>级别</View>
                      <View className='common-item-value'>{item?.level}</View>
                    </View>
                    <View className='common-item new'>
                      <View className='common-item-label'>铜厚<View className='common-label-unit'>(oz)</View></View>
                      <View className='common-item-value'>{item?.copperThickness}</View>
                    </View>
                  </View>
                  </> : 
                  // 成品盘点
                  <>
                  <View className='common-item new'>
                    <View className='common-title mini overflow-hidde'><View className='overflow-omit w-100'>{item?.commodityName}</View></View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>产品编码</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.commodityCode}</View></View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>客户编码</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.customerCode}</View></View>
                  </View>
                  <View className='common-item new'>
                    <View className='common-item-label'>单位</View>
                    <View className='common-item-value overflow-hidde'><View className='overflow-omit w-100'>{item?.units}</View></View>
                  </View>
                  </>
                }
                </View>
              )
            }) : <View className='g-empty no-margin-top'>暂无数据</View>
          }
          </> : <></>
        }
      </View>
      {waitShowAll ? (list?.length > 50 ? <View className='max-data-length-100'>当前最多展示50条</View> : <View className='max-data-length-100'>暂无更多数据</View>) : <></>}

      {
        true ? <View className='inventory-bottom-btn flex flex-end'>
          <AtButton className='new no-margin gray-btn' onClick={() => Taro.navigateBack({delta: 1})}>返回盘点计划</AtButton>
          <AtButton type="primary" className='new no-margin m-l-32' onClick={delAll}>一键移除</AtButton>
        </View> : <></>
      }
      
      <GFeedback right={true}></GFeedback>
      <GUp style={{bottom: '192rpx'}}></GUp>
    </View>
  )
}
