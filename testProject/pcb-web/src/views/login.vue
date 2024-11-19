<template>
  <div class="login">
    <el-form ref="loginRef" class="login-form" v-if="loginWay">
      <h2 class="codeTitle">诺思特ERP管理系统</h2>

      <!--      获取二维码-->
      <el-form-item>
        <div class="width-100 global-flex flex-center">
          <div style="width: 200px;height: 200px;position: relative;">
            <el-image style="width: 200px;height: 200px" :src="qrCode" :fit="cover" v-loading="!qrCode">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-image class="fixed-mask" :src="scanLogin" :fit="cover" v-if= "isCodeInvalid && !isCodeScan"  @click="refreshCode">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <el-image class="fixed-mask" :src="codeInvalidImage" :fit="cover"  v-else-if= "!isCodeInvalid"  @click="refreshCode">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>

        </div>
      </el-form-item>
      <div class="title-center">
        <h5 class="title" style="display: inline">请您使用</h5>
        <h5 class="codeTitle" style="display: inline">【微信】</h5>
        <h5 class="title" style="display: inline">扫码登录</h5>
      </div>
<!--      <div class="global-flex mt10" v-if="!isCodeInvalid || !isCodeScan">-->
<!--        <el-button icon="Refresh" type="primary" @click="refreshCode">刷新</el-button>-->
<!--      </div>-->
      <el-divider> 其他登录方式</el-divider>
      <el-form-item>
        <div class="width-100 global-flex flex-center">
          <el-button type="primary" plain title="账号登录" @click="isLoginWay"> 账号密码</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form" v-else>
      <h3 class="title">诺思特ERP管理系统</h3>
      <!-- <el-form-item prop="tenantId" v-if="tenantEnabled">
        <el-select v-model="loginForm.tenantId" filterable placeholder="请选择/输入公司名称" style="width: 100%">
          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId"></el-option>
          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号/手机号">
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码" @keyup.enter="handleLogin">
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <!--      <el-form-item prop="code" v-if="captchaEnabled">-->
      <!--        <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter="handleLogin">-->
      <!--          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>-->
      <!--        </el-input>-->
      <!--        <div class="login-code">-->
      <!--          <img :src="codeUrl" @click="getCode" class="login-code-img" />-->
      <!--        </div>-->
      <!--      </el-form-item>-->
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
<!--      <el-divider> 其他登录方式</el-divider>-->
<!--      <div class="width-100 global-flex flex-center">-->
<!--        <el-form-item>-->
<!--          <el-image :src="LogoImg" style="width: 45px;height: 45px" />-->
<!--          <el-button-->
<!--            v-for="button in buttons"-->
<!--            :key="button.text"-->
<!--            :type="button.type"-->
<!--            text-->
<!--            @click="isQrLoginWay"-->
<!--            style="height: 40px; width: 120px; font-size: larger"-->
<!--          >-->
<!--            {{ button.text }}-->
<!--          </el-button>-->
<!--        </el-form-item>-->
<!--      </div>-->
      <!-- <el-form-item style="float: right;">
        <el-button circle title="微信登录" @click="doSocialLogin('wechat')">
          <svg-icon icon-class="wechat" />
        </el-button>
        <el-button circle title="MaxKey登录" @click="doSocialLogin('maxkey')">
          <svg-icon icon-class="maxkey" />
        </el-button>
        <el-button circle title="Gitee登录" @click="doSocialLogin('gitee')">
          <svg-icon icon-class="gitee" />
        </el-button>
        <el-button circle title="Github登录" @click="doSocialLogin('github')">
          <svg-icon icon-class="github" />
        </el-button>
      </el-form-item> -->
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" target="_blank">渝ICP备 2023002361号-1</a>
      <img src="@/assets/images/bottom.png" />
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50009802001932" target="_blank">渝公网安备 50009802001932号</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getCodeImg,
  getCodeLoginUrl,
  getLoginQRCodePhone,
  getLoginQRCodeValue,
  getScanLoginQRCodeValue,
  getTenantList,
  login
} from '@/api/login';
import {authBinding} from '@/api/system/social/auth';
import {useUserStore} from '@/store/modules/user';
import {LoginData, TenantVO} from '@/api/types';
import {to} from 'await-to-js';
import {HttpStatus} from "@/enums/RespEnum";
import LogoImg from '@/assets/logo/logo.png'
import codeInvalidImage from '@/assets/images/codeInvalid.png'
import scanLogin from '@/assets/images/scanLogin.png'

