import { Button, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { ComponentType } from 'react';
import { QuestDetailStore } from 'src/store/questDetailStore';
import QuestDetailContent from './components/detail';
import { EmptyRoadNodeItem, LinkRoadItem } from './components/link-road';
import Metadata from './components/metadata';

import quest from 'src/store/quest';
import { AtAvatar, AtButton, AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import './index.less';
interface QuestDetailPageProps extends Component {
  questDetailStore: QuestDetailStore;
}

@inject('questDetailStore')
@observer
class QuestDetailPage extends Component<QuestDetailPageProps> {

  public static defaultProps: QuestDetailPageProps;

  public state = {
    showShare: false,
  };

  public componentDidMount() {
    const { id, link_id } = this.$router.params;
    if (link_id && link_id != 'none') {
      this.props.questDetailStore.currentLinkId = link_id;
    } else {
      this.props.questDetailStore.currentLinkId = null;
    }
    this.props.questDetailStore.getDetail(id);
  }

  public onShareAppMessage() {
    const questStore = this.props.questDetailStore;
    return {
      title: this.props.questDetailStore.currentQuest!.title,
      path: `/pages/quest-detail/index?id=${this.$router.params.id}` +
        `&link_id=${questStore.currentLinkId}` +
        `&key=${questStore.currentQuest!.key}` +
        `&found=${questStore.found ? 1 : 0}`,
    };
  }

  public openShare = () => {
    this.setState({
      showShare: true,
    });
  }

  public closeShare = () => {
    this.setState({
      showShare: false,
    });
  }

  public enterChatroom = () => {
    // todo
  }

  public render() {
    console.info('params', this.$router.params);
    const meta = this.props.questDetailStore.currentQuest;
    console.log(meta);
    const service = this.props.questDetailStore;
    if (!meta) {
      return null;
    }
    const lines = meta.currentLines || [];
    return (
      <View className="page-content">
        <Metadata meta={meta} toggle={false} />
        <QuestDetailContent title={meta.title} content={meta.content} cover={meta.cover || ''} />
        <View>当前链路状态</View>
        <View className="link-road-wrap">
          {
            meta.status === 'owner'
              ? lines.map(line => (
                <View className="link-road-container">
                  {
                    line.consumers.map((consumer, index) => (
                      <View className="link-road-item-wrap">
                        <View className="link-road-item">
                          <View>
                            <AtAvatar
                              size="small"
                              image={consumer.icon_url}
                              openData={{ type: 'userAvatarUrl' }}
                              circle={true}
                            ></AtAvatar>
                          </View>
                          {
                            meta.position === line.consumers.length - 2 && index === line.consumers.length - 1
                              ? <View>踢人</View>
                              : null
                          }
                        </View>
                      </View>
                    ))
                  }
                  {
                    new Array(6 - line.consumers.length).fill(0).map(_ => (
                      <View className="link-road-item-wrap">
                        <View className="link-road-item">
                          <View><View className="empty"></View></View>
                        </View>
                      </View>
                    ))
                  }
                </View>
              ))
              : null
          }
        </View>
        <AtModal isOpened={this.state.showShare}>
          <AtModalHeader>转发找人</AtModalHeader>
          <AtModalContent>转发出去, 寻找那个TA吧!</AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeShare}>取消</Button>
            <Button openType="share">确认</Button>
          </AtModalAction>
        </AtModal>
        <View className="btn-wrap" hidden={meta.joined}>
          {
            meta.status === 'created'
              ? (<View>
                <AtButton onClick={() => service.showUp(meta._id)}>
                  是我
                </AtButton>
                <AtButton
                  onClick={() =>
                    service.join(meta._id)
                      .then(result => {
                        if (result) {

                        }
                      })
                  }
                >
                  我来帮忙
                </AtButton>
              </View>)
              : null
          }
          {
            meta.status === 'passing' && (this.$router.params.found !== '1')
              ? (<View>
                <AtButton onClick={() => {
                  service.share(meta._id);
                  this.openShare();
                }}>
                  我认识TA
              </AtButton>
                <AtButton openType="share" onClick={() => service.passOn(meta._id)}>
                  接着找吧
              </AtButton>
              </View>)
              : null
          }
          {
            meta.status === 'passing' && (this.$router.params.found === '1')
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
        <View>
          {
            meta.status === 'failed'
              ? '很遗憾, 链路已经失败'
              : meta.status === 'suspect'
                ? meta.joined && (meta.position === meta.currentLines![0].consumers.length)
                  ? <View><AtButton onClick={this.enterChatroom}>进入聊天室</AtButton></View>
                  : '链路已被锁定'
                : meta.status === 'success'
                  ? '任务已完成'
                  : null
          }
        </View>
      </View>);
  }
}

export default QuestDetailPage as ComponentType;
