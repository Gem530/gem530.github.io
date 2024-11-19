<template>
    <div class="login">
        <van-form ref="formRef" @submit="registerHandle" label-align="top">
            <div class="login-title">{{$t('login.createAccount')}}</div>
                
                <!-- Already have an account? <span class="pointer" @click.stop="navigateTo('/login')">Log in</span> -->
            <div class="login-subtitle" @click.stop="toLogin" v-html="$t('login.havaAccount', { logIn: `<span class='pointer toLogin'>${$t('login.signIn')}</span>` })"></div>

            <van-field :label="$t('login.username')" name="username" v-model="form.username" :placeholder="$t('login.username')"
                :rules="[{ validator: validateUsername }]">
            </van-field>
            
            <van-field :label="$t('login.email')" name="email" v-model="form.email" :placeholder="$t('login.email')"
                :rules="[{ validator: validateEmail }]">
            </van-field>

            <van-field :label="$t('login.password')" name="password" :type="showPass ? 'text' : 'password'" v-model="form.password"
                :placeholder="$t('login.password')"
                :rules="[{ validator: validatePassword }]">
                <template #right-icon>
                    <van-icon @click.stop="showPass = !showPass" name="eye-o" v-if="showPass" />
                    <van-icon @click.stop="showPass = !showPass" name="closed-eye" v-else />
                </template>
            </van-field>

            <van-field :label="$t('login.confirmPassword')" name="confirmPassword" :type="showConfirmPass ? 'text' : 'password'" v-model="form.confirmPassword"
                :placeholder="$t('login.confirmPassword')"
                :rules="[{ validator: validatePass2 }]">
                <template #right-icon>
                    <van-icon @click.stop="showConfirmPass = !showConfirmPass" name="eye-o" v-if="showConfirmPass" />
                    <van-icon @click.stop="showConfirmPass = !showConfirmPass" name="closed-eye" v-else />
                </template>
            </van-field>

            <van-field name="googleToken"
                v-model="form.googleToken"
                :rules="[{ required: true, message: () => t('login.googleCheck') }]">
                <template #input>
                    <div id="robotDom"></div>
                </template>
            </van-field>

            <van-button type="primary" native-type="submit">{{$t('login.signUp')}}</van-button>
        </van-form>
    </div>
</template>

<script setup lang="ts" name="Register">
definePageMeta({ layout: 'empty' })
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
const showPass = ref(false)
const showConfirmPass = ref(false)
const validateUsername = (value: any, rule: any) => {
    if (value == '' || value == undefined || value == null) {
        return t('login.username')
    } else if (value.length > 32 || value.length < 4) {
        return t('login.userLength')
    } else {
        return ''
    }
}
// { required: true, message: () => t('login.password') },
// { min: 8, max: 25, message: () => t('login.passLength') }
const validatePassword = (value: any, rule: any) => {
    if (value == '' || value == undefined || value == null) {
        return t('login.password')
    } else if (value.length > 25 || value.length < 8) {
        return t('login.passLength')
    } else {
        return ''
    }
}
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
// const rules = ref({
//     username: [
//         { required: true, message: () => t('login.username') },
//         { min: 4, max: 32, message: () => t('login.userLength') }
//     ],
//     password: [
//         { required: true, message: () => t('login.password') },
//         { min: 8, max: 25, message: () => t('login.passLength') }
//     ],
//     email: [{ validator: validateEmail }],
//     confirmPassword: [{ validator: validatePass2 }],
//     // code: [{ required: true, message: () => t('login.verificationCode') }],
//     googleToken: [{ required: true, message: () => t('login.googleCheck') }],
// })

const registerHandle = () => {
    // formRef.value.validate((val: boolean) => {
    //     // console.log(11, val)
    //     if (val) {
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
            showToast(t('login.emailForVerification'))
            navigateTo('/login')
        }
    })
    //     }
    // })
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

        :deep(.toLogin) {
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
        margin: 20px 0;
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

                .unline {
                    text-decoration: underline;
                }
            }
        }

        .forgot {
            font-size: 16px;
        }
    }
}
</style>