import { action, observable } from 'mobx';
import { cloud } from '../utils/request';
import { UserInfo } from './auth';
import schoolStore from './school';

export class QuestStore {
  @observable public quests: Quest[] = [];

  @observable public currentSort: number = 0;
  @observable public currentSchool: number = 0;
  @observable public listStatus: 'more' | 'loading' | 'noMore' = 'more';

  @action public getQuests(start = 0, num = 10) {
    this.listStatus = 'loading';
    // Promise.resolve(questMock)
    //   .then(res => {
    //     this.quests = res;
    //   });
    cloud<Quest[]>({
      name: 'getTaskList',
      data: {
        num,
        start,
        sort: this.currentSort,
        school: schoolStore.schools[this.currentSchool] ? schoolStore.schools[this.currentSchool]._id : '',
      },
    }).then(
      res => {
        console.log(res);
        this.quests = res;
        this.listStatus = res.length < 10 ? 'noMore' : 'more';
      },
    );
  }

  @action public refreshList() {
    this.quests = [];
    this.getQuests();
  }

  @action public getMore() {
    this.listStatus = 'loading';
    cloud<Quest[]>({
      name: 'getTaskList',
      data: {
        num: 10,
        start: this.quests.length,
        sort: this.currentSort,
        school: schoolStore.schools[this.currentSchool] ? schoolStore.schools[this.currentSchool]._id : '',
      },
    }).then(res => {
      this.quests = this.quests.concat(res);
      this.listStatus = res.length < 10 ? 'noMore' : 'more';
    });
  }

  @action
  public accept(actId: string) {
    // 分享
  }

  @action
  public pass(actId: string) {
    // 分享
  }

  @action
  public admit(actId: string) {
    // todo
  }

  @action
  public found(actId: string) {
    // 分享
  }

  @action
  public reject(actId: string) {
    // todo
  }

  @action
  public giveUp(actId: string) {
    // refresh
  }
}

export default new QuestStore();

export interface Quest {
  _id: string;
  title: string;
  gold: number;
  content: string;
  cover?: string | null;
  published_time?: string;
  close_time?: string;
  consumed_num?: number;
  school: string;
  user: UserInfo;
}
