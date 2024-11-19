import {useState} from "react";
import Taro, {useLoad, useUnload, useDidHide, useShareAppMessage} from '@tarojs/taro'
import { AtTabBar } from "taro-ui"
import './index.less'
import { View } from '@tarojs/components'
import MaterialReport from "./materialReport/index";
import MaterialRecord from "./materialRecord/index";


export default function MaterialRequisition() {
    const [id, setId] = useState(0);
    const [search, setSearch] = useState('');
    const [current, setCurrent] = useState(0);
    useLoad(async (options) => {
        // console.log(options.id)
        setId(Number(options.id))
    })
    useShareAppMessage(() => {
        return {
            title: current == 0 ? '物料请购申请' : '物料请购记录',
            path: '/pages/index/index'
        }
    })

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '物料请购申请'
            // Taro.stopPullDownRefresh()
        } else if (e == 1) {
            title = '物料请购记录'
            Taro.removeStorageSync('car_data')
            // Taro.startPullDownRefresh()
        }
        Taro.setNavigationBarTitle({
            title: title
        })
    }
    return (
        <view className="material-page">
            {
                current == 0 && (<MaterialReport type={1}></MaterialReport>)
            }
            {
                current == 1 && (<MaterialRecord type={1}></MaterialRecord>)
            }
            <AtTabBar
                fixed
                current={current}
                onClick={handleClick}
                // selectedColor={'#ffbc76'}
                tabList={[
                    { title: '我要申请', iconType: 'share-2' },
                    { title: '申请记录', iconType: 'list' },
                ]}
            />
        </view>
    )
}