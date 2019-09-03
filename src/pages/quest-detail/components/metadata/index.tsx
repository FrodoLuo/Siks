import { Image, View } from '@tarojs/components';
import { Component } from '@tarojs/taro';
import { Quest } from 'src/store/quest';
import { AtAvatar, AtIcon } from 'taro-ui';
import schoolStore from '../../../../store/school';
import { formatDate } from '../../../../utils/dateFormatter';
import './index.less';

interface MetadataProps {
  meta: Quest | null;
  toggle: boolean;
}

const Metadata = ({ meta, toggle }: MetadataProps) => {
  if (!meta) { return null; }
  return (
    <View className="meta-wrap">
      <View className="avatar-wrap">
        <AtAvatar circle image={meta.user.icon_url} />
      </View>
      <View className="nick-wrap">
        <View>{meta.user.nickname || '匿名'}</View>
        <View>{formatDate(new Date(Number.parseInt(meta.published_time!, 10)))}</View>
      </View>
      <View className="quest-info">
        <View className="amount"><View className="icon">$</View>{meta.gold}</View>
      </View>
    </View>
  );
};

export default Metadata;
