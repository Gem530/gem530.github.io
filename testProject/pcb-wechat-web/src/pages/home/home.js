import './home.less'
import dayjs from 'dayjs'
import { useState } from 'react'
import NavBar from '../../components/nav-bar'
import GFeedback from '../../components/g-feedback'
import { AtNoticebar, AtBadge, AtIcon } from 'taro-ui'
import {View, Image, Button, Picker} from '@tarojs/components'
import * as service from "../services/login/loginService"
// import reportIcon from '../../assets/images/reportIcon.png'
import {DAILY_TEMPLATE_IDS} from '../config/commonConfig'
import {getNoticeListAPI, getOwnerListAPI, switchingUnitApi} from "../services/login/loginService"
import {loginOut, removeAllTags, downloadFileByKeys} from '../util/func'
import Taro, {useLoad, useDidShow, useShareAppMessage} from '@tarojs/taro'
import { getNotifyNumAPI, getWxPendingNumAPI, getUserRemindConfigAPI } from "../services/noticePage"


export default function Home() {
  // const iconInfo = {
  //   'reportIcon': reportIcon
  // }
  const [time, setTime] = useState()
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([])
  const [notice, setNotice] = useState('')
  const [userInfo, setUserInfo] = useState()
  const [allNotice, setAllNotice] = useState()
  const [notifyList, setNotifyList] = useState([])
  const [noReadCount, setNoReadCount] = useState()
  const [allHomeList, setAllHomeList] = useState()
  const [notifySetting, setNotifySetting] = useState([])
  const [OwnerList, setOwnerList] = useState([])
  const [OwnerInfo, setOwnerInfo] = useState([])
  useShareAppMessage(() => {
    return {
      title: '首页',
      path: '/pages/index/index'
    }
  })
  const setHomeList = (menus) => {
    const homeList = menus//Taro.getStorageSync('__Menu__')
    // console.log(homeList)
    if (homeList?.length) {
      let temp = []
      homeList.map((item) => {
        if (!item.hidden) {
          let subTemp = []
          item?.children?.map((el, elIndex) => {
            if (!el.hidden) {
              subTemp.push({
                id: (elIndex + 1),
                menuId: el?.menuId,
                icon: el?.meta?.icon,
                value: el?.meta?.title,
                url: el?.query ? `${el?.path}?${el?.query}` : el?.path,
                // iconInfo: { size: '30', value: el?.meta?.icon },
              })
            }
          })
          temp.push({
            menuId: item?.menuId,
            title: item?.meta?.title,
            children: subTemp || []
          })
        }
      })
      setList(temp)
    }
  }
  useLoad(() => {
    // let temp = []
    // const user = Taro.getStorageSync('__USER_INFO__')
    // const countArr = user.roles.filter((f) => f.indexOf('code-') == 0)
    // if (countArr.length) {
    //   // 过数角色
    //   temp.push({ id: 1, icon: countIcon, value: '过数' })
    // }
    // if (hasPermi(['capacity'])) {
    //   // 上报角色
    //   temp.push({ id: 2, icon: reportIcon, value: '产能上报' })
    // }
    // if (hasPermi(['deptLeader', 'productManager'])) {
    //   // 审核角色
    //   temp.push({ id: 3, icon: processIcon, value: '产能上报审核' })
    // }
    // if (hasPermi(['businessCardRecognitionEmail'])) {
    //   // 名片识别邮箱 角色
    //   temp.push({ id: 4, icon: emailIcon, value: '邮箱识别' })
    // }
    // if (hasPermi(['qgjs_app'])) {
    //   // 物料请购
    //   temp.push({ id: 5, icon: shopIcon, value: '物料请购' })
    // }
    // if (hasPermi(['ckzg','cwjs','cgzj'])) {
    //   // 物料请购 审核
    //   temp.push({ id: 6, icon: materialProcessIcon, value: '物料请购审核' })
    // }
    // if (hasPermi(['glwl'])) {
    //   // 关联物流信息
    //   temp.push({ id: 7, iconInfo: { size: '30', value: 'file-new' }, value: '关联物流信息' })
    // }
    // setList(temp)
  })

  useDidShow(async () => {
    // getNotifyNum()
    // getUserRemindConfig()
    // getWxPendingNum()
    getMenuList()
    getNoticeList()
    Taro.hideHomeButton({
      success: () => {
        console.log('隐藏返回按钮成功')
      }
    });
    Taro.removeStorageSync('car_data')
    Taro.removeStorageSync('isRefresh')
    Taro.removeStorageSync('detailData')
    Taro.removeStorageSync('noticeAccount')
    Taro.removeStorageSync('confirmStatus')
    let userInfo = Taro.getStorageSync('__USER_INFO__');
    if (userInfo?.user?.createTime) {
      setTime(getRemainderTime(userInfo.user.createTime))
    }
    if (userInfo?.user?.avatarUrl) {
      // setTime(getRemainderTime(userInfo.user.createTime))
      let avatarShowUrlInfo = await downloadFileByKeys(userInfo?.user?.avatarUrl)
      userInfo.user.avatarShowUrl = avatarShowUrlInfo.data[userInfo?.user?.avatarUrl]
    }
    setUserInfo(userInfo.user)

    getOwnerList(userInfo.user);
  })

  // 返回距离当前时间差，取最大值的返回，如：0年1月30天，返回1月
  function getRemainderTime(startTime) {
    var year = dayjs(new Date()).diff(dayjs(startTime), 'year');
    var month = dayjs(new Date()).diff(dayjs(startTime), 'month');
    var day = dayjs(new Date()).diff(dayjs(startTime), 'day');
    var hour = dayjs(new Date()).diff(dayjs(startTime), 'hour');
    var minute = dayjs(new Date()).diff(dayjs(startTime), 'minute');
    var second = dayjs(new Date()).diff(dayjs(startTime), 'second');
    // console.log(year,month,day,hour,minute,second);
    let timeArr = [{
      unit: '年',
      value: year,
    }, {
      unit: '月',
      value: month,
    }, {
      unit: '天',
      value: day,
    }, {
      unit: '小时',
      value: hour,
    }, {
      unit: '分钟',
      value: minute,
    }, {
      unit: '秒',
      value: second,
    }]
    let resultArr = timeArr.filter((f) => f.value)
    // console.log(resultArr)
    return resultArr?.length ? `${resultArr[0].value}${resultArr[0].unit}` : `0秒`;
  }

  // 获取待办数量
  const getNotifyNum = () => {
    getNotifyNumAPI().then((res) => {
      if (res.code == 200) {
        setNoReadCount(res.data || 0)
      }
    })
  }

  // 获取待办数量
  const getWxPendingNum = () => {
    getWxPendingNumAPI().then((res) => {
      if (res.code == 200) {
        setNotifyList(res.data || [])
      }
    })
  }

  // 获取用户待办通知提醒设置
  const getUserRemindConfig = () => {
    getUserRemindConfigAPI().then((res) => {
      if (res.code == 200) {
        setNotifySetting(res.data || [])
      }
    })
  }

  // 获取菜单
  const getMenuList = async () => {
    service.getXcxRoutersAPI().then((resMenu) => {
      setAllHomeList({
        params: '',
        res: resMenu.data || [],
      })
      setHomeList(resMenu.data || [])
    })
    // return resMenu.data || []
    // if (resMenu.code == 200) {
    // console.log(resMenu)
    // Taro.setStorageSync('__Menu__', resMenu.data);
    // }
  }

  // 获取公告
  const getNoticeList = () => {
    getNoticeListAPI({pageNum: 1, pageSize: 1, noticeType: 3}).then((res) => {
      if (res.code == 200) {
        // console.log(res)
        setAllNotice({
          res: res,
          params: {pageNum: 1, pageSize: 1, noticeType: 3}
        })
        if (res.rows?.length) {
          let tempNotice = res.rows[0]?.noticeContent || res.rows[0]?.noticeTitle || ''
          tempNotice = removeAllTags(tempNotice)
          setNotice(tempNotice)
        }
      }
    })
  }

  const getUserProfile = (e) => {
    // console.log(e.detail.avatarUrl)
    let tempUser = JSON.parse(JSON.stringify(userInfo))
    tempUser.avatar = e.detail.avatarUrl
    setUserInfo(tempUser)
  }

  // 菜单跳转
  const toPath = (item, index) => {
    // console.log(item, index)
    // 报表菜单
    const reportList = ['/packageB/report/engineeringReport/index','/packageB/report/productReport/index','/packageB/report/purchaseReport/index','/packageB/report/outSourceReport/index','/packageB/report/pendingReport/index','/packageB/report/capacityReport/index']
    if (item.url.indexOf('/pages/subOne/dailyReport/index') != -1) {
      Taro.requestSubscribeMessage({
        tmplIds: DAILY_TEMPLATE_IDS,
        success: (res) => {
          console.log(res)
          Taro.navigateTo({url: item?.url})
        },
        fail: (err) => {
          console.log(err)
          Taro.navigateTo({url: item?.url})
        }
      })
    } else if (reportList.includes(item.url)) {
      Taro.requestSubscribeMessage({
        tmplIds: DAILY_TEMPLATE_IDS,
        success: (res) => {
          console.log(res)
          Taro.navigateTo({url: item?.url})
        },
        fail: (err) => {
          console.log(err)
          Taro.navigateTo({url: item?.url})
        }
      })
    } else {
      Taro.navigateTo({url: item?.url})
    }
    // if (item.id == 1) {
    //     Taro.navigateTo({url: '/pages/scanProduction/Index'})
    // } else if (item.id == 2) {
    //     Taro.navigateTo({url: `/pages/capacityReporting/index?id=${item.id}`})
    // } else if (item.id == 3) {
    //     Taro.navigateTo({url: `/pages/process/index`})
    // } else if (item.id == 4) {
    //     Taro.navigateTo({url: `/pages/emailRecognition/index`})
    // } else if (item.id == 5) {
    //     Taro.navigateTo({url: `/pages/materialRequisition/index`})
    // } else if (item.id == 6) {
    //     Taro.navigateTo({url: `/pages/processMaterialRequisition/index`})
    // } else if (item.id == 7) {
    //     Taro.navigateTo({url: `/pages/relatedLogistics/index`})
    // }
  }

  //切换单位
  const selectOwner = (e) => {
    setOwnerInfo(OwnerList[Number(e?.detail?.value)])
    //登录之前清除缓存
    // Taro.clearStorageSync();
    Taro.login({
      success: (wxRes) => {
        let query = {
          username: OwnerList[Number(e?.detail?.value)].userName,
          ownerId: OwnerList[Number(e?.detail?.value)].ownerId,
          xcxCode: wxRes.code,
          // grantType: 'wx',
          err: false
        }
        query.xcxLoginType = 2
        service.switchingUnitApi(query).then(async (res) => {
          console.log('result', res)
          if (res) {
            Taro.reLaunch({
              // url: `/pages/scanProduction/Index`,
              url: `/pages/home/home`,
            }).then();
            // }
          }
        }).finally(() => {
          setLoading(false);
        });
      }
    })
  }

  const getOwnerList = (vo) => {
    // 获取当前账号所有租户
    getOwnerListAPI().then((res) => {
      if (res.code == 200) {
        res.data.map((item) => {
          setOwnerList(res.data)
          console.log("item.ownerName", res.data)
          console.log("item.ownerName", item.ownerName)
          console.log("item.ownerName", vo.ownerName)
          if (item.ownerName == vo.ownerName) {
            setOwnerInfo(item)
          }
        })
      }
    })
  }


  // 退出
  const loginOutHandle = () => {
    Taro.showModal({
      title: '是否确定退出？',
      success: (res) => {
        if (res?.confirm) {
          loginOut()
        }
      }
    })
  }
  return (
    <View className='home-page'>
      <NavBar
        fixed={true}
        title='首页'
        color='rgba(45, 144, 237, 1)'
        transparent={true}
      />
      {/* <View className='loginout-button'>
        <View style='width: 100px;'><AtButton size='small' onClick={() => loginOut()}>退出登录</AtButton></View>
      </View>
      <AtGrid mode='square' hasBorder={true} columnNum={list?.length > 6 ? 3 : 2} data={list}
        onClick={toPath}
      /> */}
      <View className='home-card'>
        {/* <View className='home-avator'> */}
        <Button className='home-avator'>
          {/*  open-type="chooseAvatar" onChooseAvatar={getUserProfile} */}
          <Image
            src={userInfo?.avatarShowUrl || userInfo?.avatar || 'https://pcb-prod.oss-cn-shenzhen.aliyuncs.com/wechat/avator-user.png'}
            mode='aspectFit' style={'width: 100%;height: 100%;'}></Image>
        </Button>
        {/* </View> */}

        {/* <View className='home-usertime flex flex-end'>
          <View className='home-usertime-box'>已使用{time}</View>
        </View> */}
        <View className='login-out primary-color flex flex-end' style={'opacity: 0;'}>
          <View className='primary-exit'></View>
          <View className='login-out-text'>退出</View>
        </View>
        {/* <View className='login-out primary-color flex flex-end' onClick={() => Taro.navigateTo({url: '/pages/subOne/userInfo/noticePage/index'})}>
          {
            notifySetting?.notifyConfig && (notifySetting?.notifyConfig != '0') && (noReadCount > 0) ? <AtBadge dot={notifySetting?.notifyConfig == '2'} value={noReadCount} className='new small-icon'><View className='primary-home-notice expend-click'></View></AtBadge> :
            <View className='primary-home-notice expend-click'></View>
          }
        </View> */}

        <View className='home-name flex flex-between'>
          <View className='home-name-box'>{userInfo?.wxNickName || userInfo?.nickName || ''}</View>
          <View className='home-settings flex flex-end'
                onClick={() => Taro.navigateTo({url: '/pages/subOne/userInfo/index'})}>
            <View>个人中心</View>
            <View className='home-right'></View>
          </View>
        </View>

        {/* <View className='home-sex-time flex flex-start'>
          <View className='home-sex'>{userInfo?.sex == '0' ? '男' : userInfo?.sex == '1' ? '女' : '未知'}</View>
          <View className='home-time'>在职{time}</View>
        </View> */}

        <View className='home-company'>
          <View className='home-company-tag flex flex-center'>公司</View>
          {/*<View>{userInfo?.ownerName}</View>*/}
          <Picker className='qrcode-picker' rangeKey='ownerName' mode='selector' range={OwnerList}
                  onChange={selectOwner}>
            <View className={"flex flex-start"} style={"width: 480rpx;"}>
              <View style='margin-right: 4rpx;  text-align: center;overflow: hidden; text-overflow: ellipsis;' >{userInfo?.ownerName}</View>
              <AtIcon value={'chevron-down'} size={18} color={'#ffffff'}/>
            </View>
            {/*<AtInput title='切换单位：' disabled value={OwnerInfo?.deptName} placeholder='请选择单位'>*/}
            {/*  <AtIcon value='chevron-down' size='16'></AtIcon>*/}
            {/*</AtInput>*/}
          </Picker>
        </View>

        {/*<View className='container'>*/}
        {/*  <View className='temperature-list'>*/}
        {/*    <View>*/}
        {/*      <Picker className='qrcode-picker' rangeKey='deptName' mode='selector' range={OwnerList}*/}
        {/*              onChange={selectOwner}>*/}
        {/*        <AtInput title='切换单位：' disabled value={OwnerInfo?.deptName} placeholder='请选择单位'>*/}
        {/*          <AtIcon value='chevron-down' size='16'></AtIcon>*/}
        {/*        </AtInput>*/}
        {/*      </Picker>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}

        <View className='notice-bar flex flex-start'>
          {!!notice ? <>
            <View className='primary-notice'></View>
            <AtNoticebar marquee className='notice-bar-locale'>{notice}</AtNoticebar>
          </> : <></>}
        </View>

        {
          list?.length ? list.map((el, elIndex) => {
            return (
              <View className={`home-menu ${elIndex == 0 && 'no-top'}`}>
                <View className='home-menu-title'>{el.title}</View>
                <View className='home-nav flex flex-start'>
                  {
                    el.children?.length ? el.children.map((item, index) => {
                      // 当前菜单 是展示 数字还是红点 徽标，或者不展示
                      // let crtNotify = notifySetting?.pendingConfig?.length && notifySetting?.pendingConfig.find((f) => f.menuId == item.menuId)?.config
                      // let crtNum = notifyList?.length && notifyList.find((f) => f.menuId == item.menuId)?.pendingNum
                      return (
                        <View className='home-nav-item flex flex-column flex-center'
                              onClick={() => toPath(item, index)}>
                          {/* <Image className='nav-item-icon' src={item.icon.indexOf('http') == -1 ? iconInfo[item.icon] : item.icon}></Image> */}
                          {/* {
                            crtNotify && (crtNotify != '0') && (crtNum > 0) ?
                            <AtBadge className='new' dot={crtNotify == '2'} value={crtNum}>
                              <Image className='nav-item-icon' src={item.icon}></Image>
                            </AtBadge> : */}
                            <Image className='nav-item-icon' src={item.icon}></Image>
                          {/* } */}
                          <View className='nav-item-text'>{item.value}</View>
                        </View>
                      )
                    }) : <></>
                  }
                </View>
              </View>
            )
          }) : <></>
        }
      </View>

      <View className='home-bottom flex flex-center'>
        <View className='home-bottom-logo'></View>
      </View>
      <GFeedback jsonData={{
        allNotice: allNotice,
        allHomeList: allHomeList,
      }}></GFeedback>
    </View>
  )
}
