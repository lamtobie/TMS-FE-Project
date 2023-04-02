import { UserModel } from './userModel'

export interface AuthRequestModel {
    grant_type?: string,
    client_id?: string,
    client_secret?: string,
    username?: string,
    email?: string,
    password?: string
}

export interface AuthResponseModel {
    access_token?: string,
    refresh_token?: string,
    user?: UserModel
}

export interface AuthModel {
    loading: boolean,
    auth?: AuthRequestModel,
    user?: UserModel,
    isLogin: boolean,
    stations?: Array<any>,
    currentStation?: any
} 