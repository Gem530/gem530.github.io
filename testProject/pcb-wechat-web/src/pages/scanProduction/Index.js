import {useEffect, useState} from "react";
import {Button, Image, View, Text, Picker} from '@tarojs/components'
import Taro, {useDidShow, useShareTimeline, useShareAppMessage} from '@tarojs/taro'
import './index.less'
import {AtButton, AtIcon, AtModal, AtToast, AtModalAction, AtModalContent, AtModalHeader, AtRadio, AtInput} from "taro-ui";
import scan from "../../../public/static/scan1.png";
import * as scanProduction from '../services/scanProduction/scanProductionService';
import config from '../config/commonConfig';
import {calcHeightPercentPx, calcPx, calcWidthPercentPx, loginOut} from '../util/func';
import GFeedback from "../../components/g-feedback";

const {statusBarHeight} = config;

export default function ScanProduction() {
  const [pnlVisible, setPnlVisible] = useState(false);
  const [maxNum, setMaxNum] = useState(0);
  const [showNum, setShowNum] = useState(true);
  const [showCount, setShowCount] = useState(false);
  const [countNum, setCountNum] = useState('');
  const [orderInfo, setOrderInfo] = useState({
    id: '',
    commodityCode: '',
  });
  const [nextNodeInfo, setNextNodeInfo] = useState({
    lastCardNodeId: '',
    craftName: '',
    countUnit: undefined,
  });
  const [pnlList, setPnlList] = useState([]);
  const [pnlSelected, setPnlSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    open: false,
    text: ''
  })
  const [nodeInfo, setNodeInfo] = useState({
    commodityCode: undefined,
    pnlName: undefined,
    quantity: undefined,
    currentNodeId: undefined,
    currentNodeName: undefined,
    currentNodeUnit: undefined,
    saleOrderVoList: [],
    nextNodeId: undefined,
    nextNodeName: undefined,
    nextNodeUnit: undefined,
    cardId: undefined,
    cardCode: undefined,
    nextNodeList: [],
  });
  const [onlyCount, setOnlyCount] = useState(false)

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '过数',
      path: '/pages/index/index'
    }
  })
  // useShareTimeline(() => {
  //   return {
  //     title: '分享标题',
  //     path: '/pages/index/index'
  //   }
  // })

