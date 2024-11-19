<template>
    <div class="service-guidelines main-width">
        <!-- <div class="guidelines">
            <el-card class="guidelines-item guidelines-online text-center">
                <el-icon class="guidelines-online-service"><Service /></el-icon>
                <div class="guidelines-online-title">企业服务</div>
                <div class="guidelines-online-tips">我们将为您提供咨询相关业务的工作邮箱</div>
                <div class="guidelines-online-time">
                    邮箱地址：<br/>
                    market@pcbsuper.com
                </div>
            </el-card>
            <el-card class="guidelines-item">
                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/test.jpg" class="guidelines-item-top" alt="">
                <div class="guidelines-item-title pointer hover-blue" @click="openDiaLog(1)">PCB业务咨询</div>
                <div class="guidelines-item-tips">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum l</div>
            </el-card>
            <el-card class="guidelines-item">
                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/test.jpg" class="guidelines-item-top" alt="">
                <div class="guidelines-item-title pointer hover-blue" @click="openDiaLog(2)">其他业务咨询</div>
                <div class="guidelines-item-tips">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum l</div>
            </el-card>
        </div>

        <div class="guidelines-server">
            <el-card class="guidelines-server-item">
                <div class="guidelines-server-title pointer text-center hover-blue" @click="openDiaLog(3)">品质售后服务</div>
                <div class="guidelines-server-tips">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum l</div>
            </el-card>
            <el-card class="guidelines-server-item">
                <div class="guidelines-server-title pointer text-center hover-blue" @click="openDiaLog(4)">服务投诉</div>
                <div class="guidelines-server-tips">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum l</div>
            </el-card>
            <el-card class="guidelines-server-item">
                <div class="guidelines-server-title pointer text-center hover-blue" @click="openDiaLog(5)">网站建议反馈</div>
                <div class="guidelines-server-tips">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum l</div>
            </el-card>
        </div>

        <div class="guidelines-help">
            <div class="guidelines-help-title text-center">帮助文档</div>
            <div class="guidelines-help-list">
                <el-card class="guidelines-help-item">
                    <div class="guidelines-help-item-header">
                        <div class="guidelines-help-header-title">PCB相关事项</div>
                        <div class="guidelines-help-header-btn pointer hover-unline" @click="navigateTo('/help-document')">详情</div>
                    </div>
                    <div class="guidelines-help-item-doc overflow-omit pointer hover-blue-unline" v-for="i in 4" :key="i">XXXX.DOC</div>
                </el-card>
                <el-card class="guidelines-help-item">
                    <div class="guidelines-help-item-header">
                        <div class="guidelines-help-header-title">财务相关事项</div>
                        <div class="guidelines-help-header-btn pointer hover-unline" @click="navigateTo('/help-document')">详情</div>
                    </div>
                    <div class="guidelines-help-item-doc overflow-omit pointer hover-blue-unline" v-for="i in 4" :key="i">XXXX.DOC</div>
                </el-card>
                <el-card class="guidelines-help-item">
                    <div class="guidelines-help-item-header">
                        <div class="guidelines-help-header-title">下单指引</div>
                        <div class="guidelines-help-header-btn pointer hover-unline" @click="navigateTo('/order-assistant')">详情</div>
                    </div>
                    <div class="guidelines-help-item-doc overflow-omit pointer hover-blue-unline" v-for="i in 4" :key="i">XXXX.DOC</div>
                </el-card>
                <el-card class="guidelines-help-item">
                    <div class="guidelines-help-item-header">
                        <div class="guidelines-help-header-title">退换货政策&运输方式</div>
                        <div class="guidelines-help-header-btn pointer hover-unline" @click="navigateTo('/return-change-policy')">详情</div>
                    </div>
                    <div class="guidelines-help-item-doc overflow-omit pointer hover-blue-unline" v-for="i in 4" :key="i">XXXX.DOC</div>
                </el-card>
            </div>
        </div>

        <el-dialog v-model="state.dialogVisible" :title="state.dialogTitle" width="900px">
            <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="140px">
                <template v-if="[1].includes(state.dialogType)">PCB业务咨询</template>
                <template v-if="[2].includes(state.dialogType)">其他业务咨询</template>
                <template v-if="[3].includes(state.dialogType)">品质售后服务</template>
                <el-form-item label="工作人员类型：" prop="workManType" v-if="[4].includes(state.dialogType)">
                    <el-radio-group v-model="state.form.workManType" class="ml-4">
                        <el-radio label="PCB"></el-radio>
                        <el-radio label="SMT"></el-radio>
                        <el-radio label="钢网"></el-radio>
                        <el-radio label="财务"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="类型：" prop="adviceType" v-if="[5].includes(state.dialogType)">
                    <el-radio-group v-model="state.form.adviceType" class="ml-4">
                        <el-radio label="PCB"></el-radio>
                        <el-radio label="SMT"></el-radio>
                        <el-radio label="钢网"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="投诉方式：" prop="complainMethod" v-if="[4].includes(state.dialogType)">
                    <el-radio-group v-model="state.form.complainMethod" class="ml-4">
                        <el-radio label="提交工单"></el-radio>
                        <el-radio label="电话投诉"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="被投诉人信息：" prop="complainInfo" v-if="[4].includes(state.dialogType)">
                    <el-input type="text" v-model="state.form.complainInfo" placeholder="请输入被投诉人信息，如他的电话，名称"></el-input>
                </el-form-item>
                <el-form-item label="投诉内容：" prop="complainContent" v-if="[4].includes(state.dialogType)">
                    <el-input type="textarea" rows="4" v-model="state.form.complainContent" placeholder="请输入您要投诉的内容"></el-input>
                </el-form-item>
                <el-form-item label="您的建议：" prop="advice" v-if="[4,5].includes(state.dialogType)">
                    <el-input type="textarea" rows="4" v-model="state.form.advice" placeholder="请输入您的建议"></el-input>
                </el-form-item>
                <el-form-item label="您的称呼：" prop="name" v-if="[4].includes(state.dialogType)">
                    <el-input type="text" v-model="state.form.name" placeholder="请输入您的称呼"></el-input>
                </el-form-item>
                <el-form-item label="您的电话：" prop="phone" v-if="[4,5].includes(state.dialogType)">
                    <el-input type="text" v-model="state.form.phone" placeholder="请输入您的电话"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelHandle">取消</el-button>
                    <el-button type="primary" @click="confirmHandle">确认</el-button>
                </span>
            </template>
        </el-dialog> -->
    </div>
