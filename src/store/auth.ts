import Taro from '@tarojs/taro';
import { action, observable } from 'mobx';
import { cloud } from '../utils/request';

export default class AuthStatus {

  @observable public userInfo: Taro.getUserInfo.PromisedPropUserInfo | null = null;

  @action public async getUserInfo(): Promise<boolean> {
    try {
      const result = await Taro.getUserInfo();
      this.userInfo = result.userInfo;
      return true;
    } catch (err) {
      return false;
    }
  }

  public uploadAvatar(url: string) {
    cloud({
      name: '',
      data: {
        url,
      },
    });
  }

  @action
  public async checkAuth(): Promise<boolean> {
    try {
      await Taro.authorize({ scope: 'scope.userInfo' });
      this.getUserInfo();
      return true;
    } catch (err) {
      return false;
    }
  }

}
