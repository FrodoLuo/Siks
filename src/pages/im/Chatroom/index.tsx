import { Button, Form, Input, Label, View, ScrollView, Image } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import QuestStore from 'src/store/quest';
import { AtButton, AtForm, AtInput } from 'taro-ui';

interface ChatRoomProps {
  questStore: QuestStore;
}

@inject(store => ({
  questStore: store.questStore,
}))
@observer
class ChatRoom extends Taro.Component<ChatRoomProps> {

  public static defaultProps: ChatRoomProps;

  public render() {
    let chats: any[] = [];
    let openId = '';
    return <View>
      <View className="chatroom">
        <View className="header">
          <View className="left"></View>
          <View className="middle">groupName</View>
          <View className="right"></View>
        </View>
        <ScrollView
          className="body"
          scroll-y
          scroll-with-animation="{{scrollWithAnimation}}"
          scroll-top="{{scrollTop}}"
          scroll-into-View="{{scrollToMessage}}"
          // bindscrolltoupper="onScrollToUpper"
        >
          {chats.map(item => (
            <View className={`message ${openId == item._openid ? 'message__self' : ''}`}>
              <Image
                className="avatar"
                src={item.avatar}
                mode="scaleToFill"
              ></Image>
              <View className="main">
                <View className="nickname">{item.nickName}</View>

                <View className="text-wrapper">
                  {item.writeStatus === 'pending' && <View>···</View>}
                  <View className="text-content">{item.textContent}</View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View className="footer">
          <View className="message-sender">
            <Input
              className="text-input"
              type="text"
              confirm-type="send"
              // bindconfirm="onConfirmSendText"
              cursor-spacing="20"
              value="{{textInputValue}}"
            ></Input>

            <Image
              src="./photo.png"
              className="btn-send-image"
              mode="scaleToFill"
            // bindtap="onChooseImage"
            ></Image>
          </View>

          <View className="message-sender">
            <Button
              open-type="getUserInfo"
              // bindgetuserinfo="onGetUserInfo"
              className="userinfo"
            >请先登录后参与聊天</Button>
          </View>
        </View >
      </View >


    </View >;
  }
}

export default ChatRoom;