</template>

<script setup lang="ts" name="ServiceGuidelines">
// const formRef = ref()
// const state = reactive<Record<string, any>>({
//     lookEmail: false,
//     dialogType: 1, // 1PCB业务咨询  2其他业务咨询  3品质售后服务  4服务投诉  5网站建议反馈
//     dialogTitle: 'PCB业务咨询',
//     dialogVisible: false,
//     form: {
//         // 服务投诉
//         workManType: undefined,
//         complainMethod: undefined,
//         complainInfo: undefined,
//         complainContent: undefined,
//         advice: undefined,
//         name: undefined,
//         phone: undefined,

//         // 网站建议反馈
//         adviceType: undefined,
//     },
//     rules: {
//         workManType: [{ required: true, message: '工作人员类型', trigger: 'change' }],
//         complainMethod: [{ required: true, message: '投诉方式', trigger: 'change' }],
//         complainInfo: [{ required: true, message: '被投诉人信息', trigger: 'blur' }],
//         complainContent: [{ required: true, message: '投诉内容', trigger: 'blur' }],
//         advice: [{ required: true, message: '您的建议', trigger: 'blur' }],
//     },
// })

// const openDiaLog = (type: number, row?: any) => {
//     state.dialogType = type
//     if ([1,2,3].includes(state.dialogType)) {
//         // 打开聊天工具
//         // console.log('需要打开聊天工具')
//         return;
//     // if (state.dialogType == 1) {
//     //     state.dialogTitle = 'PCB业务咨询'
//     // } else if (state.dialogType == 2) {
//     //     state.dialogTitle = '其他业务咨询'
//     // } else if (state.dialogType == 3) {
//     //     state.dialogTitle = '品质售后服务'
//     } else if (state.dialogType == 4) {
//         state.dialogTitle = '服务投诉'
//     } else if (state.dialogType == 5) {
//         state.dialogTitle = '网站建议反馈'
//     }
//     state.dialogVisible = true
//     nextTick(() => {
//         if ([4,5].includes(state.dialogType)) {
//             formRef.value.clearValidate()
//         }
//     })
// }

