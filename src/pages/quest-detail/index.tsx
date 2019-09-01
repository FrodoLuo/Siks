import { View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import { Component } from '@tarojs/taro';
import { ComponentType } from 'react';
import { QuestDetailStore } from 'src/store/questDetailStore';
import QuestDetailContent from './components/detail';
import LinkRoadCard from './components/link-road';
import Metadata from './components/metadata';

import { AtButton } from 'taro-ui';
import './index.less';
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

  public render() {
    const meta = this.props.questDetailStore.currentQuest;
    const service = this.props.questDetailStore;
    if (!meta) {
      return null;
    }
    return (
      <View className="page-content">
        <Metadata meta={meta} toggle={false} />
        <QuestDetailContent title={meta.title} content={meta.content} cover="" />
        <LinkRoadCard quest={meta} />
        <View className="btn-wrap">
          {
            meta.status === 'created'
              ? (<View>
                <AtButton onClick={() => service.showUp(meta._id)}>
                  是我
                </AtButton>
                <AtButton onClick={() => service.join(meta._id)}>
                  我来帮忙
                </AtButton>
              </View>)
              : null
          }
          {
            meta.status === 'passing'
              ? (<View>
                <AtButton onClick={() => service.share(meta._id)}>
                  我认识TA
              </AtButton>
                <AtButton onClick={() => service.passOn(meta._id)}>
                  接着找吧
              </AtButton>
              </View>)
              : null
          }
          {
            meta.status === 'suspect'
              ? (<View>
                <AtButton onClick={() => service.reject(meta._id)}>
                  不是我
                  {/* // 可能要改成拒绝或者之类的文案 */}
                </AtButton>
                <AtButton onClick={() => service.admit(meta._id)}>
                  是我
                  {/* // 可能要改成接受之类的文案 */}
                </AtButton>
              </View>)
              : null
          }
        </View>
      </View>);
  }
}

export default QuestDetailPage as ComponentType;
