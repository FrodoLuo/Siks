import { Picker, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import QuestStore, { Quest } from 'src/store/quest';
import ItemCard from './components/item-card';
import './index.less';
import { AtIcon } from 'taro-ui';

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

  public sorts = [
    '按热度',
    '按时间',
  ];

  public schools = [
    '深圳大学',
    '南方科技大学',
    '南京大学',
  ];

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
  public refreshList = () => {
    this.props.questStore.getQuests();
  }
  public render() {
    return (
      <View>
        <View className="filter-container">
          <View className="filters">
            <Picker
              mode="selector"
              range={this.schools}
              value={this.props.questStore.currentSort}
              onChange={e => {
                this.props.questStore.currentSchool = e.detail.value;
                this.refreshList();
              }}
            >
              <View className="school">
                {this.schools[this.props.questStore.currentSchool]}
                <AtIcon value="chevron-down"></AtIcon>
              </View>
            </Picker>

          </View>
          <View className="sorts">
            <Picker
              mode="selector"
              range={this.sorts}
              value={this.props.questStore.currentSort}
              onChange={e => {
                this.props.questStore.currentSort = e.detail.value;
                this.refreshList();
              }}
            >
              <View className="sort">
                {this.sorts[this.props.questStore.currentSort]}
                <AtIcon value="chevron-down"></AtIcon>
              </View>
            </Picker>
          </View>
        </View>
        <View className="quest-container">
          {this.renderItems(this.props.questStore.quests)}
        </View>
      </View>
    );
  }
}

export default HallPage;
