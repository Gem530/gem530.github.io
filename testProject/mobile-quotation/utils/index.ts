// 获取env的配置
export const env = () => {
    return useRuntimeConfig().public
}

// 判断变量类型 返回小写单词
export const isType = (val: any) => {
    let type = Object.prototype.toString.call(val).replace(']', '').split(' ')[1].toLocaleLowerCase()
    return type
}

// // 日期格式化
// export function parseTime(time: any, pattern?: string) {
//     if (arguments.length === 0 || !time) {
//         return null;
//     }
//     const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
//     let date;
//     if (typeof time === 'object') {
//         date = time;
//     } else {
//         if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
//             time = parseInt(time);
//         } else if (typeof time === 'string') {
//             time = time
//                 .replace(new RegExp(/-/gm), '/')
//                 .replace('T', ' ')
//                 .replace(new RegExp(/\.[\d]{3}/gm), '');
//         }
//         if (typeof time === 'number' && time.toString().length === 10) {
//             time = time * 1000;
//         }
//         date = new Date(time);
//     }
//     const formatObj: { [key: string]: any } = {
//         y: date.getFullYear(),
//         m: date.getMonth() + 1,
//         d: date.getDate(),
//         h: date.getHours(),
//         i: date.getMinutes(),
//         s: date.getSeconds(),
//         a: date.getDay()
//     };
//     return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result: string, key: string) => {
//         let value = formatObj[key];
//         // Note: getDay() returns 0 on Sunday
//         if (key === 'a') {
//             return ['日', '一', '二', '三', '四', '五', '六'][value];
//         }
//         if (result.length > 0 && value < 10) {
//             value = '0' + value;
//         }
//         return value || 0;
//     });
// }

/**
 * 添加日期范围
 * @param params
 * @param dateRange
 * @param propName
 */
export const addDateRange = (params: any, dateRange: any[], propName?: string) => {
    const search = params;
    search.params = typeof search.params === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof propName === 'undefined') {
        search.params['beginTime'] = dateRange[0];
        search.params['endTime'] = dateRange[1];
    } else {
        search.params['begin' + propName] = dateRange[0];
        search.params['end' + propName] = dateRange[1];
    }
    return search;
};

// 回显数据字典
export const selectDictLabel = (datas: any, value: number | string) => {
    if (value === undefined) {
        return '';
    }
    const actions = [];
    Object.keys(datas).some((key) => {
        if (datas[key].value == '' + value) {
            actions.push(datas[key].label);
            return true;
        }
    });
    if (actions.length === 0) {
        actions.push(value);
    }
    return actions.join('');
};

// 回显数据字典（字符串数组）
export const selectDictLabels = (datas: any, value: any, separator: any) => {
    if (value === undefined || value.length === 0) {
        return '';
    }
    if (Array.isArray(value)) {
        value = value.join(',');
    }
    const actions: any[] = [];
    const currentSeparator = undefined === separator ? ',' : separator;
    const temp = value.split(currentSeparator);
    Object.keys(value.split(currentSeparator)).some((val) => {
        let match = false;
        Object.keys(datas).some((key) => {
            if (datas[key].value == '' + temp[val]) {
                actions.push(datas[key].label + currentSeparator);
                match = true;
            }
        });
        if (!match) {
            actions.push(temp[val] + currentSeparator);
        }
    });
    return actions.join('').substring(0, actions.join('').length - 1);
};

// 字符串格式化(%s )
export function sprintf(str: string) {
    if (arguments.length !== 0) {
        let flag = true,
            i = 1;
        str = str.replace(/%s/g, function () {
            const arg = arguments[i++];
            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    }
}

// 转换字符串，undefined,null等转化为""
export const parseStrEmpty = (str: any) => {
    if (!str || str == 'undefined' || str == 'null') {
        return '';
    }
    return str;
};

// 数据合并
export const mergeRecursive = (source: any, target: any) => {
    for (const p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p]);
            } else {
                source[p] = target[p];
            }
        } catch (e) {
            source[p] = target[p];
        }
    }
    return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export const handleTree = <T>(data: any[], id?: string, parentId?: string, children?: string): T[] => {
    const config: {
        id: string;
        parentId: string;
        childrenList: string;
    } = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    const childrenListMap: any = {};
    const nodeIds: any = {};
    const tree: T[] = [];

    for (const d of data) {
        const parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (const d of data) {
        const parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }
    const adaptToChildrenList = (o: any) => {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (const c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    };

    for (const t of tree) {
        adaptToChildrenList(t);
    }

    return tree;
};

/**
 * 参数处理
 * @param {*} params  参数
 */
export const tansParams = (params: any) => {
    let result = '';
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        const part = encodeURIComponent(propName) + '=';
        if (value !== null && value !== '' && typeof value !== 'undefined') {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
                        const params = propName + '[' + key + ']';
                        const subPart = encodeURIComponent(params) + '=';
                        result += subPart + encodeURIComponent(value[key]) + '&';
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + '&';
            }
        }
    }
    return result;
};

