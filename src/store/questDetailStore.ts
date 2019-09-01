import { action, observable } from 'mobx';
import { cloud } from '../utils/request';
import { Quest } from './quest';

export class QuestDetailStore {

  @observable
  public currentQuest: Quest | null = null;

  @observable
  public questStatus: 'init' | 'token' | 'locked' | 'ended';

  @observable
  public found = false;

  @observable
  public currentLinkId: string | null = null;

  @action
  public async afterAction(taksId) {
    return await this.getDetail(taksId);
  }

  @action
  public async getDetail(id: string) {
    const res = await cloud({
      name: 'gettask',
      data: {
        _id: id,
        link_id: this.currentLinkId,
      },
    });
    this.currentQuest = res;
    if (this.currentQuest!.joined) {
      this.currentLinkId = this.currentQuest!.currentLines![0]._id;
    }
    return true;
  }

  @action
  public setCurrentLinkId(linkId: string) {
    this.currentLinkId = linkId;
  }

  @action
  public async join(task_id: string) {
    const res = await cloud({
      name: 'addTaskLine',
      data: {
        task_id,
        action: 'join',
      },
    });
    if (res) {
      return this.afterAction(task_id);
    } else {
      return null;
    }
  }

  @action
  public async passOn(task_id: string) {
    const res = await cloud({
      name: 'updateLinkStatus',
      data: {
        task_id,
        action: 'passOn',
        link_id: this.currentLinkId,
      },
    });
    if (res) {
      return this.afterAction(task_id);
    } else {
      return null;
    }
  }

  @action
  public async admit(task_id: string) {
    const res = await cloud({
      name: 'updateLinkStatus',
      data: {
        task_id,
        action: 'admit',
        link_id: this.currentLinkId,
      },
    });
    if (res) {
      return this.afterAction(task_id);
    } else {
      return null;
    }
  }

  @action
  public async showUp(task_id: string) {
    const res = await cloud({
      name: 'addTaskLine',
      data: {
        task_id,
        action: 'showUp',
      },
    });
    if (res) {
      return this.afterAction(task_id);
    } else {
      return null;
    }
  }

  @action
  public async reject(task_id: string) {
    // todo
    const res = await cloud({
      name: 'updateLinkStatus',
      data: {
        task_id,
        action: 'reject',
        link_id: this.currentLinkId,
      },
    });
    if (res) {
      return this.afterAction(task_id);
    } else {
      return null;
    }
  }

  @action
  public async giveUp(task_id: string) {
    const res = await cloud({
      name: 'updateLinkStatus',
      data: {
        task_id,
        action: 'giveUp',
        link_id: this.currentLinkId,
      },
    });
    if (res) {
      return this.afterAction(task_id);
    } else {
      return null;
    }
  }

  @action
  public async share(task_id: string) {
    this.found = true;
  }

  @action
  public resetShare() {
    this.found = false;
  }
}

export default new QuestDetailStore();
