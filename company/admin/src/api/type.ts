// api接口
export interface baseAPI<t> {
  data?: t,
  params?: t,
  url: string,
  method: string,
  headers?: Headers|any, // 请求头
  timeout?: number|string
}

// 登录信息
export interface loginInfo {
  username: string, // 用户名
  password: string // 密码
}

// 菜单标签
export interface tagsView {
  name: string,
  path: string,
  meta: any
}

// 列表
export interface list {
  pageIndex: number,
  pageSize: number
}

// 渠道标识列表
export interface channleList extends list {
  phoneNum: string, // 手机号
  sendState?: string,
}