// 返回项目路径
export const getNormalPath = (p: string): string => {
    if (p.length === 0 || !p || p === 'undefined') {
        return p;
    }
    const res = p.replace('//', '/');
    if (res[res.length - 1] === '/') {
        return res.slice(0, res.length - 1);
    }
    return res;
};

// 验证是否为blob格式
export const blobValidate = (data: any) => {
    return data.type !== 'application/json';
};

/**
 * 表格时间格式化
 */
export const formatDate = (cellValue: string) => {
    if (cellValue == null || cellValue == '') return '';
    const date = new Date(cellValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

// /**
//  * @param {number} time
//  * @param {string} option
//  * @returns {string}
//  */
// export const formatTime = (time: string, option: string) => {
//     let t: number;
//     if (('' + time).length === 10) {
//         t = parseInt(time) * 1000;
//     } else {
//         t = +time;
//     }
//     const d: any = new Date(t);
//     const now = Date.now();

//     const diff = (now - d) / 1000;

//     if (diff < 30) {
//         return '刚刚';
//     } else if (diff < 3600) {
//         // less 1 hour
//         return Math.ceil(diff / 60) + '分钟前';
//     } else if (diff < 3600 * 24) {
//         return Math.ceil(diff / 3600) + '小时前';
//     } else if (diff < 3600 * 24 * 2) {
//         return '1天前';
//     }
//     if (option) {
//         return parseTime(t, option);
//     } else {
//         return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
//     }
// };

/**
 * @param {string} url
 * @returns {Object}
 */
export const getQueryObject = (url: string) => {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj: { [key: string]: string } = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
};

/**
 * @param {string} input value
 * @returns {number} output value
 */
export const byteLength = (str: string) => {
    // returns the byte length of an utf8 string
    let s = str.length;
    for (let i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--;
    }
    return s;
};

/**
 * @param {Array} actual
 * @returns {Array}
 */
export const cleanArray = (actual: Array<any>) => {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
};

/**
 * @param {Object} json
 * @returns {Array}
 */
export const param = (json: any) => {
    if (!json) return '';
    return cleanArray(
        Object.keys(json).map((key) => {
            if (json[key] === undefined) return '';
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        })
    ).join('&');
};

/**
 * @param {string} url
 * @returns {Object}
 */
export const param2Obj = (url: string) => {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
    if (!search) {
        return {};
    }
    const obj: any = {};
    const searchArr = search.split('&');
    searchArr.forEach((v) => {
        const index = v.indexOf('=');
        if (index !== -1) {
            const name = v.substring(0, index);
            const val = v.substring(index + 1, v.length);
            obj[name] = val;
        }
    });
    return obj;
};

/**
 * @param {string} val
 * @returns {string}
 */
export const html2Text = (val: string) => {
    const div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent || div.innerText;
};

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export const objectMerge = (target: any, source: any | any[]) => {
    if (typeof target !== 'object') {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach((property) => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
};

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export const toggleClass = (element: HTMLElement, className: string) => {
    if (!element || !className) {
        return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += '' + className;
    } else {
        classString = classString.substring(0, nameIndex) + classString.substring(nameIndex + className.length);
    }
    element.className = classString;
};

/**
 * @param {string} type
 * @returns {Date}
 */
export const getTime = (type: string) => {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    } else {
        return new Date(new Date().toDateString());
    }
};

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export const debounce = (func: any, wait: number, immediate: boolean) => {
    let timeout: any, args: any, context: any, timestamp: any, result: any;

    const later = function () {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return (...args: any) => {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
};

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export const deepClone = (source: any) => {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone' as any);
    }
    const targetObj: any = source.constructor === Array ? [] : {};
    Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
};

//根据索引获取字符名称，0 对应 A
export const getCharName = (index: any) => {
    return String.fromCharCode(65 + index);
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export const uniqueArr = (arr: any) => {
    return Array.from(new Set(arr));
};

/**
 * @returns {string}
 */
export const createUniqueString = (): string => {
    const timestamp = +new Date() + '';
    const num = (1 + Math.random()) * 65536;
    const randomNum = parseInt(num + '');
    return (+(randomNum + timestamp)).toString(32);
};

/**
 * Check if an element has a class
 * @param ele
 * @param {string} cls
 * @returns {boolean}
 */
export const hasClass = (ele: HTMLElement, cls: string): boolean => {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

/**
 * Add class to element
 * @param ele
 * @param {string} cls
 */
export const addClass = (ele: HTMLElement, cls: string) => {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
};

/**
 * Remove class from element
 * @param ele
 * @param {string} cls
 */
export const removeClass = (ele: HTMLElement, cls: string) => {
    if (hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
};

/**
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path: string) => {
    return /^(https?:|http?:|mailto:|tel:)/.test(path);
};

/**
 * 指定位置字母转大写
 * @param {string} str
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export const strToUpper = (str: string, start: number = 0, end: number = start + 1): string => {
    let res = str.substring(0, start) + str.substring(start, end).toLocaleUpperCase() + str.substring(end)
    return res
}

/**
 * 指定位置字母转小写
 * @param {string} str
 * @param {number} start
 * @param {number} end
 * @returns {string}
 */
export const strToLower = (str: string, start: number = 0, end: number = start + 1): string => {
    let res = str.substring(0, start) + str.substring(start, end).toLocaleLowerCase() + str.substring(end)
    return res
}

/**
 * 5的倍数
 * @param {any} data 数据来源
 * @param {string} field 字段名
 */
export const mustFive = (data: any, field: string) => {
    if (typeof Number(data[field]) == 'number' && data[field] % 5 == 0) {
        data[field] = Number(data[field])
    } else {
        data[field] = undefined
        // showToast('请输入5的倍数!')
    }
}

// 模板页面 登录或者退出登录
export const logHandle = () => {
    if (userInfo().value?.userName) {
        // 退出登录
        logOut()
    } else {
        // 去登录
        navigateTo('/login')
    }
}

// 文字 加密*
export const textEncrypt = (text: string, start: number, end: number, symbol: string = '****') => {
    return text.substring(0, start) + symbol + text.substring(end)
}

/**
 * 文件列表数据处理
 * @param arr 文件数组
 * @param type object:返回对象 array:返回数组
 */
export const fileDeal = (arr: any[], type: string = 'array') => {
    if (!arr?.length) return []
    let res: any = []
    if (type == 'array') {
        res = deepClone(arr).map((v: any) => {
            return {
                fileKey: v.key,
                fileName: v.name,
                fileSize: v.size,
                fileSuffix: v.type
            }
        })
    } else {
        const v = arr[0]
        res = {
            fileKey: v.key,
            fileName: v.name,
            fileSize: v.size,
            fileSuffix: v.type
        }
    }
    return res
}

// 导入静态图片
export const importImage = (path: string) => {
    // 本地导入静态图片
    // const glob: any = import.meta.glob(`https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/**/*`, {eager:true})
    // return glob[`/assets/images/${path}`]["default"]
    // 替换网络路径
    return `https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/${path}`
}

// 判断是否为图片
export const isImage = (ext: string) => {
    return ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp', '.psd', '.svg', '.tiff'].indexOf(ext.toLowerCase()) !== -1;
}

// 获取后缀名
export const getExt = (url: string, str: string = '.') => {
    //获取最后一个.的位置
    const index= url.lastIndexOf(str);
    //获取后缀
    const ext = url.substring(index);
    return ext.toLocaleLowerCase()
}

// 返回文件格式或后缀名
export const matchFileType = (ext: string) => {
    let result = ext.substring(1)
    if (['doc','docx'].includes(ext)) {
        result = 'Word'
    }
    if (['xls','xlsx'].includes(ext)) {
        result = 'Excel'
    }
    if (['ppt','pptx'].includes(ext)) {
        result = 'PPT'
    }
    return result
}

// 返回文件预览格式
export const returnFileFormat = (ext: string) => {
    let res = ''
    if (isImage(getExt(ext))) {
        res = 'image'
    } else if (getExt(ext) == '.pdf') {
        res = 'pdf'
    } else {
        res = matchFileType(getExt(ext))
    }
    return res
}

// 金额千分号，逗号分隔
export const priceFormat = (val: number|string, float: number = 2) => {
    let num: string | number = Number(val || 0)
    if (float <= 0) {
        num = num.toString().replace(/^-?\d+/g, (m: string) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    } else {
        num = num.toFixed(float).toString().replace(/^-?\d+/g, (m: string) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    }
    return num
}

// 打开livechat聊天框
export const openLivechat = () => {
    if (document.querySelector('#chat-widget-container')) {
        // console.log(window, window.LiveChatWidget)
        (window as any).LC_API.open_chat_window()
    }
}