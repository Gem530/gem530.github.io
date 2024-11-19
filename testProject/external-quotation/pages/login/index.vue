<template>
    <div class="login">
        <el-form ref="formRef" :model="form" :rules="rules" id="demo-form">
            <div class="login-title">{{$t('login.signInTo')}}</div>
            <div class="login-subtitle" @click="toRegister" v-html="$t('login.needNew', { signUp: `<span class='pointer toRegister'>${$t('login.signUp')}</span>` })"></div>
            <!-- <div class="login-subtitle"> Need new account? <span class="pointer" @click="navigateTo('/register')">Sign up</span> now </div> -->

            <el-form-item prop="username">
                <el-input type="text" v-model="form.username" :placeholder="$t('login.userOrEmail')"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input type="password" v-model="form.password" :placeholder="$t('login.password')" show-password></el-input>
            </el-form-item>

            <el-form-item prop="googleToken" v-if="env().VITE_PACK_ENV != 'dev'">
                <div id="robotDom"></div>
                <el-input v-model="form.googleToken" v-show="false"></el-input>
            </el-form-item>
            <el-button type="primary" @click.stop="loginHandle" class="login-btn">{{$t('login.signIn')}}</el-button>

            <div class="login-flex">
                <el-checkbox v-model="form.remember">{{$t('login.rememberMe')}}</el-checkbox>
                <div class="pointer hover-blue-unline" @click="navigateTo('/forgot')">{{$t('login.forgotPassword')}}</div>
            </div>

            <el-button @click="doSocialLogin('google')">{{$t('login.signInGoogle')}}</el-button>
        </el-form>
    </div>
</template>

<script setup lang="ts" name="Login">
definePageMeta({ layout: 'login' })

const route = useRoute()
const router = useRouter()
// let widgetId: any = null
const { t } = useI18n()
const formRef = ref()
const form = ref<Record<string, any>>({
    username: undefined,
    password: undefined,
    remember: false,
    googleToken: undefined,
})
const rules = ref({
    username: [{ required: true, message: () => t('login.userOrEmail'), trigger: 'blur' }],
    password: [{ required: true, message: () => t('login.password'), trigger: 'blur' }],
    googleToken: [{ required: true, message: () => t('login.googleCheck'), trigger: 'blur' }],
})

function onloadCallback(googleToken: any) {
    form.value.googleToken = googleToken
    formRef.value.validateField('googleToken')
    // console.log('googleToken---', form.value.googleToken)
}

const toRegister = (e: any) => {
    const classList = e?.target?.classList?.value || ''
    if (classList.includes('toRegister')) {
        navigateTo('/register')
    }
}
const handleBack = (e: any) => {
    e.preventDefault()
    // navigateTo({ path: '/', replace: true })
    // window.history.pushState({title: t('home'), url: 'http://localhost:3003/'}, t('home'), 'http://localhost:3003/')
    router.push({
        path: '/',
        replace: true
    })
    // alert("我监听到了浏览器的返回按钮事件啦")
}

onMounted(() => {
    const localForm: any = localStorage.getItem('loginInfo')
    if (localForm) {
        form.value = JSON.parse(decryptWithAes(localForm, env().VITE_ABC))
        form.value.googleToken = undefined
    }

    if (env().VITE_PACK_ENV != 'dev') {
        (window as any).grecaptcha.enterprise.render('robotDom', {
            'sitekey': env().VITE_SITE_KEY,
            'callback': onloadCallback
        })
    }
    if (route.query?.redirect) {
        window.history.pushState(null, '', '/')
        window.addEventListener("popstate", handleBack)
    }
})

onUnmounted(() => {
    window.removeEventListener('popstate', handleBack)
})

const authBinding = (source: string) => {
    return new Promise((resolve, reject) => {
        $http(`/auth/binding/${source}`, {
            method: 'get',
        }, true).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

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

const loginHandle = () => {
    formRef.value.validate((val: boolean) => {
        if (val) {
            const body = {
                tenantId: '000000',
                username: form.value.username,
                // password: encrypt(form.value.password),
                password: form.value.password,
                grantType: 'password',
                clientId: env().VITE_APP_CLIENT_ID
            }
            $http('/auth/login', {
                method: 'POST',
                isToken: false,
                loading: true,
                body
            }, true).then((res: any) => {
                // localStorage.setItem('token', res.data.access_token)
                useAccessToken().value = res.data.access_token
                setLocal('useAccessToken')
                if (form.value.remember) {
                    localStorage.setItem('loginInfo', encryptWithAes(JSON.stringify(form.value), env().VITE_ABC))
                } else {
                    localStorage.removeItem('loginInfo')
                }

                getOrderNum()
                getInfo().then((result: any) => {
                    const redirect = useRoute().query?.redirect as string
                    navigateTo(redirect || '/')
                })
            })
        }
    })
}
</script>

<style lang="scss" scoped>
.login {
    width: 410px;

    .login-title {
        font-size: 38px;
        font-weight: 600;
    }

    .login-subtitle {
        margin: 20px 0 40px;

        :deep(.toRegister) {
            color: var(--el-color-primary);
        }
    }

    .el-input {
        width: 100%;
        height: 50px;
        font-size: 16px;
    }
    .el-button {
        width: 100%;
        height: 50px;
        margin-bottom: 20px;
        font-size: 18px;
    }

    .login-btn {
        margin-top: 30px;
    }

    .login-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        :deep(.el-checkbox) {
            .el-checkbox__inner {
                width: 16px;
                height: 16px;
            }
            .el-checkbox__label {
                font-size: 16px;
            }
        }
    }
}
</style>