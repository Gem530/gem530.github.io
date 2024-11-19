import request from '../../util/request';
import config, {OWNER_ID} from "../../config/commonConfig";
import {CLIENT_ID, GRANT_TYPE, TENANT_ID} from "../../config/commonConfig";
import Taro from "@tarojs/taro";

const {api: {auth: {login,switchLogin, userInfo, getXcxRouters, getNoticeList, getUserCount, userFeedback, generateUrlLink, queryUrlLink, getUserReportRole, addUserReportRole, scanQRCode, editXcxUserInfo, editLogo, editPassword, getAppletUserMenu, getAppletUserByMenuId, dateMaking, verifyNumber, setLoginQRCodeValue, setScanValue, getWriteRecords, saveWriteRecords, deleteWriteRecords,getOwnerList}, transition: {doRequest}}} = config;

export const logining = (params) => {
  const p = {
    clientId: CLIENT_ID,
    grantType: GRANT_TYPE,
    tenantId: TENANT_ID,
    ...params,
  }
  console.log("第一次登录：",params)
  // console.log('loginInfo', p)
  return new Promise((resolve, reject) => {
    request.loginAuth(login, p, params?.err ? params.err : true)
      .then(res => {
        if (res.data?.needRegister) {
          resolve(res)
          return
        }
        getUserInfo(params.username, params.password, res.data?.phoneNumber, res.data?.needAvatar).then(e => resolve(e))
          .catch(e => reject(res));
      }).catch(res => {
        // if(res.code !== '200'){
        //   Taro.showToast({ title: res.msg , icon: 'error'})
        // }
        reject(res);
    });
  })
}


export const switchingUnitApi = (params) => {
  const p = {
    clientId: CLIENT_ID,
    grantType: GRANT_TYPE,
    tenantId: TENANT_ID,
    ownerId: OWNER_ID,
    ...params,
  }
  console.log("进来切换接口打印参数：",params)
  const data = Taro.getStorageSync('__USER_INFO__') || '';
  console.log("data",data.pwd)
  return new Promise((resolve, reject) => {
    request.loginAuth(switchLogin, p, params?.err ? params.err : true)
      .then(res => {
        console.log("切换完成：",res)
        getUserInfo(params.username, data.pwd, data?.phoneNumber, res.data?.needAvatar).then(e => resolve(e))
          .catch(e => reject(res));
      }).catch(res => {
      reject(res);
    });
  })
}

export const getUserInfo = async (userName, pwd, phoneNumber, needAvatar) => {
  const res = await request.get(userInfo, null, true)
  const data = {
    ...res.data,
    pwd,
    userName,
    needAvatar,
    phoneNumber,
  }
  Taro.setStorageSync('__USER_INFO__', data);
  return data;
}

// 获取 开放进度查询
export const getXcxRoutersAPI = (params) => {
  return request.get(getXcxRouters, params, true);
}

// 获取 公告
export const getNoticeListAPI = (params) => {
  return request.get(getNoticeList, params, true);
}

// 获取用户人数
export const getUserCountAPI = (params) => {
  return request.get(getUserCount, params, true);
}

// 反馈意见
export const userFeedbackAPI = (params) => {
  return request.postJson(userFeedback, params, true);
}

// 生成微信短链
export const generateUrlLinkAPI = (params) => {
  return request.postJson(generateUrlLink, params, true);
}

// 解析微信短链
export const queryUrlLinkAPI = (params) => {
  return request.get(queryUrlLink, params, true);
}

// 获取日报/报表配置
export const getUserReportRoleAPI = (params) => {
  return request.get(getUserReportRole, params, true);
}

// 添加日报/报表配置
export const addUserReportRoleAPI = (params) => {
  return request.postJson(addUserReportRole, params, true);
}

// 微信图片解码
export const scanQRCodeAPI = (params) => {
  return request.postJson(scanQRCode, params, true);
}

// 更新头像及昵称
// 微信昵称: wxNickName
// 微信头像: avatarUrl
export const editXcxUserInfoAPI = (params) => {
  return request.postJson(editXcxUserInfo, params, true);
}

// 微信图片解码
export const editLogoAPI = (params) => {
  return request.postJson(editLogo, params, true);
}

// 用户密码修改
export const editPasswordAPI = (params) => {
  return request.postJson(editPassword, params, true);
}

// 获取用户权限菜单按钮
export const getAppletUserMenuAPI = (params) => {
  return request.get(getAppletUserMenu, params, true);
}

// 根据菜单id 获取用户
export const getAppletUserByMenuIdAPI = (menuId) => {
  return request.get(getAppletUserByMenuId + menuId, {}, true);
}

// 获取用户脱敏等级
export const dateMakingAPI = (params) => {
  return request.get(dateMaking, params, true);
}

// 获取订单 手机号 是否可以解除脱敏
export const verifyNumberAPI = (params) => {
  return request.postJson(verifyNumber, params, true);
}

// 授权erp登录
export const setLoginQRCodeValueAPI = (params) => {
  return request.postJson(setLoginQRCodeValue, params, true);
}

// 已扫码erp二维码
export const setScanValueAPI = (params) => {
  return request.get(setScanValue, params, true);
}
// 查询 表单填写记录 cacheRecordEnum 缓存记录值("1":"送货车辆","2":"装运人","3":"物流公司")
export const getWriteRecordsAPI = (params) => {
  return request.get(getWriteRecords, params, true);
}

// 保存 表单填写记录 cacheRecordEnum text
export const saveWriteRecordsAPI = (params) => {
  return request.postJson(saveWriteRecords, params, true);
}

// 删除 表单填写记录 cacheRecordEnum textList
export const deleteWriteRecordsAPI = (params) => {
  return request.postJson(deleteWriteRecords, params, true);
}

// 授权erp登录
export const getOwnerListAPI = (params) => {
  return request.get(getOwnerList, params, true);
}
