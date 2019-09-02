import { Component } from '@tarojs/taro';

import { Image, View } from '@tarojs/components';
import { Quest } from 'src/store/quest';
import './index.less';
import { AtAvatar } from 'taro-ui';

interface LinkRoadCardProps {
  quest: Quest;
}

const LinkRoadItem = (item: { icon_url: string; nickname: string }) => {
  return (
    <View className="link-road-item-wrap">
      <View className="link-road-item">
        <View><AtAvatar size="small" image={item.icon_url} circle={true}></AtAvatar></View>
      </View>
    </View>
  );
};

const EmptyRoadNodeItem = () => {
  return (
    <View className="link-road-item-wrap">
      <View className="link-road-item">
        <View><View className="empty"></View></View>
      </View>
    </View>
  )
}

const LinkRoadCard = ({ quest }: LinkRoadCardProps) => {
  return (
    <View className="link-road-wrap">
      <View className="link-road-container">
        {/* {quest.linkroad.map(LinkRoadItem)} */}
        {/* {new Array(6- quest.linkroad.length).fill(0).map(EmptyRoadNodeItem)} */}
        <View className="link-road-item-wrap">
          <View className="link-road-item">
            <View><AtAvatar size="small" circle={true} image="https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/006eH5v0ly8g4p2wg6zgcj30ru0rudj3.jpg?KID=imgbed,tva&Expires=1567245092&ssig=pCUhDx8JAA"></AtAvatar></View>
          </View>
        </View>
        <View className="link-road-item-wrap">
          <View className="link-road-item">
            <View><AtAvatar size="small" circle={true} image="https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/006eH5v0ly8g4p2wg6zgcj30ru0rudj3.jpg?KID=imgbed,tva&Expires=1567245092&ssig=pCUhDx8JAA"></AtAvatar></View>
          </View>
        </View>
        <View className="link-road-item-wrap">
          <View className="link-road-item">
            <View><AtAvatar size="small" circle={true} image="https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/006eH5v0ly8g4p2wg6zgcj30ru0rudj3.jpg?KID=imgbed,tva&Expires=1567245092&ssig=pCUhDx8JAA"></AtAvatar></View>
          </View>
        </View>
        <View className="link-road-item-wrap">
          <View className="link-road-item">
            <View><AtAvatar size="small" circle={true} image="https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/006eH5v0ly8g4p2wg6zgcj30ru0rudj3.jpg?KID=imgbed,tva&Expires=1567245092&ssig=pCUhDx8JAA"></AtAvatar></View>
          </View>
        </View>
        <View className="link-road-item-wrap">
          <View className="link-road-item">
            <View><AtAvatar size="small" circle={true} image="https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/006eH5v0ly8g4p2wg6zgcj30ru0rudj3.jpg?KID=imgbed,tva&Expires=1567245092&ssig=pCUhDx8JAA"></AtAvatar></View>
          </View>
        </View>
        <View className="link-road-item-wrap">
          <View className="link-road-item">
            <View><AtAvatar size="small" circle={true} image="https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/006eH5v0ly8g4p2wg6zgcj30ru0rudj3.jpg?KID=imgbed,tva&Expires=1567245092&ssig=pCUhDx8JAA"></AtAvatar></View>
          </View>
        </View>
        <View className="link-road-item-wrap">
          <View className="link-road-item">
            <View><AtAvatar size="small" circle={true} image="https://tvax2.sinaimg.cn/crop.0.0.1002.1002.180/006eH5v0ly8g4p2wg6zgcj30ru0rudj3.jpg?KID=imgbed,tva&Expires=1567245092&ssig=pCUhDx8JAA"></AtAvatar></View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LinkRoadCard;
