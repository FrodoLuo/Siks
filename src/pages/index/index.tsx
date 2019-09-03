import { Button, Image, Text, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { ComponentType } from 'react';
import { AtButton, AtModal, AtTabBar, AtIcon } from 'taro-ui';

import AuthComponent from '../../components/auth';
import { AuthStatus } from '../../store/auth';
import './index.less';
import HallPage from './subpages/hall';
import PersonalPage from './subpages/personalPage';

interface PageStateProps {
  authStatus: AuthStatus;
}

interface Index {
  props: PageStateProps;
}

@inject(store => ({
  authStatus: store.authStatus,
}))
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

  public state = {
    authorized: null,
    current: 0,
  };

  public componentWillMount() { }

  public componentDidMount() {

  }

  public componentWillUnmount() { }

  public componentDidShow() { }

  public componentDidHide() { }

  public handleNav = event => {
    if (event === 1) {
      Taro.navigateTo({
        url: '/pages/publish/index',
      });
    } else {
      this.setState({ current: event });
    }
  }

  public closeAuth = () => {
    this.props.authStatus.getUserInfo(true);
    this.setState({
      authorized: true,
    });
  }

  public render() {
    return (
      <View className="index">
        <View className="tab-wrap" hidden={this.state.current === 1}>
          <View
            onClick={() => this.handleNav(0)}
            className={`tab-btn ${this.state.current === 0 ? 'active' : ''}`}
          >
            <AtIcon value="eye" size="28"></AtIcon>
            发现
          </View>
          <View
            onClick={() => this.handleNav(1)}
            className={`add-btn tab-btn`}
          >
            <AtIcon value="add"></AtIcon>
          </View>
          <View
            onClick={() => this.handleNav(2)}
            className={`tab-btn ${this.state.current === 2 ? 'active' : ''}`}
          >
            <AtIcon value="home" size="28"></AtIcon>
            我的
          </View>
        </View>
        {
          this.state.current === 0
            ? <View className="page-content"><HallPage /></View>
            : null
        }{
          this.state.current === 2
            ? <View className="page-content"><PersonalPage /></View>
            : null
        }
      </View>
    );
  }
}

export default Index as ComponentType;
