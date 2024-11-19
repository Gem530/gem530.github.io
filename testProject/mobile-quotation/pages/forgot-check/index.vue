<template>
    <div class="login">
        <van-form ref="formRef" @submit="sendMsgHandle" label-align="top">
            <div class="login-title">{{$t('login.enterYourNewPassword')}}</div>
            <van-field :label="$t('login.password')" name="password" :type="showPass ? 'text' : 'password'" v-model="form.password"
                :placeholder="$t('login.password')"
                :rules="[{ required: true, message: $t('login.newPassword') }]">
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

            <van-button type="primary" native-type="submit" style="margin-top: 20px;">{{ $t('login.submit') }}</van-button>

        </van-form>
    </div>
</template>

<script setup lang="ts" name="ForgetCheck">
definePageMeta({ layout: 'empty' })

const { t } = useI18n()
const route = useRoute()
const formRef = ref()
const form = ref<Record<string, any>>({
    password: undefined,
    confirmPassword: undefined,
})
const showPass = ref(false)
const showConfirmPass = ref(false)
const validateEmail = (rule: any, value: any, callback: any) => {
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
    password: [{ required: true, message: () => t('login.newPassword') }],
    confirmPassword: [{ validator: validatePass2 }],
})

const sendMsgHandle = () => {
    // formRef.value.validate((val: boolean) => {
    //     if (val) {
    const body = {
        // code: form.value.code,
        // password: encrypt(form.value.password),
        password: form.value.password,
        token: route.query.token
        // email: form.value.email,
    }
    // console.log('body--', body)
    $http('/auth/resetPassword', {
        method: 'POST',
        body
    }).then((res: any) => {
        navigateTo('/login')
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
        margin-bottom: 20px;
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