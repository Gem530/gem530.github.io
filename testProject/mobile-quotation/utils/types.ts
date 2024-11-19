// 销售税状态
export enum saleTaxStatus {
    noPass = '-1',
    waitProcess = '0',
    processPass = '1',
    expiration = '2',
}
export const saleTaxStatusText: Record<string, any> = {
    [saleTaxStatus.noPass]: 'enumCommon.reviewFailed',
    [saleTaxStatus.waitProcess]: 'enumCommon.pendingReview',
    [saleTaxStatus.processPass]: 'enumCommon.approved',
    [saleTaxStatus.expiration]: 'enumCommon.overdue'
};

// 订单状态
export enum orderStatus {
    pendingPay = '1',
    productDoing = '2',
    productFinish = '3',
    sendFinish = '4',
    pendingEvaluate = '5',
    finish = '6',
    pendingProduct = '7',
    payFinish = '8',
    pendingSubmit = '9',
}
export const orderStatusText: Record<string, any> = {
    [orderStatus.pendingPay]: 'enumCommon.toBePaid',
    [orderStatus.productDoing]: 'enumCommon.inProduction',
    [orderStatus.productFinish]: 'enumCommon.productionCompleted',
    [orderStatus.sendFinish]: 'enumCommon.shipped',
    [orderStatus.pendingEvaluate]: 'enumCommon.toBeEvaluated',
    [orderStatus.finish]: 'enumCommon.completed',
    [orderStatus.pendingProduct]: 'enumCommon.pendingProduction',
    [orderStatus.payFinish]: 'enumCommon.paid',
    [orderStatus.pendingSubmit]: 'enumCommon.Tobesubmitted',
};

// 订单状态
export enum orderReviewStatus {
    pendingProcess = '1',
    processPass = '2',
    processNoPass = '3',
}
export const orderReviewStatusText: Record<string, any> = {
    [orderReviewStatus.pendingProcess]: 'enumCommon.pendingReview',
    [orderReviewStatus.processPass]: 'enumCommon.approved',
    [orderReviewStatus.processNoPass]: 'enumCommon.reviewFailed',
};

// 订单支付状态
export enum orderPayStatus {
    pendingProcess = '1',
    processPass = '2',
    processNoPass = '3',
}
export const orderPayStatusText: Record<string, any> = {
    [orderReviewStatus.pendingProcess]: 'enumCommon.pendingReview',
    [orderReviewStatus.processPass]: 'enumCommon.approved',
    [orderReviewStatus.processNoPass]: 'enumCommon.reviewFailed',
};

// 文件预览弹框传参
export interface filePreviewType {
    url: string,
    name: string,
    type: string,
    index: number,
    urlList: string[]
}

export enum HttpStatus {
    /**
     * 操作成功
     */
    SUCCESS = 200,
    /**
     * 对象创建成功
     */
    CREATED = 201,
    /**
     * 请求已经被接受
     */
    ACCEPTED = 202,
    /**
     * 操作已经执行成功，但是没有返回数据
     */
    NO_CONTENT = 204,
    /**
     * 资源已经被移除
     */
    MOVED_PERM = 301,
    /**
     * 重定向
     */
    SEE_OTHER = 303,
    /**
     * 资源没有被修改
     */
    NOT_MODIFIED = 304,
    /**
     * 参数列表错误（缺少，格式不匹配）
     */
    PARAM_ERROR = 400,
    /**
     * 未授权
     */
    UNAUTHORIZED = 401,
    /**
     * 访问受限，授权过期
     */
    FORBIDDEN = 403,
    /**
     * 资源，服务未找到
     */
    NOT_FOUND = 404,
    /**
     * 不允许的http方法
     */
    BAD_METHOD = 405,
    /**
     * 资源冲突，或者资源被锁
     */
    CONFLICT = 409,
    /**
     * 不支持的数据，媒体类型
     */
    UNSUPPORTED_TYPE = 415,
    /**
     * 系统内部错误
     */
    SERVER_ERROR = 500,
    /**
     * 接口未实现
     */
    NOT_IMPLEMENTED = 501,
    /**
     * 服务不可用，过载或者维护
     */
    BAD_GATEWAY = 502,
    /**
     * 网关超时
     */
    GATEWAY_TIMEOUT = 504,
    /**
     * 未知错误
     */
    UNKNOWN_ERROR = 520,
    /**
     * 服务未知错误
     */
    SERVICE_ERROR = 521,
    /**
     * 数据库未知错误
     */
    DATABASE_ERROR = 522,
    /**
     * 系统警告消息
     */
    WARN = 601
}

// 是否
export const yesOrNo = {
    '0': 'enumCommon.no',
    '1': 'enumCommon.yes'
}

// 公司or个人
export const customerTypeEnum = {
    '0': 'addressPage.company',
    '1': 'addressPage.individualCustomer',
}

// 包装要求
export const packAskEnum = {
    '1': 'enumCommon.ourFactoryLogo',
    '2': 'enumCommon.neutralPackaging',
}

// 送货单
export const deliverOrderEnum = {
    '1': 'enumCommon.electronicVersion',
    '2': 'enumCommon.paper',
}

// 制造周期
export const manufacturingCycleEnum = {
    '1': 'enumCommon.urgentOrder',
    '2': 'enumCommon.byCycle',
}

// 发货通知
export const deliveryCycleEnum = {
    '1': 'enumCommon.noNeedFor',
    '2': 'enumCommon.need',
}

// PCBA类型
export const PCBATypeEnum = {
    '1': 'pcbaPage.economic',
    '2': 'pcbaPage.standard',
}

// 装配面
export const assemblySideEnum = {
    '1': 'pcbaPage.topSide',
    '2': 'pcbaPage.bottomSide',
    '3': 'pcbaPage.bothSide',
}