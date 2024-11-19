<template>
    <div class="login">
        <van-form ref="formRef" @submit="sendMsgHandle" label-align="top">
            <div class="login-title">{{$t('login.forgotPass')}}</div>
            <div class="login-subtitle" @click.stop="toRegister" v-html="$t('login.needNew', { signUp: `<span class='pointer toRegister'>${$t('login.signUp')}</span>` })"></div>

            <van-field :label="$t('login.email')" name="email" v-model="form.email" :placeholder="$t('login.email')"
                :rules="[{ validator: validateEmail }]">
            </van-field>

            <van-field name="googleToken"
                v-model="form.googleToken"
                :rules="[{ required: true, message: $t('login.googleCheck') }]">
                <template #input>
                    <div id="robotDom"></div>
                </template>
            </van-field>

            <div class="login-flex">{{ $t('login.resetPassTip') }}</div>

            <van-button type="primary" native-type="submit">{{ $t('login.submit') }}</van-button>

        </van-form>
    </div>
</template>

<script setup lang="ts" name="Forget">
definePageMeta({ layout: 'empty' })

const { t } = useI18n()
const formRef = ref()
const form = ref<Record<string, any>>({
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    remember: undefined,
    code: undefined,
    googleToken: undefined,
})
const validateEmail = (value: any, rule: any) => {
    if (value == '' || value == undefined || value == null) {
        return t('login.email')
    } else if (!validEmail(value)) {
        return t('login.emailFormat')
    } else {
        return ''
    }
}
const validatePass2 = (value: any, rule: any) => {
    if (value == '' || value == undefined || value == null) {
        return t('login.confirmPassword')
    } else if (value !== form.value.password) {
        return t('login.passNotMatch')
    } else {
        return ''
    }
}
const rules = ref({
    email: [{ validator: validateEmail }],
    password: [{ required: true, message: () => t('login.password') }],
    confirmPassword: [{ validator: validatePass2 }],
    code: [{ required: true, message: () => t('login.verificationCode') }],
    googleToken: [{ required: true, message: () => t('login.googleCheck') }],
})

const sendMsgHandle = () => {
    // formRef.value.validate((val: boolean) => {
    //     if (val) {
    $http('/auth/forgot', {
        method: 'POST',
        body: form.value.email
    }).then((res: any) => {
        if (res.code == 200) {
            showToast(t('login.emailForVerification'))
            navigateTo('/login')
        }
    })
    //     }
    // })
}

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

onMounted(() => {
    (window as any).grecaptcha.enterprise.render('robotDom', {
        'sitekey': env().VITE_SITE_KEY,
        'callback': onloadCallback
    })
})
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
        margin-bottom: 40px;
        font-size: 16px;
        :deep(.el-checkbox) {
            .el-checkbox__inner {
                width: 16px;
                height: 16px;
            }
            .el-checkbox__label {
                font-size: 16px;
            }
        }

        .forgot {
            font-size: 16px;
        }
    }
}
</style>