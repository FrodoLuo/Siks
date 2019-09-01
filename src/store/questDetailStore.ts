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

  @action
  public join(taskId: string) {
    cloud({
      name: 'addTaskLine',
      data: {
        taskId,
        action: 'join',
      },
    });
  }

  @action
  public passOn(taskId: string) {
    cloud({
      name: 'updateLinkStatus',
      data: {
        taskId,
        action: 'passOn',
      },
    });
  }

  @action
  public admit(taskId: string) {
    cloud({
      name: 'updateLinkStatus',
      data: {
        taskId,
        action: 'admit',
      },
    });
  }

  @action
  public showUp(taskId: string) {
    cloud({
      name: 'addTaskLine',
      data: {
        taskId,
        action: 'showUp',
      },
    });
  }

  @action
  public reject(taskId: string) {
    // todo
    cloud({
      name: 'updateLinkStatus',
      data: {
        taskId,
        action: 'reject',
      },
    });
  }

  @action
  public giveUp(taskId: string) {
    cloud({
      name: 'updateLinkStatus',
      data: {
        taskId,
        action: 'giveUp',
      },
    });
  }

  @action
  public share(taskId: string) {
  }
}

export default new QuestDetailStore();
