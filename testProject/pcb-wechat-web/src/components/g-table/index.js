import './index.less'
import { useState, useEffect } from 'react'
import { getDomInfo } from '../../pages/util/func'
import { View, ScrollView } from '@tarojs/components'

export default function GTable({list, titleList, tdSlot, thSlot}) {
    const [width, setWidth] = useState(0)
    const [domID, setDomID] = useState(Math.random().toString().replace('.', ''))
    useEffect(() => {
        setTimeout(async () => {
            if (list?.length) return
            const dom = await getDomInfo(`.g-table-${domID}`)
            // console.log(dom[0], domID)
            setWidth(dom[0]?.width || 0)
        }, 0)
    }, [list])
    return (
        <ScrollView scrollX>
        <View className={`g-table g-table-${domID}`}>
            <View className='g-head'>
                <View className='g-tr'>
                    {
                        titleList.map((item, index) => {
                            return (
                                <View className={`g-td ${list?.length && index == 0 && 'g-td-fixed'} ${item.children?.length && 'g-td-merage'} ${item.width && 'font-wrap'}`} style={{width: item.width + ' !important'}}>
                                    {!item.children?.length ? (thSlot ? thSlot(item, index) : item.title) :
                                    <>
                                        <View className={`g-merage-col`}>{thSlot ? thSlot(item, index) : item.title}</View>
                                        <View className='g-merage'>
                                        {item.children.map((m) => {
                                            return (
                                                // `${1/item.children.length * 100}%`
                                                <View className='g-td' style={{width: m.width}}>{thSlot ? thSlot(m, index) : m.title}</View>
                                            )
                                        })}
                                        </View>
                                    </>}
                                </View>
                            )
                        })
                    }
                </View>
            </View>
            <View className='g-body'>
            {
                (list?.length) ? list.map((item, index) => {
                    return (
                        <View className='g-tr'>
                        {
                            titleList.map((sub, subIndex) => {
                                return (
                                    <View className={`g-td ${list?.length && subIndex == 0 && 'g-td-fixed'} ${sub.children?.length && 'g-td-merage'}`}>
                                        {!sub.children?.length ? <View className={`g-merage-col ${sub.width && 'font-wrap'}`} style={{width: sub.width + ' !important'}}>{tdSlot ? (tdSlot(sub, item, subIndex,index) || item[sub.field]) : item[sub.field]}</View> :
                                        <>
                                            <View className='g-merage'>
                                            {sub.children.map((m, mIndex) => {
                                                return (
                                                    <View className='g-td' style={{width: m.width}}>{(tdSlot ? (tdSlot(m, item, mIndex,index) || item[m.field]) : item[m.field])}</View>
                                                )
                                            })}
                                            </View>
                                        </>}

                                    </View>
                                )
                            })
                        }
                        {/* <View className='g-td'>{index + 1}</View>
                        <View className='g-td'>{item.createByName}</View>
                        <View className='g-td'>{num ? num(item) : (Number(item.auditQuantity) > 0 ? item.auditQuantity : item.reportedQuantity)} {item.unit == 2 ? 'SET' : 'PNL'}</View>
                        <View className='g-td'>{gView ? gView(item) : item.alreadyReportedg}</View>
                        <View className='g-td'>{item.createTime}</View> */}
                    </View>)
                }) : <></>
            }
            </View>
        </View>
        {list?.length ? <></> : <View className='g-table-empty' style={`width: ${width}px;`}>暂无数据</View>}
        </ScrollView>
    )
}
