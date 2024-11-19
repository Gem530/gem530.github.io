<template>
    <div class="login">
        <el-form ref="formRef" :model="form" :rules="rules">
            <div class="login-title">{{$t('login.forgotPass')}}</div>
            <div class="login-subtitle" @click="toRegister" v-html="$t('login.needNew', { signUp: `<span class='pointer toRegister'>${$t('login.signUp')}</span>` })"></div>
            <!-- <div class="login-subtitle"> Need new account? <span class="pointer" @click="navigateTo('/register')">Sign up</span> now </div> -->

            <el-form-item prop="email">
                <el-input type="text" v-model="form.email" :placeholder="$t('login.email')"></el-input>
            </el-form-item>

            <!-- <el-form-item prop="password">
                <el-input type="text" v-model="form.password" :placeholder="$t('login.password')" show-password></el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
                <el-input type="text" v-model="form.confirmPassword" :placeholder="$t('login.confirmPassword')" show-password></el-input>
            </el-form-item>

            <input-code prop="code" :email="form.email" v-model:model-value="form.code"></input-code> -->

            <el-form-item prop="googleToken">
                <div id="robotDom"></div>
                <el-input v-model="form.googleToken" v-show="false"></el-input>
            </el-form-item>

            <div class="login-flex">{{ $t('login.resetPassTip') }}</div>

            <el-button type="primary" @click="sendMsgHandle">{{ $t('login.submit') }}</el-button>

        </el-form>
    </div>
</template>

<script setup lang="ts" name="Forget">
definePageMeta({ layout: 'login' })

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
const validateEmail = (rule: any, value: any, callback: any) => {
    if (value == '' || value == undefined || value == null) {
        callback(new Error(t('login.email')))
    } else if (!validEmail(value)) {
        callback(new Error(t('login.emailFormat')))
    } else {
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value == '' || value == undefined || value == null) {
        callback(new Error(t('login.confirmPassword')))
    } else if (value !== form.value.password) {
        callback(new Error(t('login.passNotMatch')))
    } else {
        callback()
    }
}
const rules = ref({
    email: [{ validator: validateEmail, trigger: 'blur' }],
    password: [{ required: true, message: () => t('login.password'), trigger: 'blur' }],
    confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
    code: [{ required: true, message: () => t('login.verificationCode'), trigger: 'blur' }],
    googleToken: [{ required: true, message: () => t('login.googleCheck'), trigger: 'blur' }],
})

const sendMsgHandle = () => {
    formRef.value.validate((val: boolean) => {
        if (val) {
            $http('/auth/forgot', {
                method: 'POST',
                body: form.value.email
            }).then((res: any) => {
                if (res.code == 200) {
                    ElMessage.success(t('login.emailForVerification'))
                    navigateTo('/login')
                }
            })
        }
    })
}

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

onMounted(() => {
    (window as any).grecaptcha.enterprise.render('robotDom', {
        'sitekey': env().VITE_SITE_KEY,
        'callback': onloadCallback
    })
})
</script>

<style lang="scss" scoped>
.login {
    width: 450px;

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

    .login-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
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