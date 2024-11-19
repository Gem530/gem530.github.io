import { e } from "unocss";

// 根据文件名字，获取上传地址和参数 响应值
export interface SignedUrlResult {
    key: string;
    'Content-Disposition': string;
    OSSAccessKeyId: string;
    success_action_status: string;
    'x-oss-forbid-overwrite': string;
    policy: string;
    Signature: string;
    /**
     * getUploadUrl 接口返回的url地址
     */
    urlStr: string;
}

// 文件下载URL获取 响应值
export interface UrlByKeysResult {
    [key: string]: string
}

export interface FileItemVO {
    url: string;
    key: string;
    name: string;
    size: number;
}

export interface FileQuery extends PageQuery {
    url?: string;
    key?: string;
    name?: string;
    size?: number;
    bizId?: string;
    bizType?: string;
    type?: string;
    modulesCode?: string;
    isSignHistory?: boolean;
    bizTypeList?: string[];
}
export interface FileItemForm extends BaseEntity {
    url?: string;
    key?: string;
    name?: string;
    size?: number;
}
