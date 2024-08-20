<template>
    <div class="register-lose">
        <div class="register-lose-box" v-if="isError">
            <div class="register-empty"></div>
            <div class="register-text-mini">对不起，</div>
            <div class="register-text">链接已失效</div>
            <div class="register-text-primary">请联系分享人重新分享</div>
            <div class="register-text-company">
                <div class="register-text-logo"></div>
                深圳立国信工业互联科技有限公司
            </div>
        </div>
    </div>
</template>

<script setup name="XcxEnter" lang="ts">
import { isInvalidUrl } from "@/api/system/user";
// console.log(useRouter(), useRoute(), window.location.origin)
// useSettingsStore().setTitle('邀请注册');
const { proxy } = getCurrentInstance() as any
document.title = '邀请注册'
const isError = ref(false)
const isInvalidUrlAPI = () => {
    const id = useRoute().params?.id
    // console.log(useRouter())
    if (id) {
        proxy?.$modal.loading()
        isInvalidUrl(id).then((res) => {
            if (res.code == 200) {
                if (res.data) {
                    window.location.href = res.data
                } else {
                    isError.value = true
                }
            }
        }).finally(() => {
            proxy?.$modal.closeLoading()
        })
    }
}
isInvalidUrlAPI()
</script>

<style lang="scss" scoped>
.register-lose {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100vw;
    height: 100vh;
    padding-top: 100px;
    box-sizing: border-box;

    .register-lose-box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        max-width: 375px;

        .register-empty {
            width: 244px;
            height: 190px;
            background: url('@/assets/images/register-empty.png') no-repeat;
            background-size: cover;
            background-position: center center;
        }

        .register-text-mini {
            margin-top: 10px;
            font-size: 16px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
        }

        .register-text {
            margin-top: 8px;
            font-size: 24px;
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
        }

        .register-text-primary {
            margin-top: 18px;
            font-size: 20px;
            font-weight: 900;
            color: rgba(45, 144, 237, 1);
        }

        .register-text-company {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);

            .register-text-logo {
                width: 14px;
                height: 12px;
                margin-right: 4px;
                background: url('@/assets/images/register-logo.png') no-repeat;
                background-size: cover;
                background-position: center center;
            }
        }
    }
}
</style>