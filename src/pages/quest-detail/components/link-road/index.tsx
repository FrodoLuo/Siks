import { Component } from '@tarojs/taro';

import { Image, View } from '@tarojs/components';
import { Quest } from 'src/store/quest';
import './index.less';

interface LinkRoadCardProps {
  quest: Quest;
}

const LinkRoadItem = (item: { icon_url: string; nickname: string }) => {
  return (
    <View className="link-road-item-wrap">
      <View className="link-road-item">
        <View>{item.nickname}</View>
      </View>
    </View>
  );
};

const LinkRoadCard = ({ quest }: LinkRoadCardProps) => {
  return (
    <View className="link-road-wrap">
      <View className="link-road-container">
        {/* {quest.linkroad.map(LinkRoadItem)} */}
      </View>
    </View>
  );
};

export default LinkRoadCard;
