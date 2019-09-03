import { Button, Form, Input, Label, View, Swiper, SwiperItem, Navigator, ScrollView, Text } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Config } from '@tarojs/taro';
import { PersonlStore } from 'src/store/personlStore';
import { AtAvatar } from 'taro-ui'
import './index.less';
import ItemCard from '../../pages/index/subpages/hall/components/item-card';

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
    console.log('render!!!!!');

    let userInfo = this.props.personalStore.userInfo;
    // console.log(userInfo);
    let taskList = this.props.personalStore.myTaskList;
    let linkList = this.props.personalStore.myLink;

    console.log('type' , this.type ,'launch', this.type == 'launch');

    console.log('taskList', taskList);

    return <View>
      {this.type == 'launch' && <ScrollView>
        {taskList.map(item => {
          console.log('item', item);
          return (<ItemCard quest={item}></ItemCard>)
        })}
      </ScrollView>}
      {this.type == 'join' && <ScrollView>

      </ScrollView>}
    </View >;
  }

  enterChatRoom(sessionId) {
    Taro.navigateTo({
      url: `/pages/im/index?session_id=${sessionId}`,
    });
  }
}
export default PublishPage;
