import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import _ from 'lodash'
import { environment } from 'environments/environment'

const axiosClient = axios.create({
    baseURL: environment.baseApi,
    headers: {
        'Content-Type': 'application/json'
    }
})

const parserData = (res: any) => {
    if (!res.data) {
        const dataRes = {
            ..._.pick(res, ['r_code', 'r_message', 'success']),
            data: _.omit(res, ['r_code', 'r_message', 'success']) || {}
        }
        return dataRes
    }
    return res
}

// // Interceptors
// axiosClient.interceptors.request.use(function(config: AxiosRequestConfig) {
//     return config
// }, function (error) {
//     return Promise.reject(error)
// })


export default axiosClient