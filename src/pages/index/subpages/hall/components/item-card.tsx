import { View } from '@tarojs/components';
import { AtCard } from 'taro-ui';

export default ({description, date, area, cover}) => {
  return (
    <AtCard
      note='小Tips'
      extra='额外信息'
      title='这是个标题'
    >
      <View>{description}</View>
    </AtCard>
  );
};
