import { Button, Form, Input, Label, View, Swiper, SwiperItem, Navigator, ScrollView, Text } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Config } from '@tarojs/taro';
import { PersonlStore } from 'src/store/personlStore';
import { AtAvatar } from 'taro-ui'
import './index.less';
import AuthComponent from '../../components/auth';

interface PublishPageProps {
  msgCenter: PersonlStore;
}

@inject('msgCenter')
@observer
class PublishPage extends Taro.Component<PublishPageProps> {
  userInfo: Taro.getUserInfo.PromisedPropUserInfo;
  public static defaultProps: PublishPageProps;

  public config: Config = {
    navigationBarTitleText: '我的消息',
  };

  public async componentDidMount() {
    // await this.props.msgCenter.getUserInfo();
    console.log('componentDidMount');

    await this.props.msgCenter.getMyMsg();
  }

  public render() {
    console.log('render!!!!!!!!');

    let myMsg = this.props.msgCenter.myMsg
    console.log('myMsg', myMsg);
    let userInfo = this.props.msgCenter.userInfo;
    // console.log(userInfo);
    return <View>
      <ScrollView className="chatMessage">
        <AuthComponent></AuthComponent>
        {myMsg.map(_ => {
          if (_.type == 'chatInvite') {
            return (
              <View onClick={() => {
                this.enterChatRoom(_.session_id)
              }} className="line">
                <View className="circle"></View>
                有人向您发起了聊天，快点击进入<Text className="link">聊天室</Text>吧~！
              </View>
            )
          } else if (_.type == 'chatInvite') {

          } return <View></View>
        })}
      </ScrollView>
    </View >;
  }

  enterChatRoom(sessionId) {
    Taro.navigateTo({
      url: `/pages/im/index?session_id=${sessionId}`,
    });
  }
}
export default PublishPage;
