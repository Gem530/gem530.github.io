import JSEncrypt from 'jsencrypt';
const privateKey = '******';

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            encrypt: (txt: string) => {
                const publicKey = env().VITE_APP_RSA_PUBLIC_KEY
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(publicKey); // 设置公钥
                return encryptor.encrypt(txt); // 对数据进行加密
            },
            decrypt: (txt: string) => {
                const encryptor = new JSEncrypt();
                encryptor.setPrivateKey(privateKey); // 设置私钥
                return encryptor.decrypt(txt); // 对数据进行解密
            }
        }
    }
})
// // 密钥对生成 http://web.chacuo.net/netrsakeypair

// // const publicKey = useRuntimeConfig().public.VITE_APP_RSA_PUBLIC_KEY; 会报错，需要写到方法中

// // 前端不建议存放私钥 不建议解密数据 因为都是透明的意义不大
// const privateKey = '******';

// // 加密
// export const encrypt = (txt: string) => {
//   const publicKey = env().VITE_APP_RSA_PUBLIC_KEY
//   const encryptor = new JSEncrypt();
//   encryptor.setPublicKey(publicKey); // 设置公钥
//   return encryptor.encrypt(txt); // 对数据进行加密
// };

// // 解密
// export const decrypt = (txt: string) => {
//   const encryptor = new JSEncrypt();
//   encryptor.setPrivateKey(privateKey); // 设置私钥
//   return encryptor.decrypt(txt); // 对数据进行解密
// };
