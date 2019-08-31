import { View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import { Component } from '@tarojs/taro';
import { ComponentType } from 'react';
import { QuestDetailStore } from 'src/store/questDetailStore';
import QuestDetailContent from './components/detail';
import Metadata from './components/metadata';
import './index.less';
import LinkRoadCard from './components/link-road';
interface QuestDetailPageProps extends Component {
  questDetailStore: QuestDetailStore;
}

@inject('questDetailStore')
@observer
class QuestDetailPage extends Component<QuestDetailPageProps> {

  public static defaultProps: QuestDetailPageProps;

  public componentDidMount() {
    const { id } = this.$router.params;
    this.props.questDetailStore.getDetail(id);
  }

  public switchQuestStatus = () => {
    switch (this.props.questDetailStore.currentQuest!) {
      // todo
    }
    return null;
  }
  public render() {
    const meta = this.props.questDetailStore.currentQuest;
    if (!meta) {
      return null;
    }
    return (
      <View className="page-content">
        <Metadata meta={meta} toggle={false} />
        <QuestDetailContent title={meta.title} content={meta.content} cover="" />
        <LinkRoadCard quest={meta} />
        <View className="btn-wrap">
          {this.switchQuestStatus()}
        </View>
      </View>);
  }
}

export default QuestDetailPage as ComponentType;
