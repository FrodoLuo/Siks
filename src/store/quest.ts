import { action, observable } from 'mobx';
import { cloud } from '../utils/request';
import { UserInfo } from './auth';

export class QuestStore {
  @observable public quests: Quest[] = [];

  @observable public currentSort: number = 0;
  @observable public currentSchool: number = 0;
  @observable public userInfo: any = {}

  @action public getQuests(start = 0, num = 10) {
    // Promise.resolve(questMock)
    //   .then(res => {
    //     this.quests = res;
    //   });
    cloud<Quest[]>({
      name: 'getTaskList',
      data: {
        num,
        start,
      },
    }).then(
      res => {
        console.log(res);
        this.quests = res;
      },
    );
  }

  public publish(quest: Quest) {
    cloud({
      name: 'addDbTask',
      data: quest,
    })
      .then(res => {
        console.log(res);
      });
  }

  public sum(a: number, b: number) {
    cloud({
      name: 'sum',
      data: {
        a, b,
      },
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
  published_time?: string;
  close_time?: string;
  consumed_num?: number;
  school: string;
  user: UserInfo;
}
