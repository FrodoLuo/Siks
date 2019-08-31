import Taro from '@tarojs/taro';
import { action, observable } from 'mobx';
import { cloud } from '../utils/request';

export class AuthStatus {

  @observable public userInfo: Taro.getUserInfo.PromisedPropUserInfo | null = null;

  @action public async getUserInfo(first = false): Promise<boolean> {
    try {
      const result = await Taro.getUserInfo();
      this.userInfo = result.userInfo;
      console.log(this.userInfo);
      if (first) {
        this.uploadInfo();
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  public uploadInfo() {
    cloud({
      name: 'addUserinfo',
      data: {
        ...this.userInfo,
      },
    });
  }
}

export default new AuthStatus();

export interface UserInfo {
  icon_url: string;
  school: string;
  sex: number;
  nickname;
}
