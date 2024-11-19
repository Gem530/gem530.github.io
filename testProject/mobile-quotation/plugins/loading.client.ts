let loading: any = undefined;

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            loadingStart: (option?: Record<string, any>) => {
                const options = {
                    duration: 0,
                    forbidClick: true,
                }
                loading = showLoadingToast(Object.assign(options, option))
            },
            loadingEnd: () => {
                closeToast()
            }
        }
    }
})