import { Button, Form, Image, Input, Label, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import { AtButton, AtForm, AtImagePicker, AtInput } from 'taro-ui';
import PublishController, { PUBLISH_STAGE } from '../../../../store/publish';

interface PublishPageProps {
  publishController: PublishController;
}

interface PublishPageState {
  files: File[];
  currentStage: PUBLISH_STAGE;
}
@inject(store => ({
  publishController: store.publishController,
}))
@observer
class PublishPage extends Taro.Component<PublishPageProps> {

  public static defaultProps: PublishPageProps;

  public submit = event => {
  }

  public nextStage = () => {
    const t = this.props.publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
      ? PUBLISH_STAGE.DETAILING
      : PUBLISH_STAGE.CONTENT_AND_IMG;
    this.props.publishController.update('currentStage', t);
  }

  public handleFiles = files => {
    this.setState({
      files,
    });
  }

  public render() {
    const { publishController } = this.props;
    return <View>
      <Form onSubmit={this.submit}>
        <View className="form-item">
          <Label>标题</Label>
          <Input name="title"></Input>
        </View>
        <View className="form-item">
          <Label>内容</Label>
          <Input name="content"></Input>
        </View>
        <View className="form-item">
          <View className="upload-btn">
            <Label>上传图片(可选)</Label>
            {
              this.props.publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG
                ? (<AtImagePicker
                  multiple={false}
                  showAddBtn={publishController.files.length < 1}
                  length={1}
                  files={publishController.files}
                  onChange={this.handleFiles}
                />)
                : publishController.files.length > 0
                  ? <Image mode="aspectFill" src={publishController.files[0].url} />
                  : null
            }
          </View>
        </View>
        <View className="btn-wrap">
          <Button onClick={this.nextStage}>
            {this.props.publishController.currentStage === PUBLISH_STAGE.CONTENT_AND_IMG ? '下一步' : '上一步'}
          </Button>
          {this.props.publishController.currentStage === PUBLISH_STAGE.DETAILING
            ? <Button formType="submit">发布</Button>
            : null}
        </View>
      </Form>
    </View>;
  }
}

export default PublishPage;
