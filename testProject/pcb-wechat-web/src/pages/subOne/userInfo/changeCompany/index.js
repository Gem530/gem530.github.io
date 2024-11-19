import './index.less'
import { View } from '@tarojs/components'
import { useEffect, useState } from "react"
import GFeedback from '../../../../components/g-feedback'
import { AtButton, AtInput, AtImagePicker } from "taro-ui"
import Taro, {useLoad, useShareAppMessage} from '@tarojs/taro'
import { hasPermission, uploadFileDeal } from '../../../util/func'
import { editLogoAPI, getUserInfo } from '../../../services/login/loginService'

export default function ChangeName() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [fileList, setFileList] = useState([])

  useEffect(() => {
  }, []);
  useShareAppMessage(() => {
    return {
      title: '公司信息',
      path: '/pages/index/index'
    }
  })

  useLoad(async () => {
    let _USERINFO = Taro.getStorageSync('__USER_INFO__')
    setName(Taro.getStorageSync('__USER_INFO__')?.user?.nickName)
    let res = await getUserInfo(_USERINFO.userName, _USERINFO.pwd, _USERINFO.phoneNumber, _USERINFO.needAvatar)
    let userInfo = res?.user
    setFileList(userInfo?.fileList || [])
    setUserInfo(userInfo)
  })

  const changeHandle = () => {
    if (!fileList?.length) {
      Taro.showToast({ title: '请上传logo', icon: 'error', duration: 1500 })
      return;
    }
    setLoading(true)
    editLogoAPI({fileList}).then((res) => {
      if (res.code == 200) {
        Taro.showToast({ title: '保存成功' })
      }
    }).finally(() => setLoading(false))
    // console.log('userInfo?.nickName', userInfo, name)
  }
  // 图片上传
  const fileChange = async (files, operationType, index) => {
      // files 值发生变化触发的回调函数, operationType:add新增 remove删除 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引
      if (operationType == 'add') {
          const flag = files.some((s) => (s?.file?.size) > 5 * 1024 * 1024)
          if (flag) {
              Taro.showToast({
                  title: '图片不能超过5M',
                  icon: 'none',
                  duration: 1500
              })
              return
          }
          let tempFiles = files.map((m) => m.file.path)
          console.log(tempFiles)
          const res = await uploadFileDeal(tempFiles)
          if (res?.length) {
            console.log(res[0]?.params?.fileInfo)
            setFileList([{...res[0]?.params?.fileInfo, url: files[0].file.path}])
          }
      } else {
          setFileList(files)
      }
      // console.log('fileChange', files, operationType, index)
  }
  // 图片上传失败回调
  const fileFail = (res) => {
      if (res.errMsg != 'chooseImage:fail cancel') {
          Taro.showToast({
              title: '图片上传失败',
              icon: 'none',
              duration: 1500
          })
      }
  }
  // 图片预览
  const previewImage = (i) => {
      const urlArr = fileList.map((item) => item.url)
      // console.log(i, urlArr)
      Taro.previewImage({
          current: urlArr[i],
          urls: urlArr
      })
  }

  return (
    <View className="change-name-page">
      <View className='user-card'>
        <View className='user-card-item'>
          <View className='user-item-label'>公司logo</View>
          <View className='user-item-value flex flex-end'>
            <AtImagePicker
              count={1}
              length={3}
              mode='aspectFit'
              multiple={false}
              files={fileList}
              onFail={fileFail}
              onChange={fileChange}
              onImageClick={previewImage}
              className={`img-picker-resver ${!hasPermission(['user:user:tenantConfiguration']) && 'no-del'}`}
              showAddBtn={!fileList?.length}
              // sourceType={['camera']}
            ></AtImagePicker>
          </View>
        </View>
        <View className='user-card-item'>
          <View className='user-item-label'>公司名称</View>
          <View className='user-item-value text-right'>{userInfo?.dept?.deptName}</View>
        </View>
      </View>

      {hasPermission(['user:user:tenantConfiguration']) ? <View className='change-name-btn'>
        <AtButton type='primary' loading={loading} disabled={loading} onClick={changeHandle}>保存</AtButton>
      </View> : <></>}
      <GFeedback></GFeedback>
    </View>
  )
}
