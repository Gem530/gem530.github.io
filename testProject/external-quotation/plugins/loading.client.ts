let loading: any = undefined;

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            loadingStart: (option?: Record<string, any>) => {
                loading = ElLoading.service(option)
            },
            loadingEnd: () => {
                loading?.close()
            }
        }
    }
})