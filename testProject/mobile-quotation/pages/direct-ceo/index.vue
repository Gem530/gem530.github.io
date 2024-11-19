<template>
    <div class="direct-ceo">
        <!-- <div class="ceo-title-gray text-center">CONTACT!</div> -->
        <div class="ceo-title text-center">{{$t('directPage.CONTACTTOCEO')}}</div>
        <!-- <div class="ceo-subtitle  text-center">{{$t('directPage.heretohelp')}}</div> -->

        <div class="ceo-flex flex flex-column">
            <div class="ceo-left">
                <div class="ceo-info flex">
                    <div class="ceo-info-box">
                        <div class="flex flex-start ceo-info-name"><van-icon name="contact-o" size="22px" style="margin-right: 10px;"></van-icon>Name: Deven</div>
                        <div class="flex flex-start ceo-info-job"><van-icon name="idcard" size="22px" style="margin-right: 10px;"></van-icon>Position: CEO</div>
                        <div class="flex flex-start ceo-info-phone"><van-icon name="phone-o" size="22px" style="margin-right: 10px;"></van-icon>Tel: 00852-53161900</div>
                        <div class="flex flex-start ceo-info-email"><van-icon name="envelop-o" size="22px" style="margin-right: 10px;"></van-icon>
                            <a class="pointer" href="mailto:CEO@pcbsuper.com?">Email: CEO@pcbsuper.com</a>
                        </div>
                    </div>
                </div>

                <div class="ceo-card">
                    <div>{{ $t('directPage.dearuser') }}</div>
                    <div style="margin-top: 10px;">{{ $t('directPage.inorderto') }}</div>
                    <div style="margin-top: 10px;">{{ $t('directPage.inorderto1') }}</div>
                </div>
            </div>
            
            <van-form ref="formRef" class="form-box" :model="form" label-align="top" label-width="200px" @submit="submitHandle">
                <van-field
                    :label="$t('directPage.yourName')"
                    prop="name" v-model="form.name" :placeholder="$t('directPage.pleaseyourName')" type="text"
                ></van-field>
                <van-field
                    :label="$t('directPage.contactinformation')" required
                    prop="phone" v-model="form.phone" :placeholder="$t('directPage.emialOrNumber')" type="text"
                    :rules="[{required: true, message: () => t('directPage.emialOrNumber')}]"
                ></van-field>
                <van-field
                    :label="$t('directPage.leaveUsMessage')"
                    prop="content" v-model="form.content" type="textarea"
                    :placeholder="$t('directPage.leaveUsMessage')" rows="5" show-word-limit maxlength="500"
                ></van-field>
                <van-field :label="$t('directPage.yourbrochure')" props="fileList">
                    <template #input>
                        <GUpload v-model="form.fileList" model="download" :max-count="1" :fileSize="10" :isWhite="true" style="width: 100%;">
                            <div class="flex flex-start">
                                <van-icon style="margin-right: 5px;" name="photograph" size="24px" color="var(--el-color-primary)"/>
                                <div>{{ $t('directPage.addfiles') }}</div>
                                <div style="margin-left: 20px;color: #333;">{{ $t('directPage.maximumMB', { size: 10 }) }}</div>
                            </div>
                        </GUpload>
                    </template>
                </van-field>
                <van-field :label="$t('directPage.yourbusinesscard')" prop="businessCardList">
                    <template #input>
                        <GUpload class="card-upload" v-model="form.businessCardList" :isWhite="true" accept="image/*"></GUpload>
                    </template>
                </van-field>
                <van-button class="direct-btn" type="primary" native-type="submit">{{ $t('directPage.submitto') }}</van-button>
            </van-form>
        </div>
        
        <!-- <div class="ceo-bottom flex flex-around">
            <div class="ceo-item flex flex-column pointer" @click="navigateTo('/producible-products')">
                <el-image src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/ceo-bottom-1.png"></el-image>
                <span>{{$t('directPage.ourProducts')}}</span>
            </div>
            <div class="ceo-item flex flex-column pointer" @click="navigateTo('/#business')">
                <el-image src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/ceo-bottom-2.png"></el-image>
                <span>{{$t('directPage.companyDetails')}}</span>
            </div>
            <div class="ceo-item flex flex-column pointer" @click="navigateTo('/process-capability')">
                <el-image src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/ceo-bottom-3.png"></el-image>
                <span>{{$t('processCapability')}}</span>
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts" name="DirectCeo">
const { t } = useI18n()
useHead({ title: () => t('directPage.title') })

const formRef = ref()
const form = ref<Record<string, any>>({
    name: undefined,
    phone: undefined,
    content: undefined,
    fileList: [],
    businessCardList: []
})

const submitHandle = () => {
    // formRef.value.validate((value: any) => {
    //     // console.log(value)
    //     if (value) {
    const body = deepClone(form.value)
    console.log(body)
    $http(`/purchase/leaveWord/leave`, {
        method: 'post',
        body
    }).then((res: any) => {
        showToast(t('directPage.submitSuccess'))
        Object.keys(form.value).map((m: any) => {
            if (['fileList', 'businessCardList'].includes(m)) {
                form.value[m] = []
            } else {
                form.value[m] = undefined
            }
        })
    })
    //     }
    // })
}
</script>

<style lang="scss" scoped>
.direct-ceo {
    // width: 1000px !important;
    // min-height: calc(100vh - 60px - 227px);
    // padding: 30px 0 60px;

    .ceo-title-gray {
        margin-bottom: 20px;
        font-size: 22px;
        color: #999;
        font-weight: 700;
    }
    .ceo-title {
        padding: 15px 0;
        font-size: 20px;
        color: #222222;
        font-weight: 700;
    }
    .ceo-subtitle {
        margin-bottom: 70px;
        font-size: 14px;
        color: #222222;
    }

    .ceo-flex {
        align-items: flex-start;

        .ceo-left {
            padding: 0 16px;
            .ceo-info {
                // width: 420px;
                height: 211px;
                background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/ceo-bg.png') no-repeat;
                background-size: 100% 100%;
                font-size: 16px;
                font-weight: 600;
                color: #fff;
                box-sizing: border-box;

                .ceo-info-box {
                    padding: 10px 20px;
                    border: 1px solid #fff;
                    border-radius: 10px;

                    .ceo-info-name {
                        margin-top: 5px;
                    }

                    .flex {
                        margin-bottom: 8px;
                    }
                }
            }

            .ceo-card {
                // width: 420px;
                margin-top: 20px;
                padding: 15px;
                font-size: 14px;
                color: #666;
                letter-spacing: 1.2px;
                line-height: 23px;
                border-radius: 10px;
                box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
            }
        }

        .form-box {
            // width: 550px;
            margin-top: 20px;
            // margin-left: 150px;

            :deep(.card-upload) {
                height: 100px;
                .el-upload {
                    &.is-drag {
                        height: 100%;
                        .el-upload-dragger {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            height: 100%;
                            padding: 0;
                            .el-icon--upload {
                                margin-bottom: 0;
                            }
                        }
                    }
                }
            }
        }

        .x-upload {
            :deep(.el-upload-list) {
                margin: 0 !important;
            }
        }
    }

    .ceo-bottom {
        width: 100%;
        background: #F2F2F2;
        margin-top: 50px;
        padding: 30px;
        // color: #fff;
        border-radius: 5px;

        .ceo-item {
            .el-image {
                width: 80px;
            }
            span {
                margin-top: 15px;
            }
        }
    }

    .direct-btn {
        // display: block;
        width: calc(100% - 32px);
        height: 45px;
        font-size: 16px;
        margin: 20px 16px;
    }
}
</style>