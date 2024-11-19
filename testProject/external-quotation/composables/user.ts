// 用户信息
export const userInfo = () => {
    return useState('userInfo', (): any => undefined)
}

// 计价页信息
export const useOnlineData = () => {
    return useState('onlineData', (): any => undefined)
}

// token
export const useAccessToken = () => {
    return useState('token', (): any => undefined)
}

// 选中的国家信息
export const useCountryInfo = () => {
    return useState('countryInfo', (): any => {
        return {name:"Us",icon:"us"}
    })
}
// 选中的货币信息
export const useCurrencyInfo = () => {
    return useState('currencyInfo', (): any => {
        return {name:"USD",value:"$"}
    })
}
// 选中的语言
export const useLangInfo = () => {
    return useState('langInfo', (): any => {
        return {name:"English",value:"en_US"}
    })
}

// 选择的订单
export const useSelectOrder = () => {
    return useState('selectOrder', (): any => {
        return {
            orders: []
        }
    })
}

// 订单数量
export const useOrderNumber = () => {
    return useState('orderNumber', (): any => {
        return {
            '1': 0,
            '2': 0,
            '4': 0,
            '5': 0,
        }
    })
}

// 选择的订单
export const usePcbAOrder = () => {
    return useState('pcbAOrder', (): any => {
        return undefined
    })
}

// 需要持久化的数据
const enduring: { [key: string]: () => Ref<any> } = {
    userInfo,
    useLangInfo,
    usePcbAOrder,
    // useOnlineData,
    useOrderNumber,
    useSelectOrder,
    useAccessToken,
    useCountryInfo,
    useCurrencyInfo,
}

// 持久化
export const setLocal = (key?: string) => {
    if (key) {
        if (enduring[key]) {
            localStorage.setItem(key, encryptWithAes(JSON.stringify(enduring[key]().value), env().VITE_ABC))
        }
    } else {
        for (let i in enduring) {
            localStorage.setItem(i, encryptWithAes(JSON.stringify(enduring[i]().value), env().VITE_ABC))
        }
    }
}
export const getLocal = () => {
    try {
        for (let i in enduring) {
            const localData = localStorage.getItem(i)
            if (localData) {
                enduring[i]().value = JSON.parse(decryptWithAes(localData, env().VITE_ABC))
            }
        }
    } catch(err) {
        try {
            for (let i in enduring) {
                let localData = localStorage.getItem(i)
                if (localData) {
                    localData = localData.replace(/\"/g,'')
                    enduring[i]().value = JSON.parse(decryptWithAes(localData, env().VITE_ABC))
                }
            }
        } catch(error) {
            removeLocal()
        }
    }
}
export const removeLocal = (key?: string) => {
    if (key) {
        if (enduring[key]) {
            localStorage.removeItem(key)
        }
    } else {
        for (let i in enduring) {
            localStorage.removeItem(i)
        }
    }
}