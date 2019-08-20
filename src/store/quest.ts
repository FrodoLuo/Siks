import { observable } from 'mobx';

const questStore = observable({
  quests: [],
  getQuests() {
    return Promise.resolve(questMock)
      .then(res => {
        this.quests = res;
      });
  },
});

export interface Quest {
  title: string;
  amount: number;
  date: string;
  description: string;
  area: string;
  cover: string | null;
}

const questMock: Quest[] = [
  {
    title: '寻找北门看见的穿白色上衣女生',
    amount: 100,
    date: '2019/08/22',
    description: '大约在今天(周五)上午在北门看见的一个穿着白色上衣的女生',
    area: '南京大学',
    cover: null,
  }, {
    title: '寻找北门看见的穿白色上衣女生',
    amount: 100,
    date: '2019/08/22',
    description: '大约在今天(周五)上午在北门看见的一个穿着白色上衣的女生',
    area: '南京大学',
    cover: null,
  }, {
    title: '寻找北门看见的穿白色上衣女生',
    amount: 100,
    date: '2019/08/22',
    description: '大约在今天(周五)上午在北门看见的一个穿着白色上衣的女生',
    area: '南京大学',
    cover: null,
  }, {
    title: '寻找北门看见的穿白色上衣女生',
    amount: 100,
    date: '2019/08/22',
    description: '大约在今天(周五)上午在北门看见的一个穿着白色上衣的女生',
    area: '南京大学',
    cover: null,
  },
];

export default questStore;
