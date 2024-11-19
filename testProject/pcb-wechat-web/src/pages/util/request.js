import config, {CLIENT_ID, API_PREFIX, API_ORDER_PREFIX} from "../config/commonConfig";
import Taro from "@tarojs/taro";
import {loginOut, getCurrentPageRoute} from './func';
import {encryptBase64, encryptWithAes, generateAesKey} from './crypto';
import {encrypt} from './jsencrypt';


const getAuthHeaders = () => {
  let token = Taro.getStorageSync('__TOKEN__');
  if (null != token && '' !== token) {
    return {
      Authorization: 'Bearer ' + token,
      Clientid: CLIENT_ID,
    };
  } else {
    return {};
  }
};

const buildUrl = (domain, path, isOrder = false) => {
  // 判断 path 开头是否包含斜杠
  const hasLeadingSlash = path.startsWith('/');

  // 拼接域名、前缀和端口
  let url = `${domain}` + (isOrder ? API_ORDER_PREFIX : ('' + API_PREFIX));

  // 根据是否有斜杠来添加 path
  if (hasLeadingSlash) {
    url += path;
  } else {
    url += '/' + path;
  }

  return url;
}

const loginAuth = (url, params, errorMsg, errorCb) => {
  const aesKey = generateAesKey();
  let encryptKey = encrypt(encryptBase64(aesKey))
  let data = encryptWithAes(JSON.stringify(params), aesKey);
  return new Promise((resolve, reject) => {
    Taro.request({
      url: buildUrl(config.domain, url),
      data: data,
      header: {
        ...getAuthHeaders(),
        'content-type': 'application/json;charset=utf-8', // 默认值
        'Encrypt-key': encryptKey,
        'Clientid': params.clientId,
      },
      timeout: 60000,
      method: 'POST',
    }).then((res) => {
      const code = res?.data.code;
      const msg = res?.data.msg;
      if (code === 401) {
        Taro.showToast({
          title: '登录超时',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            loginOut();
          }, 1500);
        })
      } else if (code === 200) {
        Taro.setStorage({
          data: res.data.data.access_token,
          key: '__TOKEN__',
        }).then(e => {
          resolve(res.data);
        }).catch(e => {
          reject(null);
        });
      } else {
        if (errorMsg) {
          Taro.showToast({
            title: msg ? msg : '服务器异常',
            icon: msg ? 'none' : 'error',
            duration: 3000
          }).then()
        }
        if (errorCb) {
          errorCb(res.data);
        }
        reject(res.data);
      }
    }).catch((err) => {
      Taro.showToast({
        title: JSON.stringify(err),
        icon: 'none',
        duration: 3000
      }).then((r) => {
        errorCb && errorCb(r);
      })
      reject(err);
    })
  })
}

