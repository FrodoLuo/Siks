import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Quest } from 'src/store/quest';
import { AtAvatar, AtCard, AtIcon } from 'taro-ui';
import schoolStore from '../../../../../store/school';
import { formatDate } from '../../../../../utils/dateFormatter';
import './item-card.less';

export default ({ quest }: { quest: Quest }) => {
  if (!quest) { return null; }
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
        <AtAvatar circle={true} image={quest.user.icon_url} />
        <View className="publisher-nick">
          <Text className="publisher-name">
            {quest.user.nickname}
          </Text>
          <Text className="publisher-time">
            {formatDate(new Date(quest.published_time || ''))}
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
        {
          (schoolIndex => {
            const school = schoolStore.schools.find(s => s._id === schoolIndex);
            const s = { ...school } as any;
            const name = s.school || s.name;
            return name;
          })(quest.school)
        }
      </View>
    </View>
  );
};
