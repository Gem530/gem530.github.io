<template>
    <div class="login">
        <van-form ref="formRef" id="demo-form" @submit="loginHandle" label-align="top">
            <div class="login-title">{{$t('login.signInTo')}}</div>
            <div class="login-subtitle" @click.stop="toRegister" v-html="$t('login.needNew', { signUp: `<span class='pointer toRegister'>${$t('login.signUp')}</span>` })"></div>
            <!-- <div class="login-subtitle"> Need new account? <span class="pointer" @click.stop="navigateTo('/register')">Sign up</span> now </div> -->

            <van-field :label="$t('login.userOrEmail')" name="username" v-model="form.username"
                :placeholder="$t('login.userOrEmail')"
                :rules="[{ required: true, message: $t('login.userOrEmail') }]">
            </van-field>

            <van-field :label="$t('login.password')" name="password" :type="showPass ? 'text' : 'password'" v-model="form.password"
                :placeholder="$t('login.password')"
                :rules="[{ required: true, message: $t('login.password') }]">
                <template #right-icon>
                    <van-icon @click.stop="showPass = !showPass" name="eye-o" v-if="showPass" />
                    <van-icon @click.stop="showPass = !showPass" name="closed-eye" v-else />
                </template>
            </van-field>

            <van-field name="googleToken"
                v-model="form.googleToken"
                :rules="[{ required: true, message: $t('login.googleCheck') }]"
                v-if="env().VITE_PACK_ENV != 'dev'">
                <template #input>
                    <div id="robotDom"></div>
                </template>
            </van-field>
            <van-button block type="primary" native-type="submit" class="login-btn">{{$t('login.signIn')}}</van-button>

            <div class="login-flex">
                <van-checkbox v-model="form.remember">{{$t('login.rememberMe')}}</van-checkbox>
                <div class="forgot pointer hover-blue-unline" @click.stop="navigateTo('/forgot')">{{$t('login.forgotPassword')}}</div>
            </div>

            <van-button block @click.stop="doSocialLogin('google')">{{$t('login.signInGoogle')}}</van-button>
        </van-form>
    </div>
</template>

<script setup lang="ts" name="Login">
definePageMeta({ layout: 'empty' })

// let widgetId: any = null
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const formRef = ref()
const form = ref<Record<string, any>>({
    username: undefined,
    password: undefined,
    remember: false,
    googleToken: undefined,
})

const showPass = ref(false)

function onloadCallback(googleToken: any) {
    form.value.googleToken = googleToken
    formRef.value.validateField('googleToken')
    // console.log('googleToken---', form.value.googleToken)
}

const toRegister = (e: any) => {
    const classList = e.target.classList.value || ''
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
        // console.log(window.history, window)
        window.addEventListener("popstate", handleBack, false)
    }
})

onUnmounted(() => {
    window.removeEventListener('popstate', handleBack, false)
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
      showToast(res.msg);
    }
  });
};

const loginHandle = () => {
    // formRef.value.validate((val: boolean) => {
    //     if (val) {
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
            const redirect = useRoute().query.redirect as string
            navigateTo(redirect || '/')
        })
    })
    //     }
    // })
}
</script>

<style lang="scss" scoped>
.login {
    // width: 310px;
    margin: 0 auto;
    padding: 20px;

    .login-title {
        font-size: 26px;
        font-weight: 600;
    }

    .login-subtitle {
        font-size: 20px;
        margin: 10px 0 30px;

        :deep(.toRegister) {
            color: var(--el-color-primary);
        }
    }

    .van-field {
        width: 100%;
        min-height: 35px;
        font-size: 16px;
        padding-left: 0;
        padding-right: 0;
    }
    .van-button {
        width: 100%;
        height: 35px;
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
        margin-top: 20px;
        margin-bottom: 40px;

        .forgot {
            font-size: 16px;
        }
    }
}
</style>