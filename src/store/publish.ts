import { action, observable } from 'mobx';

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
}

class PublishController {

  // Stage One 标题内容与图片
  @observable public title: string = '';
  @observable public content: string = '';
  @observable public files: File[] = [];

  // Stage Two 地址赏金与实现
  @observable public school: string = '';
  @observable public gold: number = 0;
  @observable public expire: string = 0;

  // Stage Four 实名
  @observable public name: string = '';
  @observable public school__: string = '';
  @observable public selfDescription: string = '';

  @observable public currentStage: PUBLISH_STAGE = PUBLISH_STAGE.CONTENT_AND_IMG;

  @action public update(key, value) {
    this[key] = value;
  }
}

export default PublishController;
