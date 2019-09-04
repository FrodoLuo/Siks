import { Image, View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import schoolStore from '../../../../store/school';
import './index.less';

interface QDCProps {
  title: string; content: string; cover?: string; school: string;
}

const QuestDetailContent = ({ title, content, cover, school }: QDCProps) => {
  return (
    <View className="content-wrap">
      <View className="title-wrap">
        {title}
      </View>
      <View className="content">
        {content}
      </View>
      {cover
        ? (
          <View className="cover-wrap">
            <Image className="image" mode="widthFix" src={cover}></Image>
          </View>
        )
        : null
      }
      <View className="school">
        <Text className="school-name">
          {(schoolStore.schools.find(item => item._id === school) || { name: '', school: '' }).school}
        </Text>
      </View>
    </View>
  );
};

export default QuestDetailContent;
