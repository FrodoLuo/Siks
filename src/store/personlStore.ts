import { action, observable } from 'mobx';
import { cloud } from '../utils/request';
import { Quest } from './quest';
import Taro from '@tarojs/taro';
// Taro.cloud.init()

// Taro.cloud.init();

type MessageType = {
  session_id: string,
  type: string,
  data: {
    text?
  }
}

type MessageRes = {
  timestamp: number;
  sender: any;
  content: {
    type: string;
    data: {
      text?: string
    }
  }
}

type PullReqType = {
  session_id: string,
  // timestamp: number
}

export class PersonlStore {
  @observable public msgList: MessageRes[] = []
  @observable public userInfo: any = {}

  @action public async getUserInfo() {
    cloud({
      name: 'getuserinfo',
    }).then(
      res => {
        this.userInfo = res;
      }
    )
  }

  @action public async uploadUserInfo() {
    const result = await Taro.getUserInfo();
    this.userInfo = result.userInfo;
    cloud({
      name: 'addUserinfo',
      data: {
        ...this.userInfo,
      },
    }).then(() => {
      this.getUserInfo()
    });
  }

  @action public pushMessage(data: MessageType) {
    cloud({
      name: 'push',
      data
    }).then(
      res => {
        console.log('res', res);
      }
    )
  }

  @action public async pullMessage(data: PullReqType) {

    let { session_id } = data;
    let msgList = await this.getLocalMessages(session_id);
    let timestamp = 0;
    if (msgList.length > 0) {
      timestamp = msgList[msgList.length - 1].timestamp
    }
    Object.assign(data, {
      timestamp // 带上缓存消息的最新事件戳
    })
    cloud({
      name: 'pull',
      data
    }).then(
      res => {
        if (!(res instanceof Array)) return;
        let newMsgList = [...msgList, ...res];
        if (res.length > 0 || this.msgList.length != newMsgList.length) {
          this.msgList = newMsgList;
          this.setLocalMessages(session_id, this.msgList);
        }
      }
    )
  }

  public async setLocalMessages(session_id, content: MessageRes[]) {
    try {
      await Taro.setStorage({
        key: `session_${session_id}`,
        data: JSON.stringify(content)
      })
      return true;
    } catch (err) {
      return false
    }
  }

  public async getLocalMessages(session_id): Promise<Array<MessageRes>> {
    try {
      let res = await Taro.getStorage({
        key: `session_${session_id}`,
      })
      return JSON.parse(res.data);
    } catch (e) {
      return []
    }
  }

}


export default new PersonlStore();
