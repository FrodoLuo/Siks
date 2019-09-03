import { Button, Form, Input, Label, View, Swiper, SwiperItem, Navigator, ScrollView, Text } from '@tarojs/components';
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
  type = this.$router.params.type

  public config: Config = {
    navigationBarTitleText: '我的任务',
  };

  public async componentDidMount() {
    // await this.props.personalStore.getUserInfo();
    await this.props.personalStore.pullMyTask();
    await this.props.personalStore.pullMyLink();
  }

  public render() {
    let userInfo = this.props.personalStore.userInfo;
    // console.log(userInfo);
    return <View>

    </View >;
  }

  enterChatRoom(sessionId) {
    Taro.navigateTo({
      url: `/pages/im/index?session_id=${sessionId}`,
    });
  }
}
export default PublishPage;
