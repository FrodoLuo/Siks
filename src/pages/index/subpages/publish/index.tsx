import { Button, Form, Image, Input, Label, Picker, PickerView, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import { AtButton, AtForm, AtImagePicker, AtInput, AtModal, AtSwitch, AtTextarea } from 'taro-ui';
import { expires, PUBLISH_STAGE, PublishController } from '../../../../store/publish';

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

  public handleFiles = async files => {
    const res = await this.props.publishController.uploadFiles(files);
  }

  public render() {
    const { publishController } = this.props;
    const schools = this.props.schoolConfig.schools;
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
                      <AtButton openType="share">转发给其他人</AtButton>
                    </View>
                  </View>
                </AtModal>
              </View>
            )
            : null
        }
        {
          publishController.currentStage !== PUBLISH_STAGE.CONTENT_AND_IMG
            && publishController.currentStage !== PUBLISH_STAGE.FINISHED
            ? (
              <View>
                <View className="title">
                  {this.props.publishController.title}
                </View>
                <View className="content">
                  {this.props.publishController.content}
                </View>
              </View>
            )
            : null
        }
        { // Stage 1 - 填写标题与上传图片
          publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
            ? (
              <View>
                <View className="form-item">
                  <AtInput
                    title="标题"
                    type="text"
                    name="title"
                    onChange={value => publishController.update('title', value)}
                    value={publishController.title}
                    placeholder="输入寻人标题"
                  ></AtInput>
                </View>
                <View className="form-item">
                  <AtTextarea
                    onChange={value => publishController.update('content', value.detail.value)}
                    value={publishController.content}
                    placeholder="输入寻人描述"
                  ></AtTextarea>
                </View>
              </View>
            )
            : null
        }
        <View className="form-item">
          <AtImagePicker
            customStyle={{
              pointerEvents: publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG ? 'all' : 'none',
            }}
            onChange={this.handleFiles}
            files={publishController.files || []}
            showAddBtn={
              publishController.files.length === 0
              && publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
            }
            length={1}
          ></AtImagePicker>
        </View>
        {
          // Stage 2 - 填写位置, 赏金, 时限
          publishController.currentStage === PUBLISH_STAGE.DETAILING
            || publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION
            ? (
              <View>
                <View className="form-item">
                  <Picker
                    mode="selector"
                    onChange={e => publishController.school = e.detail.value}
                    value={publishController.school || -1}
                    range={schools.map(item => item.name)}
                  >
                    <View className="picker">
                      <AtInput
                        title="学校"
                        name="school"
                        onChange={() => { }}
                        value={schools[publishController.school]
                          ? schools[publishController.school].name
                          : ''
                        }
                      ></AtInput>
                    </View>
                  </Picker>
                </View>
                <View className="form-item">
                  <AtInput
                    value={publishController.gold || ''}
                    title="赏金"
                    name="gold"
                    onChange={(v: any) => publishController.gold = Number.parseFloat(v)}
                    type="number"
                  ></AtInput>
                </View>
                <View className="form-item">
                  <Picker
                    mode="selector"
                    value={publishController.expire || -1}
                    onChange={v => publishController.expire = v.detail.value}
                    range={expires}
                  >
                    <View>
                      <AtInput
                        value={expires[publishController.expire || -1]}
                        title="有效期"
                        name="expire"
                        onChange={() => { }}
                        type="number"
                      ></AtInput>
                    </View>
                  </Picker>
                </View>
                <View className="form-item">
                  <AtSwitch
                    title="实名"
                    checked={publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION}
                    onChange={value => {
                      publishController.currentStage = value ? PUBLISH_STAGE.IDENTIFICATION : PUBLISH_STAGE.DETAILING;
                    }
                    }
                  />
                </View>

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
        <View className="btn-wrap">
          {
            publishController.currentStage === PUBLISH_STAGE.DETAILING
              || publishController.currentStage === PUBLISH_STAGE.IDENTIFICATION
              ? (
                <View className="form-item">
                  <AtButton
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
                <View className="form-item">
                  <AtButton
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
                <View className="form-item">
                  <AtButton
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
