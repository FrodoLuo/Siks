import Taro from '@tarojs/taro';

Taro.cloud.init();

const config = {
  baseUrl: 'api.weixin.qq.com/',
  url(url) {
    return 'https://' + (this.baseUrl + url).replace(/(\/)+/g, '/');
  },
  getData(data) {
    return {
      ...data,
      appid: 'wx0b414cd6ff08b974',
      grant_type: 'client_credential',
      secret: '3b0c5c56791b31bf74bbfeafccc34b54',
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
