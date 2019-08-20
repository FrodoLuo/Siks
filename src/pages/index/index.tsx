import { Button, Text, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { ComponentType } from 'react';
import { AtTabBar } from 'taro-ui';

import { get } from '../../utils/request';
import './index.less';
import HallPage from './subpages/hall';

interface PageStateProps {
  counterStore: {
    counter: number,
    increment: Function,
    decrement: Function,
    incrementAsync: Function,
  };
}

interface Index {
  props: PageStateProps;
}

@inject('counterStore')
@observer
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  public config: Config = {
    navigationBarTitleText: '大厅',
  };

  // public tabList = [
  //   <HallPage></HallPage>,
  // ];

  public state = {
    current: 0,
  };



  public componentWillMount() { }

  public componentDidMount() {
  }

  public componentWillUnmount() { }

  public componentDidShow() { }

  public componentDidHide() { }

  public increment = () => {
    const { counterStore } = this.props;
    counterStore.increment();
  }

  public decrement = () => {
    const { counterStore } = this.props;
    counterStore.decrement();
  }

  public incrementAsync = () => {
    const { counterStore } = this.props;
    counterStore.incrementAsync();
  }

  public handleNav = event => {
    console.log(event);
  }

  public render() {
    const { counterStore: { counter } } = this.props;
    return (
      <View className='index'>
        <HallPage></HallPage>
        <AtTabBar
          fixed={true}
          current={0}
          tabList={[
            {title: '首页', iconType: 'home'},
            {title: '发布', iconType: 'add'},
            {title: '我的', iconType: 'user'},
          ]}
          onClick={this.handleNav}
        >
        </AtTabBar>
      </View>
    );
  }
}

export default Index  as ComponentType;
