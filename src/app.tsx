import '@tarojs/async-await';
import { Provider } from '@tarojs/mobx';
import Taro, { Component, Config, stopRecord } from '@tarojs/taro';
import 'taro-ui/dist/style/index.scss';
import './app.less';
import Index from './pages/index';
import store from './store';

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  public config: Config = {
    pages: [
      'pages/index/index',
      'pages/quest-detail/index',
      'pages/im/index',
      'pages/msg-center/index',
      'pages/myTask/index',
      'pages/publish/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
      navigationBarTitleText: 'WeChat',
    },
  };

  public componentDidMount() {
    store.schoolConfig.getSchoolConfig();
  }

  public componentDidShow() { }

  public componentDidHide() {
  }

  public componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  public render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
