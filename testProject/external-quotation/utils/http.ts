export const fetchHttp = $fetch.create({
    // onRequest({ request }) {
    //     console.log(request)
    // }
    // onResponse({ response }) {
    //     console.log('response', response)
    // }
})
export const $http = (url: string, fetchParams?: Record<string, any>, isEncrypt: boolean = false) => {
    let controller: any = new AbortController()
    controller.url = url
    const { $encrypt, $loadingEnd, $loadingStart } = useNuxtApp()
    let params = fetchParams || {}
    params.signal = controller.signal
    params.isToken = params?.isToken ? params.isToken : true

    let token = localStorage.getItem('useAccessToken')
    token = token && JSON.parse(decryptWithAes(token, env().VITE_ABC))
    params.headers = {
        'content-language': useLang().value,
        'Authorization': params.isToken ? `Bearer ${token}` : '',
        'clientid': env().VITE_APP_CLIENT_ID,
        ...params?.headers
    }

    // 方法名称全改为大写
    params.method = params?.method ? params?.method.toLocaleUpperCase() : 'GET'
    // 参数加密
    if (params && isEncrypt && ['POST','PUT'].includes(params?.method)) {
        // 生成一个 AES 密钥
        const aesKey = generateAesKey();
        params.headers['encrypt-key'] = $encrypt(encryptBase64(aesKey))
        params.body = typeof params.body === 'object' ? encryptWithAes(JSON.stringify(params.body), aesKey) : encryptWithAes(params.body, aesKey);
    }
    
    return new Promise((resolve, reject) => {
        if (params?.loading) $loadingStart({lock:true,text:'Loading',background: 'rgba(0, 0, 0, 0.7)'})
        fetchHttp((params?.isHttp ? url : env().VITE_BASE_URL + url), params).then((res: any) => {
            if (params?.loading) $loadingEnd()
            // if (!res?.data && !res?.code) {
            //     resolve(res)
            //     return
            // }
            if (params?.isHttp) {
                resolve(res)
                return
            }
            if (res.code == 401) {
                $loadingEnd()
                ElMessage.error(res.msg)
                logOut(useRoute()?.fullPath)
                // navigateTo('/login')
                return
            }
            if (params?.needStatus) {
                resolve(res)
            } else {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    $loadingEnd()
                    ElMessage.error(res.msg || 'Internal Server Error')
                }
            }
        }).catch((err) => {
            if (params?.loading) $loadingEnd()
            if (err.includes('aborted a request')) {
                return
            }
            ElMessage.error(err.msg || 'Internal Server Error')
            reject(err)
        })
        // 取消接口
        // controller.abort()
        // let win: any = window
        // win.controllerArray.push(controller)
        usePenFetch().value.push(controller)
    })
}