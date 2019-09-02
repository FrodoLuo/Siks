import { action, observable } from 'mobx';
import { cloud } from '../utils/request';

export class SchoolConfig {
  @observable
  public schools: Array<{ name: string; _id: string; }> = [];

  @action
  public getSchoolConfig() {
    cloud({
      name: 'getschoolist',
    })
      .then(res => {
        console.log(res);
        this.schools = res;
      });
  }
}

export default new SchoolConfig();
