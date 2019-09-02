import { Button, Form, Input, Label, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
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

  public async componentDidMount() {
    await this.props.personalStore.getUserInfo();
  }

  public render() {
    let userInfo = this.props.personalStore.userInfo;
    // console.log(userInfo);
    return <View>
      <View className="container">
        <View className="userInfo">
          <AtAvatar image={userInfo.icon_url} size="large" circle={true} />
          <View className="info">
            <View>{userInfo.nickname}</View>
            <View>{userInfo.school.name}</View>
          </View>
        </View>
        <View className="buttonList">
          <Button size="mini" type="primary" className="publish">我发布的</Button>
          <Button size="mini" type="primary">我参与的</Button>
        </View>
        <View className="menu">
          <Button>我的钱包</Button>
          <Button onClick={
            () => {
              Taro.navigateTo({
                url: `/pages/msg-center/index`,
              });
            }
          }>消息中心</Button>
          <Button>帮助中心</Button>
          <Button>投诉</Button>
        </View>
      </View>
    </View>;
  }
}

export default PublishPage;
