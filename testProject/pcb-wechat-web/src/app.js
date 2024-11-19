import 'taro-ui/dist/style/index.scss'
import Taro, {useLaunch} from '@tarojs/taro'
import './app.less'
import {setGlobalData} from "./global";

function App({children}) {

  useLaunch(() => {
    // 获取屏幕高度
    Taro.getSystemInfo({
      success: function (res) {
        setGlobalData('platform', res.platform);
        setGlobalData('windowWidth', res.windowWidth);
        setGlobalData('windowHeight', res.windowHeight+'px');
        setGlobalData('menuButtonInfo', Taro.getMenuButtonBoundingClientRect());
        console.log("windowHeight", res.platform, res.windowWidth, res.windowHeight, Taro.getMenuButtonBoundingClientRect());
      }
    })
  });
  return children;
}

export default App
