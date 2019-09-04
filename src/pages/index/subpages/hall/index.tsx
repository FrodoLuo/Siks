import { Picker, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import quest, { Quest, QuestStore } from 'src/store/quest';
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
    '新鲜出炉',
    '今日精选',
    '赏金丰厚',
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
    const t = currentSchool ? currentSchool.school : '';
    const questStore = this.props.questStore;
    const schoolNames = schools.map(item => {
      const i = { ...item };
      console.log(i);
      return i.school || i.name;
    });
    console.log(schoolNames);
    return (
      <View className="page-content">
        <View className="filter-container">
          <View className="filters">
            <Picker
              mode="selector"
              range={schoolNames}
              value={this.props.questStore.currentSchool}
              onChange={e => {
                this.props.questStore.currentSchool = Number.parseInt(e.detail.value, 10);
                this.refreshList();
              }}
            >
              <View className="school">
                <AtIcon value="map-pin"></AtIcon>
                {t}
                <AtIcon value="chevron-down"></AtIcon>
              </View>
            </Picker>

          </View>
          <View className="sorts">
            <View
              onClick={() => { questStore.currentSort = 1; questStore.getQuests(); }}
              className={`sort-item ${questStore.currentSort === 1 ? 'active' : ''}`}
            >
              今日精选
            </View>
            <View
              onClick={() => { questStore.currentSort = 0; questStore.getQuests(); }}
              className={`sort-item ${questStore.currentSort === 0 ? 'active' : ''}`}
            >
              新鲜出炉
            </View>
            <View
              onClick={() => { questStore.currentSort = 2; questStore.getQuests(); }}
              className={`sort-item ${questStore.currentSort === 2 ? 'active' : ''}`}
            >
              赏金丰厚
            </View>
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
          customStyle={{ background: 'white' }}
          moreBtnStyle={{ border: 'none' }}
        >
        </AtLoadMore>
      </View>
    );
  }
}

export default HallPage;
