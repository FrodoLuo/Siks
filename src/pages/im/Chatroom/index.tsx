import { Button, Form, Input, Label, View, ScrollView, Image } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import { PersonlStore } from 'src/store/personlStore';
import { AtButton, AtForm, AtInput } from 'taro-ui';
const phptoSrc = require('./photo.png');
import './index.less';

interface ChatRoomProps {
  personalStore: PersonlStore;
}

enum MessageClass {
  text = 'text',
}

const session_id = '5d262bd45d6a63b60ea4d22250c2bf03'

@inject('personalStore')
@observer
class ChatRoom extends Taro.Component<ChatRoomProps> {

  // public static
  public static defaultProps: ChatRoomProps;
  public timer;

  constructor(props) {
    super(props)
  }

  public state = {
    inputValue: ''
  };

  public onGetUserInfo() {
    this.props.personalStore.uploadUserInfo();
  }

  public async componentDidMount() {
    await this.props.personalStore.getUserInfo();
    await this.props.personalStore.pullMessage({
      session_id
    })
    this.timer = setInterval(() => {
      this.props.personalStore.pullMessage({
        session_id
      })
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  public async sendMessage(text: string) {
    this.props.personalStore.pushMessage({
      session_id,
      type: MessageClass.text,
      data: {
        text
      },
    })
  }

  public render() {
    let userInfo = this.props.personalStore.userInfo;
    console.log('render');
    console.log(userInfo);

    let openId = userInfo && userInfo.openid;
    return <View className={`chatroom`}>
      <View className="header">
        <View className="left"></View>
        <View className="middle">聊天室</View>
        <View className="right"></View>
      </View>
      <ScrollView
        className={`body ${userInfo && userInfo.nickname ? '' : 'hidden'}`}
        scroll-y
        scroll-with-animation="{{scrollWithAnimation}}"
        scroll-top="{{scrollTop}}"
        scroll-into-View="{{scrollToMessage}}"
      // bindscrolltoupper="onScrollToUpper"
      >
        {this.props.personalStore.msgList.map(item => {
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

            <Image
              src={phptoSrc}
              className="btn-send-image"
              mode="scaleToFill"
            // bindtap="onChooseImage"
            ></Image>
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
