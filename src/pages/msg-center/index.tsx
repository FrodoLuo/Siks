import { Button, Form, Input, Label, View, Swiper, SwiperItem, Navigator } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Config } from '@tarojs/taro';
import { PersonlStore } from 'src/store/personlStore';
import { AtAvatar } from 'taro-ui'
import './index.less';

interface PublishPageProps {
  personalStore: PersonlStore;
}

@inject(store => ({
  personalStore: store.personalStore,
}))
@observer
class PublishPage extends Taro.Component<PublishPageProps> {
  userInfo: Taro.getUserInfo.PromisedPropUserInfo;
  public static defaultProps: PublishPageProps;

  public config: Config = {
    navigationBarTitleText: '我的消息',
  };

  public async componentDidMount() {
    // await this.props.personalStore.getUserInfo();
    await this.props.personalStore.getMyMsg();
  }

  public render() {
    let myMsg = this.props.personalStore.myMsg
    console.log('myMsg', myMsg);
    let userInfo = this.props.personalStore.userInfo;
    // console.log(userInfo);
    return <View>
      <View className="chatMessage">
        {myMsg.map(_ => {
          console.log('_111', _);
          if (_.type == 'chatInvite') {
            console.log('match!!!');

            return (
              <View onClick={() => {
                this.enterChatRoom(_.session_id)
              }}>
                进入聊天室
              </View>
            )
          }
          return <View></View>
        })}
      </View>
    </View>;
  }

  enterChatRoom(sessionId) {
    Taro.navigateTo({
      url: `/pages/im/index?session_id=${sessionId}`,
    });
  }
}
export default PublishPage;
