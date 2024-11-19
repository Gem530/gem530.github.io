import './index.less'
// import dayjs from 'dayjs'
import { useRef } from 'react'
import { AtIcon } from 'taro-ui'
import { View } from '@tarojs/components'
import {getGlobalData} from "../../global"
import Taro, { useLoad } from '@tarojs/taro'
// import { uploadFileDeal } from '../../pages/util/func'
import { useState, forwardRef, useImperativeHandle } from "react";


export default forwardRef(function GFixedIcon({ size = 30, children, style }, ref) {
  const padding = 0
  const fixedRef = useRef()
  
  const [windowW, setWindowW] = useState(0)
  const [windowH, setWindowH] = useState(0)
  const [touchFlag, setTouchFlag] = useState(false)
  const [point, setPoint] = useState({
    x: windowW - size - padding,
    y: 0
  })

  useLoad(() => {
    let windowWidth = getGlobalData('windowWidth')
    let windowHeight = Number(getGlobalData('windowHeight').replace('px',''))
    setPoint({
      x: windowWidth - size - padding,
      y: 0
    })
    console.log(windowWidth, windowHeight)
    setWindowW(windowWidth)
    setWindowH(windowHeight)
  })

  const touchstart = (e) => {
    // console.log(e)
    // // touchFlag.value = true
    // touchFlag.current = true
    // console.log(touchFlag.current)
  }

  const touchmove = (e) => {
    e.stopPropagation()
    e.preventDefault()
    // if (!touchFlag.value) return
    console.log({
      x: e.touches[0].clientX - size / 2 - padding,
      y: e.touches[0].clientY - size / 2 - padding
    })
    setTimeout(() => {
      setPoint({
        x: e.touches[0].clientX - size / 2 - padding,
        y: e.touches[0].clientY - size / 2 - padding
      })
    }, 10)
  }

  const touchend = (e) => {
    // touchFlag.current = false
    let tempPoint = point
    if (tempPoint.x > (windowW / 2 - padding)) {
      tempPoint.x = windowW - size - padding
    } else {
      tempPoint.x = 0.1 - padding
    }
    if (tempPoint.y > windowH) {
      tempPoint.y = windowH - size - padding
    } else if (tempPoint.y < 0) {
      tempPoint.y = 0.1 - padding
    }
    setTouchFlag(true)
    setTimeout(() => {
      console.log('end', tempPoint)
      setTouchFlag(false)
      setPoint(tempPoint)
    }, 100)
  }

  // 把方法抛出给父组件
  useImperativeHandle(ref, () => ({
    // openFile,
  }))
  return (
    <View class="fixed-icon">
      {!touchFlag ? <View
        ref={fixedRef}
        className={`fixed-box`}
        style={style ? style : {
          padding: padding + 'px',
          bottom: '192rpx',
          right: '0px',
        }}
        // style={{
        //   padding: padding + 'px', 
        //   top: point.y ? point.y + 'px' : '450px',
        //   left: point.x ? point.x + 'px' : undefined,
        // }}
        // onTouchend={touchend}
        // onTouchmove={touchmove}
        // onTouchstart={touchstart}
        >
          {children}
      </View> : <></>}
    </View>
  )
})
