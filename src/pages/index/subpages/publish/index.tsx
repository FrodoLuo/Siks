import { Button, Form, Input, Label, View } from '@tarojs/components';
import { inject, observer } from '@tarojs/mobx';
import Taro from '@tarojs/taro';
import QuestStore from 'src/store/quest';
import { AtButton, AtForm, AtInput } from 'taro-ui';

interface PublishPageProps {
  questStore: QuestStore;
}

@inject(store => ({
  questStore: store.questStore,
}))
@observer
class PublishPage extends Taro.Component<PublishPageProps> {

  public static defaultProps: PublishPageProps;

  public addQuest = () => {
    this.props.questStore.publish({
      title: '找另一个人',
      gold: 14,
      content: '找一个男生',
      school: '深圳大学',
    });
  }

  public submit = event => {
    this.props.questStore.publish(event.detail.value);
  }

  public render() {
    return <View>
      <Button onClick={this.addQuest}>Add</Button>
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
          <Label>赏金</Label>
          <Input name="gold"></Input>
        </View>
        <View className="form-item">
          <Label>学校</Label>
          <Input name="school"></Input>
        </View>
        <View className="btn-wrap">
          <Button formType="submit">发布</Button>
        </View>
      </Form>
    </View>;
  }
}

export default PublishPage;
