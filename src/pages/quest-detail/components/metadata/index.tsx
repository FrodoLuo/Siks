import { Image, View } from '@tarojs/components';
import { Component } from '@tarojs/taro';

import { Quest } from 'src/store/quest';
import { AtIcon, AtAvatar } from 'taro-ui';
import './index.less';

interface MetadataProps {
  meta: Quest | null;
  toggle: boolean;
}

const Metadata = ({ meta, toggle }: MetadataProps) => {
  if (!meta) { return null; }
  console.log(meta);
  return (
    <View className="meta-wrap">
      {toggle
        ? null
        : (
          <View className="avatar-wrap">
            <AtAvatar circle image={meta.user.icon_url} />
          </View>
        )}
      <View className="nick-wrap">
        <View>NickName</View>
        <View>{new Date(Number.parseInt(meta.published_time!, 10)).toLocaleString()}</View>
      </View>
      <View className="quest-info">
        <View>{meta.school}</View>
        <View><AtIcon value="sketch"></AtIcon>{meta.gold}</View>
      </View>
    </View>
  );
};

export default Metadata;
