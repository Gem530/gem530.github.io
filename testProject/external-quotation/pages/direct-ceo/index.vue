<template>
    <div class="direct-ceo main-width">
        <!-- <div class="ceo-title-gray text-center">CONTACT!</div> -->
        <div class="ceo-title text-center">{{$t('directPage.CONTACTTOCEO')}}</div>
        <!-- <div class="ceo-subtitle  text-center">{{$t('directPage.heretohelp')}}</div> -->

        <div class="ceo-flex flex flex-between">
            <div class="ceo-left">
                <div class="ceo-info flex">
                    <div class="ceo-info-box">
                        <div class="flex flex-start ceo-info-name"><el-icon size="22px" style="margin-right: 10px;"><User /></el-icon>Name: Deven</div>
                        <div class="flex flex-start ceo-info-job"><el-icon size="22px" style="margin-right: 10px;"><Postcard /></el-icon>Position: CEO</div>
                        <div class="flex flex-start ceo-info-phone"><el-icon size="22px" style="margin-right: 10px;"><Phone /></el-icon>Tel: 00852-53161900</div>
                        <div class="flex flex-start ceo-info-email"><el-icon size="22px" style="margin-right: 10px;"><Message /></el-icon>
                            <a class="pointer" href="mailto:CEO@pcbsuper.com?">Email: CEO@pcbsuper.com</a>
                        </div>
                    </div>
                </div>

                <el-card class="ceo-card">
                    <div>{{ $t('directPage.dearuser') }}</div>
                    <div style="margin-top: 10px;">{{ $t('directPage.inorderto') }}</div>
                    <div style="margin-top: 10px;">{{ $t('directPage.inorderto1') }}</div>
                </el-card>
            </div>
            
            <el-form ref="formRef" class="form-box" :model="form" :rules="rules" label-width="200px">
                <el-form-item :label="$t('directPage.yourName')" prop="name">
                    <el-input v-model="form.name" :placeholder="$t('directPage.pleaseyourName')" type="text" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('directPage.contactinformation')" prop="phone">
                    <el-input v-model="form.phone" :placeholder="$t('directPage.emialOrNumber')" type="text" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('directPage.leaveUsMessage')" prop="content">
                    <el-input v-model="form.content" type="textarea" :placeholder="$t('directPage.leaveUsMessage')" rows="5" show-word-limit maxlength="500"></el-input>
                </el-form-item>
                <el-form-item :label="$t('directPage.yourbrochure')" props="fileList">
                    <XUpload v-model="form.fileList" model="download" :limit="1" :fileSize="10" :isWhite="true" style="width: 100%;">
                        <div class="flex flex-start">
                            <el-icon style="margin-right: 5px;" size="24px" color="var(--el-color-primary)"><UploadFilled /></el-icon>
                            <div>{{ $t('directPage.addfiles') }}</div>
                            <div style="margin-left: 20px;color: #333;">{{ $t('directPage.maximumMB', { size: 10 }) }}</div>
                        </div>
                    </XUpload>
                </el-form-item>
                <el-form-item :label="$t('directPage.yourbusinesscard')" prop="businessCardList">
                    <XUpload class="card-upload" style="width: 100%;" v-model="form.businessCardList" :isWhite="true" accept="image/*">
                        
                    </XUpload>
                    <!-- <XUpload class="card-upload" style="width: 100%;" list-type="text" :show-file-list="false" modal="download" v-model="form.businessCardList" drag :isWhite="true" accept="image/*">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            <div>{{$t('directPage.yourbusinesscard')}}</div>
                        </div>
                    </XUpload>
                    <PreviewImg v-model="form.businessCardList"></PreviewImg> -->
                </el-form-item>
                <el-form-item>
                    <el-button class="direct-btn" type="primary" @click="submitHandle">{{ $t('directPage.submitto') }}</el-button>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="ceo-bottom flex flex-around">
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
        </div>
        <!-- <div class="direct-title">{{$t('directPage.CONTACTTOCEO')}}</div>
        <div class="direct-subtitle">{{$t('directPage.heretohelp')}}</div>
        <el-form ref="formRef" class="form-box" label-position="top" :model="form" :rules="rules" label-width="150px">
            <el-form-item :label="$t('directPage.leaveUsMessage')" props="content">
                <el-input v-model="form.content" type="textarea" :placeholder="$t('directPage.leaveUsMessage')" rows="15" show-word-limit maxlength="500"></el-input>
            </el-form-item>
            <el-form-item props="fileList">
                <XUpload v-model="form.fileList" model="download" :limit="1" :fileSize="10" :isWhite="true" style="width: 200px;">
                    <div class="flex flex-start">
                        <el-icon style="margin-right: 5px;" size="24px" color="var(--el-color-primary)"><UploadFilled /></el-icon>
                        <div>{{ $t('directPage.addfiles') }}</div>
                    </div>
                </XUpload>
            </el-form-item>
            <el-form-item :label="$t('directPage.yourbusinesscard')" props="businessCardList">
                <XUpload style="width: 100%;" list-type="text" :show-file-list="false" modal="download" v-model="form.businessCardList" drag :isWhite="true" accept="image/*">
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        <div>{{$t('directPage.yourbusinesscard')}}</div>
                    </div>
                </XUpload>
                <PreviewImg v-model="form.businessCardList"></PreviewImg>
            </el-form-item>
            <el-form-item>
                <el-button class="direct-btn" type="primary" @click="submitHandle">{{ $t('directPage.submitto') }}</el-button>
            </el-form-item>
        </el-form> -->
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
const rules = ref({
    phone: [{required: true, message: () => t('directPage.emialOrNumber'), trigger: 'blur'}],
    // content: [{required: true, message: () => t('directPage.leaveUsMessage'), trigger: 'blur'}],
    // fileList: [{required: true, message: () => t('directPage.yourfile'), trigger: 'change'}],
    // businessCardList: [{required: true, message: () => t('directPage.yourbusinesscard'), trigger: 'change'}],
})

