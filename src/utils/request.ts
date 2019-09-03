import Taro from '@tarojs/taro';


(async function () {
  Taro.cloud.init();
  // const db = Taro.cloud.database({
  // env: 'dev-dy5o'
  // })
  // console.log(await db.collection('chatcontent').get());
})()

const config = {
  baseUrl: 'api.weixin.qq.com/',
  url(url) {
    return 'https://' + (this.baseUrl + url).replace(/(\/)+/g, '/');
  },
  getData(data) {
    return {
      ...data,
      appid: 'wxa499e514eb921c14',
      grant_type: 'client_credential',
      secret: '2540b6a5e8655b54feed80d36cd8bb0f',
    };
  },
};

const netErrorInterceptor = <T>(res): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    if (res.statusCode >= 100 && res.statusCode < 400) {
      return resolve(res.data);
    } else {
      reject(null);
    }
  });
};

export const get = <T>(url: string, data = {}, header = {}): Promise<T | null> => {
  return Taro.request<T>({
    url: config.url(url),
    data: config.getData(data),
    header,
    method: 'GET',
  })
    .then(netErrorInterceptor)
    .then();
};

interface CloudOption {
  name: string;
  data?: any;
  config?: any;
  success?: () => any;
  fail?: () => any;
  complete?: () => any;
}

export const cloud = <T>(option: CloudOption) => {
  return Taro.cloud.callFunction(option)
    .then(
      res => {
        return res.result;
      },
      error => {
        console.log(error);
        return null;
      },
    );
};
