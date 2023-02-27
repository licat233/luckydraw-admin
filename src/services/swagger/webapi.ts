import { request } from '@umijs/max';

//skipErrorHandler: true


// 核心请求方法
const baseRequest = async function <Type>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: any, options?: Record<string, any>) {
    // const skipErrorHandler = options && options.skipErrorHandler
    const params = method === 'GET' ? body : null;
    return request<Type>(url, {
        method,
        data: body,
        params,
        ...(options || {}),
    });
}

export const webapi = {
    get: function <Type>(url: string, body?: any) {
        return async (options?: Record<string, any>) => {
            return baseRequest<Type>('GET', url, body, options)
        }
    },
    post: function <Type>(url: string, body?: any) {
        return async (options?: Record<string, any>) => {
            return baseRequest<Type>('POST', url, body, options)
        }
    },
    put: function <Type>(url: string, body?: any) {
        return async (options?: Record<string, any>) => {
            return baseRequest<Type>('PUT', url, body, options)
        }
    },
    delete: function <Type>(url: string, body?: any) {
        return async (options?: Record<string, any>) => {
            return baseRequest<Type>('DELETE', url, body, options)
        }
    },
    request: baseRequest,
}

export default webapi
