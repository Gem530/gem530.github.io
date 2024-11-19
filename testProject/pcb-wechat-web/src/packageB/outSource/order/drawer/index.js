import dayjs from 'dayjs'
import Taro, {useDidShow} from '@tarojs/taro'
import {View, ScrollView, Picker} from '@tarojs/components'
import {AtButton, AtDrawer, AtInput, AtIcon} from "taro-ui"
import {useState, forwardRef, useImperativeHandle, useRef} from "react";
import GSelect from "../../../../components/g-select";
import {orderScrapQuantityAPI, orderUserAPI} from "../../../../pages/services/outSource/order";


export default forwardRef(function Drawer({
                                            close,
                                            confirm,
                                            classStr,
                                            newF = false,
                                            right = true,
                                            formList = [],
                                            width = '616rpx',
                                          }, ref) {
  const initRecord = {
    // list: [],
    open: false,
    title: '订单筛选',
  }
  const initTypeList = [
    {value:'1',label:'责任在本厂'},
    {value:'2',label:'责任在客户'},
    {value:'3',label:'责任在物料供应商'},
  ]
  const [h, setH] = useState(0)
  const [localFormList, setLocalFormList] = useState([])
  const [quickInfo, setQuickInfo] = useState({id: '', name: ''})
  // const halfYear = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
  const [workInfo, setWorkInfo] = useState(undefined)
  const [info, setInfo] = useState({})
  const [type, setType] = useState()
  const [recordInfo, setRecordInfo] = useState(info)
  const [typeList, setTypeList] = useState(initTypeList)
  const [item,setItem] = useState({});
  const GSelectRef = useRef();
  const [userList,setUserList] = useState([]);

  useDidShow(() => {
    initForm()
    setTimeout(() => {
      Taro.createSelectorQuery().select('.nav-bar').fields({
        rect: true,
        scrollOffset: true,
        size: true,
        dataset: true
      }, (res) => {
        console.log(res?.height)
        // getGlobalData('menuButtonInfo').top
        let barHeight = res?.height// + getGlobalData('menuButtonInfo').top
        setH(barHeight || 0)
      }).exec()
    }, 100)
  })

  // 初始化  会把传进来的参数清空，所以暂时弃用，后续找到更好的实现方法再改造
  const initForm = (infoTemp, list) => {
    let tempList = JSON.parse(JSON.stringify(list || formList))
    if (tempList?.length) {
      let tempInfo = infoTemp || info
      let tempFormList = JSON.parse(JSON.stringify(tempList))
      tempFormList.map((m) => {
        tempInfo[m.field] = m?.value || undefined
        if (m.isQuick) {
          m.quickInfo = quickInfo
        }
      })
      console.log(tempInfo, tempFormList, JSON.parse(JSON.stringify(tempList)))
      setInfo(tempInfo)
      setLocalFormList(tempFormList)
    }
  }

  // 修改数据
  const updateData = (arr, tempType = 'record', tempQuick) => {
    // arr = [{ value: '1212', field: 'number' }]
    if (!arr?.length) return
    console.log(arr)
    console.log(tempType)
    if (tempType == 'record') {
      let tempInfo = JSON.parse(JSON.stringify(recordInfo))
      arr.map((item, index) => {
        tempInfo[item.field] = item.value
      })
      setRecordInfo(tempInfo)
    }
    if (tempType == 'info') {
      console.log(arr, tempType)
      // console.log(arr, tempType)
      let tempInfo = JSON.parse(JSON.stringify(info))
      arr.map((item, index) => {
        if (item?.type && item?.type == 'number') {
          if (Array.isArray(item.value)) {
            item.value = item.value.map((m) => {
              return (m + '').replace(/[^0-9\.\-]/g, '')
            })
          } else {
            item.value = (item.value + '').replace(/[^0-9\.\-]/g, '')
          }
        } else if(item?.type && item?.type == 'integer'){
          if (Array.isArray(item.value)) {
            item.value = item.value.map((m) => {
              return (m + '').replace(/[^0-9]/g, ''); // 只保留数字
            });
          } else {
            item.value = (item.value + '').replace(/[^0-9]/g, ''); // 只保留数字
          }
        }
        tempInfo[item.field] = item.value
      })
      if (arr?.length) {
        let tempLocalForm = JSON.parse(JSON.stringify(localFormList))
        tempLocalForm.map((m) => {
          if (!tempQuick && arr.map((am) => am.field).includes(m.field) && m?.isQuick) {
            m.quickInfo = {id: '', name: ''}
          } else if (tempQuick) {
            m.quickInfo = tempQuick
          }
        })
        setLocalFormList(tempLocalForm)
      }
      setInfo(tempInfo)
    }
  }

  // 打开文件列表
  const openFilter = async (itemInfo, title, typeName) => {
    const userInfo = Taro.getStorageSync('__USER_INFO__')
    orderUserAPI(userInfo?.user?.deptId).then(res=>{
      setUserList(res.data);
    })
    setType(typeName)

    const infoData = JSON.parse(JSON.stringify(itemInfo));

    const res = await orderScrapQuantityAPI(infoData.id)
    infoData.quantity = res.data;
    infoData.processQuantity = '';
    setItem(infoData)
    setInfo({});
    setWorkInfo({});
    updateData([
      {value: true, field: 'open'},
      {value: title || initRecord?.title, field: 'title'},
    ], 'record')
  }

  // 重置
  const resetHandle = () => {
    // console.log('resetHandle')
    // reset && reset()
    closeDrawer()
  }
  // 确定
  const confirmHandle = async () => {
    // console.log('confirmHandle')
    if (recordInfo?.checkFun) {
      const res = await recordInfo?.checkFun()
      console.log(res)
      if (res) return;
    }
    info.id = item.id;
    info.status = item.status
    setInfo(info);
    if(type == 1){
      if(!info.quantity || info.quantity < 0){
        Taro.showToast({ title: '报废数量必填', icon: 'error' });
        return;
      }
      if(!info.reason){
        Taro.showToast({ title: '报废原因必填', icon: 'error' });
        return;
      }
      if(!info.type){
        Taro.showToast({ title: '责任方必填', icon: 'error' });
        return;
      }
      if(info.type == 1 && !info.dutyUserName){
        Taro.showToast({ title: '责任人必填', icon: 'error' });
        return;
      }
      if(info.type == 3 && !info.dutyUserName){
        Taro.showToast({ title: '供应商必填', icon: 'error' });
        return;
      }

    } else if(type == 2){
      if(!info.processQuantity || info.processQuantity < 0){
        Taro.showToast({ title: '加工数量必填', icon: 'error' });
        return;
      }
    }
    confirm && confirm(info,type)
    // closeDrawer()
  }
  // 关闭弹框
  const closeDrawer = (flag = false) => {
    updateData([
      {value: false, field: 'open'},
    ], 'record')
    if (flag) {
      close && close()
    }
  }

  const selectWork = (e) => {
    info.dutyUserName = "";
    const typeInfo = initTypeList[e.detail.value];
    setWorkInfo(typeInfo);
    info.type = typeInfo.value;
    setInfo(info);
    if(typeInfo.value == 1){
      // openSelect();
    }
  }

  const openSelect = () => {
    const lit = userList.filter(v=> info?.dutyUserName?.split(',').includes(v.nickName))
    console.log(lit)
    GSelectRef.current.openSelect(userList, {
      selects: userList.filter(v=> info?.dutyUserName?.split(',').includes(v.nickName)).map(v=>v.nickName),
      custom: {
        value: 'userId',
        label: 'nickName',
      },
      title: ''
    }).then((res) => {
      if (res?.confirm) {
        const name = res.data.map(v=>v.label).join(",");
        const itemInfo = JSON.parse(JSON.stringify(info))
        itemInfo.dutyUserName = name;
        setInfo(itemInfo);
      }
    })
  }

  // 把方法抛出给父组件
  useImperativeHandle(ref, () => ({
    openFilter,
    closeDrawer,
  }))
  return (
    <>
      <AtDrawer mask width={width} right={right} show={recordInfo.open} onClose={() => closeDrawer(true)}
                className={`${classStr} ${!recordInfo.open && 'none-dom'}`}>
        <View style={`height: ${h}px;`}></View>
        <View className='at-drawer-title flex flex-center'>{recordInfo.title}</View>
        <ScrollView scrollY className="at-drawer-content" style={`height: calc(100% - 96rpx - 156rpx - ${h}px)`}>
          {
            type == 1 ?
              <View>
                <View className='at-row m-t-20 f-s-28'>
                  <View>
                    当前客户： {item?.customerName}
                  </View>
                </View>
                <View className='at-row m-t-20 f-s-28'>
                  <View>
                    当前工序： {item?.craftName}
                  </View>
                </View>
                <View className='at-row m-t-20 f-s-28 m-b-8'>
                  <View style={'color:red'}>*</View>报废数量
                </View>
                <View className='common-item'>
                  <View className='flex flex-start align-center primary-color f-s-28'>
                  <AtInput className='gray-input flex-grow' placeholder='请输入' value={info?.quantity} maxLength={30} onChange={(e) => updateData([{
                    value: e,
                    field: 'quantity',
                    type: 'integer'
                  }],'info')}></AtInput>
                  {item?.quantity}{item?.unit == '1' ? '大料' : item?.unit == '2' ? 'PNL' : item?.unit == '3' ? 'SET' : ''}
                  </View>
                </View>
                <View className='at-row m-t-20 f-s-28 m-b-8'>
                  <View style={'color:red'}>*</View>报废原因
                </View>
                <View className='common-item f-s-28'>
                  <AtInput className='gray-input w-100' placeholder='请输入' value={info?.reason} maxLength={200}
                           onChange={(e) => updateData([{value: e, field: 'reason'}],'info')}></AtInput>
                </View>
                <View className='at-row f-s-28 m-b-8'>
                  <View style={'color:red'}>*</View>责任方
                </View>
                <View className='common-item f-s-28'>
                    <Picker className="qrcode-picker w-100" rangeKey='label' mode='selector' range={typeList} onChange={selectWork}>
                      <AtInput className='gray-input w-100' disabled value={workInfo?.label} placeholder="请选择">
                        <AtIcon value='chevron-down' size='16'></AtIcon>
                      </AtInput>
                    </Picker>
                </View>

                {workInfo?.value == 1 ?
                  <View>
                    <View className='at-row f-s-28 m-b-8'>
                      <View style={'color:red'}>*</View>添加责任人
                    </View>
                    <View className='common-item f-s-28'>
                      <AtInput className='gray-input w-100' editable={false} maxLength={200} value={info?.dutyUserName} placeholder="请选择" onClick={()=>openSelect()}>
                        <AtIcon value='chevron-down' size='16'></AtIcon>
                      </AtInput>
                    </View>
                  </View>
                : workInfo?.value == 2 ?
                    <View>
                    </View>
                 : workInfo?.value == 3 ?
                      <View>
                        <View className='at-row f-s-28 m-b-8'>
                          <View style={'color:red'}>*</View>供应商名称
                        </View>
                        <View className='common-item f-s-28'>
                          <AtInput className='gray-input w-100' placeholder='请输入' value={info?.dutyUserName} maxLength={200}
                                   onChange={(e) => updateData([{value: e, field: 'dutyUserName'}], 'info')}></AtInput>
                        </View>
                      </View>
                 : <></>
                }


              </View> :
              type == 2 ?
                <View>
                  <View className='at-row m-t-20 f-s-28'>
                    <View>
                      当前客户： {item?.customerName}
                    </View>
                  </View>
                  <View className='at-row m-t-20 f-s-28'>
                    <View>
                      当前工序： {item?.craftName}
                    </View>
                  </View>
                  <View className='at-row m-t-20 f-s-28 m-b-8'>
                    <View style={'color:red'}>*</View>加工数量
                  </View>
                  <View className='common-item flex primary-color f-s-28' style={'align-items: center'}>
                    <AtInput placeholder='请输入' value={info?.processQuantity} maxLength={30}
                             className={'gray-input flex-grow'}
                             onChange={(e) => updateData([{
                               value: e,
                               field: 'processQuantity',
                               type: 'number'
                             }],'info')}>
                    </AtInput>
                    {item?.waitProcessQuantity} {item?.unit == '1' ? '大料' : item?.unit == '2' ? 'PNL' : item?.unit == '3' ? 'SET' : ''}
                  </View>
                </View> : <View></View>
          }
        </ScrollView>
        <View className='at-drawer-bottom'>
          <AtButton onClick={resetHandle}>取消</AtButton>
          <AtButton type='primary' onClick={confirmHandle}>确定</AtButton>
        </View>
      </AtDrawer>

      <GSelect ref={GSelectRef}></GSelect>
    </>
  )
})
