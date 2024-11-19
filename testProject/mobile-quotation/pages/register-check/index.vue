<template>
    <div class="login">
        <van-form ref="formRef" @submit="registerHandle">
            <div class="login-title">{{$t('login.createAccount')}}</div>

            <div class="login-subtitle">{{ $t('login.clickOnTheButtonBelow') }}</div>

            <van-button type="primary" native-type="submit">{{ $t('login.activation') }}</van-button>
        </van-form>
    </div>
</template>

<script setup lang="ts" name="RegisterCheck">
definePageMeta({ layout: 'empty' })
const { t } = useI18n()
const route = useRoute()
const formRef = ref()

const registerHandle = () => {
    // formRef.value.validate((val: boolean) => {
    //     if (val) {
    // 用户注册授权
    $http('/auth/registerCheck', {
        method: 'POST',
        body: route.query?.token
    }).then((res: any) => {
        navigateTo('/login')
    })
    //     }
    // })
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

    .el-input {
        width: 100%;
        height: 35px;
        font-size: 16px;
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