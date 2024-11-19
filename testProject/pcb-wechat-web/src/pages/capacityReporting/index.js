import {useState} from "react";
import Taro, {useLoad, useUnload, useDidHide,useShareAppMessage} from '@tarojs/taro'
import { AtTabBar } from "taro-ui"
import Report from './report/report'
import ReportRecord from './reportRecord/index'
import './index.less'
import GFeedback from "../../components/g-feedback";


export default function CapacityReporting() {
    const [id, setId] = useState(0);
    const [search, setSearch] = useState('');
    const [current, setCurrent] = useState(0);
    useLoad(async (options) => {
        // console.log(options.id)
        setId(Number(options.id))
    })
    useShareAppMessage(() => {
      return {
        title: current == 0 ? '个人产能上报' : current == 1 ? '个人上报记录' : '部门上报记录',
        path: '/pages/index/index'
      }
    })
    useUnload(() => {
        // 离开页面时，清除扫码的结果
        Taro.removeStorageSync('code_data')
    })

    const handleClick = (e) => {
        // console.log(e)
        setCurrent(e)
        let title = ''
        if (e == 0) {
            title = '个人产能上报'
            // Taro.stopPullDownRefresh()
        } else if (e == 1) {
            title = '个人上报记录'
            // Taro.startPullDownRefresh()
        } else if (e == 2) {
            title = '部门上报记录'
            // Taro.startPullDownRefresh()
        }
        Taro.setNavigationBarTitle({
            title: title
        })
    }
    return (
        <view className="capacity-reporting">
            {
                current == 0 && (<Report></Report>)
            }
            {
                current == 1 && (<ReportRecord key='user-record' type={1}></ReportRecord>)
            }
            {
                current == 2 && (<ReportRecord key='dept-record' type={2}></ReportRecord>)
            }
            <AtTabBar
                fixed
                current={current}
                onClick={handleClick}
                // selectedColor={'#ffbc76'}
                tabList={[
                    { title: '个人产能上报', iconType: 'share-2' },
                    { title: '个人上报记录', iconType: 'numbered-list' },
                    { title: '部门上报记录', iconType: 'list' }
                ]}
            />
            <GFeedback></GFeedback>
        </view>
    )
}
