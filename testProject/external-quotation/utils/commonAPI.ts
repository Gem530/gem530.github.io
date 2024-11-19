// 获取用户信息
export const getInfo = () => {
    return new Promise((resolve, reject) => {
        $http('/user/getInfo', {
            method: 'get'
        }).then((res: any) => {
            userInfo().value = res?.data
            setLocal('userInfo')
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

// 获取用户信息
export const logOut = (redirect?: string) => {
    return new Promise((resolve, reject) => {
        $http('/auth/logout', {
            method: 'post'
        }).then((res: any) => {
            // 删除全局数据持久化
            removeLocal()
            localStorage.removeItem('useAccessToken')
            navigateTo(`/login${redirect ? `?redirect=${redirect}` : ''}`)
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

// 获取订单数量
export const getOrderNum = () => {
    return new Promise((resolve, reject) => {
        $http('/purchase/sale/count', {
            method: 'get',
        }).then((res: any) => {
            // state.tableData = res.data || []
            // console.log(res)
            useOrderNumber().value = res.data
            setLocal('useOrderNumber')
            resolve(useOrderNumber().value)
        }).catch((err) => {
            reject(err)
        })
    })
}

// 通过key获取文件url
export const getUrlByKeys = (key: string): any => {
    return new Promise((resolve, reject) => {
        $http('/resource/oss/getUrlByKeys', {
            method: 'get',
            loading: true,
            query: { keys: key }
        }).then((res: any) => {
            const { data } = res
            resolve(data[key])
        }).catch((err: any) => {
            reject(err)
        })
    })
}

// 下载文件
export const downloadFile = (key: string): any => {
    getUrlByKeys(key).then((data: string) => {
        const tempUrl = data.includes('http:') ? data.replace('http:', 'https:') : data
        window.open(tempUrl)
    })
    // $http('/resource/oss/getUrlByKeys', {
    //     method: 'get',
    //     loading: true,
    //     query: { keys: key }
    // }).then((res: any) => {
    //     const { data } = res
    //     // console.log(data)
    //     window.open(data[key])
    // })
}