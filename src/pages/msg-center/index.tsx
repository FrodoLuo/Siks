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
    await this.props.personalStore.getUserInfo();
  }

  public render() {
    let userInfo = this.props.personalStore.userInfo;
    // console.log(userInfo);
    return <View>
      <View className="box">
        <View className="chatMessage">

        </View>
      </View>
    </View>;
  }
}

export default PublishPage;
