import { Button, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import { AuthStatus } from '../../store/auth';

interface AuthComponentProps {
  authStatus: AuthStatus;
  onCancel: () => void;
}

@inject('authStatus')
@observer
class AuthComponent extends Component<AuthComponentProps> {
  public static defaultProps: AuthComponentProps;

  public state = {
    show: false,
  };

  public componentDidMount() {
    this.props.authStatus.getUserInfo()
      .then(res => {
        if (!res) {
          this.setState({
            show: true,
          });
        }
      });
  }

  public render() {
    return (
      <AtModal
        isOpened={this.state.show}
        closeOnClickOverlay={false}
      >
        <AtModalHeader>授权登录</AtModalHeader>
        <AtModalContent>授权六度参与找人</AtModalContent>
        <AtModalAction>
          <Button
            onClick={() => {
              Taro.getCurrentPages().length > 1 ?
                Taro.navigateBack()
                : Taro.redirectTo({
                  url: '/pages/index/index',
                });
            }}
          >取消</Button>
          <Button
            openType="getUserInfo"
            onGetUserInfo={() => {
              this.props.authStatus.getUserInfo(true);
              this.setState({
                show: false,
              });
            }}
          >授权</Button>
        </AtModalAction>
      </AtModal>
    );
  }
}

export default AuthComponent;
