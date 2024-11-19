<template>
    <div class="login-layout">
        <div class="login-layout-left">
            <div class="login-layout-left-info">
                <div class="login-info-title">{{$t('login.oneAccount')}}</div>
                <div class="login-info-subtitle">{{$t('login.justOneAccount')}}</div>
                <div class="login-info-logo-list">
                    <!-- <div class="login-info-item">
                        <img class="login-info-item-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/login-logo1.svg" />
                        <span>EasyEDA</span>
                    </div>
                    <div class="login-info-item">
                        <img class="login-info-item-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/login-logo2.svg" />
                        <span>LCSC</span>
                    </div>
                    <div class="login-info-item">
                        <img class="login-info-item-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/login-logo3.svg" />
                        <span>NOSTH</span>
                    </div> -->
                </div>
                <div class="login-info-tips">{{$t('login.stopElectronic')}}</div>
            </div>

            <img class="login-info-img" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/login.svg" />
        </div>
        <div class="login-layout-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts" name="LoginLayout">
</script>

<style lang="scss" scoped>
.login-layout {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    overflow: hidden;

    .login-layout-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 30%;
        height: 100%;
        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/login_bg.svg') no-repeat;
        // background-size: 100% 100%;
        color: #2b8ced;
        padding: 0 20px 20px 0;

        .login-layout-left-info {
            width: 100%;
            padding: 100px 48px 0 68px;

            .login-info-title {
                font-size: 32px;
                font-weight: 600;
            }

            .login-info-subtitle {
                margin-top: 10px;
                font-size: 14px;
            }

            .login-info-logo-list {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                margin-top: 20px;

                .login-info-item {
                    display: flex;
                    margin-bottom: 15px;

                    .login-info-item-img {
                        width: 24px;
                        height: 18px;
                    }

                    span {
                        margin: 0 20px 0 4px;
                    }
                }
            }

            .login-info-tips {
                margin-top: 50px;
                font-size: 14px;
            }
        }

        .login-info-img {
            width: 100%;
        }
    }

    .login-layout-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
}
</style>