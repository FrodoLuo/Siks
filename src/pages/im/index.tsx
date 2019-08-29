import { Button, Form, Input, Label, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import QuestStore from 'src/store/quest';
import { AtButton, AtForm, AtInput } from 'taro-ui';
import Chatroom from './Chatroom'

interface IMProps {
  questStore: QuestStore;
}

@inject(store => ({
  questStore: store.questStore,
}))
@observer
class IM extends Taro.Component<IMProps> {

  public static defaultProps: IMProps;

  public render() {
    return <View>
      <Chatroom></Chatroom>
    </View>;
  }
}

export default IM;
