export const useLang = () => {
    return useState('lang', () => useRuntimeConfig().public.VITE_BASE_LOCALE)
}

export const useIPLang = () => {
    return useState('iplang', () => '')
}