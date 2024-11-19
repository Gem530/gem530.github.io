import Taro, {useLoad} from "@tarojs/taro";
import {AtDrawer, AtFab, AtFloatLayout, AtTimeline} from 'taro-ui';
import { useState} from "react";
import {ScrollView, Text, View} from "@tarojs/components";
import {getGlobalData} from "../../../global";
import './index.less';

export default function Detail() {
  const scrollTop = 0
  const Threshold = 20
  const style = {
    height: getGlobalData('windowHeight'),
  }

  useLoad(() => {
    let value = JSON.parse(Taro.getCurrentInstance().router.params.param);
    let fields = [
      {name: '产品名称：', value: '', key: 'productName'},
      {name: '订单数量：', value: '', key: 'orderNum'},
      {name: '物料编码：', value: '', key: 'materialCode'},
      {name: '入库数量：', value: '', key: 'storageNum'},
      {name: '差额数量：', value: '', key: 'balanceNum'},
      {name: '订单状态：', value: '', key: 'orderStatusName'},
      {name: '表面处理：', value: '', key: 'surfaceTreatment'},
      {name: '字符：', value: '', key: 'font'},
      {name: '阻焊颜色：', value: '', key: 'solderColor'},
      {name: '发货时间：', value: '', key: 'deliverTime'},
      {name: '运单编号：', value: '', key: 'waybillCode'},
      {name: '发货数量：', value: '', key: 'deliverNum'}
    ]
    fields = fields.map(item => {
      item['value'] = value[item.key]
      return item;
    })
    setFieldObj(fields);
  });

  const [fieldObj, setFieldObj] = useState([]);
  const [isShow, setIsShow] = useState(false);

  const onChange = () =>{
    setIsShow(true)
  }
  return (
    <ScrollView
      className='scrollview'
      scrollY
      scrollWithAnimation
      scrollTop={scrollTop}
      style={style}
      lowerThreshold={Threshold}
      upperThreshold={Threshold}
      onScrollToUpper={() => {
      }}
      onScroll={() => {
      }}
    >
      {fieldObj.map(item => {
        return <View className='at-row'>
          <View className='at-col at-col-1 at-col--auto' style={{paddingLeft: '10px', fontWeight: "500"}}>
            {item.name}
          </View>
          <View className='at-col' style={{paddingRight: '10px'}}>{item.value}</View>
        </View>
      })}
      <AtFab onClick={onChange} size='small'>
        <Text className='fabTex'>生产流程</Text>
      </AtFab>
      {isShow &&<AtDrawer
        show={isShow}
        right
        mask
        onClose={()=>{setIsShow(false)}}
        width='80%'
      >
        <View className='drawer-item'>
          <AtTimeline
            pending
            items={[
              { title: '下单', content: ['2023-05-23 20:30'],color: 'green', icon: 'check-circle' },
              { title: '开料', content: ['2023-05-24 19:09'], icon: 'check-circle',color: 'green' },
              { title: '内层线路', content: ['2023-05-24 22:29'], icon: 'check-circle',color: 'green' },
              { title: '内层蚀刻', content: ['2023-05-26 13:20'], icon: 'check-circle',color: 'green' },
              { title: '内层蚀检', content: ['2023-05-26 13:20'], icon: 'check-circle' ,color: 'green'},
              { title: '压合', content: ['2023-05-27 16:51'], icon: 'check-circle' ,color: 'green'},
              { title: '外层钻孔', content: ['2023-05-27 16:51'], icon: 'check-circle',color: 'green' },
              { title: '除胶渣沉铜', content: ['2023-05-27 23:05'], icon: 'check-circle',color: 'green' },
              { title: '外层线路', content: ['2023-05-29 10:39'], icon: 'check-circle',color: 'green' },
              { title: '线检QC', content: ['2023-05-30 08:09'], icon: 'check-circle',color: 'green' },
              { title: '图形电镀', content: ['2023-05-30 08:09'], icon: 'check-circle' ,color: 'green'},
              { title: '退膜/蚀刻', content: ['2023-05-31 07:42'], icon: 'check-circle' ,color: 'green'},
              { title: '蚀检QC', content: ['2023-05-31 07:42'], icon: 'check-circle' ,color: 'green'},
              { title: '阻焊', content: ['2023-05-31 07:47'], icon: 'check-circle' ,color: 'green'},
              { title: '阻焊QC', content: ['2023-05-31 08:09'], icon: 'check-circle',color: 'green' },
              { title: '丝印字符', content: ['2023-05-31 12:09'], icon: 'check-circle',color: 'green' },
              { title: '文字后烤', content: ['2023-05-31 14:09'], icon: 'check-circle',color: 'green' },
              { title: '表面处理', content: ['2023-05-31 15:05'], icon: 'check-circle',color: 'green' },
              { title: '测试', content: ['2023-05-31 16:00'], icon: 'check-circle',color: 'green' },
              { title: '成形', content: [], icon: 'check-circle' ,color: 'grey'},
              { title: 'V-CUT', content: [], icon: 'check-circle',color: 'grey' },
              { title: 'FQC', content: [], icon: 'check-circle' ,color: 'grey'},
              { title: '包装', content: [], icon: 'check-circle' ,color: 'grey'}
            ]}
          >
          </AtTimeline>
        </View>
      </AtDrawer>}
    </ScrollView>
  )
}
