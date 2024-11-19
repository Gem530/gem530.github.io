import { AtIcon } from 'taro-ui'
import { View } from '@tarojs/components'
import { useState, useEffect } from "react"
import Taro, { useLoad } from '@tarojs/taro'
import { rpxToPx } from '../../pages/util/func'


export default function GTagHistory({list = [], tagInfo, style, choose, isDelete = false, onDelete}) {
    const [isExpend, setIsExpend] = useState(false)
    const [showNumber, setShowNumber] = useState(0)
    useLoad(() => {
    })

    useEffect(() => {
        initShowNum()
    }, [list])

    // 展示数量
    const initShowNum = () => {
        setTimeout(() => {
            Taro.createSelectorQuery().select('.g-tag-history').fields({ rect: true, scrollOffset: true, size: true, dataset: true }, (res) => {
                // console.log(res, 'res')
                // 历史记录的总宽度
                const parentWidth = res?.width - rpxToPx(8 * 2)

                Taro.createSelectorQuery().selectAll('.g-tag-history-item').fields({ rect: true, scrollOffset: true, size: true, dataset: true }, (result) => {
                    // console.log(result, 'result')
                    let tempList = result.map((m) => {
                        return m.width + rpxToPx(12)
                    })
                    // 展开、收缩按钮宽度
                    let expendIconWidth = tempList[tempList?.length - 1]
                    // tempList = [tempList[tempList?.length - 1], ...tempList.slice(0, tempList?.length - 1)]
                    // console.log(tempList, 'tempList')

                    let showNum = 0;
                    // 计算出第一层有几个tag
                    let showOneNum = 0;
                    let tempOneTotalWidth = 0;
                    tempList.map((m, mIndex) => {
                        tempOneTotalWidth = tempOneTotalWidth + m
                        // console.log(tempOneTotalWidth, m, parentWidth)
                        if (tempOneTotalWidth < parentWidth) {
                            showOneNum = mIndex
                        }
                    })
                    showNum = showOneNum + 1
                    // console.log(showOneNum, tempList.slice(showOneNum + 1))
                    // 第二层还有数据的话，继续计算出第二层能展示几个
                    if (showNum && (showNum < tempList?.length)) {
                        let tempTwoList = tempList.slice(showOneNum + 1)
                        let showTwoNum = 0;
                        let tempTwoTotalWidth = expendIconWidth;
                        tempTwoList.map((m, mIndex) => {
                            tempTwoTotalWidth = tempTwoTotalWidth + m
                            // console.log(tempTwoTotalWidth, m, parentWidth)
                            if (tempTwoTotalWidth < parentWidth) {
                                showTwoNum = mIndex
                            }
                        })
                        // console.log('two', showTwoNum)
                        showNum = showNum + showTwoNum + 1
                    }

                    // 可以展示的数量
                    // console.log('showNum', showNum)
                    setShowNumber(showNum)
                }).exec()
            }).exec()
        }, 10)
    }
    const chooseHandle = (item) => {
        choose && choose(item)
    }
    const deleteHandle = (e, text) => {
        // console.log(e, text)
        e?.length && e[0].stopPropagation()
        onDelete && onDelete(text)
    }
    return (
        // 有数据时，并且shouwNum有值时才展示tag
        <View className={`g-tag-list g-tag-history`} style={`opacity: ${list?.length && !showNumber ? '0' : '1'}`}>
        {
            list?.length ? <>
            {
                list.slice(0, isDelete || isExpend ? list?.length : (showNumber ? showNumber : list.length)).map((item, index) => {
                    return (
                        <View style={style} className={`g-tag g-tag-history-item ${item?.id == tagInfo?.id && 'active'}`} onClick={() => chooseHandle(item)}>
                            {item.name}
                            {isDelete ? <View className='primary-close expend-click' style={'margin-left: 8rpx;'} onClick={(e) => deleteHandle(e, item.name)}></View> : <></>}
                        </View>
                    )
                })
            }
            {!isDelete ? <View style={style} className='g-tag g-tag-history-item last-item' onClick={() => setIsExpend(!isExpend)}>
                {/* text 用于撑开元素高度 */}
                <text style={'opacity:0;width: 0px;'}>1</text><AtIcon value={isExpend ? 'chevron-up' : 'chevron-down'} size={16} color='#333' className='expend-click'></AtIcon>
            </View> : <></>}
            </> : <View style={'width: 100%;font-size: 28rpx;text-align: center;color: #919191;'}>暂无历史记录</View>
        }
        </View>
    )
}
