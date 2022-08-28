// 发送人&接受人
export interface sendAndRecv {
    sendId: number // 发送人id
    recvId: number // 接受人id
}
// 注册接口参数
export interface register {
    name: string // 用户账号
    pass: string // 密码
}

// 列表 分页
export interface listParam {
    page: number // 页码
    pageSize: number // 每页数量
}

// 用户列表
export interface userList extends listParam {
    name: string // 用户名称
}

// 消息记录
export interface msgRecord extends sendAndRecv {
    msg: string // 消息
}

// 与好友的聊天记录
export interface msgFriendRecord {
    page: number // 页码
    sendId: number // 发送人id
    recvId: number // 接受人id
    pageSize?: number // 每页数量
}

// 好友申请处理
export interface friendApply {
    id: number // 好友申请Id
    state: number // 状态 2拒绝 1通过 0未处理
}

// 建群
export interface createGroup {
    groupName: string // 群名
    members: {
        id: number // 用户id
        type: number // 用户角色 0：普通 1：管理 2：群主
    }[] // 群成员
}