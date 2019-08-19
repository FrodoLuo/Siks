import Taro from '@tarojs/taro';

export function get<T>(url: string, data = {}, header = {}): Promise<T> {
  return Taro.request({
    url,
    data,
    header,
    method: 'GET',
  })
    .then(res => {
      return new Promise((resolve, reject) => {
        if (res.statusCode >= 100 && res.statusCode < 400) {
          return resolve(res.data);
        } else {
          reject(res.data);
        }
      });
    })
    .catch(reason => console.log(reason))
    .then();
}
