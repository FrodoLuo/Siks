import Taro from '@tarojs/taro';
import { action, observable } from 'mobx';
import { cloud } from '../utils/request';
import { UserInfo } from './auth';
import schoolStore from './school';

export class QuestStore {
  @observable public quests: Quest[] = [];

  @observable public currentSort: number = 1;
  @observable public currentSchool: number = 0;
  @observable public listStatus: 'more' | 'loading' | 'noMore' = 'more';

  @action public getQuests(start = 0, num = 10) {
    this.listStatus = 'loading';
    if (start === 0 && num === 10) {
      this.quests = [];
    }
    // Promise.resolve(questMock)
    //   .then(res => {
    //     this.quests = res;
    //   });
    const currentSchool = schoolStore.schools[this.currentSchool];
    const schoolId = { ...currentSchool }._id || '';
    cloud<Quest[]>({
      name: 'getTaskList',
      data: {
        num,
        start,
        sort: this.currentSort,
        school: schoolId,
      },
    }).then(
      res => {
        this.quests = res;
        this.listStatus = res.length < 10 ? 'noMore' : 'more';
        Taro.stopPullDownRefresh();
      },
    )
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
}

export default new QuestStore();

export interface Quest {
  _id: string;
  title: string;
  gold: number;
  content: string;
  cover?: string | null;
  position: number;
  published_time?: string;
  close_time?: string;
  consumed_num?: number;
  currentLines?: Array<{
    _id: string;
    task_id: string;
    status: 'passing' | 'suspect' | 'success' | 'failed';
    sessionid: string;
    consumers: Array<
      {
        iconUrl: string;
        nickname: string;
      }
    >;
  }>;
  school: string;
  user: UserInfo;
  joined: boolean;
  key: string;
  status: 'created' | 'passing' | 'suspect' | 'failed' | 'success' | 'owner';
}
