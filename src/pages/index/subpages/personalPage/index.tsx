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
          <AtAvatar className="img" image={userInfo.icon_url} size="large" circle={true} />
          <View className="nickname">{userInfo.nickname}</View>
        </View>
        <View className="buttonList">
          <Button size="mini" type="primary" className="button" onClick={
            () => {
              Taro.navigateTo({
                url: `/pages/myTask/index?type=launch`,
              });
            }
          }>我发布的</Button>
          <Button size="mini" type="primary" className="button" onClick={
            () => {
              Taro.navigateTo({
                url: `/pages/myTask/index?type=join`,
              });
            }
          }>我参与的</Button>
        </View>
        <View className="menu">
          <View className="button" onClick = {
            () => Taro.showToast({
              title: '未完待续..',
              icon: 'none'
            })
          }>我的钱包</View>
          <View className="button" onClick={
            () => {
              Taro.navigateTo({
                url: `/pages/msg-center/index`,
              });
            }
          }>消息中心</View>
          <View className="button" onClick = {
            () => Taro.showToast({
              title: '未完待续..',
              icon: 'none'
            })
          }>帮助中心</View>
          <View className="button" onClick = {
            () => Taro.showToast({
              title: '未完待续..',
              icon: 'none'
            })
          }>投诉</View>
        </View>
      </View>
    </View>;
  }
}

export default PublishPage;
