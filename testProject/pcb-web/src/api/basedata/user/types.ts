export interface UserVO {
  /**
   * $column.columnComment
   */
  id: string | number;

  /**
   * 登录名
   */
  loginName: string;

  /**
   * 用户密码
   */
  userPassword: string;

  /**
   * 用户姓名
   */
  userName: string;

  /**
   * 性别 1男 2女
   */
  sex: string;

  /**
   * 入职时间
   */
  entryTime: string;

  /**
   * 婚姻状态(1未婚 2已婚)
   */
  matrimony: string;

  /**
   * 合同开始时间
   */
  contractStartTime: string;

  /**
   * 合同结束时间
   */
  contractEndTime: string;

  /**
   * 薪水
   */
  salary: number;

  /**
   * 合同期限（月）
   */
  contractTimeLimit: number;

  /**
   * 身份证
   */
  identityCard: string | number;

  /**
   * 学历
   */
  education: string;

  /**
   * 家庭住址
   */
  familyAddress: string;

  /**
   * 联系电话
   */
  phone: string;

  /**
   * 紧急联系人
   */
  emergencyContact: string;

  /**
   * 紧急联系电话
   */
  emergencyContacPhone: string;

  /**
   * 开户银行
   */
  depositBank: string;

  /**
   * 银行账户
   */
  bankAccount: string;

  /**
   * 帐号状态（1正常 2停用）
   */
  status: string;

  /**
   * 部门id
   */
  deptId: string | number;

  /**
   * 最后登陆IP
   */
  loginIp: string;

  /**
   * 最后登录时间
   */
  loginDate: string;

}

export interface UserForm extends BaseEntity {
  /**
   * $column.columnComment
   */
  id?: string | number;

  /**
   * 登录名
   */
  loginName?: string;

  /**
   * 用户密码
   */
  userPassword?: string;

  /**
   * 用户姓名
   */
  userName?: string;

  /**
   * 性别 1男 2女
   */
  sex?: string;

  /**
   * 入职时间
   */
  entryTime?: string;

  /**
   * 婚姻状态(1未婚 2已婚)
   */
  matrimony?: string;

  /**
   * 合同开始时间
   */
  contractStartTime?: string;

  /**
   * 合同结束时间
   */
  contractEndTime?: string;

  /**
   * 薪水
   */
  salary?: number;

  /**
   * 合同期限（月）
   */
  contractTimeLimit?: number;

  /**
   * 身份证
   */
  identityCard?: string | number;

  /**
   * 学历
   */
  education?: string;

  /**
   * 家庭住址
   */
  familyAddress?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 紧急联系人
   */
  emergencyContact?: string;

  /**
   * 紧急联系电话
   */
  emergencyContacPhone?: string;

  /**
   * 开户银行
   */
  depositBank?: string;

  /**
   * 银行账户
   */
  bankAccount?: string;

  /**
   * 帐号状态（1正常 2停用）
   */
  status?: string;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 最后登陆IP
   */
  loginIp?: string;

  /**
   * 最后登录时间
   */
  loginDate?: string;

}

export interface UserQuery extends PageQuery {

  /**
   * 登录名
   */
  loginName?: string;

  /**
   * 用户密码
   */
  userPassword?: string;

  /**
   * 用户姓名
   */
  userName?: string;

  /**
   * 性别 1男 2女
   */
  sex?: string;

  /**
   * 入职时间
   */
  entryTime?: string;

  /**
   * 婚姻状态(1未婚 2已婚)
   */
  matrimony?: string;

  /**
   * 合同开始时间
   */
  contractStartTime?: string;

  /**
   * 合同结束时间
   */
  contractEndTime?: string;

  /**
   * 薪水
   */
  salary?: number;

  /**
   * 合同期限（月）
   */
  contractTimeLimit?: number;

  /**
   * 身份证
   */
  identityCard?: string | number;

  /**
   * 学历
   */
  education?: string;

  /**
   * 家庭住址
   */
  familyAddress?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 紧急联系人
   */
  emergencyContact?: string;

  /**
   * 紧急联系电话
   */
  emergencyContacPhone?: string;

  /**
   * 开户银行
   */
  depositBank?: string;

  /**
   * 银行账户
   */
  bankAccount?: string;

  /**
   * 帐号状态（1正常 2停用）
   */
  status?: string;

  /**
   * 部门id
   */
  deptId?: string | number;

  /**
   * 最后登陆IP
   */
  loginIp?: string;

  /**
   * 最后登录时间
   */
  loginDate?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



