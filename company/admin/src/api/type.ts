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

// app操作日志管理列表
export interface appoperateList extends list {
  businessType?: number, // 业务类型（0其它 1新增 2修改 3删除）
  businessTypes?: number[], // 业务类型（0其它 1新增 2修改 3删除）集合
  endTime?: string, // 结束时间
  operName?: string, // 操作人员名称
  startTime?: string, // 开始时间
  status?: number, // 操作状态（0正常 1异常）
  title?: string, // 模块标题
}
