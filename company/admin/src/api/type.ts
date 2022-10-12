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

// 菜单列表
export interface menuList {
  status: string, // 状态
  menuName: string, // 菜单名称
}

// 新增菜单
export interface addMenu {
  children?: addMenu[],
  component?: string, // 组件路径
  createBy?: string, // 创建者
  createTime?: string, // 创建时间
  icon?: string, // 菜单图标
  isCache?: number, // 是否缓存（0缓存 1不缓存）
  isFrame?: number, // 是否为外链（0是 1否）
  menuId?: number, // 菜单ID
  menuName?: string, // 菜单名称
  menuType?: string, // 菜单类型（M目录 C菜单 F按钮）
  orderNum?: number, // 显示顺序
  parentId?: number, // 父菜单ID
  path?: string, // 路由地址
  perms?: string, // 权限标识
  query?: string, // 路由参数
  remark?: string, // 备注
  status?: string, // 菜单状态（0正常 1停用）
  updateBy?: string, // 更新者
  updateTime?: string, // 更新时间
  visible?: string // 菜单状态（0显示 1隐藏）
}
