import { Button, Form, Image, Input, Label, Picker, Textarea, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import { AtButton, AtForm, AtImagePicker, AtInput, AtModal, AtSwitch, AtTextarea } from 'taro-ui';
import { expires, PUBLISH_STAGE, PublishController } from '../../store/publish';

import { SchoolConfig } from 'src/store/school';
import './index.less';

interface PublishPageProps {
  publishController: PublishController;
  schoolConfig: SchoolConfig;
}

@inject(store => ({
  publishController: store.publishController,
  schoolConfig: store.schoolConfig,
}))
@observer
class PublishPage extends Taro.Component<PublishPageProps> {

  public static defaultProps: PublishPageProps;

  public submit = event => {
    console.log('publish');
    this.props.publishController.publish()
      .then(() => { }, () => { });
  }

  public nextStage = () => {
    const t = this.props.publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
      ? PUBLISH_STAGE.DETAILING
      : PUBLISH_STAGE.CONTENT_AND_IMG;
    this.props.publishController.update('currentStage', t);
  }

  public handleFiles = async (files, type: string) => {
    switch (type) {
      case 'add': {
        const res = await this.props.publishController.uploadFiles(files);
        break;
      }
      case 'remove': {
        this.props.publishController.imageUrl = '';
        this.props.publishController.files = [];
      }
    }
  }

  public render() {
    const { publishController } = this.props;
    const schools = this.props.schoolConfig.schools;
    console.log(this.props.publishController);
    return (
      <View className="page-content">
        {
          publishController.currentStage === PUBLISH_STAGE.FINISHED
            ? (
              <View>
                <AtModal
                  isOpened={true}
                >
                  <View>
                    发布成功
                  <View className="form-item">
                      <AtButton type="primary" className="sik-btn" openType="share">转发给其他人</AtButton>
                    </View>
                  </View>
                </AtModal>
              </View>
            )
            : null
        }
        { // Stage 1 - 填写标题与上传图片
          publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
            ? (
              <View>
                <View className="form-item">
                  <Label className="label">
                    取个标题, 吸引更多人的注意
                  </Label>
                  <Input
                    type="text"
                    name="title"
                    className="sik-input input"
                    onInput={({ detail }) => publishController.update('title', detail.value)}
                    value={publishController.title}
                  ></Input>
                </View>
                <View className="form-item">
                  <Label className="label">
                    描述一下, 让大家帮你找到那个TA
                  </Label>
                  <Textarea
                    className="sik-input"
                    onInput={value => publishController.update('content', value.detail.value)}
                    value={publishController.content}
                    placeholder="输入寻人描述"
                  ></Textarea>
                </View>
                <View className="form-item">
                  <Label className="label">
                    添加一张照片
                  </Label>
                  <AtImagePicker
                    customStyle={{
                      pointerEvents: publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG ? 'all' : 'none',
                    }}
                    className="sik-image-picker"
                    onChange={this.handleFiles}
                    files={publishController.files || []}
                    showAddBtn={
                      publishController.files.length === 0
                      && publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
                    }
                    length={1}
                  ></AtImagePicker>
                </View>
              </View>
            )
            : null
        }
        {
          // Stage 2 - 填写位置, 赏金, 时限
          publishController.currentStage === PUBLISH_STAGE.DETAILING
            || publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION
            ? (
              <View>
                <View className="form-item">
                  <Label className="label">
                    你在哪看到TA的
                  </Label>
                  <Picker
                    mode="selector"
                    onChange={e => publishController.school = e.detail.value}
                    value={publishController.school || -1}
                    range={schools.map(item => item.name)}
                  >
                    <View className="picker">
                      {
                        (schoolIndex => {
                          const school = schools[schoolIndex];
                          if (school) {
                            return school.name;
                          } else {
                            return '';
                          }
                        })(publishController.school)
                      }
                    </View>
                  </Picker>
                </View>
                <View className="form-item">
                  <Label className="label">
                    填写一下赏金吧
                  </Label>
                  <Input
                    className="sik-input input"
                    name="gold"
                    onInput={({ detail }: any) => publishController.gold = Number.parseFloat(detail.value || 0)}
                    type="number"
                  ></Input>
                </View>
                <View className="form-item">
                  <Label className="label">
                    信息有效期是多久
                  </Label>
                  <Picker
                    mode="selector"
                    value={publishController.expire || -1}
                    onChange={v => publishController.expire = v.detail.value}
                    range={expires}
                  >
                    <View className="picker">
                      {
                        (expire => {
                          const e = expires[expire];
                          if (e) {
                            return e;
                          } else {
                            return '';
                          }
                        }
                        )(publishController.expire || -1)
                      }
                    </View>
                  </Picker>
                </View>
                {
                  false
                    ? (<View className="form-item">

                      <AtSwitch
                        title="实名"
                        checked={publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION}
                        onChange={value => {
                          publishController.currentStage = value ? PUBLISH_STAGE.IDENTIFICATION : PUBLISH_STAGE.DETAILING;
                        }
                        }
                      />
                    </View>)
                    : null
                }

              </View>
            )
            : null
        }
        {
          // Stage 4 - 填写实名信息
          publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION
            ? (
              <View>
                <View className="form-item">
                  <AtInput
                    title="姓名"
                    value={publishController.name}
                    onChange={(v: string) => publishController.name = v}
                    name="name"
                  ></AtInput>
                </View>
                <View className="form-item">
                  <AtInput
                    title="学校"
                    value={publishController.school__}
                    onChange={(v: string) => publishController.school__ = v}
                    name="school__"
                  ></AtInput>
                </View>
                <View className="form-item">
                  <AtInput
                    title="自我介绍"
                    value={publishController.selfDescription}
                    onChange={(v: string) => publishController.selfDescription = v}
                    name="selfDescription"
                  ></AtInput>
                </View>
              </View>
            )
            : null
        }
        <View className="btn-container">
          {
            publishController.currentStage === PUBLISH_STAGE.DETAILING
              || publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION
              ? (
                <View className="btn-wrap">
                  <AtButton type="primary" className="sik-btn"
                    onClick={
                      () => {
                        publishController.update('currentStage', PUBLISH_STAGE.CONTENT_AND_IMG);
                      }}
                    disabled={
                      !publishController.contentValid()
                    }
                  >
                    上一步
                  </AtButton>
                </View>
              )
              : null
          }
          {
            publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
              ? (
                <View className="btn-wrap">
                  <AtButton type="primary" className="sik-btn"
                    onClick={
                      () => {
                        publishController.update('currentStage', PUBLISH_STAGE.DETAILING);
                      }}
                    disabled={
                      !publishController.contentValid()
                    }
                  >
                    下一步
              </AtButton>
                </View>
              )
              : null
          }
          {
            (
              this.props.publishController.currentStage === PUBLISH_STAGE.DETAILING
              || this.props.publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION
            )
              ? (
                <View className="btn-wrap">
                  <AtButton type="primary" className="sik-btn"
                    disabled={!this.props.publishController.valid()}
                    onClick={this.submit}
                  >发布</AtButton>
                </View>
              )
              : null
          }
        </View>

      </View>
    );
  }
}

export default PublishPage;