// 对应 onShow
  useDidShow(() => {
    Taro.hideHomeButton({}).then();
    
    Taro.setNavigationBarTitle({
        title: Taro.getStorageSync('__USER_INFO__')?.user?.nickName
    })
    
    // Taro.getStorage({
    //   key: '__USER_INFO__',
    //   success: (res) => {
    //     const countArr = res.data.roles.filter((f) => f.indexOf('code-') == 0)
    //     const otherRole = res.data.roles.filter((f) => ['deptLeader','productManager','capacity','businessCardRecognitionEmail','qgjs_app','ckzg','cwjs','cgzj','glwl'].includes(f))
    //     if (countArr.length && otherRole.length == 0) {
    //       // 只有过数权限，没有上报以及审核权限
    //       setOnlyCount(true)
    //     } else {
    //       setOnlyCount(false)
    //     }
    //   }
    // })
  })

  const resetState = () => {
    setPnlList([]);
    setCountNum('');
    setPnlSelected(null);
    setNodeInfo({
      commodityCode: undefined,
      pnlName: undefined,
      quantity: undefined,
      currentNodeId: undefined,
      currentNodeName: undefined,
      currentNodeUnit: undefined,
      saleOrderVoList: [],
      nextNodeId: undefined,
      nextNodeName: undefined,
      nextNodeUnit: undefined,
      cardId: undefined,
      cardCode: undefined,
      nextNodeList: []
    });
  }

  const getCanCountQuantity = (cardId, saleOrderId) => {
    return scanProduction.getCanCountQuantityAPI({cardId, saleOrderId}).then((res) => {
      if (res.code == 200) {
        setMaxNum(res.data || 0)
        if (countNum) {
          changeNum(countNum, res.data || 0)
        }
      }
    })
  }

  const onScanQrCode = () => {
    resetState();
    Taro.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        let cardId = res.result;
        setIsLoading(true);
        if (cardId.indexOf("_") === -1) {
          //如果流转卡ID没有下划线，那说明流转卡为新系统流转卡，不需要选pnl卡，直接查询当前卡信息
          scanProduction.getCurrentNodeInfo({
            id: cardId,
          }).then((nodeRes) => {
            console.log(nodeRes.data)
            setNodeInfo({
              commodityCode: nodeRes.data.commodityCode,
              pnlName: nodeRes.data.pnlName,
              quantity: nodeRes.data.quantityPerCard,
              nextNodeName: nodeRes.data.nextNodeName,
              nextNodeId: nodeRes.data.nextNodeId,
              nextNodeUnit: nodeRes.data.nextNodeUnit,
              currentNodeId: nodeRes.data.currentNodeId,
              currentNodeName: nodeRes.data.currentNodeName,
              currentNodeUnit: nodeRes.data.currentNodeUnit,
              saleOrderVoList: nodeRes.data.saleOrderVoList,
              cardId: nodeRes.data.id,
              cardCode: nodeRes.data.code,
              nextNodeList: nodeRes.data.nextNodeList,
            })
            if (nodeRes.data?.saleOrderVoList?.length) {
              setOrderInfo(nodeRes.data.saleOrderVoList[0])
            }
            if (nodeRes.data?.nextNodeList?.length) {
              setNextNodeInfo(nodeRes.data.nextNodeList[0])
            }
          }).finally(() => {
            setIsLoading(false);
          });
        } else {
          //如果流转卡ID有下划线，那说明流转卡为老系统流转卡，需要选pnl卡，查询卡信息
          scanProduction.getCardPnls({
            qrCode: cardId,
          }).then((resCard) => {
            if (resCard.data.length === 1) {
              //如果卡的数量为1的话，直接默认选择这个卡
              scanProduction.getCurrentNodeInfo({
                id: resCard.data[0].id,
              }).then((nodeRes) => {
                setNodeInfo({
                  commodityCode: nodeRes.data.commodityCode,
                  pnlName: resCard.data[0].pnlName,
                  quantity: nodeRes.data.quantityPerCard,
                  nextNodeName: nodeRes.data.nextNodeName,
                  nextNodeId: nodeRes.data.nextNodeId,
                  nextNodeUnit: nodeRes.data.nextNodeUnit,
                  currentNodeId: nodeRes.data.currentNodeId,
                  currentNodeName: nodeRes.data.currentNodeName,
                  currentNodeUnit: nodeRes.data.currentNodeUnit,
                  saleOrderVoList: nodeRes.data.saleOrderVoList,
                  cardId: nodeRes.data.id,
                  cardCode: resCard.data[0].code,
                  nextNodeList: nodeRes.data.nextNodeList,
                })
                if (nodeRes.data?.saleOrderVoList?.length) {
                  setOrderInfo(nodeRes.data.saleOrderVoList[0])
                }
                if (nodeRes.data?.nextNodeList?.length) {
                  setNextNodeInfo(nodeRes.data.nextNodeList[0])
                }
              })
            } else {
              setPnlVisible(true);
              let pnls = resCard.data.map(item => {
                return {
                  label: item.pnlName,
                  value: item.id,
                }
              });
              setPnlList(pnls);
            }
          }).finally(() => {
            setIsLoading(false);
          });
        }
      },
      fail: (err) => {
        Taro.showToast({
          title: '识别失败，请重试',
          icon: 'error',
          duration: 1500
        })
      }
    })
  }

  const onLoginOut = () => {
    loginOut();
  }

  const pnlSelectOk = () => {
    scanProduction.getCurrentNodeInfo({
      id: pnlSelected,
    }).then((nodeRes) => {
      setNodeInfo({
        commodityCode: nodeRes.data.commodityCode,
        pnlName: pnlList.find(item => item.value === pnlSelected).label,
        quantity: nodeRes.data.quantityPerCard,
        nextNodeName: nodeRes.data.nextNodeName,
        nextNodeId: nodeRes.data.nextNodeId,
        nextNodeUnit: nodeRes.data.nextNodeUnit,
        currentNodeId: nodeRes.data.currentNodeId,
        currentNodeName: nodeRes.data.currentNodeName,
        currentNodeUnit: nodeRes.data.currentNodeUnit,
        saleOrderVoList: nodeRes.data.saleOrderVoList,
        cardId: nodeRes.data.id,
        cardCode: nodeRes.data.code,
        nextNodeList: nodeRes.data.nextNodeList,
      })
      setPnlVisible(false);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const getPnlData = () => {
    return <View>
      <AtRadio
        options={pnlList}
        value={pnlSelected}
        onClick={selectPnl}
      />
    </View>
  }

  const pnlSelectCancel = () => {
    setPnlVisible(false);
    resetState();
  }

  // 打开-过数修改弹框
  const openCount = () => {
    console.log(nodeInfo.nextNodeUnit != '3' || nodeInfo.nextNodeList?.length)
    if (nodeInfo.nextNodeUnit != '3' || nodeInfo.nextNodeList?.length) {
      getCanCountQuantity(nodeInfo.cardId, orderInfo.id)
      setCountNum('');
      setShowCount(true);
    } else {
      onSubmit()
    }
  }

  // 过数修改-确认弹框
  const confrimCount = () => {
    if (!orderInfo?.id) {
      Taro.showToast({ title: '请选择接单订单', icon: 'none' })
      return
    }
    if (!(countNum+'')) {
      Taro.showToast({ title: '请输入接单数量', icon: 'none' })
      return
    }
    if (countNum <= 0) {
      Taro.showToast({ title: '接单数量不可小于0', icon: 'none' })
      return
    }
    onSubmit()
  }

  const selectPnl = (val) => {
    setPnlSelected(val);
  }

  const onSubmit = () => {
    setIsLoading(true);
    const params = {
      cardId: nodeInfo.cardId,
      id: nextNodeInfo?.lastCardNodeId || nodeInfo.currentNodeId,
    }
    if (countNum) params.countQuantity = countNum
    if (orderInfo?.id) params.saleOrderId = orderInfo.id
    scanProduction.onHandleTask(params).then((res) => {
      resetState();
      setShowCount(false);
      Taro.showToast({
        title: '接单成功',
        icon: 'success',
        duration: 1500
      })
    }).catch((err) => {
      setToastInfo({
        open: true,
        text: err.msg
      })
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const headerStyle = () => {
    let lineHeight = "line-height: " + calcPx(40) + "rpx;";
    let fontSize = "font-size: " + calcPx(35) + "rpx;"
    return lineHeight + fontSize;
  }

  const statusBarStyle = () => {
    return "height: " + statusBarHeight + 'px';
  }

  const productionInfoStyle = () => {
    let lineHeight = "line-height: " + calcHeightPercentPx(5) + "rpx;";
    let fontSize = "font-size: " + calcPx(20) + "rpx;"
    let paddingLeft = "padding-left: " + calcPx(10) + "rpx;"
    return lineHeight + fontSize + paddingLeft;
  }

  const footerStyle = () => {
    let paddingBottom = "padding-bottom: " + calcPx(50) + "rpx;"
    return paddingBottom;
  }

  const submitButtonStyle = () => {
    let width = "width: " + calcWidthPercentPx(70) + "rpx;"
    let height = "height: " + calcPx(50) + "rpx;"
    return width + height;
  }

  const selectOrder = (e, type) => {
    if (type == 'order') {
      // console.log(e)
      setOrderInfo(nodeInfo.saleOrderVoList[Number(e.detail.value)])
      getCanCountQuantity(nodeInfo.cardId, nodeInfo.saleOrderVoList[Number(e.detail.value)]?.id)
    } else {
      setNextNodeInfo(nodeInfo.nextNodeList[Number(e.detail.value)])
    }
  }

  // 动态改变值
  const changeNum = (value, max = '') => {
    let maxTxt = max+'' ? max : maxNum
    if (value > maxTxt) {
      value = maxTxt
      setShowNum(false)
    }
    setTimeout(() => {
      setCountNum(Number(value))
      setShowNum(true)
    }, 5)
  }

  return (
    <View style='position: relative'>
      <View>
        {/* <View style={statusBarStyle()}></View> */}
        {/* <View style={headerStyle()} className='scan-header'>{Taro.getStorageSync('__USER_INFO__')?.user?.nickName}</View> */}
        {onlyCount && <View className='scan-loginOut'>
          <View style='width: 100px'>
            <AtButton size='small' onClick={onLoginOut}>退出登录</AtButton>
          </View>
        </View>}
        <View>
          <View className='at-row'>
            <View className='at-col at-col-4 scan-productionInfo'
                  style={productionInfoStyle()}>
              流转卡号：
            </View>
            <View className='at-col at-col-8 scan-productionInfo'
                  style={productionInfoStyle()}>
              {nodeInfo && nodeInfo.cardCode}
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col at-col-4 scan-productionInfo'
                  style={productionInfoStyle()}>
              生产编号：
            </View>
            <View className='at-col at-col-8 scan-productionInfo sace-wrap'
                  style={productionInfoStyle()}>
              {
                nodeInfo && nodeInfo.commodityCode && nodeInfo.commodityCode.split('-').map((m) => {
                  return (
                    <Text>{m}</Text>
                  )
                })
              }
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col at-col-4 scan-productionInfo'
                  style={productionInfoStyle()}>
              PNL：
            </View>
            <View className='at-col at-col-8 scan-productionInfo'
                  style={productionInfoStyle()}>
              {nodeInfo && nodeInfo.pnlName}
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col at-col-4 scan-productionInfo'
                  style={productionInfoStyle()}>
              数量：
            </View>
            <View className='at-col at-col-8 scan-productionInfo'
                  style={productionInfoStyle()}>
              {nodeInfo && nodeInfo.quantity}
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col at-col-4 scan-productionInfo'
                  style={productionInfoStyle()}>
              当前工序：
            </View>
            <View className='at-col at-col-8 scan-productionInfo'
                  style={productionInfoStyle()}>
              {nodeInfo && nodeInfo.currentNodeName}
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col at-col-4 scan-productionInfo'
                  style={productionInfoStyle()}>
              可接单工序：
            </View>
            <View className='at-col at-col-8 scan-productionInfo'
                  style={productionInfoStyle()}>
              {nodeInfo && nodeInfo.nextNodeName}
            </View>
          </View>
        </View>
      </View>
      <View className='scan-footer' style={footerStyle()}>
        <View className='scan-pic'>
          <Image src={scan} style='width: 50%; height: 60%;' mode='widthFix' onClick={onScanQrCode}></Image>
          <View>
            请点击图标扫码
          </View>
        </View>
        <View className='scan-submit'>
          <View style={submitButtonStyle()}>
            {nodeInfo && nodeInfo.pnlName &&
              // <AtButton size='normal' circle type='primary' onClick={onSubmit} loading={isLoading}
              //           disabled={isLoading}>确定接单</AtButton>
              <AtButton size='normal' circle type='primary' onClick={openCount} loading={isLoading}
                            disabled={isLoading}>确定接单</AtButton>
            }
          </View>
        </View>
      </View>
      <AtModal isOpened={pnlVisible}>
        <AtModalHeader>请选择对应的PNL</AtModalHeader>
        <AtModalContent>
          {getPnlData()}
        </AtModalContent>
        <AtModalAction>
          <Button onClick={pnlSelectCancel}>取消</Button>
          <Button onClick={pnlSelectOk}
                  loading={isLoading}
                  disabled={isLoading}>确定</Button>
        </AtModalAction>
      </AtModal>
      {showCount ? <AtModal isOpened={showCount} closeOnClickOverlay={false} className="count-modal">
        <AtModalHeader>接单</AtModalHeader>
        <AtModalContent className="height-count">
          {/* {nodeInfo.nextNodeList?.length ? <Picker className="qrcode1-picker" rangeKey='craftName' mode='selector' range={nodeInfo.nextNodeList} onChange={(e) => selectOrder(e, 'nextNode')}>
              <AtInput title='可接单工序' disabled value={nextNodeInfo?.craftName} placeholder={showCount ? "请选择可接单工序" : ''}>
                  <AtIcon value='chevron-down' size='16'></AtIcon>
              </AtInput>
          </Picker> : <></>} */}
          <Picker className="qrcode1-picker" rangeKey='commodityCode' mode='selector' range={nodeInfo.saleOrderVoList} onChange={(e) => selectOrder(e, 'order')}>
              <AtInput title='接单订单' disabled value={orderInfo?.commodityCode} placeholder={showCount ? "请选择接单订单" : ''}>
                  <AtIcon value='chevron-down' size='16'></AtIcon>
              </AtInput>
          </Picker>
          {
            showNum ? <AtInput title="接单数量" type="number" value={countNum} placeholder={showCount ? "请输入接单数量" : ''} onChange={(value) => changeNum(value)}>
            <View style={'color: #999;'}>
            {maxNum}
            {((nextNodeInfo?.countUnit || nodeInfo?.nextNodeUnit) == '1' ? 'PCS' : (nextNodeInfo?.countUnit || nodeInfo?.nextNodeUnit) == '2' ? 'SET' : 'PNL')}
            </View>
          </AtInput> : <></>
          }
        </AtModalContent>
        <AtModalAction>
          <Button loading={isLoading} disabled={isLoading} onClick={() => {setCountNum('');setShowCount(false);}}>取消</Button>
          <Button onClick={confrimCount}
                  loading={isLoading}
                  disabled={isLoading}>确定</Button>
        </AtModalAction>
      </AtModal> : <></>}

      <AtToast isOpened={toastInfo.open} text={toastInfo.text} duration={1500} hasMask={true} onClose={() => { setToastInfo({ open: false, text: toastInfo.text }) }}></AtToast>

      <GFeedback></GFeedback>
    </View>
  )
}
