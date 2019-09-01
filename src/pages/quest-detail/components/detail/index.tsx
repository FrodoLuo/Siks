import { Component } from '@tarojs/taro';

import { Image, View } from '@tarojs/components';
import './index.less';

interface QDCProps {
  title: string; content: string; cover?: string;
}

const QuestDetailContent = ({ title, content, cover }: QDCProps) => {
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
    </View>
  );
};

export default QuestDetailContent;
