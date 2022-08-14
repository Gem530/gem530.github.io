import { request } from "./request"

import * as tsType from './type/index'

/**
 * @author hjj
 * @description 注册接口
 * @param name 账号
 * @param pass 密码
 */
export function registerAPI (param: tsType.register): Promise<unknown> {
    return request({
        method: 'POST',
        url: '/api/register',
        data: param
    })
}

/**
 * @author hjj
 * @description 登录接口
 * @param name 账号
 * @param pass 密码
 */
export function loginAPI (param: tsType.register): Promise<unknown> {
    return request({
        method: 'POST',
        url: '/api/login',
        data: param
    })
}

/**
 * @author hjj
 * @description 用户列表
 */
export function userListAPI (param: tsType.userList): Promise<unknown> {
    return request({
        method: 'POST',
        url: '/api/userList',
        data: param
    })
}

/**
 * @author hjj
 * @description 给好友发消息
 */
export function sendMsgFriendAPI (param: tsType.msgRecord): Promise<unknown> {
    return request({
        method: 'POST',
        url: '/api/sendMsgFriend',
        data: param
    })
}

/**
 * @author hjj
 * @description 获取消息列表
 */
export function getMsgListAPI (userId: number): Promise<unknown> {
    return request({
        method: 'GET',
        url: '/api/getMsgList',
        data: { userId }
    })
}

/**
 * @author hjj
 * @description 获取未读消息列表
 */
export function getUnreadMsgAPI (userId: number): Promise<unknown> {
    return request({
        method: 'GET',
        url: '/api/getUnreadMsg',
        data: { userId }
    })
}

/**
 * @author hjj
 * @description 获取与好友的聊天记录
 */
export function getUserMsgRecordAPI (param: tsType.msgFriendRecord): Promise<unknown> {
    return request({
        method: 'POST',
        url: '/api/getUserMsgRecord',
        data: param
    })
}

/**
 * @author hjj
 * @description 改变消息状态
 */
 export function updateUnreadMsgAPI (param: tsType.sendAndRecv): Promise<unknown> {
    return request({
        method: 'POST',
        url: '/api/updateUnreadMsg',
        data: param
    })
}
