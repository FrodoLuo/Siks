import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Quest } from 'src/store/quest';
import { AtCard } from 'taro-ui';
import './item-card.less';

export default ({ quest }: { quest: Quest }) => {
  if (!quest) { return null; }
  return (
    <AtCard
      note={quest.school}
      title={quest.title}
      onClick={
        () => {
          Taro.navigateTo({
            url: `/pages/quest-detail/index?id=${quest._id}`,
          });
        }
      }
    >
      <View className="siks">
        <View className="content">
          {quest.cover ? (<View className="cover-wraper"><Image src={quest.cover} /></View>) : null}
          <View className="descriptions">
            {quest.content}
          </View>
        </View>
        <View className="footer">
          <View className="date">
            {quest.publishedTime}
          </View>
          <View className="amount">
            ￥{quest.gold}
          </View>
        </View>
      </View>
    </AtCard>
  );
};
