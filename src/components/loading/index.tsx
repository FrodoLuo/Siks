import { View } from '@tarojs/components';

import { AtLoadMore } from 'taro-ui';
import './index.less';

export default () => {
  return (
    <View className="loading-wrap">
      <View className="loading-icon">
        <AtLoadMore status="loading" />
      </View>
    </View>
  );
};
