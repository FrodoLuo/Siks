import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Quest } from 'src/store/quest';
import { AtAvatar, AtCard, AtIcon } from 'taro-ui';
import schoolConfig from '../../../../../store/school';
import './item-card.less';

export default ({ quest }: { quest: Quest }) => {
  if (!quest) { return null; }
  console.log(quest);
  return (
    <View
      className="quest-card-wrap"
      onClick={() => {
        Taro.navigateTo({
          url: `/pages/quest-detail/index?id=${quest._id}`,
        });
      }}
    >
      <View className="publisher-info">
        <AtAvatar circle={true} />
        <View className="publisher-nick">
          <Text className="publisher-name">
            {/* {quest.user.nickname} */}
            Blaj kop
          </Text>
          <Text className="publisher-time">
            {new Date(quest.published_time || '').toLocaleTimeString()}
          </Text>
        </View>
        <View className="amount">
          <View className="icon">$</View>
          {quest.gold}
        </View>
      </View>
      <View className="content">
        <View className="title">
          {quest.title}
        </View>
        <View className="descriptions">
          {quest.content}
        </View>
        {quest.cover ? (<View className="cover-wrapper">
          <Image className="image" src={quest.cover} mode="aspectFill" />
        </View>) : null}
      </View>
      <View className="footer">
        <AtIcon value="map-pin"></AtIcon>
        {schoolConfig.schools[quest.school].name}
      </View>
    </View>
  );
};
