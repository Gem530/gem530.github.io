import CryptoJS from 'crypto-js';

/**
 * 随机生成32位的字符串
 * @returns {string}
 */
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * 随机生成aes 密钥
 * @returns {string}
 */
export const generateAesKey = () => {
  return CryptoJS.enc.Utf8.parse(generateRandomString());
};

/**
 * 加密base64
 * @returns {string}
 */
export const encryptBase64 = (str: CryptoJS.lib.WordArray) => {
  return CryptoJS.enc.Base64.stringify(str);
};
/**
 * 加密base64
 * @param str - 原始字符串
 * @returns {string} - base64 编码的字符串
 */
export const encryptBase64ByStr = (str: string) => {
  const wordArray = CryptoJS.enc.Utf8.parse(str);
  return CryptoJS.enc.Base64.stringify(wordArray);
};
/**
 * 解密base64
 * @param {string} encodedStr - base64 编码的字符串
 * @returns {string} - 原始字符串
 */
export const decryptBase64ByStr = (encodedStr: string): CryptoJS.lib.WordArray => {
  const wordArray = CryptoJS.enc.Base64.parse(encodedStr);
  return wordArray.toString(CryptoJS.enc.Utf8);
};
/**
 * 使用密钥对数据进行加密
 * @param message
 * @param aesKey
 * @returns {string}
 */
export const encryptWithAes = (message: string, aesKey: CryptoJS.lib.WordArray) => {
  const encrypted = CryptoJS.AES.encrypt(message, aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};
