import MobileDetect from 'mobile-detect'
const userAgent = navigator.userAgent;
const md: any = new MobileDetect(userAgent);

// 检测操作系统，返回操作系统字符串或者null。
// 可能得到的值：AndroidOS, BlackBerryOS, PalmOS
export const os = ()=>{
    return md.os();
}

// 浏览器宽度
export const width = ()=>{
    return document.documentElement.clientWidth;
}

// 浏览器高度
export const height = ()=>{
    return document.documentElement.clientHeight;
}

// 获取手机或平板电脑类型，若不是移动设备，则返回null。若检测不到设备，则会返回UnknownPhone或UnknownTablet或UnknownMobile。
export const model = ()=>{
    return md.mobile();
}

// 返回平板电脑系列或制作人的关键，例如“SamsungTablet”。无则返回null。
export const tablet = ()=>{
    return md.tablet();
}

// 手机版本号
export const version = ()=>{
    if(md.os()==="iOS"){
        return md.version("iPhone")
    }else if(md.os()==="AndroidOS"){
        return md.version("Android")
    }
}

// 浏览器名称
export const browserName = ()=>{
    return md.userAgent();
}

// 浏览器版本号
export const browserVersion = ()=>{
    let versions="";
    const UserAgent = md.ua.toLowerCase();
    const browserArray = {
        chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1,    
        firefox: UserAgent.indexOf('firefox') > -1,    
        opera: UserAgent.indexOf('opera') > -1,     
        safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1
    }
    const keyList = Object.keys(browserArray);
    let isMatch = undefined;
    if(UserAgent.match(/browser\/([\d.]+)/)){
        isMatch = UserAgent.match(/browser\/([\d.]+)/);
    }else if(keyList.some(v=>v==="safari")){
        isMatch = UserAgent.match(/safari\/([\d.]+)/);
    }else if(keyList.some(v=>v==="chrome")){
        isMatch = UserAgent.match(/chrome\/([\d.]+)/);
    }else if(keyList.some(v=>v==="firefox")){
        isMatch = UserAgent.match(/firefox\/([\d.]+)/);
    }else if(keyList.some(v=>v==="opera")){
        isMatch = UserAgent.match(/opera\/([\d.]+)/);
    }
    versions = isMatch?isMatch[1]:undefined
    return versions;
}

// 手机品牌
export const brand = ()=>{
    return md.phone()
}

// 本地语言
export const lang = ()=>{
    return navigator.language;
}

// 国家
export const local = (key: string)=>{
    const localeList: Record<string, string> = {
        "bg-BG":"保加利亚",
        "bn-BD":"孟加拉国",
        "da-DK":"丹麦",
        "de-DE":"德国",
        "de-DE-formal":"德国",
        "el-GR":"希腊",
        "en-US":"美国",
        "en-EN":"英国",
        "es-ES":"西班牙",
        "fa-IR":"波斯",
        "fr-FR":"法语",
        "he-IL":"希伯来语",
        "hi-IN":"印地",
        "id-ID":"印度尼西亚",
        "is-IS":"冰岛",
        "it-IT":"意大利",
        "ja-JP":"日本",
        "ko-KR":"韩国/朝鲜",
        "la-LA":"老挝",
        "nb-NO":"挪威",
        "pt-BR":"巴西",
        "ro-RO":"罗马尼亚",
        "ru-RU":"俄罗斯",
        "sv-SE":"瑞典",
        "r-TR":"土耳其",
        "th-TH":"泰国",
        "uk-UA":"乌克兰",
        "vi-VN":"越南",
        "zh-CN":"中国",
        "zh-HK":"中国香港",
        "zh-TW":"中国台湾"
    }
    if(key){
        return localeList[key]||""
    }else{
        return ""
    }
}

export const device = () => {
  return {
    os:os(),
    tablet: tablet(),
    width:width(),
    height:height(),
    model:model(),
    version:version(),
    browserName:browserName(),
    browserVersion:browserVersion(),
    brand:brand(),
    lang:lang(),
    local:local(lang())
  }
};

export default device