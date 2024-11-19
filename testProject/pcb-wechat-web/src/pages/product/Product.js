import {useState} from "react";
import {AtCard, AtForm, AtSearchBar,} from "taro-ui";
import {ScrollView, View} from '@tarojs/components'
import Taro, {useLoad} from '@tarojs/taro'
import './index.less'
import {getGlobalData} from "../../global";
import * as service from "../services/productService";
import GFeedback from "../../components/g-feedback";

export default function Product() {
  const scrollTop = 0
  const Threshold = 20
  const style = {
    height: getGlobalData('windowHeight'),
    backgroundColor: '#e4e4e4',
  }

  const [productList, setProductList] = useState([]);
  const [text, setText] = useState('');

  useLoad(() => {
    service.queryProduct({phoneNumber: Taro.getStorageSync("phoneNumber")}).then((res) => {
      setProductList(res.data);
    })
  });

  const onCardClick = (value) => {
    value = JSON.stringify(value);
    Taro.navigateTo({
      url: `/pages/product/components/Detail?param=${value}`,
    })
  }

  const onChange = (value) => {
    console.log("vlaue", value);
    setText(value);
  }

  const onSearch = () => {
    console.log("value123", text)
    service.queryProduct({phoneNumber: Taro.getStorageSync("phoneNumber"), productName: text}).then((res) => {
      setProductList(res.data);
    })
  }

  return (
    <>
      <View>
        <AtForm onSubmit={onSearch}>
          <AtSearchBar
            placeholder='请输入产品名称'
            actionName='搜索'
            value={text}
            onChange={onChange}
            onActionClick={onSearch}
          />
        </AtForm>
      </View>

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
        {productList.map((item) => {
          return <View>
            <AtCard
              extra={`订单状态：${item.orderStatusName}`}
              title={`订单数量：${item.orderNum}`}
              onClick={() => onCardClick(item)}
            >
              {item.productName}
            </AtCard>
          </View>
        })}
      </ScrollView>
      <GFeedback></GFeedback>
    </>
  )
}