const submitHandle = () => {
    formRef.value.validate((value: any) => {
        // console.log(value)
        if (value) {
            // console.log('form.value', form.value)
            // console.log(Object.entries(form.value))
            // const flag = Object.entries(form.value).some((s: any) => ['fileList', 'businessCardList'].includes(s[0]) ? s[1]?.length : !!s[1])
            // // console.log('flag',flag)
            // if (!form.value.fileList?.length && !form.value.businessCardList?.length && !form.value.content) {
            //     ElMessage.error(t('directPage.atLeast'))
            //     return
            // }
            const body = deepClone(form.value)
            // console.log(body)
            $http(`/purchase/leaveWord/leave`, {
                method: 'post',
                body
            }).then((res: any) => {
                ElMessage.success(t('directPage.submitSuccess'))
                Object.keys(form.value).map((m: any) => {
                    if (['fileList', 'businessCardList'].includes(m)) {
                        form.value[m] = []
                    } else {
                        form.value[m] = undefined
                    }
                })
            })
        }
    })
}
</script>

<style lang="scss" scoped>
.direct-ceo {
    width: 1000px !important;
    min-height: calc(100vh - 60px - 227px);
    padding: 30px 0 60px;

    // .direct-title {
    //     font-size: 34px;
    //     color: #222222;
    //     font-weight: 700;
    // }
    // .direct-subtitle {
    //     margin-top: 10px;
    //     font-size: 14px;
    //     color: #222222;
    // }

    // :deep(.form-box) {
    //     margin-top: 30px;
    //     .el-form-item__label {
    //         font-size: 16px;
    //         color: #222222;
    //         font-weight: 600;
    //     }

    //     .direct-btn {
    //         min-width: 300px;
    //         height: 50px;
    //         font-size: 16px;
    //         border-radius: 50px;
    //         margin: 0 auto;
    //     }
    // }

    .ceo-title-gray {
        margin-bottom: 20px;
        font-size: 22px;
        color: #999;
        font-weight: 700;
    }
    .ceo-title {
        margin-bottom: 40px;
        font-size: 34px;
        color: #222222;
        font-weight: 700;
    }
    .ceo-subtitle {
        margin-bottom: 70px;
        font-size: 14px;
        color: #222222;
    }

    .ceo-flex {
        padding: 0 30px;
        align-items: flex-start;

        .ceo-left {
            .ceo-info {
                width: 420px;
                height: 211px;
                background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/ceo-bg.png') no-repeat;
                background-size: 100% 100%;
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
                width: 420px;
                margin-top: 20px;
                font-size: 14px;
                color: #666;
                letter-spacing: 1.2px;
                line-height: 23px;
            }
        }

        .form-box {
            width: 550px;
            // margin-left: 150px;

            :deep(.el-form-item__label) {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                line-height: 16px;
            }

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
        width: 200px;
        height: 45px;
        font-size: 16px;
    }
}
</style>