// // 关闭弹框
// const cancelHandle = () => {
//     state.dialogVisible = false
//     for (let key in state.form) {
//         state.form[key] = undefined
//     }
// }
// // 确认弹框
// const confirmHandle = () => {
//     formRef.value.validate((val: boolean) => {
//         if (val) {
//             const params = deepClone(state.form)
//             // console.log(params)
//             if (state.dialogType == 1) {
//                 // params.id = state.tableData.length
//                 // state.tableData.push(params)
//             } else if (state.dialogType == 2) {
//                 // const i = state.tableData.findIndex((v: any) => v.id == params.id)
//                 // state.tableData[i] = params
//             }
//             cancelHandle()
//         }
//     })
// }
</script>

<style lang="scss" scoped>
.service-guidelines {
    .guidelines {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        padding: 60px 100px;

        .guidelines-item {
            width: 320px;
            --el-card-padding: 0;
            border-radius: 10px;
            transition: box-shadow 0.2s;

            &.guidelines-online {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
                color: #ffffff;
                background: rgba($color: #79bbff, $alpha: 0.7);
                .guidelines-online-service {
                    font-size: 90px;
                    margin-bottom: 30px;
                }
                .guidelines-online-title {
                    margin-bottom: 10px;
                    font-size: 20px;
                    font-weight: 600;
                }
                .guidelines-online-time {
                    margin-top: 40px;
                    font-weight: 600;
                }
            }

            &:hover {
                box-shadow: 0 5px 30px 0 rgba(78,122,194,.2);
            }
            .guidelines-item-top {
                width: 100%;
                height: 200px;
            }
            .guidelines-item-title {
                padding: 30px 20px 20px;
                font-size: 18px;
                font-weight: 600;
                transition: color 0.2s;
            }
            .guidelines-item-tips {
                padding: 0 20px 30px;
                font-size: 14px;
                line-height: 18px;
            }
        }
    }

    .guidelines-server {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        background: #fbfcfe;
        padding: 20px 60px;
        margin-bottom: 60px;
        border-radius: 5px;

        :deep(.guidelines-server-item) {
            width: 390px;
            border-radius: 5px;
            &:hover {
                box-shadow: 0 5px 30px 0 rgba(78,122,194,.2);
            }
            .el-card__body {
                padding: 20px 30px;

                .guidelines-server-title {
                    margin-bottom: 20px;
                    font-size: 18px;
                    font-weight: 600;
                    transition: color 0.2s;
                }
            }
        }
    }

    .guidelines-help {
        padding-bottom: 60px;
        .guidelines-help-title {
            margin-bottom: 40px;
            font-size: 22px;
            font-weight: 600;
        }

        .guidelines-help-list {
            display: flex;
            justify-content: space-between;
            align-items: stretch;

            .guidelines-help-item {
                width: 300px;
                border-radius: 5px;

                .guidelines-help-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;

                    .guidelines-help-header-title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .guidelines-help-header-btn {
                        font-size: 14px;
                        color: var(--el-color-primary);
                    }
                }

                .guidelines-help-item-doc {
                    font-size: 14px;
                    &:not(:last-child) {
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
}
</style>