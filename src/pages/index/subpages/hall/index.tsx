import { Picker, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import { Quest, QuestStore } from 'src/store/quest';
import school, { SchoolConfig } from 'src/store/school';
import { AtIcon, AtLoadMore } from 'taro-ui';
import ItemCard from './components/item-card';
import './index.less';

interface PageStateProps {
  questStore: QuestStore;
  schoolConfig: SchoolConfig;
}

@inject('schoolConfig')
@inject('questStore')
@observer
class HallPage extends Taro.Component<PageStateProps> {

  // 注意这个defaultProps, 不带上这一行会导致typescript类型检查失败
  public static defaultProps: PageStateProps;

  public sorts = [
    '按时间',
    '按热度',
    '按赏金',
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
    this.props.questStore.refreshList();
  }
  public render() {
    const schools = this.props.schoolConfig.schools;
    const currentSchool = schools[this.props.questStore.currentSchool];
    const t = currentSchool ? currentSchool.name : '';
    return (
      <View>
        <View className="filter-container">
          <View className="filters">
            <Picker
              mode="selector"
              range={schools.map(item => item.name)}
              value={this.props.questStore.currentSchool}
              onChange={e => {
                console.log(6666123);
                this.props.questStore.currentSchool = Number.parseInt(e.detail.value, 10);
                this.refreshList();
              }}
            >
              <View className="school">
                {t}
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
                this.props.questStore.currentSort = Number.parseInt(e.detail.value, 10);
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
        <AtLoadMore
          loadingText="加载中"
          noMoreText="已加载全部"
          status={this.props.questStore.listStatus}
          onClick={() => { this.props.questStore.getMore(); }}
        >
        </AtLoadMore>
      </View>
    );
  }
}

export default HallPage;
