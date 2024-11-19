import {useState} from "react";
import Taro, {useLoad, usePullDownRefresh, useDidShow, useShareAppMessage} from '@tarojs/taro'
import { AtTabBar } from "taro-ui"
// import Report from './report/report'
import WorkRecord from './workRecord/index'
import ProcessRecord from './processRecord/index'
import './index.less'


export default function Process() {

    const [id, setId] = useState(0);
    const [search, setSearch] = useState('');
    const [current, setCurrent] = useState(0);
    const [random, setRandom] = useState(undefined)
    useLoad(async (options) => {
        console.log(options.id)
        setId(Number(options.id))
    })
    useDidShow(() => {
        // console.log(1111)
        setRandom(Math.random())
    })

    // usePullDownRefresh(() => {
    //     console.log(111)
    //     Taro.stopPullDownRefresh()
    // })
    useShareAppMessage(() => {
        return {
            title: current == 0 ? '个人产能审核' : '审核记录',
            path: '/pages/index/index'
        }
    })

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '个人产能审核'
        } else if (e == 1) {
            title = '审核记录'
        }
        Taro.setNavigationBarTitle({
            title: title
        })
    }
    return (
        <view className="capacity-reporting">
            {
                // current == 0 && (<ProcessRecord key='user-record' type={1} random={random}></ProcessRecord>)
                current == 0 && (<WorkRecord key='user-record' type={1} random={random}></WorkRecord>)
            }
            {
                current == 1 && (<ProcessRecord key='dept-record' type={2} random={random}></ProcessRecord>)
            }
            <AtTabBar
                fixed
                current={current}
                onClick={handleClick}
                // selectedColor={'#ffbc76'}
                tabList={[
                    { title: '待审核', iconType: 'numbered-list' },
                    { title: '审核记录', iconType: 'list' }
                ]}
            />
        </view>
    )
}
