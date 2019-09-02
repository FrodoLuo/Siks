import { Button, Form, Input, Label, View, ScrollView, Image } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro, { cloud as nativeCloud } from '@tarojs/taro';
import { PersonlStore, MessageClass, MaskStatus, MessageRes } from '../../../../src/store/personlStore';
import { AtButton, AtForm, AtInput } from 'taro-ui';
const phptoSrc = require('./photo.png');
import './index.less';

interface ChatRoomProps {
  personalStore: PersonlStore;
}


// const session_id = '0377e702-60c0-415a-a538-96b09f938037'

@inject('personalStore')
@observer
class ChatRoom extends Taro.Component<ChatRoomProps> {

  // public static
  public static defaultProps: ChatRoomProps;
  public timer;
  session_id: string

  constructor(props) {
    super(props)
    this.session_id = this.$router.params.session_id;
  }

  public state = {
    inputValue: ''
  };

  public onGetUserInfo() {
    this.props.personalStore.uploadUserInfo();
  }

  public async componentDidMount() {
    await this.props.personalStore.getUserInfo();

    await Promise.all([this.fetchMes(), this.fetchDetail()])

    this.timer = setInterval(() => {
      this.fetchMes()
    }, 1000)
  }

  public async fetchDetail() {
    await this.props.personalStore.getSessionDetail({
      session_id: this.session_id,
    })
  }

  public async fetchMes() {
    let userInfo = this.props.personalStore.userInfo;
    let msgList = await this.props.personalStore.pullMessage({
      session_id: this.session_id
    })
    console.log('chatTimes' + this.props.personalStore.chatTimes);

    // console.log('msgList!!!', msgList);

    let launchMaskMsg: MessageRes = this.props.personalStore.launchMaskMsg;
    let acceptMaskMsg: MessageRes = this.props.personalStore.acceptMaskMsg;
    // console.log('launchMaskMsg!!!!!', launchMaskMsg);
    if (launchMaskMsg && launchMaskMsg.content &&
      launchMaskMsg.content.type == MessageClass.launchMask) {
      // console.log('openid', launchMaskMsg.sender.openid, userInfo, userInfo.openid);
      if (launchMaskMsg.sender.openid == userInfo.openid) return;
      // this.fetchDetail();
      this.showAcceptMask();
    }

    if (acceptMaskMsg && acceptMaskMsg.content &&
      acceptMaskMsg.content.type == MessageClass.acceptMask) {
      // console.log('openid', acceptMaskMsg.sender.openid, userInfo, userInfo.openid);
      if (acceptMaskMsg.sender.openid == userInfo.openid) return;
      this.fetchDetail();
      // this.showAcceptMask();
    }

    return msgList;
  }

  public async showAcceptMask() {
    Taro.showModal({
      title: `Ta已上传照片，邀请您加入马赛克聊天`,
      content: '',
      cancelText: '拒绝',
      confirmText: '接受',
      success: (e) => {
        if (e.confirm) {
          this.showAcceptModal()
        } else {
          this.refuceMask()
        }
      }
    })

  }

  public async showAcceptModal() {
    Taro.showModal({
      title: `上传你的照片吧`,
      content: '',
      showCancel: false,
      success: () => {
        this.sendLauncherImg(MessageClass.acceptMask)
      },
    })
  }

  public async refuceMask() {
    await this.props.personalStore.pushMessage({
      session_id: this.session_id,
      type: MessageClass.refuseMask,
      data: {
      }
    })
    await this.fetchDetail();
  }


  public async launchMaskImgMode() {
    let sessionDetail = this.props.personalStore.sessionDetail
    let { status, finder, findee } = sessionDetail

    if ([MaskStatus.init].includes(status)) {
      Taro.showModal({
        title: '马赛克玩法',
        content: '游戏前聊天双方需上传个人照，游戏开始双方照片在聊天框置顶且为马赛克状态。双方聊天轮次越多，置顶照片越清晰，当聊天轮次超过15轮，置顶照片马赛克完全消失',
        success: (e) => {
          if (e.confirm) {
            this.showSendLauncherImgModal()
          }
        },
        fail: () => {
          console.log('fail');
        }
      })
    }
  }

