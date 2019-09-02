import { Button, Form, Input, Label, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import { PersonlStore } from 'src/store/personlStore';
import { AtButton, AtForm, AtInput } from 'taro-ui';
import Chatroom from './Chatroom'
import './index.less'

interface IMProps {
  personalStore: PersonlStore;
}

@inject(store => ({
  personalStore: store.personalStore,
}))
@observer
class IM extends Taro.Component<IMProps> {

  public static defaultProps: IMProps;

  public render() {
    return <View className="container">
      <Chatroom sessionId={this.$router.params.session_id}></Chatroom>
    </View>;
  }
}

export default IM;
