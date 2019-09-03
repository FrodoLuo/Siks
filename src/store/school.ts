import { action, observable } from 'mobx';
import { cloud } from '../utils/request';

export class SchoolConfig {
  @observable
  public schools: Array<{ school: string; _id: string; }> = [];

  @action
  public getSchoolConfig() {
    cloud({
      name: 'getschoolist',
    })
      .then(res => {
        console.log('school', res);
        this.schools = res;
      });
  }
}

export default new SchoolConfig();
