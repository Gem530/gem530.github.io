import {useState} from "react";
import Taro, {useLoad, useUnload, useDidHide, useShareAppMessage} from '@tarojs/taro'
import { AtTabBar } from "taro-ui"
import './index.less'
import { View } from '@tarojs/components'
// import MaterialReport from "../materialRequisition/materialReport/index";
import MaterialRecord from "../materialRequisition/materialRecord/index";


export default function ProcessMaterialRequisition() {
    // const [id, setId] = useState(0);
    const [search, setSearch] = useState('');
    const [current, setCurrent] = useState(0);
    useLoad(async (options) => {
        // console.log(options.id)
        // setId(Number(options.id))
    })
    useShareAppMessage(() => {
        return {
            title: current == 0 ? '物料请购审核' : '物料请购审核记录',
            path: '/pages/index/index'
        }
    })

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '物料请购审核'
            // Taro.stopPullDownRefresh()
        } else if (e == 1) {
            title = '物料请购审核记录'
            // Taro.removeStorageSync('car_data')
            // Taro.startPullDownRefresh()
        }
        Taro.setNavigationBarTitle({
            title: title
        })
    }
    return (
        <view className="material-page">
            {
                current == 0 && (<MaterialRecord type={2}></MaterialRecord>)
            }
            {
                current == 1 && (<MaterialRecord type={3}></MaterialRecord>)
            }
            <AtTabBar
                fixed
                current={current}
                onClick={handleClick}
                // selectedColor={'#ffbc76'}
                tabList={[
                    { title: '待审核', iconType: 'numbered-list' },
                    { title: '审核记录', iconType: 'list' },
                ]}
            />
        </view>
    )
}