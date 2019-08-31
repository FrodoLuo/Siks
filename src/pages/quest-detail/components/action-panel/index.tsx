import { View } from '@tarojs/components';
import { Component } from '@tarojs/taro';
import { AtButton } from 'taro-ui';

const Initialized = ({ taskId }) => {
  const isMe = () => {
    // todo
  };
  const takeQuest = () => {
    // todo
  };
  return (
    <View>
      <AtButton>是我</AtButton>
      <AtButton>我要帮忙</AtButton>
    </View>
  );
};

const Passing = ({ taskId }) => {
  const recongenized = () => {
    // todo
  };
  const passOn = () => {
    // todo
  };
  return (
    <View>
      <AtButton>我认识</AtButton>
      <AtButton>接着找吧</AtButton>
    </View>
  );
};

const Suspect = ({ taskId }) => {
  const startCommunication = () => {
    // todo
  };
  return (
    <View>
      <View>此处为匿名聊天玩法</View>
      <AtButton>开始匿名聊天</AtButton>
    </View>
  );
};

const PassingInSelf = ({ taskId }) => {
  // todo
  const giveUp = () => {
    // todo
  };

  const recongenized = () => {
    // todo
  };

  return (
    <View>
      <AtButton>我认识TA</AtButton>
      <AtButton>放弃寻找</AtButton>
    </View>
  );
};