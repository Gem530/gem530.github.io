<template>
    <div class="login">
        <el-form ref="formRef" :model="form" :rules="rules">
            <div class="login-title">{{$t('login.createAccount')}}</div>
                
                <!-- Already have an account? <span class="pointer" @click="navigateTo('/login')">Log in</span> -->
            <div class="login-subtitle" @click="toLogin" v-html="$t('login.havaAccount', { logIn: `<span class='pointer toLogin'>${$t('login.signIn')}</span>` })"></div>

            <el-form-item prop="username">
                <el-input type="text" v-model="form.username" :placeholder="$t('login.username')"></el-input>
            </el-form-item>
            
            <el-form-item prop="email">
                <el-input type="text" v-model="form.email" :placeholder="$t('login.email')"></el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input type="text" v-model="form.password" :placeholder="$t('login.password')" show-password></el-input>
            </el-form-item>

            <el-form-item prop="confirmPassword">
                <el-input type="text" v-model="form.confirmPassword" :placeholder="$t('login.confirmPassword')" show-password></el-input>
            </el-form-item>

            <!-- <input-code prop="code" :email="form.email" v-model:model-value="form.code"></input-code> -->

            <!-- <div class="login-flex">
                <el-checkbox v-model="form.agree">
                 I agree to NSTPCB's 
                 <span class="unline">Terms of Use</span>
                 and 
                 <span class="unline">Privacy Policy</span>
                </el-checkbox>
            </div> -->
            <el-form-item prop="googleToken">
                <div id="robotDom"></div>
                <el-input v-model="form.googleToken" v-show="false"></el-input>
            </el-form-item>

            <el-button type="primary" @click.stop="registerHandle">{{$t('login.signUp')}}</el-button>
        </el-form>
    </div>
</template>

<script setup lang="ts" name="Register">
definePageMeta({ layout: 'login' })
const { t } = useI18n()
const formRef = ref()
const form = ref<Record<string, any>>({
    email: undefined,
    username: undefined,
    password: undefined,
    confirmPassword: undefined,
    agree: undefined,
    // code: undefined,
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
    username: [
        { required: true, message: () => t('login.username'), trigger: 'blur' },
        { min: 4, max: 32, message: () => t('login.userLength'), trigger: 'blur' }
    ],
    password: [
        { required: true, message: () => t('login.password'), trigger: 'blur' },
        { min: 8, max: 25, message: () => t('login.passLength'), trigger: 'blur' }
    ],
    email: [{ validator: validateEmail, trigger: 'blur' }],
    confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
    // code: [{ required: true, message: () => t('login.verificationCode'), trigger: 'blur' }],
    googleToken: [{ required: true, message: () => t('login.googleCheck'), trigger: 'blur' }],
})

const registerHandle = () => {
    formRef.value.validate((val: boolean) => {
        // console.log(11, val)
        if (val) {
            const body = {
                // code: form.value.code,
                username: form.value.username,
                // password: encrypt(form.value.password),
                password: form.value.password,
                email: form.value.email,
                grantType: 'email',
                clientId: env().VITE_APP_CLIENT_ID
            }
            // console.log(body)
            $http('/auth/register', {
                method: 'POST',
                body
            }).then((res: any) => {
                // navigateTo('/login')
                if (res.code == 200) {
                    ElMessage.success(t('login.emailForVerification'))
                    navigateTo('/login')
                }
            })
        }
    })
}

const toLogin = (e: any) => {
    const classList = e?.target?.classList?.value || ''
    if (classList.includes('toLogin')) {
        navigateTo('/login')
    }
}

function onloadCallback(googleToken: any) {
    form.value.googleToken = googleToken
    formRef.value.validateField('googleToken')
    // console.log('googleToken---', form.value.googleToken)
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
    width: 410px;

    .login-title {
        font-size: 38px;
        font-weight: 600;
    }

    .login-subtitle {
        margin: 20px 0 40px;

        :deep(.toLogin) {
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
        margin-bottom: 40px;
        :deep(.el-checkbox) {
            .el-checkbox__inner {
                width: 16px;
                height: 16px;
            }
            .el-checkbox__label {
                font-size: 16px;

                .unline {
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>