import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ItemCard from './components/item-card';
import './index.less';

class HallPage extends Taro.Component {
  public render() {
    return (
      <View>
        <View>
          <ItemCard />
        </View>
      </View>
    );
  }
}

export default HallPage;
