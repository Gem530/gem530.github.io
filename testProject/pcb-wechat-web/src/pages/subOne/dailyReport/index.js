import './index.less'
import Daily from './daily'
import { useState } from 'react'
import echartsJs from '../../util/echarts'
import MarketReport from './marketReport/index'
import NavBar from '../../../components/nav-bar'
import ProductReport from './productReport/index'
import OperateReport from './operateReport/index'
import EngineeringDaily from './engineeringDaily/index'
import { View, Image, Text, Button, ScrollView } from '@tarojs/components'
import Taro, {useLoad,useShareAppMessage, useDidShow, useDidHide} from '@tarojs/taro'
// import { AtImagePicker, AtButton, AtInput, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
// import { getSignedUrlAPI, getEmailByKeyListAPI, sendBatchEmailAndAddDataAPI } from '../../services/emailRecognition/index'

export default function DailyReportPage() {
    const [type, setType] = useState('')
    const [title, setTitle] = useState('')
    const [firstShow, setFirstShow] = useState(0)
    const [isRedirect, setIsRedirect] = useState(0)
    const [list, setList] = useState([])
    const [typeList, setTypeList] = useState({
        '1': '运营日报',
        '2': '工厂日报',
        '3': '工程日报',
        '4': '生产日报',
        '5': '市场日报',
    })
    useShareAppMessage(() => {
      return {
        title: typeList[type],
        path: '/pages/index/index'
      }
    })
    useLoad((options) => {
        console.log('options:', options)
        setType(options?.type || 1)
        setIsRedirect(options?.isRedirect || 0)
        setTimeout(() => {
        if (options?.type == 1) {
            // 营运总经理 日报
            setList(
                    {
                        // --1接单:takeOrdersVo
                        "takeOrdersVo": {
                            "price": "0.00",//--金额
                            "area": "0.0000",//--面积
                            "averagePrice": "0"//--平均价
                        },
                                // --2未下线订单数据
                        "operationNotOfflineOrderVos": [
                            {
                            "orderType": "1",//--1新单,2返单,3返单有改,4出库存
                            "sumQuantity": 2,//--款数
                            "sumArea": "19.6773"//--面积
                            },
                            {
                            "orderType": "2",
                            "sumQuantity": 3,
                            "sumArea": "107.0903"
                            },
                            {
                            "orderType": "3",
                            "sumQuantity": 0,
                            "sumArea": "0"
                            },
                            {
                            "orderType": "4",
                            "sumQuantity": 0,
                            "sumArea": "0"
                            }
                        ],
                                    // --3-1各业务员接单数据
                        "peopleVos": [
                            {
                            "userId": 6496,//--业务员id
                            "sumQuantity": 19,//--款数
                            "sumArea": "318.6442"//--面积
                            },
                            {
                            "userId": 6583,
                            "sumQuantity": 11,
                            "sumArea": "196.1495"
                            },
                            {
                            "userId": 6599,
                            "sumQuantity": 10,
                            "sumArea": "770.8097"
                            },
                            {
                            "userId": 6495,
                            "sumQuantity": 51,
                            "sumArea": "1360.5150"
                            }
                        ],
                        // --3-2业务员动态表头
                        "processTitles": [
                            {
                            "id": 6495,//--业务员id
                            "title": "陈总"//--业务员名称
                            },
                            {
                            "id": 6496,
                            "title": "冯仕丁"
                            },
                            {
                            "id": 6583,
                            "title": "张新贵"
                            },
                            {
                            "id": 6599,
                            "title": "张亮"
                            }
                        ],
                                    // --4接单列表数据
                        "operationTakeOrderVos": [
                            {
                            "orderType": "1",//--1新单/返单有改,2返单,3总
                            "sumQuantity": 30,
                            "sumArea": "1344.8286"
                            },
                            {
                            "orderType": "2",
                            "sumQuantity": 60,
                            "sumArea": "1292.7293"
                            },
                            {
                            "orderType": "3",
                            "sumQuantity": 90,
                            "sumArea": "2637.5579"
                            }
                        ],
                                    // --5投料、报价下单数据
                        "operationPutOrderVos": [
                            {
                            "orderType": "5",//--4投料,5报价下单
                            "sumQuantity": 27,//--款数
                            "sumArea": "520.9667"//--面积
                            },
                            {
                            "orderType": "4",
                            "sumQuantity": 94,
                            "sumArea": "2293.9771"
                            }
                        ]
                    }
                    
                // [
                //     {
                //         title: '报价未下单',
                //         list: [
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //             },
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //             },
                //         ]
                //     },
                //     {
                //         title: '报价下单',
                //         list: [
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //                 reportCount: 4,
                //             },
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //                 reportCount: 4,
                //             },
                //         ]
                //     },
                //     {
                //         title: '返单',
                //         list: [
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //                 reportCount: 4,
                //             },
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //                 reportCount: 4,
                //             },
                //         ]
                //     },
                //     {
                //         title: '返单有改/样转批',
                //         list: [
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //                 reportCount: 4,
                //             },
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //                 reportCount: 4,
                //             },
                //         ]
                //     },
                //     {
                //         title: '未下线订单',
                //         list: [
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //             },
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //             },
                //         ]
                //     },
                //     {
                //         title: '送货',
                //         list: [
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //             },
                //             {
                //                 count: 2,
                //                 area: 15.7840,
                //                 price: 123.45,
                //             },
                //         ]
                //     },
                // ]
            )
        } else if (options?.type == 2) {
            // 厂长 日报
            setList({
                dayInfo: {
                    count: 10,
                    area: 12.7840,
                    counted: 5,
                    areaed: 124.7840,
                },
                monthInfo: {
                    count: 10,
                    area: 12.7840,
                    counted: 5,
                    areaed: 124.7840,
                },
                list: [
                    { title: '开料', dayPer: 0, monthPer: 0 },
                    { title: '外层钻孔', dayPer: 0, monthPer: 0 },
                    { title: '压合', dayPer: 0, monthPer: 0 },
                    { title: '图形电镀', dayPer: 0, monthPer: 0 },
                ]
            })
        } else if (options?.type == 3) {
            // 工程主管 日报
            setList({
                dayInfo: {
                    allocationCount: 10,
                    waitCount: 5,
                    counting: 5,
                    area: 12.7840,
                },
                list: [
                    {
                        title: '管理员',
                        list: [
                            { title: '样板新单', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '量产新单', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '返单有改', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '返单', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '样转批', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                        ]
                    },
                    {
                        title: '卢鹏',
                        list: [
                            { title: '样板新单', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '量产新单', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '返单有改', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '返单', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                            { title: '样转批', allocationCount: 4, finishCount: 4, performanceCount: 10 },
                        ]
                    }
                ]
            })
        } else if (options?.type == 4) {
            // 生产主管 日报
            setList({
                dayInfo: {
                    area: 12.4758,
                },
                list: [
                    {
                        title: '线路部门',
                        totalArea: 22.7890,
                        list: [
                            [
                                { title: '类型', value: 'CCD曝光' },
                                { title: 'user1', value: 1.2345 },
                                { title: 'user2', value: 1.7890 },
                                { title: 'user3', value: 1.2345 },
                                { title: 'user3', value: 1.2345 },
                                { title: 'user3', value: 1.2345 },
                                { title: 'user3', value: 1.2345 },
                                { title: 'user3', value: 1.2345 },
                                { title: 'user3', value: 1.2345 },
                            ],
                            [
                                { title: '类型', value: '贴干膜' },
                                { title: 'user1', value: 11.2345 },
                                { title: 'user2', value: 1.7890 },
                            ],
                            [
                                { title: '类型', value: 'LDI曝光' },
                                { title: 'user1', value: 1.2345 },
                                { title: 'user2', value: 5.7890 },
                            ]
                        ]
                    },
                    {
                        title: '品质部门',
                        totalArea: 2.7890,
                        list: [
                            [
                                { title: '类型', value: '检修' },
                                { title: 'user1', value: 1.2345 },
                                { title: 'user2', value: 1.7890 },
                                { title: 'user3', value: 1.2345 },
                            ],
                            [
                                { title: '类型', value: '贴干膜' },
                                { title: 'user1', value: 11.2345 },
                                { title: 'user2', value: 1.7890 },
                            ],
                        ]
                    },
                    {
                        title: '阻焊部门',
                        totalArea: 2.7890,
                        list: [
                            [
                                { title: '类型', value: 'CCD曝光' },
                                { title: 'user1', value: 1.2345 },
                                { title: 'user2', value: 1.7890 },
                                { title: 'user3', value: 1.2345 },
                            ],
                            [
                                { title: '类型', value: '贴干膜' },
                                { title: 'user1', value: 11.2345 },
                                { title: 'user2', value: 1.7890 },
                            ],
                        ]
                    },
                ]
            })
        } else if (options?.type == 5) {
            // 市场主管 日报
            setList({
                // --总计数据
                "totalVo": {
                    "sumQuantity": 10,
                    "sumArea": "539.7371",
                    "sumPrice": "181890.9200",
                    "sumProductionQuantity": 1
                },
                // --销售个人产能数据列表（前端可直接参考【销售产能统计】）
                "orderPersonalCapacityVos": [
                    {
                        "name": "黄志宝",
                        "quotation": {
                            "sumQuantity": 1,
                            "sumArea": "1",
                            "sumPrice": "1",
                            "productionQuantity": 1,
                            "orderType": null
                        },
                        "order": {
                            "sumQuantity": 1,
                            "sumArea": "1",
                            "sumPrice": "1",
                            "productionQuantity": 1,
                            "orderType": null
                        },
                        "returned": {
                            "sumQuantity": 5,
                            "sumArea": "122.2236",
                            "sumPrice": "48205.1000",
                            "productionQuantity": 2,
                            "orderType": "2"
                        },
                        "returnChange": {
                            "sumQuantity": 1,
                            "sumArea": "36.7952",
                            "sumPrice": "28140.0000",
                            "productionQuantity": 1,
                            "orderType": null
                        },
                        "total": {
                            "sumQuantity": 6,
                            "sumArea": "159.0188",
                            "sumPrice": "76345.1000",
                            "productionQuantity": 3,
                            "orderType": null
                        }
                    },
                    {
                        "name": "文忠义",
                        "quotation": {
                            "sumQuantity": 5,
                            "sumArea": "999999.7282",
                            "sumPrice": "1",
                            "productionQuantity": 1,
                            "orderType": null
                        },
                        "order": {
                            "sumQuantity": 4,
                            "sumArea": "380.7183",
                            "sumPrice": "105545.8200",
                            "productionQuantity": 8,
                            "orderType": "1"
                        },
                        "returned": {
                            "sumQuantity": 1,
                            "sumArea": "1",
                            "sumPrice": "1",
                            "productionQuantity": 3,
                            "orderType": null
                        },
                        "returnChange": {
                            "sumQuantity": 1,
                            "sumArea": "1",
                            "sumPrice": "1",
                            "productionQuantity": 1,
                            "orderType": null
                        },
                        "total": {
                            "sumQuantity": 4,
                            "sumArea": "380.7183",
                            "sumPrice": "105545.8200",
                            "productionQuantity": 12,
                            "orderType": null
                        }
                    }
                ]
            }
        
            //     {
            //     dayInfo: {
            //         count: 10,
            //         area: 589.4758,
            //         price: 245780.25
            //     },
            //     list: [
            //         {
            //             title: '管理员',
            //             list: [
            //                 { title: '报价未下单', count: 4, area: 15.2347, price: 4875.21, perCount: '/' },
            //                 { title: '报价下单', count: 4, area: 15.2347, price: 4875.21, perCount: 2 },
            //                 { title: '返单', count: 1, area: 5.2347, price: 1200.45, perCount: 0 },
            //                 { title: '返单有改/样转批', count: 1, area: 5.2347, price: 1200.45, perCount: 0 },
            //                 { title: '合计', count: 10, area: 41.2347, price: 12000.45, perCount: 0 },
            //             ]
            //         },
            //         {
            //             title: '卢鹏',
            //             list: [
            //                 { title: '报价未下单', count: 4, area: 15.2347, price: 4875.21, perCount: '/' },
            //                 { title: '报价下单', count: 4, area: 15.2347, price: 4875.21, perCount: 2 },
            //                 { title: '返单', count: 1, area: 5.2347, price: 1200.45, perCount: 0 },
            //                 { title: '返单有改/样转批', count: 1, area: 5.2347, price: 1200.45, perCount: 0 },
            //                 { title: '合计', count: 10, area: 41.2347, price: 12000.45, perCount: 0 },
            //             ]
            //         }
            //     ]
            // }
            )
        }
        }, 1000)
        Taro.setNavigationBarTitle({title: typeList[options?.type]})
    })
    useDidShow(() => {
        setFirstShow(firstShow + 1)
        setTitle('')
    })

    const titleChange = (title) => {
        setTitle(title)
    }

    const backHandle = () => {
        if (isRedirect == 1) {
            // const pathArr = Taro.getCurrentPages()
            // console.log('pathArr:', pathArr)
            Taro.redirectTo({ url: '/pages/home/home' })
        } else {
            Taro.navigateBack({ delta: 1 })
        }
    }

    const toRecord = () => {
        Taro.navigateTo({ url: '/pages/emailRecord/index' })
    }
    return (
        <>
        <NavBar color={'#333'} title={title || typeList[type]} leftIconType={'chevron-left'} onClickLeftIcon={backHandle}></NavBar>
        <View className='daily-report'>
        {/* <ScrollView scrollY={true} className='daily-report'> */}
            {type == 1 ? <OperateReport echartsJs={echartsJs} count={firstShow}></OperateReport> : <></>}
            {type == 2 ? <Daily echartsJs={echartsJs} count={firstShow}></Daily> : <></>}
            {type == 3 ? <EngineeringDaily echartsJs={echartsJs} count={firstShow}></EngineeringDaily> : <></>}
            {type == 4 ? <ProductReport echartsJs={echartsJs} titleChange={titleChange} count={firstShow}></ProductReport> : <></>}
            {type == 5 ? <MarketReport echartsJs={echartsJs} count={firstShow}></MarketReport> : <></>}
        {/* </ScrollView> */}
        {/* <View style={'height: 300px;'}></View> */}
        </View>
        </>
    )
}
