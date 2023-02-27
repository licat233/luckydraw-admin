/*
 * @Author: licat
 * @Date: 2022-12-26 12:48:15
 * @LastEditors: licat
 * @LastEditTime: 2022-12-26 17:50:33
 * @Description:
 */
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';

import RequestErrorHandler from './requestErrorHandler';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType, traceMessage } = res as unknown as API.BaseResp;
      if (!success) {
        const error: any = new Error(errorMessage || "request failed");
        error.name = 'BizError';
        error.info = { success, errorCode, errorMessage, showType, data, traceMessage };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // if (opts?.skipErrorHandler) throw error;
      RequestErrorHandler(error, opts);
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (options: RequestOptions) => {
      // if (options) throw error;
      const token = localStorage.getItem('jwtToken'); //从缓存中加载token
      if (!token) return options;
      try {
        const jwt: API.JwtToken = JSON.parse(token);
        if (jwt.accessExpire < Date.now() / 1000) {
          throw new Error("token is expired");
        }
        if (!options.headers) {
          options.headers = {};
        }
        options.headers.Authorization = jwt.accessToken //携带token
      } catch (error) {
        localStorage.removeItem('jwtToken');
      }
      return options;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      // const { data } = response as unknown as API.BaseResp;

      // if (data?.success === false) {
      //   message.error('请求失败！');
      // }
      return response;
    },
  ],
};
