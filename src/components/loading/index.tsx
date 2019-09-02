import { View } from '@tarojs/components';

import { AtIcon } from 'taro-ui';
import './index.less';

export default () => {
  return (
    <View className="loading-wrap">
      <View className="loading-icon">
        <AtIcon value="loading"></AtIcon>
      </View>
    </View>
  );
};
