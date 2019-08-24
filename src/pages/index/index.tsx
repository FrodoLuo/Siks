import { Button, Text, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Component, Config } from '@tarojs/taro';
import { ComponentType } from 'react';
import { AtButton, AtModal, AtTabBar } from 'taro-ui';

import AuthStatus from '../../store/auth';
import './index.less';
import HallPage from './subpages/hall';
import PublishPage from './subpages/publish';

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
    this.props.authStatus.getUserInfo()
      .then(res => {
        this.setState({
          authorized: res,
        });
      });
  }

  public componentWillUnmount() { }

  public componentDidShow() { }

  public componentDidHide() { }

  public handleNav = event => {
    this.setState({ current: event });
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
        {this.state.authorized === false
          ? (
            <AtModal isOpened closeOnClickOverlay={false}>
              <View>登录小程序, 加入六度寻人</View>
              <AtButton
                openType="getUserInfo"
                type="primary"
                onGetUserInfo={this.closeAuth}
              >
                登录
              </AtButton>
            </AtModal>
          )
          : null
        }
        <AtTabBar
          fixed={true}
          current={this.state.current}
          tabList={[
            { title: '首页', iconType: 'home' },
            { title: '发布', iconType: 'add' },
            { title: '我的', iconType: 'user' },
          ]}
          onClick={this.handleNav}
        >
        </AtTabBar>
        {
          this.state.current === 0
            ? <View className="page-content"><HallPage /></View>
            : null
        }{
          this.state.current === 1
            ? <View className="page-content"><PublishPage /></View>
            : null
        }
      </View>
    );
  }
}

export default Index as ComponentType;
