// 其他文件的ts类型

// 用户信息
export interface chatRoom {
    Id: number, // 用户id
    name: string, // 用户名字
    tips?: string, // 用户描述
    state: number, // 用户状态 1在线 0离线
    avator: string | null, // 用户头像
    password?: string, // 用户密码
    createTime?: Date // 用户创建时间
}