<template>
    <div class="login">
        <el-form ref="formRef" :model="{}">
            <div class="login-title">{{$t('login.createAccount')}}</div>

            <div class="login-subtitle">{{ $t('login.clickOnTheButtonBelow') }}</div>

            <el-button type="primary" @click.stop="registerHandle">{{ $t('login.activation') }}</el-button>
        </el-form>
    </div>
</template>

<script setup lang="ts" name="RegisterCheck">
definePageMeta({ layout: 'login' })
const { t } = useI18n()
const route = useRoute()
const formRef = ref()

const registerHandle = () => {
    formRef.value.validate((val: boolean) => {
        if (val) {
            // 用户注册授权
            $http('/auth/registerCheck', {
                method: 'POST',
                body: route.query?.token
            }).then((res: any) => {
                navigateTo('/login')
            })
        }
    })
}

// const toLogin = (e: any) => {
//     const classList = e?.target?.classList?.value || ''
//     if (classList.includes('toLogin')) {
//         navigateTo('/login')
//     }
// }

// function onloadCallback(googleToken: any) {
//     form.value.googleToken = googleToken
//     formRef.value.validateField('googleToken')
//     // console.log('googleToken---', form.value.googleToken)
// }

// onMounted(() => {
//     (window as any).grecaptcha.enterprise.render('robotDom', {
//         'sitekey': env().VITE_SITE_KEY,
//         'callback': onloadCallback
//     })
// })
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