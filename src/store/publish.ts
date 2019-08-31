import Taro, { cloud as nativeCloud } from '@tarojs/taro';
import { action, observable } from 'mobx';
import { cloud } from '../utils/request';

export interface FileItem {
  path: string;

  size: number;
}

export interface File {
  url: string;

  file?: FileItem;
}
export enum PUBLISH_STAGE {
  CONTENT_AND_IMG,
  DETAILING,
  POSITION,
  IDENTIFICATION,
  FINISHED,
}
export const schools = [
  '深圳大学',
  '南方科技大学',
  '南京大学',
];

export const expires = [
  '1天',
  '3天',
  '7天',
  '14天',
  '30天',
];
export class PublishController {

  // Stage One 标题内容与图片
  @observable public title: string = '';
  @observable public content: string = '';
  @observable public imageUrl: string = '';
  @observable public files: File[] = [];

  // Stage Two 地址赏金与时限
  @observable public school: number | null = null;
  @observable public gold: number | null = null;
  @observable public expire: number | null = null;

  // Stage Four 实名
  @observable public name: string = '';
  @observable public school__: string = '';
  @observable public selfDescription: string = '';

  @observable public currentStage: PUBLISH_STAGE = PUBLISH_STAGE.CONTENT_AND_IMG;

  @observable public onShareMessage: any = null;

  public getImage(): string {
    return this.files[0] ? this.files[0].url : '';
  }

  public contentValid(): boolean {
    return (
      this.title.length > 0
      && this.content.length > 0
    );
  }

  public valid(): boolean {
    const base = (
      this.title.length > 0
      && this.content.length > 0
      && !!this.school
      && !!this.gold
      && !!this.expire
    );
    if (this.currentStage === PUBLISH_STAGE.DETAILING) {
      return base;
    } else if (this.currentStage === PUBLISH_STAGE.IDENTIFICATION) {
      return (
        base
        && this.name.length > 0
        && this.school__.length > 0
        && this.selfDescription.length > 0
      );
    } else {
      return false;
    }
  }

  @action public reset() {
    this.title = '';
    this.content = '';
    this.files = [];
    this.school = null;
    this.gold = null;
    this.expire = null;
    this.name = '';
    this.school__ = '';
  }

  @action public update(key, value) {
    this[key] = value;
  }

  @action public async uploadFiles(files: File[]) {
    const file = files[0] || null;
    if (!file) { return null; }
    this.files = files;
    const res = await nativeCloud.uploadFile({
      cloudPath: `images/${Date.now()}.jpg`,
      filePath: file.url,
    });
    console.log(res);
    this.imageUrl = res.fileID;
    return res;
  }

  @action public async publish(): Promise<number | false> {
    const data = {
      content: this.content,
      expire: this.expire,
      files: this.files,
      gold: this.gold,
      name: this.name,
      school: this.school,
      school__: this.school__,
      selfDescription: this.selfDescription,
      title: this.title,
    };
    const res = await cloud({
      name: 'addDbTask',
      data,
    });
    if (res._id) {
      Taro.navigateTo({
        url: `/pages/quest-detail/index?id=${res._id}`,
      });
    }
    this.currentStage = PUBLISH_STAGE.FINISHED;
    return false;
  }
}

export default new PublishController();