const userStore = useUserStore();
const router = useRouter();

const buttons = [
  {type: 'primary', text: '小程序登录'},
] as const

const loginForm = ref<LoginData>({
  tenantId: '000000',
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const loginRules: ElFormRules = {
  tenantId: [{required: true, trigger: "blur", message: "请输入您的租户编号"}],
  username: [{required: true, trigger: 'blur', message: '请输入您的账号/手机号'}],
  password: [{required: true, trigger: 'blur', message: '请输入您的密码'}],
  code: [{required: false, trigger: 'change', message: '请输入验证码'}]
};

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(false);
// 租户开关
const tenantEnabled = ref(true);
//进入页面默认选择登录方式
const loginWay = ref(false);
//生成的二维码
const qrCode = ref<any>();
//查询二维码是否失效唯一值
const isCodeInvalid = ref(true);
//查询二维码是否已被扫描
const isCodeScan = ref(true);
const qrCodeId = ref<any>();
const isEndTimeOut = ref(false)


// 注册开关
const register = ref(false);
const redirect = ref(undefined);
const loginRef = ref<ElFormInstance>();
// 租户列表
const tenantList = ref<TenantVO[]>([]);

watch(() => router.currentRoute.value, (newRoute: any) => {
  redirect.value = newRoute.query && newRoute.query.redirect;
}, {immediate: true});

const handleLogin = () => {
  loginRef.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        localStorage.setItem("tenantId", String(loginForm.value.tenantId));
        localStorage.setItem('username', String(loginForm.value.username));
        localStorage.setItem('password', String(loginForm.value.password));
        localStorage.setItem('rememberMe', String(loginForm.value.rememberMe));
      } else {
        // 否则移除
        localStorage.removeItem("tenantId");
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
      }
      // 调用action的登录方法
      const [err] = await to(userStore.login(loginForm.value));
      if (!err) {
        await router.push({path: redirect.value || '/'});
        loading.value = false;
      } else {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

/**
 * 获取验证码
 */
const getCode = async () => {
  const res = await getCodeImg();
  const {data} = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    loginForm.value.uuid = data.uuid;
  }
};

const getLoginData = () => {
  const tenantId = localStorage.getItem("tenantId");
  const username = null;
  const password = null;
  const rememberMe = localStorage.getItem('rememberMe');
  loginForm.value = {
    tenantId: tenantId === null ? String(loginForm.value.tenantId) : tenantId,
    username: username === null ? String(loginForm.value.username) : username,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === null ? false : Boolean(rememberMe)
  } as LoginData;
}


/**
 * 获取租户列表
 */
const initTenantList = async () => {
  const {data} = await getTenantList();
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
    if (tenantList.value != null && tenantList.value.length !== 0) {
      loginForm.value.tenantId = tenantList.value[0].tenantId;
    }
  }
}

//检测租户选择框的变化
watch(() => loginForm.value.tenantId, () => {
  localStorage.setItem("tenantId", String(loginForm.value.tenantId))
});

/**
 * 第三方登录
 * @param type
 */
const doSocialLogin = (type: string) => {
  authBinding(type).then((res: any) => {
    if (res.code === HttpStatus.SUCCESS) {
      // 获取授权地址跳转
      window.location.href = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};

const isLoginWay = () => {
  console.log("切换为账号登录~~")
  loginWay.value = !loginWay
}
const isQrLoginWay = () => {
  console.log("切换为二维码登录~~")
  loginWay.value = true
}

/**
 * 二维码信息
 */
const setQrCode = async () => {
  const res = await getCodeLoginUrl();
  console.log("获取到的地址：", res)
  if (res.code === HttpStatus.SUCCESS) {
    console.log("获取到的地址：", res.data)
    //获取生成二维码地址
    qrCode.value = "data:image/png;base64," + res.data.image
    console.log("qrCode:", qrCode.value);
    console.log("isCodeInvalid:", isCodeInvalid.value);
    //给唯一标识赋值
    qrCodeId.value = res.data.id
  }
}

let time = null

//轮询调用
function getQrCodeValue() {
  const isCodeInterval = async () => {
    if (isEndTimeOut.value) return;
    await isScan();
    await isInvalid();
    if (isCodeInvalid.value) {
      time = setTimeout(() => {
        isCodeInterval()
      }, 2000)
    } else {
      clearTimeout(time)
    }
  };
  isCodeInterval();
}

// 二维码失效，重新获取二维码
const refreshCode = async () => {
  qrCode.value = undefined
  qrCodeId.value = undefined
  isCodeInvalid.value = true
  isCodeScan.value = true
  await isScan();
  await setQrCode()
  getQrCodeValue()
}
/**
 * 获取二维码是否已被扫描
 */
const isScan = async () => {
  console.log("是否被扫描：", qrCodeId.value)
  if (qrCodeId.value) {
    const res = await getScanLoginQRCodeValue({id: qrCodeId.value});
    if (res.code === HttpStatus.SUCCESS) {
      console.log("是否被扫描：--", res.data)
      if (res?.data == 'true') {
        isCodeScan.value = false;
        console.log("isCodeScan：--", isCodeScan.value)
      }
    }
  }
}

/**
 * 获取二维码是否失效
 */
const isInvalid = async () => {
  console.log(qrCodeId.value)
  if (qrCodeId.value) {
    const res = await getLoginQRCodeValue({id: qrCodeId.value});
    if (res.code === HttpStatus.SUCCESS) {
      console.log("是否可登录状态进行判断res.data", res.data)
      if (res.data) {
        //为true的情况下 先调取手机号码 再进行登录
        const phoneData = await getLoginQRCodePhone({id: qrCodeId.value});
        if (phoneData.data) {
          console.log("手机号：", phoneData.data)
          //调用登录接口
          loginForm.value.phoneNumber = phoneData.data
          loginForm.value.id = qrCodeId.value
          console.log("登录入参：", loginForm.value)
          const [err] = await to(userStore.scanCodeLogin(loginForm.value));
          if (!err) {
            await router.push({path: redirect.value || '/'});
            loading.value = false;
          } else {
            loading.value = false;
            // 重新获取验证码
            if (captchaEnabled.value) {
              await getCode();
            }
          }
        }
      }
      if (res.data == null) {
        console.log("二维码失效~")
        isCodeInvalid.value = false;
      }
    }
  }
}


onMounted(() => {
  // getCode();
  // let protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  // initWebSocketLogin(protocol + window.location.host + import.meta.env.VITE_APP_BASE_API + "/resource/websocket");
  isInvalid();
  isScan();
  setQrCode();
  initTenantList();
  getLoginData();
  getQrCodeValue();
});
onUnmounted(() => {
  console.log(111111)
  isEndTimeOut.value = true
  clearTimeout(time);
})
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
  // background: linear-gradient(135deg,#0f76fe, #2cdad4)
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.codeTitle {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #090101FF;
  font-weight: bold;
}

.title-center {
  text-align: center;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .el-button {
    height: 40px;
  }

  .input-icon {
    height: 22px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  display: block;
  height: 40px;
  // line-height: 40px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  padding-bottom: 20px;
  text-align: center;
  color: #fff;
  font-family: Arial, serif;
  font-size: 12px;
  letter-spacing: 1px;

  img {
    width: 16px;
    height: 16px;
    margin: 0 10px;
  }
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}

.fixed-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 1;
}
</style>