const get = (url, params, errorMsg, errorCb) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: buildUrl(config.domain, url),
      data: params,
      header: {
        ...getAuthHeaders(),
      },
      method: 'GET',
    }).then((res) => {
      const code = res?.data.code;
      const msg = res?.data.msg;
      if (code === 401) {
        Taro.showToast({
          title: '登录超时',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            loginOut();
          }, 1500);
        })
      } else if (code === 200) {
        resolve(res.data);
      } else if (code == 540) {
        Taro.showToast({
          title: msg ? msg : '服务器异常',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            Taro.redirectTo({url: '/pages/home/home'})
          }, 1000);
        })
      } else {
        if (errorMsg) {
          Taro.showToast({
            title: msg ? msg : '服务器异常',
            icon: msg ? 'none' : 'error',
            duration: 3000
          }).then()
        }
        if (errorCb) {
          errorCb(res.data);
        }
        reject(res.data);
      }
    }).catch((err) => {
      Taro.showToast({
        title: JSON.stringify(err),
        icon: 'none',
        duration: 3000
      }).then((r) => {
        errorCb && errorCb(r);
      })
      reject(err);
    })
  })
}
const postJson = (url, params, errorMsg, errorCb) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: buildUrl(config.domain, url),
      data: params,
      header: {
        ...getAuthHeaders(),
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      method: 'POST',
    }).then((res) => {
      const code = res?.data.code;
      const msg = res?.data.msg;
      if (code === 401) {
        Taro.showToast({
          title: '登录超时',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            loginOut();
          }, 1500);
        })
      } else if (code === 200) {
        resolve(res.data);
      } else if (code == 540) {
        Taro.showToast({
          title: msg ? msg : '服务器异常',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            Taro.redirectTo({url: '/pages/home/home'})
          }, 1000);
        })
      } else {
        if (errorMsg) {
          Taro.showToast({
            title: msg ? msg : '服务器异常',
            icon: msg ? 'none' : 'error',
            duration: 3000
          }).then()
        }
        if (errorCb) {
          errorCb(res.data);
        }
        reject(res.data);
      }
    }).catch((err) => {
      Taro.showToast({
        title: JSON.stringify(err),
        icon: 'none',
        duration: 3000
      }).then((r) => {
        errorCb && errorCb(r);
      })
      reject(err);
    })
  })
};
const putJson = (url, params, errorMsg, errorCb) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: buildUrl(config.domain, url),
      data: params,
      header: {
        ...getAuthHeaders(),
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      method: 'PUT',
    }).then((res) => {
      const code = res?.data.code;
      const msg = res?.data.msg;
      if (code === 401) {
        Taro.showToast({
          title: '登录超时',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            loginOut();
          }, 1500);
        })
      }else if (code === 200) {
        resolve(res.data);
      } else if (code == 540) {
        Taro.showToast({
          title: msg ? msg : '服务器异常',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/home/home'})
          }, 1000);
        })
      } else {
        if (errorMsg) {
          Taro.showToast({
            title: msg ? msg : '服务器异常',
            icon: msg ? 'none' : 'error',
            duration: 3000
          }).then()
        }
        if (errorCb) {
          errorCb(res.data);
        }
        reject(res.data);
      }
    }).catch((err) => {
      Taro.showToast({
        title: JSON.stringify(err),
        icon: 'none',
        duration: 3000
      }).then((r) => {
        errorCb && errorCb(r);
      })
      reject(err);
    })
  })
};
const deleteJson = (url, params, errorMsg, errorCb) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: buildUrl(config.domain, url),
      data: params,
      header: {
        ...getAuthHeaders(),
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      method: 'DELETE',
    }).then((res) => {
      const code = res?.data.code;
      const msg = res?.data.msg;
      if (code === 401) {
        Taro.showToast({
          title: '登录超时',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            loginOut();
          }, 1500);
        })
      }else if (code === 200) {
        resolve(res.data);
      } else if (code == 540) {
        Taro.showToast({
          title: msg ? msg : '服务器异常',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/home/home'})
          }, 1000);
        })
      } else {
        if (errorMsg) {
          Taro.showToast({
            title: msg ? msg : '服务器异常',
            icon: msg ? 'none' : 'error',
            duration: 3000
          }).then()
        }
        if (errorCb) {
          errorCb(res.data);
        }
        reject(res.data);
      }
    }).catch((err) => {
      Taro.showToast({
        title: JSON.stringify(err),
        icon: 'none',
        duration: 3000
      }).then((r) => {
        errorCb && errorCb(r);
      })
      reject(err);
    })
  })
};
const customAPI = (url, params, errorMsg, errorCb) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: params?.isCustom ? url : buildUrl(config.orderDomain, url, true),
      data: params?.data,
      header: {
        ...getAuthHeaders(),
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      method: params?.method ? params.method : 'GET',
    }).then((res) => {
      const code = res?.data.code;
      const msg = res?.data.msg;
      if (code === 401) {
        Taro.showToast({
          title: '登录超时',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            loginOut();
          }, 1500);
        })
      } else if (code === 200) {
        resolve(res.data);
      } else if (code == 540) {
        Taro.showToast({
          title: msg ? msg : '服务器异常',
          icon: 'error',
          duration: 3000
        }).then(() => {
          setTimeout(() => {
            Taro.redirectTo({url: '/pages/home/home'})
          }, 1000);
        })
      } else {
        if (errorMsg) {
          Taro.showToast({
            title: msg ? msg : '服务器异常',
            icon: msg ? 'none' : 'error',
            duration: 3000
          }).then()
        }
        if (errorCb) {
          errorCb(res.data);
        }
        reject(res.data);
      }
    }).catch((err) => {
      Taro.showToast({
        title: JSON.stringify(err),
        icon: 'none',
        duration: 3000
      }).then((r) => {
        errorCb && errorCb(r);
      })
      reject(err);
    })
  })
};

export default {get, postJson, loginAuth, customAPI, putJson, deleteJson};
