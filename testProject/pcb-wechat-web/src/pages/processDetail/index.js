import { subscribeMessage } from '../util/func'
import { useState, useEffect } from "react";
import { AtIcon, AtInput, AtTextarea, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import Taro, { useLoad, usePullDownRefresh, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import AreaTable from '../../components/area-table'
import DetailCard from '../../components/detail-card'
import RejectTable from '../../components/reject-table'
import './index.less'
import { deepClone } from '../util/func'
import { getCapacityDetailsAPI, passCapacityAPI, rejectCapacityAPI, voidCapacityAPI } from '../services/productWork/index'
import { hasPermi, loginOut } from '../util/func'
import GFeedback from '../../components/g-feedback';

export default function ProcessDetail() {
  const [role, setRole] = useState(1) // 1部门主管 2生产经理
  const [info, setInfo] = useState({})
  const [show, setShow] = useState(false)
  const [type, setType] = useState(undefined)
  const [data, setData] = useState(undefined)
  const [waitArea, setWaitArea] = useState(0)
  const [loading, setLoading] = useState(false)
  const [cardId, setCardId] = useState(undefined)
  const [residueArea, setResidueArea] = useState(0)
  const [craftId, setCraftId] = useState(undefined)
  const [roleType, setRoleType] = useState(undefined)
  const [processTwo, setProcessTwo] = useState(false)
  const [dialog, setDialog] = useState({
    open: false,
    title: '上报产能修改',
    confirmText: '确定',
    // 提交数据
    auditQuantity: undefined,
    alreadyReportedArea: undefined,
    reason: undefined
  })

  const [crtRow, setCrtRow] = useState()
  const [rejectType, setRejectType] = useState(1) // 1驳回 2作废
  const [reason, setReason] = useState('')
  const [showReason, setShowReason] = useState(false)

  const [waitAuditList, setwaitAuditList] = useState([])
  const [finishedList, setfinishedList] = useState([])
  const [voidList, setVoidList] = useState([])
  useLoad((options) => {
    setType(options.type)
    setCardId(options.cardId)
    setCraftId(options.craftId)
    setRoleType(options.roleType)
    let title = ''
    if (options.type == 1) {
      title = '个人产能审核'
    } else if (options.type == 2) {
      title = '审核记录'
    }
    Taro.setNavigationBarTitle({
      title: title
    })
    options.isAudit = (options.type == 1)
    options.type = options.roleType
    getCapacityDetails(options)
  })
  useShareAppMessage(() => {
    return {
      title: type == 1 ? '个人产能审核' : '审核记录',
      path: '/pages/index/index'
    }
  })
  usePullDownRefresh(() => {
    const params = {cardId, craftId, isAudit: (type == 1), type: roleType}
    getCapacityDetails(params, 'stop')
  })
  const getCapacityDetails = (params, pullType) => {
    let roleTypeTemp = 3
    if (hasPermi(['deptLeader'])) {
        roleTypeTemp = 3
        setRole(1)
    } else if (hasPermi(['productManager'])) {
        roleTypeTemp = 4
        setRole(1)
    }
    if (params.type == '3') {
      setProcessTwo(false)
    } else if (params.type == '4') {
      setProcessTwo(true)
    }
    delete params.roleType
    // params.type = roleType
    // console.log(type)
    // params.isAudit = (type == 1)
    getCapacityDetailsAPI(params).then((res) => {
      if (res.code == 200) {
        // console.log(res)
        if (params.type == '3') {
          res.data.waitAuditList && res.data.waitAuditList.map((m) => {
            m.auditQuantity = m.reportedQuantity
          })
        }
        setData(res.data)
        setVoidList(res.data.voidList || [])
        setfinishedList(res.data.finishedList || [])
        setwaitAuditList(res.data.waitAuditList || [])
        countHandle(res.data)
      }
    }).finally(() => {
      if (pullType == 'stop') {
        Taro.stopPullDownRefresh()
      }
    })
  }
  // useEffect(() => {
  //     if (processTwo) {
  //         updateData('通过', 'confirmText')
  //         return
  //     }
  //     if (dialog.reportedQuantity != dialog.info.reportedQuantity) {
  //         // confirmText
  //         updateData('修改并审核', 'confirmText')
  //     } else {
  //         updateData('确定', 'confirmText')
  //     }
  // }, [dialog.reportedQuantity])
  useLoad(() => {
  })
  // const openClick = (flag, item) => {
  //   let temp = Object.assign({}, dialog)
  //   temp.open = flag
  //   if (flag) {
  //     temp.title = item?.info?.code + ' 产能审核'
  //     temp.reportedQuantity = item?.info?.reportedQuantity
  //   }
  //   console.log('temp', temp, dialog, item)
  //   setDialog(temp)
  //   // setfinishedList([{ id: 1, index: 1, reportName: 'admin' + Math.random(), reportNum: '200', reportArea: '0.1200', createdTime: '2024-03-12 12:12' }])
  // }
  const updateData = (value, name) => {
    let temp = Object.assign({}, dialog)
    console.log(Array.isArray(name), name.length == 2)
    if (Array.isArray(name) && name.length == 2) {
      temp[name[0]][name[1]] = value
    } else {
      temp[name] = value
    }
    // console.log('---', temp)
    setDialog(temp)
  }
  // 计算出当前数据之外的pnl/set总数
  const countTatolNum = (tempInfo) => {
    let maxNum = 0
    let totalTemp = 0
    if (tempInfo.unit == 2) {
      // set
      let pnlSetNum = 0
      data.pnlSetVos.map((m) => {
        if (m.saleorderId == tempInfo.saleOrderId) {
          pnlSetNum += Number(m.quantity || 0)
        }
      })
      totalTemp = Number(data.bundlePnlQuantity || 0) * pnlSetNum
      waitAuditList.map((m) => {
        if (m.id != tempInfo.id && m.saleOrderId == tempInfo.saleOrderId) {
          maxNum += (Number(m.auditQuantity || 0))
        }
      })
      finishedList.map((m) => {
        if (m.saleOrderId == tempInfo.saleOrderId) {
          maxNum += (Number(m.auditQuantity || 0))
        }
      })
    } else {
      // pnl
      totalTemp = Number(data.bundlePnlQuantity || 0)
      waitAuditList.map((m) => {
        if (m.id != tempInfo.id) {
          maxNum += Number(m.auditQuantity || 0)
        }
      })
      finishedList.map((m) => {
        maxNum += Number(m.auditQuantity || 0)
      })
    }
    return totalTemp - maxNum
  }
  // 阻止超出pnl/set数
  const notExcePnl = (e) => {
    let tempInfo = deepClone(info)
    let tempDialog = deepClone(dialog)
    const total = countTatolNum(tempInfo)
    console.log(total)
    // if (tempInfo.unit == 2) {
    //   // set
    // } else {
    //   // pnl
    // }
    let num = e
    if (Number(e) > total) {
      num = total
    }
    let areaTemp = 0
    if (tempInfo.unit == 2) {
      // set
      const itemOrder = data.saleOrderVoList.find(f => f.id == tempInfo.saleOrderId)
      areaTemp += Number((tempDialog.auditQuantity) || 0) * Number(itemOrder.unitedLength || 0) * Number(itemOrder.unitedWidth || 0) / 1000000 * (data?.number || 1)
    } else {
      // pnl
      data.pnlSetVos.forEach(pnlSet => {
          const itemOrder = data.saleOrderVoList.find(f => f.id == pnlSet.saleorderId)
          areaTemp += Number(tempDialog.auditQuantity || 0) * Number(pnlSet.quantity || 0) * Number(itemOrder.unitedLength || 0) * Number(itemOrder.unitedWidth || 0) / 1000000 * (data?.number || 1)
      })
    }
    tempDialog.open = true
    tempDialog.auditQuantity = num
    tempDialog.alreadyReportedArea = (areaTemp || 0).toFixed(4)
    setDialog(tempDialog)
  }
  const checkData = () => {
    let res = ''
    if (!dialog.reason) {
      res = '请填写修改原因'
    }
    return res
  }
  // 打开弹框
  const changeNumber = (item) => {
    let temp = Object.assign({}, dialog)
    setInfo(item)
    temp.open = true
    setCrtRow(item)
    temp.title = item?.createByName + '上报产能修改'
    if (!processTwo) {
      temp.auditQuantity = item?.auditQuantity
      temp.alreadyReportedArea = item?.alreadyReportedArea
      temp.reason = item?.reason || undefined
    } else {
      temp.auditQuantity = item?.auditQuantity
      temp.reportedQuantity = item?.reportedQuantity
      temp.alreadyReportedArea = item?.alreadyReportedArea
      temp.reason = item?.reason || undefined
    }
    setDialog(temp)
  }
  // 审核弹框 确认
  const confirmChange = () => {
    let tempInfo = deepClone(info)
    let tempDialog = deepClone(dialog)
    tempInfo.reason = tempDialog.reason
    tempInfo.auditQuantity = tempDialog.auditQuantity
    tempInfo.alreadyReportedArea = tempDialog.alreadyReportedArea
    if (Number(tempInfo.auditQuantity || 0) <= 0) {
      Taro.showToast({
        title: '个人产能需大于0',
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (tempInfo.auditQuantity != tempInfo.reportedQuantity) {
      // 修改过产能，所以修改原因必填
      const errMsg = checkData()
      if (errMsg) {
        Taro.showToast({
          title: errMsg,
          icon: 'none',
          duration: 1500
        })
        return;
      }
    }
    let tempWaitArea = deepClone(waitAuditList)
    const numIndex = tempWaitArea.findIndex((res) => res.id == tempInfo.id)
    tempWaitArea[numIndex] = tempInfo

    let param = deepClone(data)
    param.waitAuditList = tempWaitArea
    countHandle(param)
    
    setwaitAuditList(tempWaitArea)
    updateData(false, 'open')
    // Taro.navigateBack({ delta: 1 })
  }
  /**
   * pnl:
   * auitQuailty *
   * set:
   */
  // 计算 剩余面积，待审核面积，已审核面积
  const countHandle = (data) => {
    let waitAreaTemp = 0;
    // pnlnum * setpnlnum
    data.waitAuditList && data.waitAuditList.map((m) => {
      if (m.unit == 2) {
        // set
        const itemOrder = data.saleOrderVoList.find(f => f.id == m.saleOrderId)
        waitAreaTemp += Number((m.auditQuantity || m.reportedQuantity) || 0) * Number(itemOrder.unitedLength || 0) * Number(itemOrder.unitedWidth || 0) / 1000000 * (data?.number || 1)
      } else {
        // pnl
        data.pnlSetVos.forEach(pnlSet => {
            const itemOrder = data.saleOrderVoList.find(f => f.id == pnlSet.saleorderId)
            waitAreaTemp += Number(m.auditQuantity || m.reportedQuantity || 0) * Number(pnlSet.quantity || 0) * Number(itemOrder.unitedLength || 0) * Number(itemOrder.unitedWidth || 0) / 1000000 * (data?.number || 1)
        })
      }
    })
    setWaitArea(waitAreaTemp.toFixed(4))
    let autidArea = 0
    data.finishedList && data.finishedList.map((m) => {
      if (m.unit == 2) {
        // set
        const itemOrder = data.saleOrderVoList.find(f => f.id == m.saleOrderId)
        autidArea += Number(m.auditQuantity || m.reportedQuantity || 0) * Number(itemOrder.unitedLength || 0) * Number(itemOrder.unitedWidth || 0) / 1000000 * (data?.number || 1)
      } else {
        // pnl
        data.pnlSetVos.forEach(pnlSet => {
            const itemOrder = data.saleOrderVoList.find(f => f.id == pnlSet.saleorderId)
            autidArea += Number(m.auditQuantity || m.reportedQuantity || 0) * Number(pnlSet.quantity || 0) * Number(itemOrder.unitedLength || 0) * Number(itemOrder.unitedWidth || 0) / 1000000 * (data?.number || 1)
        })
      }
    })
    let totalAreaTemp = 0
    data.pnlSetVos.forEach(pnlSet => {
        const itemOrder = data.saleOrderVoList.find(f => f.id == pnlSet.saleorderId)
        totalAreaTemp += Number(data.bundlePnlQuantity || 0) * Number(pnlSet.quantity || 0) * Number(itemOrder.unitedLength || 0) * Number(itemOrder.unitedWidth || 0) / 1000000 * (data?.number || 1)
        // console.log(totalAreaTemp)
    })
    let residueAreaTemp = Number((totalAreaTemp - autidArea - waitAreaTemp).toFixed(4)).toFixed(4)
    // console.log(totalAreaTemp, autidArea, waitAreaTemp)
    setResidueArea(residueAreaTemp)
  }
  // 提交审核
  const submitHandle = () => {
    if (residueArea < 0) {
      setShow(true)
      return;
    }
    subscribeMessage().finally(() => {
      Taro.showModal({
        title: '系统提示',
        content: '确定审核通过?',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            const params = waitAuditList.map((m) => {
              return {
                id: m.id,
                reportedQuantity: m.reportedQuantity,
                auditQuantity: m.auditQuantity,
                reason: m.reason,
                status: m.status,
              }
            })
            setLoading(true)
            passCapacityAPI(params).then((res) => {
              if (res.code == 200) {
                // console.log(res)
                Taro.navigateBack({ delta: 1 })
              }
            }).finally(() => {
              setLoading(false)
            })
          }
        }
      })
    })
  }

  // 作废、驳回 打开弹框
  const openReject = (row) => {
    subscribeMessage().finally(() => {
      if (row) {
        if (['8', '9'].includes(row.status + '')) {
          return;
        }
        setCrtRow(row)
        setRejectType(2)
      } else {
        setRejectType(1)
      }
      setReason('')
      setShowReason(true)
    })
  }
  // 作废、驳回 确认
  const confirmReject = () => {
    console.log('确认---:', crtRow.id, reason)
    if (!reason) {
      Taro.showToast({
        title: `请填写${rejectType == 1 ? '驳回' : '作废'}原因`,
        icon: 'error',
        duration: 1500
      })
      return;
    }
    if (rejectType == 1) {
      rejectRecord()
    } else {
      voidRecord()
    }
  }
  // 驳回
  const rejectRecord = () => {
    Taro.showModal({
      title: '系统提示',
      content: `是否驳回${crtRow.createByName}上报的记录？`,
      success: function (res) {
        if (res.confirm) {
          console.log('crtRow:', crtRow)
          const params = {
            id: crtRow.id,
            reason: reason
          }
          setLoading(true)
          rejectCapacityAPI(params).then((res) => {
            if (res.code == 200) {
              setShowReason(false)
              updateData(false, 'open')
              const params = {cardId, craftId, isAudit: (type == 1), type: roleType}
              getCapacityDetails(params, 'stop')
            }
          }).finally(() => {
            setLoading(false)
          })
        }
      }
    })
  }

  // 作废
  const voidRecord = () => {
    Taro.showModal({
      title: '系统提示',
      content: `是否作废${crtRow.createByName}上报的记录？`,
      success: function (res) {
        if (res.confirm) {
          console.log('crtRow-:', crtRow)
          const params = {
            id: crtRow.id,
            reason: reason
          }
          setLoading(true)
          voidCapacityAPI(params).then((res) => {
            if (res.code == 200) {
              setShowReason(false)
              const params = {cardId, craftId, isAudit: (type == 1), type: roleType}
              getCapacityDetails(params, 'stop')
            }
          }).finally(() => {
            setLoading(false)
          })
        }
      }
    })
  }
  return (
    <View className='detail flex flex-column'>
      <View className='detail-top'>
        {data && <DetailCard type={type} data={data} residueArea={residueArea}></DetailCard>}
      </View>

      <View className="page-area-content">
        {type == 1 && <View className='page-area-table'>
          <View className="page-table-head flex flex-between">
            <View className="page-table-title">待审核记录</View>
            <View className="page-table-tip" style='color: #6190E8;'>待审面积:{waitArea}</View>
          </View>
          <View className="page-area-table-box">
            <AreaTable list={waitAuditList} areaView={
              (item) => {
                return (<Text style={`color: ${Number(item.reportedQuantity) != Number(item.auditQuantity) ? '#f00' : '#00f'};`} onClick={() => changeNumber(item)}
                >{item.alreadyReportedArea}</Text>)
              }
            }
            num={(item) => {
              return (<Text>{(Number(item.auditQuantity) > 0 ? item.auditQuantity : item.reportedQuantity) || 0}</Text>)
            }}></AreaTable>
          </View>
          <View className="font-16" style={'color: #DD1A33;'}>提示：点击上报面积可修改或驳回</View>
        </View>}

        <View className='page-area-table'>
          <View className="page-table-head flex flex-between">
            <View className="page-table-title">已审核记录</View>
            <View className="page-table-tip">已审面积:{data?.finishedArea}</View>
          </View>
          <View className="page-area-table-box">
            <AreaTable areaView={
              (item) => {
                return (<Text style={`color: ${(type == 2 && !['8','9'].includes(item.status + '')) ? '#f00' : ''};`} onClick={() => openReject(item)}
                >{item.alreadyReportedArea}</Text>)
              }
            }
            num={(item) => {
              return (<Text>{(Number(item.auditQuantity) > 0 ? item.auditQuantity : item.reportedQuantity) || 0}</Text>)
            }} list={finishedList}></AreaTable>
          </View>
          {type == 2 && <View className="font-16" style={'color: #DD1A33;'}>提示：点击上报面积可作废</View>}
        </View>

        {type == 2 && <View className='page-area-table'>
          <View className="page-table-head flex flex-between">
            <View className="page-table-title">驳回/作废记录</View>
            <View className="page-table-tip"></View>
          </View>
          <View className="page-area-table-box">
            <RejectTable list={voidList}></RejectTable>
          </View>
        </View>}
      </View>

      {type == 1 && <AtButton className="button-top" loading={loading} disabled={loading} type='primary' onClick={submitHandle}>审核</AtButton>}

      {dialog.open && <AtModal isOpened={dialog.open} closeOnClickOverlay={false}>
        <AtModalHeader>{dialog.title}</AtModalHeader>
        <AtModalContent>
          {dialog.info}
          {!processTwo && <AtInput
            name='value'
            type='number'
            title='个人产能：'
            placeholder='请填写个人产能'
            value={dialog.auditQuantity}
            onChange={(e) => notExcePnl(e)}>
            <View>{info && info.unit == 2 ? 'SET' : 'PNL'}</View>
          </AtInput>}
          {processTwo && <AtInput
            disabled
            name='value'
            type='number'
            title='个人产能：'
            placeholder='请填写个人产能'
            value={dialog.reportedQuantity}
            onChange={(e) => notExcePnl(e)}>
            <View>{info && info.unit == 2 ? 'SET' : 'PNL'}</View>
          </AtInput>}
          {processTwo && <AtInput
            disabled
            name='value'
            type='number'
            title='修改产能：'
            placeholder='请填写修改产能'
            value={dialog.auditQuantity}
            onChange={(e) => notExcePnl(e)}>
            <View>{info && info.unit == 2 ? 'SET' : 'PNL'}</View>
          </AtInput>}
          <View className="g-textarea flex flex-start">
            <View className="g-textarea-label">修改原因：</View>
            <AtTextarea disabled={processTwo} value={dialog.reason} onChange={(e) => updateData(e, 'reason')} placeholder="请填写修改原因"></AtTextarea>
          </View>
          {!processTwo && <View className="detail-dialog-change flex flex-between">
            <View className="flex flex-column flex-center">
              <View>修改前</View>
              <View>{info?.auditQuantity || 0} {info && info.unit == 2 ? 'SET' : 'PNL'}/{info?.alreadyReportedArea} ㎡</View>
            </View>
            <AtIcon value='arrow-right' size='16'></AtIcon>
            <View className="flex flex-column flex-center">
              <View>修改后</View>
              <View>{dialog.auditQuantity || 0} {info && info.unit == 2 ? 'SET' : 'PNL'}/{dialog?.alreadyReportedArea} ㎡</View>
            </View>
          </View>}
        </AtModalContent>
        <AtModalAction>
          <Button loading={loading} disabled={loading} onClick={() => updateData(false, 'open')}>取消</Button>
          <Button loading={loading} disabled={loading} style={'color: #DD1A33;'} onClick={() => openReject()}>驳回</Button>
          <Button loading={loading} disabled={loading} onClick={confirmChange}>确定</Button>
        </AtModalAction>
      </AtModal>}

      {show && <AtModal isOpened={show} closeOnClickOverlay={false}>
        <AtModalHeader>审核</AtModalHeader>
        <AtModalContent className='mini-content-height'>
          <View style='text-align: center;'><Text style='color: #f00;'>超过</Text>可上报面积，请检查后重试</View>
        </AtModalContent>
        <AtModalAction><Button onClick={() => setShow(false)}>确定</Button></AtModalAction>
      </AtModal>}

      {showReason && <AtModal isOpened={showReason} closeOnClickOverlay={false}>
        <AtModalHeader>{rejectType == 1 ? '驳回' : '作废'}</AtModalHeader>
        <AtModalContent className='mini-content-height'>
          <View className="g-textarea flex flex-start">
            <View className="g-textarea-label">{rejectType == 1 ? '驳回' : '作废'}原因：</View>
            <AtTextarea value={reason} onChange={(e) => setReason(e)} placeholder={`请填写${rejectType == 1 ? '驳回' : '作废'}原因`}></AtTextarea>
          </View>
        </AtModalContent>
        <AtModalAction><Button loading={loading} disabled={loading} onClick={() => setShowReason(false)}>取消</Button><Button loading={loading} disabled={loading} onClick={confirmReject}>确定</Button></AtModalAction>
      </AtModal>}
      <GFeedback></GFeedback>
    </View>
  )
}
