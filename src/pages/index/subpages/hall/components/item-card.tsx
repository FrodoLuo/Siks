import { Image, View } from '@tarojs/components';
import { AtCard } from 'taro-ui';
import './item-card.less';

export default ({ amount, title, description, date, area, cover }) => {
  return (
    <AtCard
      note={area}
      title={title}
    >
      <View className="siks">
        <View className="content">
          {cover ? (<View className="cover-wraper"><Image src={cover} /></View>) : null}
          <View className="descriptions">
            {description}
          </View>
        </View>
        <View className="footer">
          <View className="date">
            {date}
          </View>
          <View className="amount">
            ￥{amount}
          </View>
        </View>
      </View>
    </AtCard>
  );
};
