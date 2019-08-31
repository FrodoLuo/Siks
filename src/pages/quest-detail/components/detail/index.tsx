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

      {cover
        ? (
          <View className="cover-wrap">
            <Image src={cover}></Image>
          </View>
        )
        : null
      }
      <View className="content">
        {content}
      </View>
    </View>
  );
};

export default QuestDetailContent;
