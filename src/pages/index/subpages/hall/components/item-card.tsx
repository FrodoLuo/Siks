import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Quest } from 'src/store/quest';
import { AtCard } from 'taro-ui';
import './item-card.less';
import schoolConfig from '../../../../../store/school';

export default ({ quest }: { quest: Quest }) => {
  if (!quest) { return null; }
  return (
    <AtCard
      note={(schoolConfig.schools.find(item => item._id === quest.school) || { name: '' }).name}
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
            {new Date(quest.published_time || '').toLocaleString()}
          </View>
          <View className="amount">
            ￥{quest.gold}
          </View>
        </View>
      </View>
    </AtCard>
  );
};
