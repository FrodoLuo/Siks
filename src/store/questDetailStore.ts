import { action, observable } from 'mobx';
import { cloud } from '../utils/request';
import { Quest } from './quest';

export class QuestDetailStore {

  @observable
  public currentQuest: Quest | null = null;

  @observable
  public questStatus: 'init' | 'token' | 'locked' | 'ended';

  @action
  public async getDetail(id: string) {
    const res = await cloud({
      name: 'gettask',
      data: {
        _id: id,
      },
    });
    this.currentQuest = res;
  }
}


export default new QuestDetailStore();
