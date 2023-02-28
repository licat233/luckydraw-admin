/*
 * @Author: licat
 * @Date: 2022-12-26 12:48:15
 * @LastEditors: licat
 * @LastEditTime: 2022-12-26 18:16:07
 * @Description:
 */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;

    id: number;
    username: string;
    password: string;
    isSuper: number;
    access: string;
  };

  type BaseResp = {
    status: boolean // 响应状态
    success: boolean // 响应状态，用于对接umijs
    message?: string // 给予的提示信息
    data?: any // 【选填】响应的业务数据
    total?: number // 【选填】数据总个数
    pageSize?: number // 【选填】单页数量
    current?: number // 【选填】当前页码
    page?: number // 【选填】当前页码，用于对接umijs
    totalPage?: number // 【选填】自增项，总共有多少页，根据前端的pageSize来计算
    errorCode?: number // 【选填】错误类型代码：400错误请求，401未授权，500服务器内部错误，200成功
    errorMessage?: string // 【选填】向用户显示消息
    traceMessage?: string // 【选填】调试错误信息，请勿在生产环境下使用，可有可无
    showType?: number // 【选填】错误显示类型：0.不提示错误;1.警告信息提示；2.错误信息提示；4.通知提示；9.页面跳转
    traceId?: string // 【选填】方便后端故障排除：唯一的请求ID
    host?: string // 【选填】方便后端故障排除：当前访问服务器的主机
  }

  type JwtToken = {
    accessToken: string // token
    accessExpire: number // expire
    refreshAfter: number // refresh at
  }

  type ListReq = {
    pageSize?: number; // 页面大小
    current?: number; // 当前页码
    keyword?: string; // 关键词，可选
  }
}
