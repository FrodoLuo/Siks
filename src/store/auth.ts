import Taro from '@tarojs/taro';
import { action, observable } from 'mobx';
import { cloud } from '../utils/request';

export default class AuthStatus {

  @observable public userInfo: Taro.getUserInfo.PromisedPropUserInfo | null = null;

  @action public async getUserInfo(first = false): Promise<boolean> {
    try {
      const result = await Taro.getUserInfo();
      this.userInfo = result.userInfo;
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
