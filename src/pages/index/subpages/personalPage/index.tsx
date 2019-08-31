import { Button, Form, Input, Label, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import QuestStore from 'src/store/quest';
// import AuthStore from 'src/store/auth'
import { AtAvatar } from 'taro-ui'
import './index.less';

interface PublishPageProps {
  questStore: QuestStore;
}

@inject(store => ({
  questStore: store.questStore,
}))
@observer
class PublishPage extends Taro.Component<PublishPageProps> {
  userInfo: Taro.getUserInfo.PromisedPropUserInfo ;
  public static defaultProps: PublishPageProps;

  public async componentDidMount() {
    await this.props.questStore.getUserInfo();
    console.log('state', this.props.questStore.userInfo);
  }

  public render() {
    return <View>
      <View className="container">
        <View className="userInfo">
          <AtAvatar image='https://jdc.jd.com/img/200' size="large" circle={true} />
          <View className="info">
            <View>xxx</View>
            <View>xx大学</View>
          </View>
        </View>
        <View className="buttonList">
          <Button size="mini" type="primary" className="publish">我发布的</Button>
          <Button size="mini" type="primary">我参与的</Button>
        </View>
        <View className="menu">
          <Button>我的钱包</Button>
          <Button>消息中心</Button>
          <Button>帮助中心</Button>
          <Button>投诉</Button>
        </View>
      </View>
    </View>;
  }
}

export default PublishPage;
