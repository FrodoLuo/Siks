import { View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import QuestStore, { Quest } from 'src/store/quest';
import ItemCard from './components/item-card';
import './index.less';

interface PageStateProps {
  questStore: QuestStore;
}

@inject(store => ({
  questStore: store.questStore,
}))
@observer
class HallPage extends Taro.Component<PageStateProps> {

  // 注意这个defaultProps, 不带上这一行会导致typescript类型检查失败
  public static defaultProps: PageStateProps;

  public componentDidMount() {
    this.props.questStore.getQuests();
  }

  public renderItems(items: Quest[]) {
    return items.map(
      item => {
        return (
          <View className="card-wrap">
            <ItemCard quest={item} />
          </View>
        );
      },
    );
  }
  public render() {
    return (
      <View>
        <View>
          {this.renderItems(this.props.questStore.quests)}
        </View>
      </View>
    );
  }
}

export default HallPage;