  public async showSendLauncherImgModal() {
    Taro.showModal({
      title: `先上传照片吧`,
      content: '',
      showCancel: false,
      success: () => {
        this.sendLauncherImg(MessageClass.launchMask)
      },
    })
  }

  public async sendLauncherImg(type: MessageClass) {
    Taro.chooseImage({
      sourceType: ['album', 'camera'],
      count: 1,
      success: async (res) => {
        let url = res.tempFilePaths[0];
        console.log(url);
        const ret = await nativeCloud.uploadFile({
          cloudPath: `images/${Date.now()}.jpg`,
          filePath: url,
        });
        console.log(ret);
        this.launchMaskImg(ret.fileID, type)
      }
    })
  }

  public async launchMaskImg(fileID, type) {
    await this.props.personalStore.pushMessage({
      session_id: this.session_id,
      type,
      data: {
        imgUrl: fileID
      }
    })
    await this.fetchDetail();
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  public async sendMessage(text: string) {
    this.props.personalStore.pushMessage({
      session_id: this.session_id,
      type: MessageClass.text,
      data: {
        text
      },
    })
  }

  public render() {
    let userInfo = this.props.personalStore.userInfo;
    let chatTimes = this.props.personalStore.chatTimes
    console.log('render');
    console.log('userInfo', userInfo);

    let openId = userInfo && userInfo.openid;
    let sessionDetail = this.props.personalStore.sessionDetail

    let { status, finder, findee } = sessionDetail
    let isFinder = openId == (finder && finder.openid)
    let isFindee = openId == (findee && findee.openid)


    return <View className={`chatroom`}>
      <View className="header">
        <View className="left"></View>
        <View className="middle">聊天室</View>
        <View className="right"></View>
      </View>
      {status == MaskStatus.acceptMask && (<View className="maskList">
        <Image
          src={finder.url}
          className="mask"
          mode="aspectFit"
          style={{filter: `blur(${16-chatTimes}px)`}}
        ></Image>
        <Image
          src={findee.url}
          className="mask"
          mode="aspectFit"
          style={{filter: `blur(${16-chatTimes}px)`}}
        ></Image>
      </View>)}
      <ScrollView
        className={`body ${userInfo && userInfo.nickname ? '' : 'hidden'}`}
        scroll-y
        scroll-with-animation="{{scrollWithAnimation}}"
        scroll-top="{{scrollTop}}"
        scroll-into-View="{{scrollToMessage}}"
      // bindscrolltoupper="onScrollToUpper"
      >
        {this.props.personalStore.textMsgList.map(item => {
          console.log(item);
          return (<View className={`message ${openId == item.sender.openid ? 'message__self' : ''}`}>
            <Image
              className="avatar"
              src={item.sender && item.sender.icon_url}
              mode="scaleToFill"
            ></Image>
            <View className="main">
              <View className="nickname">{item.sender.nickname}</View>

              <View className="text-wrapper">
                {/* {item.writeStatus === 'pending' && <View>···</View>} */}
                <View className="text-content">{item.content.data.text}</View>
              </View>
            </View>
          </View>
          )
        })}
      </ScrollView>
      <View className="footer">
        {userInfo && userInfo.nickname && (
          <View className="message-sender">
            {(status !== MaskStatus.end &&
              <Image
                src={phptoSrc}
                className="btn-send-image"
                mode="scaleToFill"
                onClick={this.launchMaskImgMode}
              ></Image>)}
            <View className="text-input">
              <Input
                value={this.state.inputValue}
                name="message"
                className=""
                type="text"
                confirm-type="发送"
                onInput={
                  (e) => {
                    this.setState({
                      inputValue: e.detail.value
                    })
                  }
                }
                cursor-spacing="20"
                onConfirm={
                  (e) => {
                    this.sendMessage(e.detail.value);
                    this.setState({
                      inputValue: ''
                    })
                  }
                }
              ></Input>
            </View>
            <Button className="btn" onClick={() => {
              this.sendMessage(this.state.inputValue);
              this.setState({
                inputValue: ''
              })
            }}>
              发送
            </Button>
          </View>
        )}
        {
          (!userInfo) && (
            <View className="message-sender">
              <Button
                open-type="getUserInfo"
                className="userinfo"
                onGetUserInfo={this.onGetUserInfo}
              >请先登录后参与聊天</Button>
            </View>)
        }
      </View >
    </View >
  }
}

export default ChatRoom;
