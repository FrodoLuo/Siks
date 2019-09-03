import { Button, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { Component } from '@tarojs/taro';
import { ComponentType } from 'react';
import { QuestDetailStore } from 'src/store/questDetailStore';
import QuestDetailContent from './components/detail';
import Metadata from './components/metadata';

import { AtAvatar, AtButton, AtModal, AtModalAction, AtModalContent, AtModalHeader } from 'taro-ui';
import AuthComponent from '../../components/auth';
import Loading from '../../components/loading';
import { AuthStatus } from '../../store/auth';
import { Quest } from '../../store/quest';
import './index.less';
interface QuestDetailPageProps extends Component {
  questDetailStore: QuestDetailStore;
  authStatus: AuthStatus;
}

enum Identity {
  VISITOR,          // 与任务无关的访问者
  OWNER,            // 任务的发起者
  PARTICIPATOR,     // 任务传递的参与者
  SUSPECT_TARGET,   // 任务链路的潜在目标
}

const VISITOR_TEXT = {
  exhausted: '任务链路已达上限',
  failed: '任务已经失败',
  success: '任务已成功',
};

const OWNER_TEXT = {
  failed: '很不幸, 任务已经失败了',
  owner: '任务进行中',
  success: '任务已成功',
};

const PARTICIPATOR_TEXT = {
  failed: '任务已失败',
  passing: '任务进行中',
  success: '任务已成功',
  suspect: '链路已建立, 请静候佳音',
};

@inject('questDetailStore')
@inject('authStatus')
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

  public componentWillUnmount() {
    this.props.questDetailStore.loading = true;
  }

  public onShareAppMessage = () => {
    const questStore = this.props.questDetailStore;
    console.log(questStore);
    const found = questStore.found;
    questStore.resetShare();

    const path = `/pages/quest-detail/index?id=${this.$router.params.id}` +
    `&link_id=${questStore.currentLinkId}` +
    `&key=${questStore.currentQuest!.key}` +
    `&found=${found ? '1' :'0'}`;

    console.log(path);
    return {
      path,
      title: this.props.questDetailStore.currentQuest!.title,
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

  public enterChatroom = (sessionId?: string) => {
    const lines = this.props.questDetailStore.currentQuest!.currentLines || [];
    const line = lines[0] || {};
    Taro.navigateTo({
      url: `/pages/im/index?session_id=${sessionId || line.sessionid}`,
    });
  }

  /**
   * 根据任务信息判断当前访问者的身份
   * @param quest 任务信息
   */
  public dispatchIdentity(quest: Quest): Identity {
    if (quest.status === 'owner') {
      return Identity.OWNER; // 任务发起人
    }
    if (!quest.joined) {
      return Identity.VISITOR; // 无关访问者
    } else {
      const lines = quest.currentLines || [];
      const line = lines[0] || null;
      const consumers = line ? line.consumers : [];
      if (quest.status === 'suspect') {
        if (quest.position === consumers.length - 1) {
          return Identity.SUSPECT_TARGET; // 潜在寻找目标
        } else {
          return Identity.PARTICIPATOR; // 参与者
        }
      } else {
        return Identity.PARTICIPATOR; // 参与者
      }
    }
  }

  /**
   * Holy Jesus! States here is extremly complicated!
   */
  public render() {
    console.log(this.$router.params);

    const store = this.props.questDetailStore;
    const quest = this.props.questDetailStore.currentQuest;
    if (!quest) {
      if (!store.loading) {
        Taro.showToast({
          title: '路径错误, 任务不存在',
          icon: 'error',
          duration: 3000,
        });
      }
      return null;
    }

    const loading = store.loading;

    /**
     * 首先需要判断访问者的身份, 现在一共存在这么四种身份
     * Owner = 任务发起者, Visitor = 没有参与的访问者, Participator = 参与者, Suspect Target = 潜在目标
     */
    const identity = this.dispatchIdentity(quest);

    const lines = quest.currentLines || [];

    const line = lines[0] || {};

    const isFoundedShare = (this.$router.params.found === '1') || false;

    const storeFound = this.props.questDetailStore.found;
    return (
      <View className="page-content">
        <AuthComponent />
        <AtModal
          isOpened={this.state.showShare}
        >
          <AtModalHeader>转发出去</AtModalHeader>
          <AtModalContent>{storeFound ? '转发给TA, 完成任务领取赏金!' : '转发任务, 让你认识的人来找到TA' }</AtModalContent>
          <AtModalAction>
            <Button onClick={_ => this.closeShare()}>取消</Button>
            <Button type="primary" openType="share" onClick={this.closeShare}>转发</Button>
          </AtModalAction>
        </AtModal>

        {
          loading
            ? <Loading />
            : null
        }

        { /* 确认为潜在对象的访问者只能看到进入匿名聊天的界面 */
          !loading && identity === Identity.SUSPECT_TARGET
            ? quest.status === 'suspect'
              ? (
                <View className="">
                  <View>{line!.consumers.length > 1
                    ? `经过${line!.consumers.length}人, TA终于找到了你`
                    : '这一定是缘分, 让你们在茫茫人群中相遇'
                  }</View>
                  <View className="avatar-wrap">
                    <AtAvatar image={quest.user.icon_url}></AtAvatar>
                    <AtAvatar image={this.props.authStatus.userInfo!.avatarUrl}></AtAvatar>
                  </View>
                  <View className="sik-btn-container center">
                    <AtButton type="primary" className="sik-btn" onClick={() => { this.enterChatroom(); }}>加入匿名聊天</AtButton>
                  </View>
                </View>
              ) : (
                <View className="hint">
                  {PARTICIPATOR_TEXT[quest.status]}
                </View>
              )
            : null
        }

        { /* 非潜在对象的所有访问者都能看到任务的详情 */
          !loading && (identity === Identity.OWNER || identity === Identity.PARTICIPATOR || identity === Identity.VISITOR)
            ? (
              <View>
                <Metadata meta={quest} toggle={false} />
                <QuestDetailContent title={quest.title} content={quest.content} cover={quest.cover || ''} />
              </View>
            )
            : null
        }

        { /* 只有参与者与任务发起者能看到链路状态 */
          !loading && (identity === Identity.OWNER || identity === Identity.PARTICIPATOR)
            ? (
              <View className="link-road-wrap">
                {
                  lines.map(l => (
                    <View className="link-road-container">
                      {
                        l.consumers.map((consumer, index) => (
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
                              { /*
                                // identity === Identity.PARTICIPATOR && quest.position === l.consumers.length - 2 && index === l.consumers.length - 1
                                //   ? <View>踢人</View>
                                //   : null
                              */}
                            </View>
                          </View>
                        ))
                      }
                    </View>
                  ))
                }
              </View>
            )
            : null
        }

        { /* 根据任务状态与身份的不同, 每个人看到的可操作性面板也不尽相同 */
          !loading && identity === Identity.VISITOR   /*对于访问者*/
            ? quest.status === 'created'  /* 任务还可以被接受*/
              ? (
                <View className="sik-btn-container">
                  <AtButton type="primary" className="sik-btn" onClick={() => store.showUp(quest._id)}>
                    是我
                  </AtButton>
                  <AtButton type="primary" className="sik-btn"
                    onClick={() =>
                      store.join(quest._id)
                        .then(result => {
                          if (result) {
                            this.openShare();
                          }
                        })
                    }
                  >
                    我来帮忙
                  </AtButton>
                </View>
              )
              : quest.status === 'passing'
                ? isFoundedShare /* 访问者还没有参与到任务中, 但TA被认为是潜在对象 */
                  ? (
                    <View className="sik-btn-container">
                      <AtButton type="primary" className="sik-btn" onClick={() => store.reject(quest._id)}>
                        残忍拒绝
                        {/* // 可能要改成拒绝或者之类的文案 */}
                      </AtButton>
                      <AtButton type="primary" className="sik-btn" onClick={() => store.admit(quest._id)}>
                        聊天试试
                        {/* // 可能要改成接受之类的文案 */}
                      </AtButton>
                    </View>
                  )
                  : ( /* 任务在传递中, 这是按照接茬的人来看, 因为这个页面是只能被分享出去的 */
                    <View className="sik-btn-container">
                      <AtButton
                        type="primary"
                        className="sik-btn"
                        onClick={() => {
                          store.share(true);
                          store.passOn(quest._id);
                          this.openShare();
                        }}
                      >
                        我认识TA
                      </AtButton>
                      <AtButton
                        type="primary"
                        className="sik-btn"
                        onClick={
                          () => {
                            store.share(false);
                            store.passOn(quest._id);
                            this.openShare();
                          }
                        }
                      >
                        接着找吧
                      </AtButton>
                    </View>
                  )
                : (<View className="hint">
                  {VISITOR_TEXT[quest.status]}
                </View>)
            : null
        }
        { /* 对于发起人 */
          !loading && identity === Identity.OWNER
            ? (<View className="hint">
              {OWNER_TEXT[quest.status]}
            </View>)
            : null
        }
        { /* 对于参与者 */
          !loading && identity === Identity.PARTICIPATOR
            ? quest.status === 'passing'
              ? quest.position === 5
                ? (
                  <View className="sik-btn-container">
                    <AtButton className="sik-btn">我认识TA</AtButton>
                    <AtButton className="sik-btn">放弃寻找</AtButton>
                  </View>
                )
                : quest.position === line.consumers.length - 1
                  ? (<View className="sik-btn-container">
                    <AtButton
                      className="sik-btn"
                      onClick={() => {
                        store.share(true);
                        this.openShare();
                      }}
                    >
                      可能是TA!
                    </AtButton>
                    <AtButton
                      className="sik-btn"
                      onClick={() => {
                        store.share(false);
                        this.openShare();
                      }}
                    >
                      转发出去
                    </AtButton>
                  </View>)
                  : (<View className="hint">
                    {PARTICIPATOR_TEXT[quest.status]}
                  </View>)
              : (<View className="hint">
                {PARTICIPATOR_TEXT[quest.status]}
              </View>)
            : null

        }
      </View>
    );
  }
}

export default QuestDetailPage as ComponentType;
