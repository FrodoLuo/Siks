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
    imgUrl?: string,
  }
}

export type MessageRes = {
  timestamp: number;
  sender: any;
  content: {
    type: string;
    data: {
      text?: string,
      imgUrl?: string,
    }
  }
}

export enum MaskStatus {
  init = 'init',
  launchMask = 'launchMask',
  acceptMask = 'acceptMask',
  end = 'end',
}

type SessionDetail = {
  status: MaskStatus;
  wxid: string;
  taskid: string;
  findee: {
    openid: string;
    url: string
  }
  finder: {
    openid: string;
    url: string
  }
}

export enum MessageClass {
  text = 'text',
  askWechat = 'askWechat',
  launchMask = 'launchMask',
  acceptMask = 'acceptMask',
  refuseMask = 'refuseMask',
}


type PullReqType = {
  session_id: string,
  // timestamp: number
}

export class PersonlStore {
  @observable public textMsgList: MessageRes[] = []
  @observable public userInfo: any = {}
  //@ts-ignore
  @observable public sessionDetail: SessionDetail = {}
  @observable public launchMaskMsg: any = {}
  @observable public acceptMaskMsg: any = {}
  @observable public chatTimes: number = 0;
  @observable public myMsg: any = []

  @action public async getUserInfo() {
    let res = await cloud({
      name: 'getuserinfo',
    })
    this.userInfo = res;
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

  @action public async pushMessage(data: MessageType) {
    let res = await cloud({
      name: 'push',
      data
    })
    console.log('res', res);
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
    let res = await cloud({
      name: 'pull',
      data
    })
    // console.log('res', res);
    let newMsgList;
    if (!(res instanceof Array)) {
      newMsgList = [...msgList]
      res = []
    } else {
      newMsgList = [...msgList, ...res];
    }
    this.setLocalMessages(session_id, newMsgList);

    let newTextMsgList = newMsgList.filter(_ => (_.content.type == MessageClass.text));
    this.chatTimes = this.countTimes(newTextMsgList);

    if (this.textMsgList.length != newTextMsgList.length) { // 有新的文本消息
      this.textMsgList = newTextMsgList
    }

    let launchMaskMsgList = res.filter(_ => (_.content.type == MessageClass.launchMask))
    // console.log('launchMaskMsgList', launchMaskMsgList);
    if (launchMaskMsgList.length > 0) {
      this.launchMaskMsg = launchMaskMsgList.shift();
    } else {
      this.launchMaskMsg = []
    }

    let AcceptMaskMsgList = res.filter(_ => (_.content.type == MessageClass.acceptMask))
    // console.log('launchMaskMsgList', launchMaskMsgList);
    if (AcceptMaskMsgList.length > 0) {
      this.acceptMaskMsg = AcceptMaskMsgList.shift();
    } else {
      this.acceptMaskMsg = []
    }
  }

  public countTimes(newTextMsgList: MessageRes[]) {
    let count = 0;
    let openid = ''
    newTextMsgList.forEach(msg => {
      if (msg.sender.openid !== openid) {
        openid = msg.sender.openid
        count++
      }
    });
    return count;
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

  public async getSessionDetail(data) {
    try {
      cloud({
        name: 'getDetail',
        data
      }).then(
        res => {
          console.log('res', res);
          this.sessionDetail = res
        }
      )
    } catch (e) {
      //@ts-ignore
      this.sessionDetail = {}
    }
  }

  public async endSession(data){
    let res = await cloud({
      name: 'confirmFindee',
      data
    });
  }

  @action public async getMyMsg() {
    let res = await cloud({
      name: 'message'
    })
    this.myMsg = res
  }

}


export default new PersonlStore();
